from django.shortcuts import render
from django.http import JsonResponse
from .models import Question, User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
from datetime import datetime


def index(request):
    id = int(request.GET.get("id"))
    post = request.GET.get("post")
    users = list(User.objects.all())
    for user in users:
        if id == user.id and post == user.post.title:
            data = {
                "post": post,
                "id": id
            }
            return render(request, 'main/index.html', context=data)
    return HttpResponse("<h2>Недействительные параметры: POST: {0}; ID: {1}</h2>".format(post, id))

def interview(request):
    post = request.GET.get("post")
    id = int(request.GET.get("id"))
    users = list(User.objects.all())
    for user in users:
        if id == user.id and post == user.post.title:
            if user.screen_link == None and user.start_date == None:
                data = {
                    "post" : post,
                    "id" : id
                }
                return render(request, 'main/interview.html', context=data)
            else:
                return HttpResponse(f"<h2>Вы уже прошли интервью</h2>")
    return HttpResponse(f"<h2>Недействительные параметры: POST: {post}; ID: {id}</h2>")


def get_tasks(request):
    tasks = Question.objects.all()
    response = {}
    for task in tasks:
        if task.post.title not in response:
            response[task.post.title] = [task.question]
        else:
            response[task.post.title].append(task.question)
    return JsonResponse({ 'tasks': response })


@csrf_protect
def post_data(request):
    start_time_posix = int(request.POST.get("start_date")) / 1000
    time = datetime.utcfromtimestamp(start_time_posix)
    users = User.objects.all()
    for user in users:
        if user.id == int(request.POST.get("id")):
            user.start_date = time
            user.save()
    return HttpResponse("<h2></h2>")


@csrf_protect
def post_video(request):
    screen_link = request.POST.get('download_screen_link')
    users = User.objects.all()
    for user in users:
        if user.id == int(request.POST.get("id")):
            user.screen_link = screen_link
            user.save()
    return HttpResponse("<h2></h2>")