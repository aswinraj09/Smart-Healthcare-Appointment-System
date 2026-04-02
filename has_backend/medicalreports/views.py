from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status

from .models import Prescription, LabReport, ScanReport
from .serializers import (
    PrescriptionSerializer,
    LabReportSerializer,
    ScanReportSerializer
)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_prescription(request):
    serializer = PrescriptionSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Prescription uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_lab_report(request):
    serializer = LabReportSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Lab report uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_scan_report(request):
    serializer = ScanReportSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Scan report uploaded successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def patient_prescriptions(request, patient_id):
    prescriptions = Prescription.objects.filter(
        patient_id=patient_id
    ).order_by("-uploaded_at")

    serializer = PrescriptionSerializer(
        prescriptions, many=True, context={"request": request}
    )

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def patient_scan_reports(request, patient_id):
    scan_report = ScanReport.objects.filter(
        patient_id=patient_id
    ).order_by("-uploaded_at")

    serializer = ScanReportSerializer(
        scan_report, many=True, context={"request": request}
    )

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def patient_lab_reports(request, patient_id):
    lab_report = LabReport.objects.filter(
        patient_id=patient_id
    ).order_by("-uploaded_at")

    serializer = LabReportSerializer(
        lab_report, many=True, context={"request": request}
    )

    return Response(serializer.data, status=status.HTTP_200_OK)