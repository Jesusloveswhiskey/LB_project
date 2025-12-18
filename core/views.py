from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import UserAccount, Movie, Review, Like, Person, Rating, update_movie_rating
from .serializers import UserSerializer, MovieSerializer, ReviewSerializer, LikeSerializer, PersonDetailSerializer, RatingSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view

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
        return Rating.objects.filter(user=self.request.user)

    # def create(self, request, *args, **kwargs):
    #     movie_id = request.data.get("movie")
    #     score = request.data.get("score")

    #     rating, created = Rating.objects.update_or_create(
    #         user=request.user,
    #         movie_id=movie_id,
    #         defaults={"score": score},
    #     )
    #     avg = rating.movie.ratings.aggregate(avg=Avg("score"))["avg"]
    #     rating.movie.average_rating = round(avg or 0, 2)
    #     rating.movie.save(update_fields=["average_rating"])

    #     serializer = self.get_serializer(rating)
    #     return Response(serializer.data)
    def create(self, request, *args, **kwargs):

        user = request.user
        movie_id = request.data.get('movie')
        

        existing_rating = Rating.objects.filter(user=user, movie=movie_id).first()

        if existing_rating:

            serializer = self.get_serializer(existing_rating, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:

            return super().create(request, *args, **kwargs)

