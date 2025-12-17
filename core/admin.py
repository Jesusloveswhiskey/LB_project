from django.contrib import admin

# Register your models here.
from .models import Movie, Review, Like, UserAccount, Person, Rating

admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(Like)
admin.site.register(UserAccount)
admin.site.site_header = "My Letterboxd Admin"
admin.site.register(Person)
admin.site.register(Rating)