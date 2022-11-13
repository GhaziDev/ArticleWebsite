from django.contrib import admin
from main import models


class ArticleAdmin(admin.ModelAdmin):

    class Meta:
        models = models.Article
        fields = '__all__'

class CommentAdmin(admin.ModelAdmin):
    class Meta:
        models = models.Comment
        fields = '__all__'

admin.site.register(models.Article,ArticleAdmin)
admin.site.register(models.Comment,CommentAdmin)
# Register your models here.

