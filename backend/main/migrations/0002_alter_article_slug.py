# Generated by Django 4.0.3 on 2023-01-13 11:29

import autoslug.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='slug',
            field=autoslug.fields.AutoSlugField(editable=False, populate_from='title', primary_key=True, serialize=False, unique_with=['user']),
        ),
    ]