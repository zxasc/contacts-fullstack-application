from django.contrib import admin
from django.urls import path
from project_root.contacts_api import views as contact_views
from project_root.weather_grabber import views as weather_views


urlpatterns = [
    path('admin/', admin.site.urls),
    # Weather path, grabs city param from the url
    path('weather/<str:city>', weather_views.get_weather_data),
    # Contacts API paths
    path('api/contacts/', contact_views.ContactViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('api/contacts/<int:pk>', contact_views.ContactViewSet.as_view({
        'post': 'create',
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
    path('api/status-options/', contact_views.get_status_options),
]
