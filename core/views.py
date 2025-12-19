from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import UserAccount, Movie, Review, Like, Person, Rating, update_movie_rating
from .serializers import UserSerializer, MovieSerializer, ReviewSerializer, LikeSerializer, PersonSerializer, RatingSerializer, ProfileMovieSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.decorators import api_view
from django.db.models import Q

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
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def liked(self, request):
        movies = Movie.objects.filter(liked_by__user=request.user)
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"])
    def discover(self, request):
        # Топ фильмов
        top_movies = (
            Movie.objects
            .order_by("-average_rating")[:10]
        )

        genres = (
            Movie.objects
            .values_list("genre", flat=True)
            .distinct()
        )

        by_genre = {}

        for genre in genres:
            movies = (
                Movie.objects
                .filter(genre=genre)
                .order_by("-average_rating")[:6]
            )
            by_genre[genre] = MovieSerializer(movies, many=True).data

        return Response({
            "top": MovieSerializer(top_movies, many=True).data,
            "by_genre": by_genre
        })
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my(self, request):
        movies = Movie.objects.filter(
            Q(ratings__user=request.user) |
            Q(reviews__user=request.user)
        ).distinct()

        serializer = ProfileMovieSerializer(
            movies,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        movie_id = self.request.query_params.get("movie")
        qs = Review.objects.all()
        if movie_id:
            qs = qs.filter(movie_id=movie_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        movie_id = request.data.get("movie")

        if not movie_id:
            return Response({"error": "movie is required"}, status=400)

        like = Like.objects.filter(
            user=request.user,
            movie_id=movie_id
        ).first()

        if like:
            like.delete()
            return Response({"liked": False})
        else:
            Like.objects.create(
                user=request.user,
                movie_id=movie_id
            )
            return Response({"liked": True})

class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): #получение рейтинга только для ТЕКУЗЕГО пользователя
        qs = Review.objects.all()

        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)

        return qs

    def create(self, request, *args, **kwargs):
        movie_id = request.data.get("movie")
        score = request.data.get("score")

        rating, created = Rating.objects.update_or_create(
            user=request.user,
            movie_id=movie_id,
            defaults={"score": score}
        )

        serializer = self.get_serializer(rating)
        return Response(serializer.data)

