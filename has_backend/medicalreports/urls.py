from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("prescriptions/", upload_prescription),
    path("lab-reports/", upload_lab_report),
    path("scan-reports/", upload_scan_report),
    path("prescriptions/<int:patient_id>/", patient_prescriptions, name="patient-prescriptions"),
    path("scan-reports/<int:patient_id>/", patient_scan_reports, name="patient-scan-reports"),
    path("lab-reports/<int:patient_id>/", patient_lab_reports, name="patient-lab-reports"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)