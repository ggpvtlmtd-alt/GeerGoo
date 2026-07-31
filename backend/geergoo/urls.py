"""
URL configuration for geergoo project.
"""

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("authentication.urls")),
]