from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from appointment.models import *
from . serializers import *
from doctor.serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from user.models import user_tbl

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"message": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"message": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # ✅ ADMIN CHECK
    if not (user.is_staff or user.is_superuser):
        return Response(
            {"message": "Access denied. Admin only."},
            status=status.HTTP_403_FORBIDDEN
        )

    # ✅ SET SESSION
    request.session["admin_id"] = user.id
    request.session["role"] = "admin"

    # ✅ AUTO LOGOUT AFTER 30 MINUTES
    request.session.set_expiry(1800)  # 30 minutes

    return Response(
        {
            "message": "Admin login successful",
            "admin_id": user.id,
            "username": user.username,
            "role": "admin"
        },
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def logout_view(request):
    request.session.flush()
    return Response({"message": "Logged out successfully"})


@api_view(["GET"])
@permission_classes([AllowAny])
def admin_dashboard(request):
    return Response({
        "stats": {
            "doctors": doctor_tbl.objects.count(),
            "patients": user_tbl.objects.count(),
            "appointments": Appointment.objects.count(),
            "pending_doctors": doctor_tbl.objects.filter(
                is_approved="Waiting"
            ).count(),
        },
            "recent_appointments": [
                {
                    "doctor": a.doctor.name,
                    "patient": a.patient.name,
                    "date": a.availability.date,
                    "start_time": a.availability.start_time,
                    "end_time": a.availability.end_time,
                    "time": f"{a.availability.start_time} - {a.availability.end_time}",
                    "status": a.status,
                    "token_number": a.token_number
                }
                for a in Appointment.objects.select_related(
                    "doctor", "patient", "availability"
                ).order_by("-created_at")[:5]
            ]
    })

@api_view(["GET"])
def pending_doctors(request):
    doctors = doctor_tbl.objects.filter(is_approved="Waiting")

    base_url = request.build_absolute_uri('/')[:-1]

    data = []
    for d in doctors:
        photo_url = base_url + d.photo.url if d.photo else None
        data.append({
            "id": d.id,
            "name": d.name,
            "specialization": d.specialization,
            "qualification": d.qualification,
            "experience": d.experience,
            "photo": photo_url,
        })

    return Response(data)


@api_view(["GET"])
def admin_all_doctors(request):
    """Return all doctors with approval status for admin view."""
    doctors = doctor_tbl.objects.all()

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
            "is_approved": doc.is_approved,
        })

    return Response(data)


@api_view(["GET"])
def admin_all_patients(request):
    """Return all patients for admin view."""
    patients = user_tbl.objects.all()

    data = []
    base_url = request.build_absolute_uri('/')[:-1]

    for p in patients:
        data.append({
            "id": p.id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "phone_number": p.phone_number,
            "email": p.email,
            "is_active": getattr(p, "is_active", True),
        })

    return Response(data)


@api_view(["GET"])
def admin_all_appointments(request):
    """Return all appointments for admin view."""
    appointments = (
        Appointment.objects
        .select_related("doctor", "patient", "availability")
        .order_by("-availability__date", "-availability__start_time")
    )

    data = []
    for a in appointments:
        av = a.availability
        data.append({
            "appointment_id": a.appointment_id,
            "doctor_id": a.doctor.id,
            "doctor_name": a.doctor.name,
            "patient_id": a.patient.id,
            "patient_name": a.patient.name,
            "date": av.date,
            "start_time": av.start_time,
            "end_time": av.end_time,
            "token_number": a.token_number,
            "status": a.status,
        })

    return Response(data)


@api_view(["GET"])
def admin_doctor_detail(request, doctor_id):
    try:
        doc = doctor_tbl.objects.get(id=doctor_id)

        base_url = request.build_absolute_uri('/')[:-1]
        photo_url = base_url + doc.photo.url if doc.photo else None

        return Response({
            "id": doc.id,
            "name": doc.name,
            "age": doc.age,
            "gender": doc.gender,
            "specialization": doc.specialization,
            "qualification": doc.qualification,
            "experience": doc.experience,
            "phone_number": doc.phone_number,
            "email": doc.email,
            "photo": photo_url,
            "is_approved": doc.is_approved,
        })

    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)

@api_view(["PUT"])
def approve_doctor(request, doctor_id):
    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)

        doctor.is_approved = "Approved"
        doctor.save()

        send_mail(
            subject="Doctor Approved | Smart Healthcare",
            message=f"""
Hi {doctor.name},

Thank you for registering with Smart Healthcare.

Your account has been created successfully approved by our admin team.

You will be able to:
- Login to your dashboard
- Set your slots
- View daily appointments

Please note: This is an auto-generated mail. Please do not reply to this mail.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[doctor.email],
            fail_silently=True,
        )

        return Response({"message": "Doctor approved successfully"})

    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)
    
@api_view(["PUT"])
def reject_doctor(request, doctor_id):
    reason = request.data.get("reason")

    if not reason:
        return Response(
            {"message": "Rejection reason is required"},
            status=400
        )

    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)

        doctor.is_approved = "Rejected"
        doctor.save()

        send_mail(
            subject="Doctor Account Rejected | Smart Healthcare",
            message=f"""
Hi Dr. {doctor.name},

We regret to inform you that your account has been reviewed and has been rejected.

Reason:
{reason}

If you believe this decision was made in error or need further clarification,
please contact our support team.

Thank you for your interest in Smart Healthcare.

Please note: This is an auto-generated email. Do not reply to this message.

Regards,
Smart Healthcare Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[doctor.email],
            fail_silently=True,
        )

        return Response({"message": "Doctor rejected successfully"})

    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)


@api_view(["PUT"])
def block_patient(request, patient_id):
    """Mark a patient account inactive and send notification email."""
    try:
        patient = user_tbl.objects.get(id=patient_id)

        patient.is_active = False
        patient.save()

        send_mail(
            subject="Account Inactive | Smart Healthcare",
            message=f"""
Hi {patient.name},

Your account has been marked inactive by the admin team.
You will no longer be able to login until your account is reactivated.

If you think this is a mistake, please contact support.

Please note: This is an auto-generated mail. Do not reply to this message.

Regards,
Smart Healthcare Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[patient.email],
            fail_silently=True,
        )

        return Response({"message": "Patient blocked and notified"})

    except user_tbl.DoesNotExist:
        return Response({"message": "Patient not found"}, status=404)


@api_view(["PUT"])
def unblock_patient(request, patient_id):
    """Mark a patient account active and send notification email."""
    try:
        patient = user_tbl.objects.get(id=patient_id)

        patient.is_active = True
        patient.save()

        send_mail(
            subject="Account Reactivated | Smart Healthcare",
            message=f"""
Hi {patient.name},

Your account has been reactivated by the admin team. You can now login and use Smart Healthcare.

If you did not request this change, please contact our support team immediately.

Please note: This is an auto-generated mail. Do not reply to this message.

Regards,
Smart Healthcare Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[patient.email],
            fail_silently=True,
        )

        return Response({"message": "Patient unblocked and notified"})

    except user_tbl.DoesNotExist:
        return Response({"message": "Patient not found"}, status=404)