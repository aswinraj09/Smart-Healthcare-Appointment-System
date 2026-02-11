from django.urls import path
from .views import *

urlpatterns = [
    path("book/", book_appointment),
    path("appointments/<int:patient_id>/", patient_appointments),
    path("cancel/<int:appointment_id>/", cancel_appointment),
    path("doctor/appointments/<int:doctor_id>/", doctor_appointments),
    path("doctor/appointments-history/<int:doctor_id>/", doctor_appointment_history),
    path("doctor/daily-appointments/<int:doctor_id>/", doctor_daily_appointments),
    path("doctor/update-status/<int:appointment_id>/", update_appointment_status),
]
