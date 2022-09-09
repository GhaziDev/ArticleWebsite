from django.shortcuts import render
from main import models,serializer
from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import login,authenticate,logout
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.middleware.csrf import get_token
from django.utils import timezone
from django.middleware.csrf import CsrfViewMiddleware
from django.core import serializers
from django.contrib.postgres.search import SearchVector
import json
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.mail import  send_mail
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.urls import reverse
import uuid
class CurrentUser(views.APIView):
    def get(self,request):
        return Response(request.user.username,status=200)


class CheckAuthenticated(views.APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(request.user.username)
    
        return Response("Not Authenticated",status=401)
    
class ArticleView(viewsets.ModelViewSet):
    serializer_class = serializer.ArticleSerializer
    parser_classes = [MultiPartParser,FormParser,JSONParser]

    def get_queryset(self):
        queryset = models.Article.objects.all()
        return queryset
    
    @method_decorator(ensure_csrf_cookie,csrf_protect)
    def create(self,request):
        authentication_classes = [SessionAuthentication]
        permissions_classes = [IsAuthenticated]
        article = serializer.ArticleSerializer(data=request.data)
        print(article.is_valid())
        print(article.errors)
        if article.is_valid():
            title = article.data['title']
            description = article.data['description']
            tag = models.Tag.objects.get(name=article.data['tag'])
            date = timezone.now()
            title_img = request.FILES['title_img']
            if not 20<=len(title)<=60:
                return Response("Title should be between 20-60 characters!",status=400)
            new_article = models.Article.objects.create(title=title,title_img=title_img,description=description,user=request.user,tag=tag,date=date)
            return Response(new_article.id)
        if article.errors.get('title_img'):
           return Response('Upload an image of type : png,jpeg,jpg,ico,gif,webp',status=400)
        return Response(article.data['title_img'])

    def update(self, request,pk):
        data = serializer.OnEditSerializer(data=request.data)

        if data.is_valid():
            models.Article.objects.filter(id=pk).update(description=data.data['description'])
            return Response(data.data['description'],status=200)
    def destroy(self,request,pk):
        models.Article.objects.filter(pk=pk).delete()
        return Response('Article deleted.',status=200)
    

class TagView(viewsets.ModelViewSet):
    serializer_class = serializer.TagSerializer
    lookup_field = 'name'
    queryset = models.Tag.objects.all()


@method_decorator(csrf_protect,name='dispatch')
class SignupView(viewsets.ModelViewSet):
    serializer_class = serializer.SignupSerializer



    def get_queryset(self):
        queryset = models.CustomUser.objects.all()
        return queryset
    
    def create(self,request):
        data = serializer.SignupSerializer(data=request.data)
        if data.is_valid():
            username = data.data['username']
            email = data.data['email']
            password = data.data['password']
           
            if models.CustomUser.objects.filter(email=email):
                return Response("Email already exists in the database",status=400)  
            try:

                validate_password(password)
            except ValidationError as e:
                return Response(e,status=400)
            user = models.CustomUser.objects.create_user(username=username,email=email,password=make_password(password))
            user.is_active = False
            user.save()

            print(user.token)
            send_mail(subject='Email Confirmation',message=f'Click on this link to verify your email : http://127.0.0.1:8000/verify/{user.token}/{user}',from_email=None, recipient_list=[email])
            return Response("Account Created.",status=200)
        return Response("Fail")

class CheckUserExist(views.APIView):
    serializer_class = serializer.CheckUserSerializer
    def post(self,request):
        data = serializer.CheckUserSerializer(data=request.data)
        valid = ASCIIUsernameValidator()
        if data.is_valid():
            try:
                valid(data.data['username'])
            except ValidationError as e:
                return Response(e,status=400)
            if models.CustomUser.objects.filter(username=data.data['username']):
                return Response('Username already exists.',status=400)
            if len(data.data['username'])<6:
                return Response('Username must be between 6-30 characters.',status=400)
            else:
                return Response("Valid Username",status=200)
        return Response("Username field is empty",status=400)


class CommentView(viewsets.ModelViewSet):
    serializer_class = serializer.CommentSerializer
    def get_queryset(self):
        comments = models.Comment.objects.all()

        return comments
    def create(self,request):
        data = serializer.CommentSerializer(data=request.data)
        if data.is_valid():
            desc = data.data['desc']
            article = data.data['article']
            article = models.Article.objects.get(id=article)
            user = request.user
            models.Comment.objects.create(desc=desc,article=article,user=user)
            comments_of_article = list(article.article_comments.all().values())
            return JsonResponse(comments_of_article,safe=False)
        return Response("Comment fail on creation.")     


class LoginView(views.APIView):
    permission_classes = [AllowAny,]
    serializer_class = serializer.LoginSerializer

    def post(self,request):
        data = serializer.LoginSerializer(data=request.data)
        if data.is_valid():
            email = data.data['email']
            password = data.data['password']
            auth = authenticate(username=email,password=password)
            if auth:
                login(request,auth)
                return Response("Success",status=200)
            else:
                if email == "" and password =="":
                    return Response('Both email and password field are empty',status=400)

                elif email == "":
                    return Response('Email field is empty',status=400)
                elif password == "":
                    return Response('Passowrd field is empty',status = 400)
                

                else:
                    try:
                        if not get_object_or_404(models.CustomUser,email=email).is_active:
                                return Response('Please check your inbox and verify your account in order to log in',status=400)
                        else:
                            return Response('Username or password is wrong.',status=400)

                    except Http404:
                        return Response('Username or password is wrong.',status=400)
                
        else:
            return Response("Both email and password fields are empty",status=400)

 
class GetCSRFToken(views.APIView):
    permission_classes = [AllowAny, ]

    
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, format=None):
        return Response("Success")




class LogoutView(views.APIView):
    @method_decorator(ensure_csrf_cookie,csrf_protect)
    def get(self,request):
        logout(request)
        return Response("Logged out!")



class VerifyUser(views.APIView):
    def get(self,request,token,user):
        user = models.CustomUser.objects.get(email=user)
        user.is_active = True
        user.save()
        
        print(user.is_active)

        return Response("Verified!")


def generate_token():
    return get_random_string(length=32)


class CheckVerified(views.APIView):
    def get(self,request):
        return Response(1 if self.request.user.is_active else 0)



class UserProfileView(views.APIView):
    def get(self,request,user):
        print(models.CustomUser.objects.get(username=user).user_articles)
        return HttpResponse(models.CustomUser.objects.get(username=user).user_articles)
    
class PasswordResetView(views.APIView):
    serializer_class = serializer.PasswordResetSerializer
    def post(self,request):
        data = serializer.PasswordResetSerializer(data=request.data)

        print(data.is_valid())
        print(data.data)
        print(data.errors)
        if data.is_valid():
            user = models.CustomUser.objects.get(email=data.data['email'])
            send_mail('Password Reset', f'please reset your password here : 127.0.0.1:3000/reset-page/{user.token}/{user.pk}',from_email=None, recipient_list=[data.data['email']])
            return Response(user.token,status=200)
    
        

class PasswordChangeView(views.APIView):
    serializer_class = serializer.PasswordChangeSerializer
    def post(self,request,token,id):
        data = serializer.PasswordChangeSerializer(data=request.data)
        if data.is_valid():
            password = data.data['password']
            try:
                validate_password(password)
                user = models.CustomUser.objects.filter(id=id)
                user1 =  models.CustomUser.objects.get(id=id)
                user.update(password=make_password(password))
                user1.token = uuid.uuid1()
                user1.save()
                return Response("Password has been reset!",status=200)
    
            except ValidationError as e:
                return Response(e,status=400)

            
        return Response("Password reset failed",status=400)
    def get(self,request,token,id):
        try:
            get_object_or_404(models.CustomUser,token = token)
            get_object_or_404(models.CustomUser,id=id)
            return Response("user is found",status=200)
        except:
            return Response("user is not found",status=404)
    



def random_token():
    # generate a random token
    return get_random_string(length=12)