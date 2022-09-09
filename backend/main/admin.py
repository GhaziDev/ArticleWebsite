from django.contrib import admin
from main import models


class ArticleAdmin(admin.ModelAdmin):

    class Meta:
        models = models.Article
        fields = '__all__'


admin.site.register(models.Article,ArticleAdmin)
# Register your models here.

