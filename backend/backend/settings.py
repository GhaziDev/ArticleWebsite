"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from pathlib import Path
import os
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'X-CSRFTOKEN',
]
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


#

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
DEV_MODE = False

SECRET_KEY = os.environ['SECRET_KEY']
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
if DEV_MODE:
    SECURE_SSL_REDIRECT = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    
else:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 60
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

  

ALLOWED_HOSTS = ['xezwms5k.up.railway.app','globeofarticles','127.0.0.1','localhost','backend.globeofarticles.com','globeofarticles.com','www.globeofarticles.com','https://globeofarticles.com','https://www.globeofarticles.com/','https://backend.globeofarticles.com','.vercel.app']
ACCESS_CONTROL_ALLOW_ORIGIN = '*'
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
ACCESS_CONTROL_ALLOW_CREDENTIALS = True
ACCESS_CONTROL_ALLOW_METHODS = '*'
ACCESS_CONTROL_ALLOW_HEADERS = '*'
CSRF_TRUSTED_ORIGINS = [ 
    "http://127.0.0.1:3000",'http://127.0.0.1:8000','http://localhost:3000',
'https://globeofarticles.com','https://www.globeofarticles.com','https://backend.globeofarticles.com',
'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com','https://article-website.vercel.app',
]




'''
SESSION_COOKIE_SECURE = True

CSRF_COOKIE_PATH = '/'
'''



'''
SESSION_COOKIE_DOMAIN = '.globeofarticles.com'
CSRF_COOKIE_DOMAIN = '.globeofarticles.com'
'''
CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_SAMESITE = 'Strict'



EMAIL_HOST = 'smtp-mail.outlook.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'artclcontctme@outlook.com'
EMAIL_HOST_PASSWORD = os.environ['password']
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# Application definition

INSTALLED_APPS = [
    'imagekit',
    'django_extensions',
    'coverage',
    'storages',
    'main.validators',
    'ckeditor',
    'main',
    'rest_framework',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = 'backend.urls'
#
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {

    'default': {

        'ENGINE': 'django.db.backends.postgresql',

        'NAME': os.environ.get('PGDATABASE'),

        'USER':os.environ.get('PGUSER'),

        'PASSWORD': os.environ.get('PGPASSWORD'),

        'HOST': os.environ.get('PGHOST'),

        'PORT': os.environ.get('PGPORT'),

    }

}




# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME':'main.validators.NumberValidator',
    },
    {
        'NAME':'main.validators.UpperCaseValidator',
    }
    ,
    {
        'NAME':'main.validators.SymbolValidator',
    }
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_TZ = True
USE_L10N = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'  

MEDIA_ROOT  = os.path.join(BASE_DIR, 'media')


CKEDITOR_UPLOAD_PATH = "/media"

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')  

AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')  

AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME') 

AWS_S3_FILE_OVERWRITE = False  

AWS_DEFAULT_ACL = None  

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'   

AWS_S3_REGION_NAME = "ap-southeast-2"  

AWS_S3_ADDRESSING_STYLE = "virtual"


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DATE_INPUT_FORMATS':['%d %b %Y','%d-%b-%Y','%Y %m %d']
}

AUTH_USER_MODEL = 'main.CustomUser'




DATE_FORMAT ='%d %b %Y'

DATE_INPUT_FORMATS = ['%d %b %Y','%Y %m %d']