from rest_framework import serializers
from .models import UserAccount, Movie, Review, Like, Person, Rating
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
            'email': {'required': True}
        }

    def create(self, validated_data): #хеширование пароля 
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data): #обнова пароля
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.password = make_password(password)
            user.save()
        return user

class PersonShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["id", "name", "photo", "role"]

class MovieShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "year_released", "poster"]


class PersonSerializer(serializers.ModelSerializer):
    movies = MovieShortSerializer(many=True, read_only=True)
    class Meta:
        model = Person
        fields = ["id", "name", "photo", "role", "movies"]


class MovieSerializer(serializers.ModelSerializer):
    people = PersonSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    like_id = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = "__all__"

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        return Like.objects.filter(
            user=request.user,
            movie=obj
        ).exists()

    def get_like_id(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        like = Like.objects.filter(
            user=request.user,
            movie=obj
        ).first()

        return like.id if like else None
    
    def get_user_rating(self, obj): #получение рейтинга для каждого фильма
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        rating = Rating.objects.filter(
            user=request.user,
            movie=obj
        ).first()

        if not rating:
            return None

        return {
            "id": rating.id,
            "score": rating.score
        }


class PersonDetailSerializer(serializers.ModelSerializer):
    movies = MovieShortSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ["id", "name", "role", "movies"]

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "user", "text", "created_at", "movie"]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
        }


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "movie", "created_at"]


class RatingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Rating
        fields = ["id", "score", "movie"]


class ProfileMovieSerializer(serializers.ModelSerializer): #для страницы профиля пользователя
    my_rating = serializers.SerializerMethodField()
    my_review = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "poster",
            "my_rating",
            "my_review"
        ]

    def get_my_rating(self, obj):
        user = self.context["request"].user
        rating = obj.ratings.filter(user=user).first()
        return rating.score if rating else None

    def get_my_review(self, obj):
        user = self.context["request"].user
        review = obj.reviews.filter(user=user).first()
        return review.text if review else None