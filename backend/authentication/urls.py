from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello),
    path("register/", views.register),
    path("login/", views.login),
    path("profile/", views.profile),
    path("logout/", views.logout),
]