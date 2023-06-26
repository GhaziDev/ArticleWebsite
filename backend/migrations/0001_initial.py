# Generated by Django 4.0.3 on 2023-06-24 11:49

import autoslug.fields
import ckeditor.fields
from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import imagekit.models.fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('_id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('username', models.CharField(max_length=322, unique=True)),
                ('email', models.EmailField(max_length=320, unique=True)),
                ('token', models.UUIDField(default=uuid.uuid1, unique=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Article',
            fields=[
                ('_id', models.UUIDField(default=uuid.uuid4, unique=True)),
                ('title', models.CharField(max_length=200)),
                ('title_img', imagekit.models.fields.ProcessedImageField(upload_to='media')),
                ('description', ckeditor.fields.RichTextField()),
                ('date', models.DateField(auto_now=True)),
                ('thumb_img', imagekit.models.fields.ProcessedImageField(upload_to='media')),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from='title', primary_key=True, serialize=False, unique=True)),
                ('likes', models.ManyToManyField(related_name='liked_articles', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-date',),
            },
        ),
        migrations.CreateModel(
            name='Signup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=322)),
                ('email', models.EmailField(max_length=320)),
                ('password', models.CharField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', imagekit.models.fields.ProcessedImageField(blank=True, default='typer.webp', null=True, upload_to='media')),
                ('bio', models.CharField(max_length=1000)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL, to_field='username')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('_id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False, unique=True)),
                ('desc', models.TextField()),
                ('date', models.DateField(auto_now_add=True)),
                ('is_author', models.BooleanField(default=False)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='article_comments', to='main.article')),
                ('likes', models.ManyToManyField(related_name='liked_comments', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_comments', to=settings.AUTH_USER_MODEL, to_field='username')),
            ],
            options={
                'ordering': ('-date',),
            },
        ),
        migrations.AddField(
            model_name='article',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tag_articles', to='main.tag', to_field='name'),
        ),
        migrations.AddField(
            model_name='article',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_articles', to=settings.AUTH_USER_MODEL, to_field='username'),
        ),
        migrations.AddField(
            model_name='article',
            name='user_profile',
            field=models.ForeignKey(default=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_articles', to=settings.AUTH_USER_MODEL, to_field='username'), on_delete=django.db.models.deletion.CASCADE, related_name='user_posts', to='main.userprofile', to_field='user'),
        ),
    ]
