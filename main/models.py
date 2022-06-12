from django.db import models


class Post(models.Model):
    title = models.CharField('Должность', max_length= 100)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "должность"
        verbose_name_plural = "должности"


class Question(models.Model):
    question = models.TextField('Вопрос')
    post = models.ForeignKey(Post, on_delete= models.CASCADE)

    def __str__(self):
        return self.question

    def post_name(self):
        return self.post
    post_name.short_description = "Должность(Post)"

    class Meta:
        verbose_name = "вопрос"
        verbose_name_plural = "вопросы"


class User(models.Model):
    name = models.CharField('Имя', max_length= 50)
    surname = models.CharField('Фамилия', max_length=50)
    post = models.ForeignKey(Post, on_delete= models.CASCADE)
    recommend = models.CharField('Рекомендую', max_length= 3, blank=True , null=True)
    start_date = models.DateTimeField("Дата прохождения интервью", blank=True , null=True)
    screen_link = models.CharField('Видео', max_length= 100, blank=True , null=True)

    def __str__(self):
        return self.name + " " + self.surname

    def post_name(self):
        return self.post
    post_name.short_description = "Должность (Post)"

    class Meta:
        verbose_name = "участник"
        verbose_name_plural = "участники"


class Comment(models.Model):
    inspector = models.CharField('Проверяющий', max_length= 50)
    comment = models.TextField('Комментарий проверяющего')
    examinee = models.ForeignKey(User, on_delete= models.CASCADE)

    def __str__(self):
        return self.comment

    def examinee_name(self):
        return self.examinee
    examinee_name.short_description = "Участник"

    class Meta:
        verbose_name = "комментарий"
        verbose_name_plural = "комментарии"
