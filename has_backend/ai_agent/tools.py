# ai_agent/tools.py

from langchain_core.tools import tool
from doctor.models import doctor_tbl, DoctorAvailability
from django.utils import timezone
import datetime

@tool
def find_doctor(specialization: str = None, query: str = None):
    """Search for doctors by specialization or name/query.
    Returns a list of doctors with their IDs, names, and specializations.
    """
    doctors = doctor_tbl.objects.filter(is_approved='Approved')
    
    if specialization:
        doctors = doctors.filter(specialization__icontains=specialization)
    if query:
        doctors = doctors.filter(name__icontains=query)
    
    results = []
    for doc in doctors:
        results.append({
            "id": doc.id,
            "name": f"Dr. {doc.name}",
            "specialization": doc.specialization,
            "experience": f"{doc.experience} years",
            "fee": "Consultation fees not in model" # Adjust based on model
        })
    
    if not results:
        return "No doctors found matching your criteria."
        
    return str(results)

@tool
def check_availability(doctor_id: int):
    """Check available appointment slots for a specific doctor for upcoming days.
    Returns list of distinct start times.
    """
    try:
        doctor = doctor_tbl.objects.get(id=doctor_id)
    except doctor_tbl.DoesNotExist:
        return "Doctor not found."

    # Find availability for next 7 days
    today = timezone.now().date()
    availabilities = DoctorAvailability.objects.filter(
        doctor=doctor,
        date__gte=today,
        is_available=True
    ).order_by('date', 'start_time')

    if not availabilities.exists():
        return f"No available slots found for Dr. {doctor.name}."

    slots = []
    for slot in availabilities:
        slots.append(f"{slot.date}: {slot.start_time.strftime('%I:%M %p')} - {slot.end_time.strftime('%I:%M %p')}")
    
    return "\n".join(slots)
