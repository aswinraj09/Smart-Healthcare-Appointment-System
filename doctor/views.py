from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from . serializers import *
from django.core.mail import send_mail
from django.conf import settings
from datetime import date
from appointment.models import *
from .models import DoctorAvailability
from django.utils import timezone
from datetime import timedelta
from .serializers import *
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
def doctor_register(request):
    serializer = doctorRegisterSerializer(data=request.data)

    if serializer.is_valid():
        doctor = serializer.save()  # ✅ save doctor

        # 📧 SEND EMAIL TO DOCTOR
        send_mail(
            subject="Doctor Registration Successful | Smart Healthcare",
            message=f"""
Hi {doctor.name},

Thank you for registering with Smart Healthcare.

Your account has been created successfully and is currently
waiting for admin approval.

Once approved, you will be able to:
- Login to your dashboard
- Set your slots
- View daily appointments

We will notify you once your account is approved.

Please note: This is an auto-generated mail. Please do not reply to this mail.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[doctor.email],  # ✅ send to doctor email
            fail_silently=False,
        )

        return Response(
            {
                "message": "Doctor registered successfully. Waiting for admin approval."
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
def doctor_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        doctor = doctor_tbl.objects.get(email=email)
    except doctor_tbl.DoesNotExist:
        return Response(
            {"message": "Invalid email or password"},
            status=400
        )

    if doctor.password != password:
        return Response(
            {"message": "Invalid email or password"},
            status=400
        )

    # 🚨 ADMIN APPROVAL CHECK
    if doctor.is_approved != "Approved":
        return Response(
            {"message": "Your account is not approved by admin yet"},
            status=403
        )
    
    request.session["doctor_id"] = doctor.id
    request.session["role"] = "doctor"

    # ⏱️ SESSION EXPIRY (30 minutes)
    request.session.set_expiry(1800)

    return Response(
        {
            "message": "Login successful",
            "doctor_id": doctor.id,
            "name": doctor.name,
            "email": doctor.email,
            "specialization": doctor.specialization,
            "role": "doctor"
        },
        status=200
    )


@api_view(['POST'])
def set_doctor_availability(request):
    serializer = DoctorAvailabilitySerializer(data=request.data)

    if serializer.is_valid():
        availability = serializer.save(is_available=True)

        return Response(
            {
                "id": availability.id,
                "date": availability.date,
                "start_time": availability.start_time,
                "end_time": availability.end_time,
                "message": "Availability added successfully"
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET"])
def get_doctor_availability(request, doctor_id):
    today = date.today()

    availability = DoctorAvailability.objects.filter(
        doctor_id=doctor_id,
        date__gte=today
    ).order_by("date", "start_time")

    data = []

    for slot in availability:
        booked_count = Appointment.objects.filter(
            availability=slot
        ).count()

        remaining = max(0, 20 - booked_count)

        data.append({
            "id": slot.id,
            "date": slot.date,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "remaining_slots": remaining,
            "is_full": remaining == 0
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
def doctor_availability_history(request, doctor_id):
    """Return all availability entries for a doctor (history), ordered by date desc."""
    availability = DoctorAvailability.objects.filter(
        doctor_id=doctor_id
    ).order_by("-date", "-start_time")

    data = []
    for slot in availability:
        booked_count = Appointment.objects.filter(
            availability=slot
        ).count()

        remaining = max(0, 20 - booked_count)

        data.append({
            "id": slot.id,
            "date": slot.date,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "remaining_slots": remaining,
            "is_full": remaining == 0
        })

    return Response(data, status=status.HTTP_200_OK)

@api_view(["DELETE"])
def delete_availability(request, pk):
    try:
        availability = DoctorAvailability.objects.get(id=pk)
        availability.delete()
        return Response({"message": "Availability deleted"}, status=200)
    except DoctorAvailability.DoesNotExist:
        return Response({"message": "Not found"}, status=404)

@api_view(['PUT'])
def update_doctor_availability(request, pk):
    try:
        availability = DoctorAvailability.objects.get(id=pk)
    except DoctorAvailability.DoesNotExist:
        return Response(
            {"message": "Availability not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = DoctorAvailabilitySerializer(
        availability,
        data=request.data,
        partial=True   # ✅ allows updating only changed fields
    )

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Availability updated successfully"},
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
def logout_view(request):
    request.session.flush()
    return Response({"message": "Logged out successfully"})


@api_view(["GET"])
def doctor_dashboard(request, doctor_id):
    today = timezone.now().date()

    # 📅 WEEK RANGE (Mon → Sun)
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    # 📆 MONTH RANGE
    month_start = today.replace(day=1)
    if today.month == 12:
        month_end = today.replace(day=31)
    else:
        month_end = (today.replace(month=today.month + 1, day=1) - timedelta(days=1))

    appointments = Appointment.objects.filter(doctor_id=doctor_id)

    today_appointments = appointments.filter(
        availability__date=today
    )

    data = {
        "weekly_appointments": appointments.filter(
            availability__date__range=(week_start, week_end)
        ).count(),

        "monthly_appointments": appointments.filter(
            availability__date__range=(month_start, month_end)
        ).count(),

        "pending_count": appointments.filter(status="Pending").count(),
        "completed_count": appointments.filter(status="Completed").count(),
        "cancelled_count": appointments.filter(status="Cancelled").count(),
        "today_patients": today_appointments.values("patient").distinct().count(),
        "total_count": appointments.count()
    }

    return Response(data)

@api_view(['GET'])
def doctor_profile(request, doctor_id):
    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)

        base_url = request.build_absolute_uri('/')[:-1]
        photo_url = None
        if doctor.photo:
            photo_url = base_url + doctor.photo.url

        return Response({
            "id": doctor.id,
            "name": doctor.name,
            "email": doctor.email,
            "specialization": doctor.specialization,
            "qualification": doctor.qualification,
            "experience": doctor.experience,
            "photo": photo_url
        })
    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)

@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])
def update_doctor_profile(request, doctor_id):
    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)
    except doctor_tbl.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=404)

    serializer = DoctorProfileSerializer(
        doctor,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)