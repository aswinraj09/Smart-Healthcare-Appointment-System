from django.urls import path
from .views import chat_agent

urlpatterns = [
    path("chat/", chat_agent),
]
