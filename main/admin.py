from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.http import urlencode
from main.models import User, Post, Comment, Question


@admin.register(User)
class User(admin.ModelAdmin):
    list_display = ("__str__", "post__title", "start_date", "recommend", "screen_link", "time_stamps", 'not_focus',
                    "view_comment_link")
    list_filter = ("post__title", "recommend")
    fieldsets = (
        (None, {
            'fields': ('name', 'surname', 'post')
        }),
        ('Interview results', {
            'fields': ('start_date', 'recommend', 'screen_link', 'time_stamps', 'not_focus')
        }),
    )

    def view_comment_link(self, obj):
        count = obj.comment_set.count()
        url = (
            reverse("admin:main_comment_changelist")
            + "?"
            + urlencode({"examinee__surname": f"{obj.surname}"})
        )
        return format_html('<a href="{}">{} Comments</a>', url, count)
    view_comment_link.short_description = "Comments"


@admin.register(Comment)
class Comment(admin.ModelAdmin):
    list_display = ("examinee__surname", "inspector", "comment")
    search_fields = ("examinee__surname__startswith", )
    list_filter = ("examinee__surname", )


@admin.register(Question)
class Question(admin.ModelAdmin):
    list_display = ("post__title", "question")
    list_filter = ("post__title",)


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
