from django.shortcuts import render
from main import models,serializer
from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated, AllowAny,IsAuthenticatedOrReadOnly,IsAdminUser

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
from django.utils import timezone, dateformat
from django.middleware.csrf import CsrfViewMiddleware
from django.core import serializers
from django.contrib.postgres.search import SearchVector
from django.db.utils import IntegrityError
import json
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.mail import  send_mail
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.urls import reverse
import uuid
import json
from django.conf import settings
import datetime

from PIL import UnidentifiedImageError



from django.db.models import Exists, OuterRef


class TagByName(views.APIView):
    def get(self,request):
        return Response(models.Tag.objects.all().values_list('name',flat=True),status=200)

class CurrentUser(views.APIView):
    def get(self,request):
        if request.user.is_authenticated:
            return  Response(serializer.UserProfileSerializer(models.UserProfile.objects.get(user=request.user.username)).data,status=200)
        return Response('not_authenticated', status=401)


class CheckAuthenticated(views.APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(request.user.username)
    
        return Response("Not Authenticated",status=401)

class FetchUserArticles(views.APIView):
    def get(self,request,username):
        serializer_class = serializer.ArticleSerializer
        return Response(serializer.ArticleSerializer(models.Article.objects.filter(user=username)[0:4],many=True).data,status=200)

class ArticleView(viewsets.ModelViewSet):
    serializer_class = serializer.ArticleSerializer
    parser_classes = [MultiPartParser,FormParser,JSONParser]

    def get_queryset(self):
        queryset = models.Article.objects.all()

        return queryset


    
    @method_decorator(ensure_csrf_cookie)
    def create(self,request):
        authentication_classes = [SessionAuthentication]
        permissions_classes = [IsAuthenticated]
        article = serializer.ArticleSerializer(data=request.data)
        if article.is_valid():
            title = article.data['title']
            description = article.data['description']
            tag = models.Tag.objects.get(name=article.data['tag'])
            date = timezone.now().date()

            title_img = request.FILES['title_img']
            if not 20<=len(title)<=60:
                return Response("Title should be between 20-60 characters!",status=400)
            if not request.user.is_authenticated:
                return Response("user is not authenticated",status=401)
            user_profile = models.UserProfile.objects.get(user=request.user.username)
            new_article = models.Article.objects.create(title=title,title_img=title_img,description=description,user=request.user,tag=tag,date=date,user_profile=user_profile,thumb_img=title_img)
            new_article.save()
            return Response(new_article.slug)
        if article.errors.get('title_img'):
           return Response('Upload an image of type : png,jpeg,jpg,ico,gif,webp',status=400)
        return Response(article.data['title_img'])

    def update(self, request,pk):
        data = serializer.OnEditSerializer(data=request.data)
        permission_classes = [IsAuthenticated]

        if data.is_valid():
            # don't forget to change the date
            models.Article.objects.filter(slug=pk).update(description=data.data['description'])
            models.Article.objects.filter(slug=pk).update(date=timezone.now().date())
            artcl = models.Article.objects.get(slug=pk)
            

            return Response(serializer.ArticleSerializer(artcl).data,status=200)

            
    def destroy(self,request,pk):
        permission_classes = [IsAuthenticated]
        models.Article.objects.filter(slug=pk).delete()
        return Response('Article deleted.',status=200)



class CommentLikesView(views.APIView):
    serializer_class = serializer.LikesSerializer

    def get(self,request,_id):
        comment = models.Comment.objects.get(_id=_id)
        user = request.user
        is_liked = True if user.liked_comments.filter(_id=_id) else False
        return Response(serializer.LikesSerializer({'likes_count':comment.likes.count,'like':is_liked,'user':user.username,'iid':user._id}).data,status=200)
    def post(self,request,_id):
        permission_classes = [IsAuthenticated]

        comment = models.Comment.objects.get(_id=_id)
       
        if request.user.is_authenticated:
           user = models.CustomUser.objects.get(username=request.user.username)
           is_liked = user.liked_comments.filter(_id=_id)
           if is_liked:
            comment.likes.remove(user)
            is_liked =  False
           else:
            comment.likes.add(user)
            is_liked = True
        else:
            is_liked = False
        likes_count = comment.likes.count()
        return Response(serializer.LikesSerializer(dict(likes_count=likes_count,like=is_liked,iid=_id,user=request.user.username)).data,status=200)


class LikesView(views.APIView):
    serializer_class = serializer.LikesSerializer

    def get(self,request, slug):
        article_likes = models.Article.objects.get(slug=slug).likes.count()
        if request.user.is_authenticated:
            user = models.CustomUser.objects.get(_id=request.user._id)
            is_article_liked = user.liked_articles.filter(slug=slug)
            if is_article_liked:
                is_article_liked = True
            else:
                is_article_liked = False
        
        else:
            is_article_liked = False
        

        return Response(serializer.LikesSerializer({'like':is_article_liked,'likes_count':article_likes,'user':request.user.username,'iid':slug}).data,status=200)


    @method_decorator(ensure_csrf_cookie)
    def post(self,request,slug):
        permission_classes = [IsAuthenticated]
        if not request.user.is_authenticated:
            return Response("User is not authenticated!",status=401)
        if request.user.is_authenticated:
            likes = serializer.LikesSerializer(data=request.data)

            if likes.is_valid():
                user = likes.data['user']
                
                if request.user.is_authenticated:
                    user = models.CustomUser.objects.get(username=user)
                    article = models.Article.objects.get(slug=slug)

                    if user.liked_articles.filter(slug=slug):
                        article.likes.remove(user)
                        return Response(article.likes.count(),status=200)
                    else:
                        article.likes.add(user)
                        return Response(article.likes.count(),status=200)
            return Response("Invalid Data for the serializer!",status=400)



            



class TagView(viewsets.ModelViewSet):
    serializer_class = serializer.TagSerializer
    lookup_field = 'name'
    queryset = models.Tag.objects.all()
    permission_classes = [IsAdminUser]



class SignupView(viewsets.ModelViewSet):
    serializer_class = serializer.SignupSerializer



    def get_queryset(self):
        permission_classes = [IsAdminUser]
        queryset = models.CustomUser.objects.all()
        return queryset
    
    @method_decorator(ensure_csrf_cookie)
    def create(self,request):
        data = serializer.SignupSerializer(data=request.data)
        if data.is_valid():
            username = data.data['username']
            email = data.data['email']
            password = data.data['password']
           
            if models.CustomUser.objects.filter(email=email).exists():
                return Response("Email already exists in the database",status=400)  
            
            if models.CustomUser.objects.filter(username=username).exists():
                return Response("Username already exist.",status=400)
        
            try:

                validate_password(password)
            except ValidationError as e:
                return Response(e,status=400)

            user = models.CustomUser.objects.create_user(username=username,email=email,password=password)
            user.is_active = False
            user.save()
            send_mail(subject='Email Confirmation',message=f'Click on this link to verify your email : https://www.globeofarticles.com/verify/{user.token}/{user}',from_email=None, recipient_list=[email])
            return Response("Account Created.",status=200)
        return Response("Fail")

class CheckUserExist(views.APIView):
    serializer_class = serializer.CheckUserSerializer

    def post(self,request):
        data = serializer.CheckUserSerializer(data=request.data,context={'user':request.user})
        valid = ASCIIUsernameValidator() # validating username using a custom validator by django.
        if data.is_valid():
            try:
                valid(data.data['username'])
            except ValidationError as e:
                return Response(e,status=400)
            if models.CustomUser.objects.filter(username=data.data['username']).exists():
                return Response('Username already exists.',status=400)
            if len(data.data['username'])<6:
                return Response('Username must be between 6-30 characters.',status=400)
            else:
                return Response("Valid Username",status=200)
        return Response("Username field is empty",status=400)

class CheckPasswordValidation(views.APIView):
    serializer_class = serializer.CheckPasswordSerializer
    def post(self,request):
        data = serializer.CheckPasswordSerializer(data=request.data)
        if data.is_valid():
            try:
                validate_password(data.data["password"])
            except ValidationError as e:
                return Response(e,status=400)
            return Response("password is valid",status=200)
        return Response("password validation failed",status=400)



class CommentView(viewsets.ModelViewSet):
    serializer_class = serializer.CommentSerializer
    permission_classes = [IsAuthenticated]


    def get_serializer_context(self): #adding request.user as an extra context
        context = super(CommentView,self).get_serializer_context()
        context.update({'user':self.request.user})
        return context

    def get_queryset(self):
        queryset = models.Comment.objects.all()

        return queryset
    def get(self,request):
        data = serializer.CommentSerializer(data=request.data)
     
        if data.is_valid():
            article = data.data['id']
            comments = models.Comment.objects.filter(article=article)
            return Response(comment,status=200)
        return Response('could not validate data',status=400)

    @method_decorator(ensure_csrf_cookie)
    def create(self,request):
        data = serializer.CommentSerializer(data=request.data)
        if data.is_valid():
            desc = data.data['desc']
            article = data.data['article']
            article = models.Article.objects.get(slug=article)
            user = models.CustomUser.objects.get(username=request.user.username)
       

            cmnt = models.Comment.objects.create(desc=desc,article=article,user=request.user,is_author=user==True if user == article.user else False)
            cmnt.likes.add(user)
            cmnt.save()
            comments_of_article = article.article_comments.all()
            return Response(serializer.CommentSerializer(comments_of_article,many=True).data,status=200)

        return Response("Comment fail on creation.",status=400)   

    def delete(self,request,id):
        instance = models.Comment.objects.get(_id=id)
        if request.user == instance.user:
            instance.delete()
            return Response("Comment deleted!",status=200)
        else:
            return Response("You do not own this comment!",status=401)
    def update(self,request,pk):
        serializer_class = serializer.OnEditSerializer
        instance = models.Comment.objects.get(_id=pk)
        if request.user == instance.user:
            data = serializer.OnEditSerializer(data=request.data)
            if data.is_valid():
                models.Comment.objects.filter(_id=pk).update(desc=data.data['description'])
                return Response("Comment updated!",status=200)
            return Response("Invalid Data!",status=400)
        return Response("You do not own this comment!",status=401)




          


class LoginView(views.APIView):
    permission_classes = [AllowAny,]
    serializer_class = serializer.LoginSerializer
    authentication_classes = [SessionAuthentication]

    @method_decorator(ensure_csrf_cookie)
    def post(self,request):
        data = serializer.LoginSerializer(data=request.data)
        if data.is_valid():
            email = data.data['email']
            password = data.data['password']
            auth = authenticate(email=email,password=password)
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
        return JsonResponse({'csrftoken':get_token(request)})





class LogoutView(views.APIView):
    @method_decorator(ensure_csrf_cookie)
    def get(self,request):
        logout(request)
        return Response("Logged out!")


class VerifyUser(views.APIView):
    def get(self,request,token,user):
        try:

            user = models.CustomUser.objects.get(email=user)
            user.is_active = True
            profile = models.UserProfile.objects.create(user=user,bio='No Bio Here',img='/media/typer.webp')
            user.save()
            profile.save()

            return Response("Verified!",status=200)


        except IntegrityError:

            return Response("Page does not exist",status=404)
       


def generate_token():
    return get_random_string(length=32)


class CheckVerified(views.APIView):
    def get(self,request):
        return Response(1 if self.request.user.is_active else 0)



class UserProfileView(viewsets.ModelViewSet):
    serializer_class = serializer.UserProfileSerializer
    parser_classes = [MultiPartParser,FormParser,JSONParser]
    lookup_field = 'user'
    def get_queryset(self): # fetching profiles
        return models.UserProfile.objects.all()

    @method_decorator(ensure_csrf_cookie)
    def update(self,request,user): # creating profile
        permission_classes = [IsAuthenticated,]
        data = serializer.UserProfileSerializer(data=request.data)
        if data.is_valid():
            if not request.FILES.get('img',''):
                username = data.data['user']
                bio = data.data['bio']
                pfp = models.UserProfile.objects.get(user=username)
                pfp.bio = bio
                pfp.img = '/media/typer.webp'
                pfp.save()
            else:
                username = data.data['user']
                img = request.FILES['img']
                bio = data.data['bio']
                pfp = models.UserProfile.objects.get(user=username)
                pfp.img = img
                pfp.bio = bio
                try:
                    pfp.save()
                except UnidentifiedImageError:
                    return Response('Wrong image format.',status=400)
            return Response("Profile updated!",status=200)
        if data.errors.get('img'):
            return Response('Upload an image of type : png,jpeg,jpg,ico,gif,webp',status=400)
  

        return Response("fail to create a profile",status=400)
    



class DeleteProfileView(views.APIView):
        permission_classes = [IsAuthenticated]
        def delete(self,request,username,user):
            if username == user:
                user = models.CustomUser.objects.get(username=username)
                user.delete()
                return Response("Account deleted!",status=200)
            else:
                return Response("Wrong username input",status=400)


class LikedArticlesView(views.APIView):
    def get(self,request,username):
        user = models.CustomUser.objects.get(username=username)

        liked_articles = user.liked_articles.all()
        return Response(serializer.ArticleSerializer(liked_articles,many=True).data,status=200)




    
class PasswordResetView(views.APIView):
    serializer_class = serializer.PasswordResetSerializer
    @method_decorator(ensure_csrf_cookie)
    def post(self,request):
        data = serializer.PasswordResetSerializer(data=request.data)
        if data.is_valid():
            try:
                user = models.CustomUser.objects.get(email=data.data['email'])
            except:
                return Response("This email does not exist in our database",status=400)

            send_mail('Password Reset', f'Reset your password here : https:/www.globeofarticles.com/resetpage/{user.token}',from_email=None, recipient_list=[data.data['email']])
            return Response(user.token,status=200)
    
        
        

class PasswordChangeView(views.APIView):
    serializer_class = serializer.PasswordChangeSerializer

    @method_decorator(ensure_csrf_cookie)
    def post(self,request,token):
        data = serializer.PasswordChangeSerializer(data=request.data)
        if data.is_valid():
            password = data.data['password']
            try:
                validate_password(password)
                user1 =  models.CustomUser.objects.get(token=token)
                user1.set_password(password)
                user1.token = uuid.uuid1()
                user1.save()
                return Response("Password has been reset!",status=200)
    
            except ValidationError as e:
                return Response(e,status=400)

            
        return Response("Password reset failed",status=400)
    def get(self,request,token):
        try:
            get_object_or_404(models.CustomUser,token = token)
            return Response("user is found",status=200)
        except:
            return Response("user is not found",status=404)
    

class FilterArticlesView(views.APIView):
    serializer_class = serializer.ArticleFilterSerializer
    def post(self,request):
        data = serializer.ArticleFilterSerializer(data=request.data)
        if data.is_valid():
            article = models.Article.objects.all()
            if data.data['tag'] == ['All']:
                pass
            elif data.data['tag']!=['All']:
                article = models.Article.objects.filter(tag__in=data.data['tag'])
            if article.filter(user__username__icontains=data.data['user']):
                article =article.filter(user__username__icontains=data.data['user'])
            
            else:
                return Response([])
          
            
            
            if article.filter(title__icontains=data.data['title']):
                    article = article.filter(title__icontains=data.data['title'])
            
            else:
                return Response([])
          
            article = serializer.ArticleSerializer(article,many=True)
                
            return Response(article.data,status=200)
        return Response(serializer.ArticleSerializer(model.Article.objects.all()).data,status=200)


def random_token():
    # generate a random token
    return get_random_string(length=12)


class RetrieveComments(views.APIView):
    serializer_class = serializer.CommentSerializer

    def get(self,request,slug):
        permission_classes=[IsAuthenticated]
        comments = serializer.CommentSerializer(models.Comment.objects.filter(article=slug),many=True)
        return Response(comments.data,status=200)

class RetrieveUserToken(views.APIView):
    serializer_class = serializer.RetrieveUserTokenSerializer
    def get(self,request):
        return Response(models.CustomUser.objects.all().values_list('token'),
        status=200)