from rest_framework import serializers
from . models import *

class doctorRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = doctor_tbl
        fields = [
            'name',
            'age',
            'gender',
            'phone_number',
            'specialization',
            'qualification',
            'experience',
            'email',
            'password'
        ]
    
    def validate_email(self, value):
        if doctor_tbl.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_phone_number(self, value):
        if doctor_tbl.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value

class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = "__all__"

class DoctorProfileSerializer(serializers.ModelSerializer):
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
        ]
        read_only_fields = ["email"]

    def get_photo(self, obj):
        request = self.context.get("request")
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None
