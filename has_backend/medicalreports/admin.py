from django.contrib import admin
from . models import *

admin.site.register(Prescription)
admin.site.register(ScanReport)
admin.site.register(LabReport)