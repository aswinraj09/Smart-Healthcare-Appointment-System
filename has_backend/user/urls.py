from django.contrib import admin
from django.urls import path
from . views import *
from django.conf.urls.static import static

urlpatterns = [
    path('user-register/', patient_register, name='user-register'),
    path('user-login/', patient_login, name='user-login'),
    path("contact/", contact_send_email),
    path("patient/doctors/", patient_doctors),
    path("doctor/<int:doctor_id>/", patient_doctor_detail),
    path("profile/<int:patient_id>/", patient_profile),
    path("profile/update/<int:patient_id>/", update_patient_profile),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)