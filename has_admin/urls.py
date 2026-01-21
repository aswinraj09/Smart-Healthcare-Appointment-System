from django.urls import path
from .views import *

urlpatterns = [
    path("api/admin/login/", admin_login, name="admin-login"),
    path("api/admin/dashboard/", admin_dashboard),
    path("api/admin/pending-doctors/", pending_doctors),
    path("api/admin/all-doctors/", admin_all_doctors),
    path("api/admin/all-patients/", admin_all_patients),
    path("api/admin/all-appointments/", admin_all_appointments),
    path("api/admin/block-patient/<int:patient_id>/", block_patient),
    path("api/admin/unblock-patient/<int:patient_id>/", unblock_patient),
    path("api/admin/doctor/<int:doctor_id>/", admin_doctor_detail),
    path("api/admin/approve-doctor/<int:doctor_id>/", approve_doctor),
    path("api/admin/reject-doctor/<int:doctor_id>/", reject_doctor),
]
