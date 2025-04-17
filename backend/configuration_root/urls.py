from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from project_root.contacts_api import views as contact_views
from project_root.weather_grabber import views as weather_views

router = DefaultRouter()
router.register(r'api/contacts', contact_views.ContactViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('weather/<str:city>', weather_views.get_weather_data),
    path('', include(router.urls)),
]
