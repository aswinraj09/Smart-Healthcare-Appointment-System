from django.contrib import admin
from . models import *

admin.site.register(doctor_tbl)
admin.site.register(DoctorAvailability)