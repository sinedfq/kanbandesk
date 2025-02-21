from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordChangeView
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.views import View
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status

from .models import Board, Card, Profile, Comment
from .serializers import BoardSerializer, CardSerializer, ProfileSerializer, UserSerializer, CommentSerializer
from .forms import RegisterForm, LoginForm, UpdateUserForm, UpdateProfileForm


def home(request):
    return render(request, 'users/home.html')

class RegisterView(View):
    form_class = RegisterForm
    initial = {'key': 'value'}
    template_name = 'users/register.html'

    def dispatch(self, request, *args, **kwargs):
        # will redirect to the home page if a user tries to access the register page while logged in
        if request.user.is_authenticated:
            return redirect(to='/')

        # else process dispatch as it otherwise normally would
        return super(RegisterView, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        form = self.form_class(initial=self.initial)
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)

        if form.is_valid():
            form.save()

            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}')

            return redirect(to='login')

        return render(request, self.template_name, {'form': form})


# Class based view that extends from the built in login view to add a remember me functionality
class CustomLoginView(LoginView):
    form_class = LoginForm

    def form_valid(self, form):
        remember_me = form.cleaned_data.get('remember_me')

        if not remember_me:
            # set session expiry to 0 seconds. So it will automatically close the session after the browser is closed.
            self.request.session.set_expiry(0)

            # Set session as modified to force data updates/cookie to be saved.
            self.request.session.modified = True

        # else browser session will be as long as the session cookie time "SESSION_COOKIE_AGE" defined in settings.py
        return super(CustomLoginView, self).form_valid(form)


class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'users/password_reset.html'
    email_template_name = 'users/password_reset_email.html'
    subject_template_name = 'users/password_reset_subject'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('users-home')


class ChangePasswordView(SuccessMessageMixin, PasswordChangeView):
    template_name = 'users/change_password.html'
    success_message = "Successfully Changed Your Password"
    success_url = reverse_lazy('users-home')


@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Your profile is updated successfully')
            return redirect(to='users-profile')
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)
        user_cards = Card.objects.filter(participants=request.user)

    user_comments = Comment.objects.filter(user=request.user)  # Получаем комментарии пользователя

    return render(request, 'users/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
        'user_comments': user_comments,
        'user_cards': user_cards,
    })

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer

from rest_framework.exceptions import ValidationError
class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    @method_decorator(csrf_exempt)  # Если необходимо отключить проверку CSRF токена
    def update(self, request, *args, **kwargs):
        # Выводим данные, которые пришли в запросе
        print("Request data:", request.data)

        # Извлекаем данные для обновления
        participants_usernames = request.data.get('participants', [])
        title = request.data.get('title')
        description = request.data.get('description')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        board_id = request.data.get('board')
        color = request.data.get('color')

        # Получаем id пользователей по username
        participants = User.objects.filter(username__in=participants_usernames)
        if participants.count() != len(participants_usernames):
            missing_users = set(participants_usernames) - set(participants.values_list('username', flat=True))
            raise ValidationError(f"Users not found: {', '.join(missing_users)}")

        # Преобразуем список участников в список их ID
        participants_ids = list(participants.values_list('id', flat=True))

        # Получаем объект карточки для обновления
        instance = self.get_object()

        # Обновляем все поля карточки
        if title:
            instance.title = title
        if description:
            instance.description = description
        if start_date:
            instance.start_date = start_date
        if end_date:
            instance.end_date = end_date
        if board_id:
            instance.board_id = board_id
        if color:
            instance.color = color

        # Обновляем участников
        instance.participants.clear()  # Очищаем существующих участников
        instance.participants.add(*participants_ids)  # Добавляем новых участников

        # Сохраняем изменения в объекте карточки
        instance.save()

        # Выводим обновленные данные карточки
        serializer = self.get_serializer(instance)
        print("Updated card data:", serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        card_id = self.request.query_params.get('card', None)
        if card_id:
            return Comment.objects.filter(card_id=card_id)
        return Comment.objects.none()  # Возвращаем пустой набор данных, если нет card_id


@login_required
def check_auth(request):
    return JsonResponse({'isAuthenticated': True})

def get_username(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return JsonResponse({'username': user.username})
