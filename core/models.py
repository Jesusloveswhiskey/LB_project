from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser

class UserAccount(AbstractUser):
    def __str__(self):
        return self.username
    
class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    year_released = models.PositiveIntegerField()
    description = models.TextField(blank=True)
    length_minutes = models.PositiveIntegerField()
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    poster = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title
    

class Review(models.Model):
    text = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField()
    user = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    movie = models.ForeignKey('Movie', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"
   

class Like(models.Model):
    is_like = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    review = models.ForeignKey('Review', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'review')