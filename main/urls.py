from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path("interview/", views.interview),
    path("interview/get_tasks", views.get_tasks, name = "get_tasks"),
    path('interview/post_data', views.post_data),
    path('interview/post_video', views.post_video)
]