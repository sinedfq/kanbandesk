## Канбан доска с регистрацией/авторизацией ##

<h3>Задание:</h3>

Разработать электронную версию канбан-доски с сохранением изменений в базу данных. Добавить возможность регистрации и редактрования профиля.

-----

<h3>Используемые технологии: </h3>

1. Django.
2. ReactJS.
3. HTML/CSS.
4. SQLite.
5. Node.js

------

<h3>Инстуркция по запуску: </h3>

1. Переходим в папку django-app.
```bash
cd django-app/
```
2. Делаем миграцию для корректной работы веб-приложения.
```bash
python manage.py migrate
```
3. Запускаем наш проект.
```bash
python manage.py runserver
```

*успешный запуск проекта

<div align = "center">
  
  ![image](https://github.com/user-attachments/assets/c3c0bcf9-a028-4cd0-9fe4-4b9dbfb3ee2d)
  
</div>

-----

<h3>Внешний вид запущенного проекта: </h3>

Главная страница:
![image](https://github.com/user-attachments/assets/e180accf-f791-4045-a295-d3ddf3543770)

Меню просмотра карточки: 

![image](https://github.com/user-attachments/assets/195c4c50-3f88-4053-bb8b-ece976ea7530)

Меню редактирования карточки:

![image](https://github.com/user-attachments/assets/e549be81-b8b8-46e9-bb02-ea23c684d52b)

Страница профиля:

![image](https://github.com/user-attachments/assets/d29d2eaa-aac1-484e-a817-84ea2a0ec10b)
![image](https://github.com/user-attachments/assets/d4ee3e44-02c2-4048-b119-7c3790036170)
![image](https://github.com/user-attachments/assets/474287b4-3210-42ba-a527-053d29f19fe7)

-----

<h3>Техническое описание:</h3>

models.py
```python
class Card(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=True, blank=True)  # Новое поле
    end_date = models.DateTimeField(null=True, blank=True)    # Новое поле
    participants = models.ManyToManyField(User, related_name='cards')
    color = models.CharField(max_length=50, default="#fff")

    def __str__(self):
        return self.title

```
Class Card служит для объявления таблицы в базе данных с именем Card и с необходимым по заданию полями. <br><br>
На подобии данного учатска кода сделаны и остальные таблицы базы данных

----

views.py

```python 
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

    # Получаем карточки, в которых участвует пользователь
    user_cards = Card.objects.filter(participants=request.user)

    # Получаем комментарии пользователя
    user_comments = Comment.objects.filter(user=request.user)

    return render(request, 'users/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
        'user_cards': user_cards,
        'user_comments': user_comments,
    })
```
Views.py служит для сохранения изменений в базу данных с помощью ```GET``` и ```POST``` запросов. <br><br>
На данном учатске кода сохраняются изменения в профиле пользователя (аватар, био и т.д) <br>
По аналогии с этим кодом сделаны и остальные обработчики изменений

----

serializers.py

```python
class CardSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'board', 'participants', 'color']
        extra_kwargs = {
            'board': {'required': True},  # Убедитесь, что поле `board` является обязательным
        }
```
Сериализаторы в Django — это инструмент для преобразования сложных типов данных, таких как экземпляры модели Django, в типы данных Python, которые могут быть легко переведены в JSON, XML или другие типы контента<br><br>

В данном участке кода продемонстрирован сериализатор для класса Card, по аналогии с ним сделаны и остальные сериализаторы.

-----

urls.py

```python
router = DefaultRouter()
router.register(r'boards', BoardViewSet)
router.register(r'cards', CardViewSet)
router.register(r'users', UserViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', home, name='users-home'),
    path('api/', include(router.urls)),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('profile/', profile, name='users-profile'),
    path('api/auth/check/', check_auth, name='check_auth'),
    path('api/get-username/<int:user_id>/', get_username, name='get_username'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```
Не мало важным объектом нашего проекта является ursl. В данном коде реализованы /api/ запросы к нашему проекту, из которых мы получаем всю необходимую информацию из БД

----
