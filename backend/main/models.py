from django.db import models
from django.contrib.auth.models import User
import uuid
from ckeditor.fields import RichTextField
from main import validators
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,AbstractUser,UserManager



class CustomUser(AbstractUser):
    _id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
    username = models.CharField(max_length=322,unique=True)
    email = models.EmailField(max_length=320,unique=True)
    token = models.UUIDField(default=uuid.uuid1,unique=True)
    USERNAME_FIELD ='email'
    REQUIRED_FIELDS = ['username']


class Tag(models.Model):
    name = models.CharField(max_length=100,unique=True)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,to_field='username',related_name='user_profile')
    img = models.ImageField(upload_to='media')
    bio = models.CharField(max_length=1000)


class Article(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True)
    title = models.CharField(max_length=200)
    title_img = models.ImageField(upload_to='media')
    description = RichTextField()
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name='user_articles',to_field='username')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE,related_name='tag_articles',to_field='name')
    date = models.DateField(auto_now_add=True,blank=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE,to_field='user',related_name='user_posts',default=user)


    class Meta:
        ordering = '-date',

    def __str__(self):
        return f"{self.title} {self.title_img} {self.user.username} {self.tag}"


class UploadedImagesToDescription(models.Model):
    '''
    Because the article description is basically a multipart data (can have images,text, etc...)
    all images will be handled here
    '''
    article = models.ForeignKey(Article,related_name='articles_imgs',on_delete=models.CASCADE)
    images = models.ImageField(upload_to='media')


class Comment(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True)
    desc = models.TextField()
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='user_comments',to_field='username')
    article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='article_comments')
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = '-date',

    def __str__(self):
        return f"{self.desc} {self.user} {self.article}"
    class Meta:
        ordering = ('-date',)
        


class Signup(models.Model):
    username = models.CharField(max_length=322)
    email = models.EmailField(max_length=320)
    password = models.CharField(max_length=128)


    

# Create your models here.
