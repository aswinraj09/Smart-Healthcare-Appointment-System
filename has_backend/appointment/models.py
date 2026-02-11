from django.db import models
from user.models import user_tbl
from doctor.models import doctor_tbl
from doctor.models import DoctorAvailability


class Appointment(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    appointment_id = models.AutoField(primary_key=True)

    patient = models.ForeignKey(
        user_tbl,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    doctor = models.ForeignKey(
        doctor_tbl,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    availability = models.ForeignKey(
        DoctorAvailability,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    token_number = models.PositiveIntegerField(default=1)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    reminder_sent = models.BooleanField(default=False)


class AppointmentReminder(models.Model):
    """Tracks whether a reminder email was sent for an appointment."""
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="reminder",
    )
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reminder for appt {self.appointment.appointment_id} at {self.sent_at}"

    def __str__(self):
        return (
            f"Appt {self.appointment_id} | "
            f"{self.patient.name} → {self.doctor.name} | "
            f"{self.availability.date} "
            f"{self.availability.start_time}-{self.availability.end_time}"
        )
