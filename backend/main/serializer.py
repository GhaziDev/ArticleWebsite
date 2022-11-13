from rest_framework import serializers,fields
from main import models
from drf_extra_fields.fields import Base64ImageField
from PIL import Image
from io import BytesIO
import base64



class ArticleSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(read_only=True)
    user_profile = serializers.ReadOnlyField(source='user_profile.img.url')
    class Meta:
        fields = '_id','title','title_img','description','tag','user','date','user_profile'
        model = models.Article


class TagSerializer(serializers.ModelSerializer):
    tag_articles = ArticleSerializer(many=True,read_only=True)
    
    class Meta:
        fields = 'name','tag_articles'
        lookup_field = 'name'
        extra_kwargs = {
            'url':{'lookup_field':'name'}
        }
        model = models.Tag

    
class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        fields = '__all__'
        model = models.Comment

class SignupSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = models.Signup


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=False)
    password = serializers.CharField(required=True)


class SearchSerializer(serializers.Serializer):
    search = serializers.CharField(required=False)


class CheckUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)

class CheckPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=False)


class OnEditSerializer(serializers.Serializer):
    description = serializers.CharField()




class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = '__all__'


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.CharField()


class PasswordChangeSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)


class UserProfileSerializer(serializers.ModelSerializer):
    user_posts = ArticleSerializer(many=True,read_only=True)
    user = serializers.CharField(source='user.username')
    img = serializers.FileField(required=False,allow_null=True)
    # sometimes a user just want to edit the bio alone without uploading a new image.



    class Meta:
        model = models.UserProfile
        fields = 'user','bio','user_posts','img'


class ArticleFilterSerializer(serializers.Serializer):
    tag = serializers.ListField(required=False)
    user = serializers.CharField(required=False,allow_blank=True)
    title = serializers.CharField(required=False,allow_blank=True)
