from django.db import models
from django.db.models import Avg

# Create your models here.

from django.contrib.auth.models import AbstractUser

class UserAccount(AbstractUser):
    def __str__(self):
        return self.username
    
class Person(models.Model):
    ROLE_CHOICES = (
        ('actor', 'Actor'),
        ('director', 'Director'),
        ('writer', 'Writer'),
    )

    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    photo = models.CharField(max_length=1024, blank=True)
    

    def __str__(self):
        return f"{self.name} ({self.role})"
    
class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    year_released = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    length_minutes = models.PositiveIntegerField()
    average_rating = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    poster = models.CharField(max_length=1024, blank=True)
    people = models.ManyToManyField(Person, related_name="movies", blank=True)

    def __str__(self):
        return self.title
    

class Review(models.Model):
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")  
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} → {self.movie}"
   

class Like(models.Model):
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="likes"
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="liked_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")

    def __str__(self):
        return f"{self.user} ♥ {self.movie}"



class Rating(models.Model):
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="ratings"
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="ratings"
    )
    score = models.PositiveSmallIntegerField()  # 1–10
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "movie")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_movie_rating()

    def delete(self, *args, **kwargs):
        movie = self.movie
        super().delete(*args, **kwargs)
        self.update_movie_rating(movie)

    def update_movie_rating(self, movie=None):
        movie = movie or self.movie
        avg = movie.ratings.aggregate(avg=Avg("score"))["avg"]
        movie.average_rating = round(avg or 0, 2)
        movie.save(update_fields=["average_rating"])

    def __str__(self):
        return f"{self.user} → {self.movie}: {self.score}"


def update_movie_rating(movie):
    avg = movie.ratings.aggregate(avg=Avg("score"))["avg"]
    movie.average_rating = round(avg or 0, 2)
    movie.save(update_fields=["average_rating"])