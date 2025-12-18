from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import UserAccount, Movie, Review, Like, Person, Rating, update_movie_rating
from .serializers import UserSerializer, MovieSerializer, ReviewSerializer, LikeSerializer, PersonDetailSerializer, RatingSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()] #регистрация доступна всем
        return [permissions.IsAuthenticated()]  #остальные действия требуют аутентификации


# class MovieViewSet(viewsets.ModelViewSet):
#     queryset = Movie.objects.all()
#     serializer_class = MovieSerializer
#     def get_permissions(self):
#         if self.action in ['create', 'update', 'partial_update', 'destroy']: #только админ может изменять данные о фильмах
#             return [permissions.IsAdminUser()]
#         return [permissions.AllowAny()]

class MovieViewSet(viewsets.ModelViewSet):
    serializer_class = MovieSerializer
    queryset = Movie.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['genre']

    def get_queryset(self):
        qs = Movie.objects.all()

        search = self.request.query_params.get("search")
        genre = self.request.query_params.get("genre")
        year_from = self.request.query_params.get("year_from")
        year_to = self.request.query_params.get("year_to")
        rating_from = self.request.query_params.get("rating_from")

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)

        genre = self.request.query_params.get("genre")
        if genre:
            qs = qs.filter(genre__icontains=genre)

        rating_from = self.request.query_params.get("rating_from")
        if rating_from:
            qs = qs.filter(average_rating__gte=rating_from)

        return qs

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

class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonDetailSerializer


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # пользователь видит только свои оценки
        return Rating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        rating = serializer.save(user=self.request.user)
        update_movie_rating(rating.movie)

    def perform_update(self, serializer):
        rating = serializer.save()
        update_movie_rating(rating.movie)

    def perform_destroy(self, instance):
        movie = instance.movie
        instance.delete()
        update_movie_rating(movie)