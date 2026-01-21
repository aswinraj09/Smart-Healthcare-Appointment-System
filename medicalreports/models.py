from django.db import models
from user.models import user_tbl
from appointment.models import Appointment

class Prescription(models.Model):
    patient = models.ForeignKey(user_tbl, on_delete=models.CASCADE)

    appointment = models.ForeignKey(
        Appointment, on_delete=models.SET_NULL, null=True, blank=True
    )

    prescription_file = models.FileField(
        upload_to="prescriptions/", null=True, blank=True
    )

    notes = models.TextField(blank=True, null=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription - {self.patient.name} ({self.uploaded_at.date()})"

    
class LabReport(models.Model):
    REPORT_TYPES = [
        ("BP", "Blood Pressure"),
        ("SUGAR", "Blood Sugar"),
        ("BLOOD", "Blood Test"),
        ("URINE", "Urine Test"),
        ("OTHER", "Other"),
    ]

    patient = models.ForeignKey(user_tbl, on_delete=models.CASCADE)

    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)

    report_file = models.FileField(
        upload_to="lab_reports/",
        null=True,
        blank=True
    )

    report_date = models.DateField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} - {self.patient.name}"


class ScanReport(models.Model):
    SCAN_TYPES = [
        ("XRAY", "X-Ray"),
        ("MRI", "MRI"),
        ("CT", "CT Scan"),
        ("ULTRASOUND", "Ultrasound"),
        ("OTHER", "Other"),
    ]

    patient = models.ForeignKey(user_tbl, on_delete=models.CASCADE)

    scan_type = models.CharField(max_length=20, choices=SCAN_TYPES)
    description = models.TextField(blank=True, null=True)

    scan_file = models.FileField(upload_to="scan_reports/")
    scan_date = models.DateField()

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.scan_type} - {self.patient.name}"


