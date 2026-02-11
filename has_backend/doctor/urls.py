from django.urls import path
from .views import *
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('doctor-register/', doctor_register, name='doctor-register'),
    path('login/', doctor_login, name='doctor-login'),
    path('set-availability/', set_doctor_availability),
    path("get-availability/<int:doctor_id>/", get_doctor_availability),
    path("doctor/availability-history/<int:doctor_id>/", doctor_availability_history),
    path("delete-availability/<int:pk>/", delete_availability),
    path("update-availability/<int:pk>/", views.update_doctor_availability),
    path('logout/', logout_view),
    path('doctor/dashboard/<int:doctor_id>/', doctor_dashboard),
    path("doctor/profile/<int:doctor_id>/", doctor_profile),
    path("doctor/profile/update/<int:doctor_id>/", update_doctor_profile),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)