from django.contrib import admin

# Register your models here.
from .models import Movie, Review, Like, UserAccount

admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(Like)
admin.site.register(UserAccount)