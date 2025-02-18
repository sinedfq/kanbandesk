from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, profile, RegisterView, BoardViewSet, CardViewSet, UserViewSet, CommentViewSet, get_username
from .views import check_auth

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
