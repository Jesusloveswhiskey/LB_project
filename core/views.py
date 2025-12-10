from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import UserAccount, Movie, Review, Like
from .serializers import UserSerializer, MovieSerializer, ReviewSerializer, LikeSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()] #регистрация доступна всем
        return [permissions.IsAuthenticated()]  #остальные действия требуют аутентификации


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']: #только админ может изменять данные о фильмах
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]