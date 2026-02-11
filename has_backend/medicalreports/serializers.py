from rest_framework import serializers
from .models import Prescription, LabReport, ScanReport


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = "__all__"

    def get_prescription_file(self, obj):
        request = self.context.get("request")
        if obj.prescription_file and request:
            return request.build_absolute_uri(obj.prescription_file.url)
        return None


class LabReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReport
        fields = "__all__"


class ScanReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanReport
        fields = "__all__"
