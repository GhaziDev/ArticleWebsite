# Generated by Django 4.0.3 on 2023-01-20 07:33

from django.db import migrations
import imagekit.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0010_article_thumb_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='img',
            field=imagekit.models.fields.ProcessedImageField(blank=True, default='/media/Article_1.gif', null=True, upload_to='media'),
        ),
    ]
