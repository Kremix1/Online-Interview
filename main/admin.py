from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.http import urlencode
from main.models import User, Post, Comment, Question


@admin.register(User)
class User(admin.ModelAdmin):
    list_display = ("__str__", "post_name", "start_date", "recommend", "screen_link")
    list_filter = ("post", "recommend")


@admin.register(Comment)
class Comment(admin.ModelAdmin):
    list_display = ("examinee_name", "inspector", "comment")


@admin.register(Question)
class Question(admin.ModelAdmin):
    list_display = ("post_name", "question")
    list_filter = ("post",)


@admin.register(Post)
class Post(admin.ModelAdmin):
    list_display = ("title", "view_question_link")

    def view_question_link(self, obj):
        count = obj.question_set.count()
        url = (
            reverse("admin:main_question_changelist")
            + "?"
            + urlencode({"post__id__exact": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} Questions</a>', url, count)
    view_question_link.short_description = "Questions"