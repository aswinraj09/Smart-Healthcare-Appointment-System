from rest_framework import serializers
from .models import *

class PatientRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_tbl
        fields = '__all__'

    def validate_email(self, value):
        if user_tbl.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_phone_number(self, value):
        if user_tbl.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists")
        return value

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_tbl
        fields = [
            "id",
            "name",
            "email",
            "age",
            "phone_number",  
        ]
        extra_kwargs = {
            "email": {"read_only": True}
        }