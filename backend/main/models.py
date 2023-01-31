from django.db import models
from django.contrib.auth.models import User
import uuid
from ckeditor.fields import RichTextField
from main import validators
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,AbstractUser,UserManager
from django.template.defaultfilters import slugify
from autoslug import AutoSlugField
from django.utils import timezone
from imagekit.models import ProcessedImageField,ImageSpecField
from imagekit.processors import ResizeToFit, ResizeToFill


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
    img = ProcessedImageField(upload_to='media',processors=[ResizeToFit(width=150,height=150)],format='webp',options={'quality':100},null=True,blank=True,default='typer.webp')
    bio = models.CharField(max_length=1000)

    def __str__(self):
        return f"{self.user.username} {self.img} {self.bio}"





class Article(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,unique=True)
    title = models.CharField(max_length=200)
    title_img = ProcessedImageField(upload_to='media',processors=[ResizeToFill(width=800,height=450)],format='webp',options={'quality':100})
    description = RichTextField()
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name='user_articles',to_field='username')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE,related_name='tag_articles',to_field='name')
    date = models.DateField(auto_now=True,blank=False)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE,to_field='user',related_name='user_posts',default=user)
    likes = models.ManyToManyField(CustomUser,related_name='liked_articles')
    thumb_img = ProcessedImageField(upload_to='media',processors=[ResizeToFill(width=315,height=190,upscale=True)],format='webp',options={'quality':100})
    slug = AutoSlugField(populate_from='title',primary_key=True,unique=True)

    class Meta:
        ordering = '-date',

    def __str__(self):
        return f"{self.title} {self.title_img.url} {self.user.username} {self.tag}"
    
    def save(self,*args,**kwargs):
        return super().save(*args,**kwargs)

'''
class UploadedImagesToDescription(models.Model):
    Because the article description is basically a multipart data (can have images,text, etc...)
    all images will be handled here
    article = models.ForeignKey(Article,related_name='articles_imgs',on_delete=models.CASCADE)
    images = models.ImageField(upload_to='media')

'''

class Comment(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,unique=True,primary_key=True) #fix the primary key here.

    desc = models.TextField()
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='user_comments',to_field='username')
    article = models.ForeignKey(Article,on_delete=models.CASCADE,related_name='article_comments')
    date = models.DateField(auto_now_add=True)
    is_author = models.BooleanField(default=False)
    likes = models.ManyToManyField(CustomUser,related_name='liked_comments')


    class Meta:
        ordering = '-date',



    def __str__(self):
        return f"{self.desc} {self.user} {self.article} {self.user.user_profile.img.url}"



    



class Signup(models.Model):
    username = models.CharField(max_length=322)
    email = models.EmailField(max_length=320)
    password = models.CharField(max_length=128)


    

# Create your models here.
