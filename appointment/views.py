from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from doctor.models import *
from user.models import *
from django.utils import timezone
from datetime import datetime
from doctor.models import *
from datetime import timedelta

@api_view(["POST"])
def book_appointment(request):
    patient_id = request.data.get("patient_id")
    doctor_id = request.data.get("doctor_id")
    availability_id = request.data.get("availability_id")

    try:
        patient = user_tbl.objects.get(id=patient_id)
        doctor = doctor_tbl.objects.get(id=doctor_id)
        availability = DoctorAvailability.objects.get(id=availability_id)

        # 🚫 CHECK 1: SAME PATIENT ALREADY BOOKED
        already_booked = Appointment.objects.filter(
            patient=patient,
            availability=availability,
        ).exists()

        if already_booked:
            return Response(
                {"message": "You already booked this slot"},
                status=status.HTTP_409_CONFLICT
            )

        # 🚫 CHECK 2: SLOT CAPACITY (20)
        booked_count = Appointment.objects.filter(
            availability=availability
        ).count()

        if booked_count >= 20:
            return Response(
                {"message": "This slot is already filled"},
                status=status.HTTP_409_CONFLICT
            )

        # 🎫 TOKEN NUMBER
        token_number = booked_count + 1

        # ✅ CREATE APPOINTMENT
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            availability=availability,
            token_number=token_number,
            status="Pending"
        )

        # ✉️ EMAIL
        send_mail(
            subject="Appointment Confirmation | Smart Healthcare",
            message=f"""
Hi {patient.name},

Your appointment has been successfully confirmed.

Doctor: Dr. {doctor.name}
Specialization: {doctor.specialization}
Date: {availability.date}
Time: {availability.start_time} – {availability.end_time}
Token Number: {token_number}

Please arrive according to your token number.
If you are unable to attend, kindly cancel the appointment in advance.

This is an auto-generated email. Please do not reply.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[patient.email],
            fail_silently=True,
        )

        return Response(
            {
                "message": "Appointment booked successfully",
                "appointment_id": appointment.appointment_id,
                "token_number": token_number
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {
                "message": "Failed to book appointment",
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["GET"])
def patient_appointments(request, patient_id):
    auto_cancel_expired_appointments()  

    appointments = Appointment.objects.filter(patient_id=patient_id)

    data = []
    for app in appointments:
        availability = app.availability

        slot_end = datetime.combine(
            availability.date,
            availability.end_time
        )

        slot_end = timezone.make_aware(slot_end)

        can_cancel = (
            app.status == "Pending"
            and slot_end > timezone.now()
        )

        data.append({
            "appointment_id": app.appointment_id,
            "doctor_name": app.doctor.name,
            "specialization": app.doctor.specialization,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "token_number": app.token_number,
            "status": app.status,
            "can_cancel": can_cancel
        })

    return Response(data)



@api_view(["PUT"])
def cancel_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(appointment_id=appointment_id)

        if appointment.status != "Pending":
            return Response(
                {"message": "Cannot cancel this appointment"},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = "Cancelled"
        appointment.save()

        # ✉️ EMAIL
        send_mail(
            subject="Appointment Cancelled | Smart Healthcare",
            message=f"""
Hi {appointment.patient.name},

Your appointment has been successfully cancelled. Please find the details below:

Doctor: Dr. {appointment.doctor.name}
Date: {appointment.availability.date}
Time: {appointment.availability.start_time} – {appointment.availability.end_time}
Token numner: {appointment.token_number}

If this cancellation was made by mistake, you may book a new appointment through our platform.

Please note: This is an auto-generated email. Do not reply to this message.

Regards,
Smart Healthcare Team
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.patient.email],
            fail_silently=True,
        )

        return Response(
            {"message": "Appointment cancelled successfully"},
            status=status.HTTP_200_OK
        )

    except Appointment.DoesNotExist:
        return Response(
            {"message": "Appointment not found"},
            status=status.HTTP_404_NOT_FOUND
        )

def auto_cancel_expired_appointments():
    now = timezone.now()

    expired_appointments = Appointment.objects.filter(
        status="Pending"
    )

    for appointment in expired_appointments:
        availability = appointment.availability

        slot_end = datetime.combine(
            availability.date,
            availability.end_time
        )

        slot_end = timezone.make_aware(slot_end)

        if slot_end < now:
            appointment.status = "Cancelled"
            appointment.save()

@api_view(["GET"])
def doctor_appointments(request, doctor_id):
    now = timezone.now()

    appointments = (
        Appointment.objects
        .filter(doctor_id=doctor_id)
        .select_related("patient", "availability")
        .order_by("availability__date", "availability__start_time")
    )

    data = []
    for app in appointments:
        availability = app.availability

        slot_end = timezone.make_aware(
            datetime.combine(
                availability.date,
                availability.end_time
            )
        )

        data.append({
            "appointment_id": app.appointment_id,
            "patient_name": app.patient.name,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "token_number": app.token_number,
            "status": app.status,
            "is_active": slot_end > now
        })

    return Response(data)

@api_view(["GET"])
def doctor_appointment_history(request, doctor_id):
    now = timezone.now().date()

    appointments = (
        Appointment.objects
        .select_related("patient", "availability")
        .filter(doctor_id=doctor_id)
        .order_by("-availability__date", "-availability__start_time")
    )

    data = []
    for app in appointments:
        availability = app.availability

        data.append({
            "appointment_id": app.appointment_id,
            "patient_name": app.patient.name,
            "date": availability.date,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "token_number": app.token_number,
            "status": app.status
        })

    return Response(data)

@api_view(["GET"])
def doctor_daily_appointments(request, doctor_id):
    today = timezone.localdate()

    appointments = Appointment.objects.filter(
        doctor_id=doctor_id,
        availability__date=today
    ).select_related(
        "patient", "availability"
    ).order_by("token_number")

    data = []
    for app in appointments:
        data.append({
            "appointment_id": app.appointment_id,
            "patient_name": app.patient.name,
            "token_number": app.token_number,
            "start_time": app.availability.start_time,
            "end_time": app.availability.end_time,
            "status": app.status
        })

    return Response(data)

@api_view(["PUT"])
def update_appointment_status(request, appointment_id):
    status_value = request.data.get("status")

    if status_value not in ["Completed", "Cancelled"]:
        return Response(
            {"message": "Invalid status"},
            status=400
        )

    try:
        appointment = Appointment.objects.get(appointment_id=appointment_id)

        if appointment.status != "Pending":
            return Response(
                {"message": "Status cannot be changed"},
                status=400
            )

        appointment.status = status_value
        appointment.save()

        return Response(
            {"message": "Appointment status updated successfully"}
        )

    except Appointment.DoesNotExist:
        return Response(
            {"message": "Appointment not found"},
            status=404
        )
    

def send_appointment_reminders():
    now = timezone.now()

    appointments = Appointment.objects.filter(
        status="Pending",
        reminder_sent=False
    )

    for appointment in appointments:
        availability = appointment.availability

        appointment_start = timezone.make_aware(
            datetime.combine(
                availability.date,
                availability.start_time
            )
        )

        reminder_time = appointment_start - timedelta(hours=4)

        if reminder_time <= now < appointment_start:
            send_mail(
                subject="Appointment Reminder | Smart Healthcare",
                message=f"""
Hi {appointment.patient.name},

⏰ This is a friendly reminder about your upcoming appointment. Please find the details below:

Doctor: Dr. {appointment.doctor.name}
Specialization: {appointment.doctor.specialization}
Date: {availability.date}
Time: {availability.start_time} – {availability.end_time}
Token Number: {appointment.token_number}

Kindly ensure you arrive at the clinic on time.

Thank you for choosing Smart Healthcare.

(This is an automated reminder email. Please do not reply to this message.)
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[appointment.patient.email],
                fail_silently=True,
            )

            appointment.reminder_sent = True
            appointment.save()
