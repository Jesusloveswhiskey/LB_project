from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MovieViewSet, ReviewViewSet, LikeViewSet, PersonViewSet
from .views_auth import login_view, logout_view, csrf_cookie_view, current_user_view, register_view

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'people', PersonViewSet, basename='person')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/csrf/', csrf_cookie_view, name='csrf'),
    path('auth/user/', current_user_view, name='current_user'),
    path("auth/register/", register_view, name="register")
]