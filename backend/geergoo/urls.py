from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/", include("authentication.urls")),
    path("api/logs/", include("logs.urls")),
    path("api/analysis/", include("analysis.urls")),
]