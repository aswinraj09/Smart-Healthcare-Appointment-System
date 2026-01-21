from rest_framework import serializers
from appointment.models import Appointment
from doctor.models import *

class RecentAppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.CharField(source="doctor.name")
    patient = serializers.CharField(source="patient.name")
    date = serializers.DateField(source="availability.date")
    start_time = serializers.TimeField(source="availability.start_time")
    end_time = serializers.TimeField(source="availability.end_time")

    class Meta:
        model = Appointment
        fields = [
            "doctor",
            "patient",
            "date",
            "start_time",
            "end_time",
            "status",
        ]

class PendingDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = doctor_tbl
        fields = [
            "id",
            "name",
            "email",
            "specialization",
            "qualification",
            "experience",
            "photo",
            "is_approved",
            "rejection_reason",
        ]