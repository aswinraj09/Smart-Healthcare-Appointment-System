from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from . models import *
from django.core.mail import send_mail
from django.conf import settings
from doctor.models import *
from django.utils import timezone
from appointment.models import *


@api_view(['POST'])
def patient_register(request):
    serializer = PatientRegisterSerializer(data=request.data)

    if serializer.is_valid():
        patient = serializer.save()  # ✅ save patient

        # 📧 SEND EMAIL TO PATIENT
        send_mail(
            subject="Welcome to Smart Healthcare ",
            message=f"""
Hi {patient.name},

Your Smart Healthcare account has been created successfully.

You can now login and book appointments with verified doctors.

Please note: This is an auto-generated mail. Please do not reply to this mail.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[patient.email],  # ✅ send to user
            fail_silently=False,
        )

        return Response(
            {"message": "Patient registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def patient_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        patient = user_tbl.objects.get(email=email)

        if patient.password != password:
            return Response(
                {"message": "Invalid email or password"},
                status=400
            )

        if hasattr(patient, 'is_active') and not patient.is_active:
            return Response(
                {"message": "Account inactive. Contact admin."},
                status=403
            )

        request.session["user_id"] = patient.id
        request.session["role"] = "patient"

        request.session.set_expiry(1800)  # 30 minutes

        return Response(
            {
                "message": "Login successful",
                "id": patient.id,
                "name": patient.name,
                "email": patient.email,
                "role": "patient"
            },
            status=200
        )

    except user_tbl.DoesNotExist:
        return Response(
            {"message": "Invalid email or password"},
            status=400
        )
    
def logout_view(request):
    request.session.flush()
    return Response({"message": "Logged out successfully"})

@api_view(["POST"])
def contact_send_email(request):
    print("CONTACT API HIT")
    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    if not name or not email or not message:
        return Response({"message": "All fields are required"}, status=400)

    try:
        send_mail(
            subject="We received your message | Smart Healthcare",
            message=f"""
Hi {name},

Thank you for contacting Smart Healthcare.

We have received your message and our support team will get back to you shortly.

Your message:
------------------
{message}

Please note: This is an auto-generated mail. Please do not reply to this mail.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Confirmation email sent"}, status=200)

    except Exception as e:
        return Response(
            {"message": "Failed to send message"},
            status=500
        )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from doctor.models import doctor_tbl, DoctorAvailability
from datetime import date, datetime

@api_view(['GET'])
def patient_doctors(request):
    doctors = doctor_tbl.objects.filter(is_approved="Approved")

    data = []
    base_url = request.build_absolute_uri('/')[:-1]  

    for doc in doctors:
        photo_url = None
        if doc.photo:
            photo_url = base_url + doc.photo.url

        data.append({
            "id": doc.id,
            "name": doc.name,
            "specialization": doc.specialization,
            "experience": doc.experience,
            "photo": photo_url,
        })

    return Response(data)

@api_view(['GET'])
def patient_doctor_detail(request, doctor_id):
    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)

        base_url = request.build_absolute_uri('/')[:-1]
        photo_url = None
        if doctor.photo:
            photo_url = base_url + doctor.photo.url

        return Response({
            "id": doctor.id,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "qualification": doctor.qualification,
            "experience": doctor.experience,
            "photo": photo_url
        })
    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)
    
@api_view(["GET"])
def patient_profile(request, patient_id):
    patient = user_tbl.objects.get(id=patient_id)
    serializer = PatientProfileSerializer(patient)
    return Response(serializer.data)
    
@api_view(["PUT"])
def update_patient_profile(request, patient_id):
    try:
        patient = user_tbl.objects.get(id=patient_id)
    except user_tbl.DoesNotExist:
        return Response(
            {"message": "Patient not found"},
            status=404
        )

    serializer = PatientProfileSerializer(
        patient,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    print("PATIENT PROFILE UPDATE ERROR:", serializer.errors)
    return Response(serializer.errors, status=400)