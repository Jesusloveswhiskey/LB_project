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


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["id", "name", "role", "photo"]


class MovieSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    people = PersonSerializer(many=True, read_only=True) 

    class Meta:
        model = Movie
        fields = ["id", "title", "poster", "description", "year_released", "length_minutes", "genre", "average_rating", "user_rating", "people"]

    def get_average_rating(self, obj):
        ratings = obj.ratings.all()
        if not ratings.exists():
            return None
        return round(
            sum(r.score for r in ratings) / ratings.count(),
            1
        )

    def get_user_rating(self, obj):
            request = self.context.get("request")
            if not request or not request.user.is_authenticated:
                return None

            rating = obj.ratings.filter(user=request.user).first()
            if rating:
                return {
                    "id": rating.id,
                    "score": rating.score
                }
            return None

class MovieShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "title", "year_released", "poster"]


class PersonDetailSerializer(serializers.ModelSerializer):
    movies = MovieShortSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ["id", "name", "role", "movies"]

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ["id", "score", "movie"]