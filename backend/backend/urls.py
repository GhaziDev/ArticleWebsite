"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import SimpleRouter
from main import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from django.contrib.auth.views import PasswordChangeView
from django_email_verification import urls as email_urls


router = SimpleRouter()
router.register(r'articles',views.ArticleView,basename='article')
router.register(r'comments',views.CommentView,basename='comment')
router.register(r'tag',views.TagView,basename='tag')
router.register(r'signup',views.SignupView,basename='signup')
router.register(r'userprofile',views.UserProfileView,basename='userprofile')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include(router.urls)),
     path('login/',views.LoginView.as_view(),name='login'),
     path('logout/',views.LogoutView.as_view(),name='logout'),
     path('csrf/',views.GetCSRFToken.as_view(),name='csrf'),
     path('isauthenticated/',views.CheckAuthenticated.as_view(),name='authenticated'),
     path('exists/',views.CheckUserExist.as_view(),name='exists'),
     path('current/',views.CurrentUser.as_view(),name='current'),
     path('accounts/', include('django.contrib.auth.urls')),
     path('verify/<uuid:token>/<str:user>/',views.VerifyUser.as_view(),name='verify'),
     path('verified/',views.CheckVerified.as_view(),name='verified'),
     path('reset/',views.PasswordResetView.as_view(),name='reset'),
     path('reset/<uuid:token>/<int:id>/',views.PasswordChangeView.as_view(),name='reset')
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


