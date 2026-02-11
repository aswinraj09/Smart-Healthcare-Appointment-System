from django.db import models
from django.contrib.auth.models import User
import uuid

class doctor_tbl(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    APPROVAL_CHOICES = [
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Waiting', 'Waiting')
    ]
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=100, choices=GENDER_CHOICES)
    specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=150)
    experience = models.PositiveIntegerField()
    phone_number = models.CharField(max_length=10)
    email = models.EmailField()
    photo = models.ImageField(upload_to="doctor_photos/", null=True, blank=True)
    password = models.CharField(max_length=100)
    is_approved = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='Waiting')

    def save(self, *args, **kwargs):
        if not self.photo:
            if self.gender == "Male":
                self.photo = "default/male-doctor-avatar.jpg"
            else:
                self.photo = "default/female-doctor-avatar.jpg"
        super().save(*args, **kwargs)


class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(doctor_tbl, on_delete=models.CASCADE, related_name="availabilities")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.doctor.name} | {self.date} {self.start_time}-{self.end_time}"

