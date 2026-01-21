from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from appointment.models import Appointment, AppointmentReminder


class Command(BaseCommand):
    help = 'Send reminder emails to patients 3 hours before appointment start time'

    def handle(self, *args, **options):
        now = timezone.now()
        target = now + timedelta(hours=3)
        window = timedelta(minutes=10)  # +/- window around the 3 hour mark

        start_lower = target - window
        start_upper = target + window

        sent_count = 0
        failed = 0

        appointments = (
            Appointment.objects
            .select_related('patient', 'doctor', 'availability')
            .filter(status='Pending')
        )

        for appt in appointments:
            av = appt.availability
            slot_start = datetime.combine(av.date, av.start_time)
            slot_start = timezone.make_aware(slot_start)

            if not (start_lower <= slot_start <= start_upper):
                continue

            # skip if reminder already sent
            if hasattr(appt, 'reminder'):
                continue

            try:
                subject = 'Appointment Reminder | Smart Healthcare'
                message = f"""
Hi {appt.patient.name},

This is a reminder for your upcoming appointment.

Doctor: Dr. {appt.doctor.name}
Specialization: {appt.doctor.specialization}
Date: {av.date}
Time: {av.start_time} – {av.end_time}
Token Number: {appt.token_number}

Please arrive on time. If you need to cancel, please do so in advance.

This is an automated message. Do not reply.

Regards,
Smart Healthcare Team
"""
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[appt.patient.email],
                    fail_silently=False,
                )

                # mark as sent
                AppointmentReminder.objects.create(appointment=appt)
                sent_count += 1

            except Exception as e:
                failed += 1
                self.stderr.write(f"Failed to send reminder for appt {appt.appointment_id}: {e}")

        self.stdout.write(f"Reminders sent: {sent_count}, failed: {failed}")
