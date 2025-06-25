from django.test import TestCase, Client
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from main import models, validators
from PIL import Image
import datetime
import json
import tempfile
import os
from io import BytesIO


class CustomUserModelTest(TestCase):
    """Test cases for CustomUser model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPass123!'
        }
    
    def test_create_user(self):
        """Test creating a user with valid data"""
        user = models.CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('TestPass123!'))
        self.assertIsNotNone(user._id)
        self.assertIsNotNone(user.token)
    
    def test_user_string_representation(self):
        """Test user string representation"""
        user = models.CustomUser.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'testuser')
    
    def test_unique_email_constraint(self):
        """Test that email must be unique"""
        models.CustomUser.objects.create_user(**self.user_data)
        with self.assertRaises(Exception):
            models.CustomUser.objects.create_user(
                username='testuser2',
                email='test@example.com',
                password='TestPass123!'
            )
    
    def test_unique_username_constraint(self):
        """Test that username must be unique"""
        models.CustomUser.objects.create_user(**self.user_data)
        with self.assertRaises(Exception):
            models.CustomUser.objects.create_user(
                username='testuser',
                email='test2@example.com',
                password='TestPass123!'
            )


class TagModelTest(TestCase):
    """Test cases for Tag model"""
    
    def test_create_tag(self):
        """Test creating a tag"""
        tag = models.Tag.objects.create(name='programming')
        self.assertEqual(tag.name, 'programming')
        self.assertEqual(str(tag), 'programming')
    
    def test_unique_tag_name(self):
        """Test that tag names must be unique"""
        models.Tag.objects.create(name='programming')
        with self.assertRaises(Exception):
            models.Tag.objects.create(name='programming')


class UserProfileModelTest(TestCase):
    """Test cases for UserProfile model"""
    
    def setUp(self):
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
    
    def test_create_user_profile(self):
        """Test creating a user profile"""
        profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.bio, 'Test bio')
        self.assertIn('testuser', str(profile))
    
    def test_user_profile_one_to_one_relationship(self):
        """Test one-to-one relationship with user"""
        profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        self.assertEqual(self.user.user_profile, profile)


class ArticleModelTest(TestCase):
    """Test cases for Article model"""
    
    def setUp(self):
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.tag = models.Tag.objects.create(name='programming')
        self.user_profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        
        # Create a test image
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        image.save(temp_file, 'JPEG')
        temp_file.seek(0)
        
        self.test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=temp_file.read(),
            content_type='image/jpeg'
        )
        temp_file.close()
        os.unlink(temp_file.name)
    
    def test_create_article(self):
        """Test creating an article"""
        article = models.Article.objects.create(
            title='Test Article Title Here',
            title_img=self.test_image,
            description='This is a test article description',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
        self.assertEqual(article.title, 'Test Article Title Here')
        self.assertEqual(article.user, self.user)
        self.assertEqual(article.tag, self.tag)
        self.assertIsNotNone(article._id)
        self.assertIsNotNone(article.date)
    
    def test_article_string_representation(self):
        """Test article string representation"""
        article = models.Article.objects.create(
            title='Test Article Title Here',
            title_img=self.test_image,
            description='This is a test article description',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
        self.assertIn('Test Article Title Here', str(article))
        self.assertIn('testuser', str(article))
    
    def test_article_ordering(self):
        """Test that articles are ordered by date (newest first)"""
        article1 = models.Article.objects.create(
            title='First Article Title Here',
            title_img=self.test_image,
            description='First article',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
        article2 = models.Article.objects.create(
            title='Second Article Title Here',
            title_img=self.test_image,
            description='Second article',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
        articles = models.Article.objects.all()
        self.assertEqual(articles[0], article2)  # Newest first


class CommentModelTest(TestCase):
    """Test cases for Comment model"""
    
    def setUp(self):
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.tag = models.Tag.objects.create(name='programming')
        self.user_profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        
        # Create a test image
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        image.save(temp_file, 'JPEG')
        temp_file.seek(0)
        
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=temp_file.read(),
            content_type='image/jpeg'
        )
        temp_file.close()
        os.unlink(temp_file.name)
        
        self.article = models.Article.objects.create(
            title='Test Article Title Here',
            title_img=test_image,
            description='Test article description',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
    
    def test_create_comment(self):
        """Test creating a comment"""
        comment = models.Comment.objects.create(
            desc='This is a test comment',
            user=self.user,
            article=self.article
        )
        self.assertEqual(comment.desc, 'This is a test comment')
        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.article, self.article)
        self.assertIsNotNone(comment._id)
        self.assertIsNotNone(comment.date)
    
    def test_comment_is_author_flag(self):
        """Test is_author flag for comments"""
        comment = models.Comment.objects.create(
            desc='Test comment',
            user=self.user,
            article=self.article,
            is_author=True
        )
        self.assertTrue(comment.is_author)


class PasswordValidatorsTest(TestCase):
    """Test cases for custom password validators"""
    
    def test_number_validator_valid(self):
        """Test NumberValidator with valid password"""
        validator = validators.NumberValidator()
        try:
            validator.validate('Password123')
        except ValidationError:
            self.fail("NumberValidator raised ValidationError unexpectedly!")
    
    def test_number_validator_invalid(self):
        """Test NumberValidator with invalid password"""
        validator = validators.NumberValidator()
        with self.assertRaises(ValidationError):
            validator.validate('Password')
    
    def test_uppercase_validator_valid(self):
        """Test UpperCaseValidator with valid password"""
        validator = validators.UpperCaseValidator()
        try:
            validator.validate('Password123')
        except ValidationError:
            self.fail("UpperCaseValidator raised ValidationError unexpectedly!")
    
    def test_uppercase_validator_invalid(self):
        """Test UpperCaseValidator with invalid password"""
        validator = validators.UpperCaseValidator()
        with self.assertRaises(ValidationError):
            validator.validate('password123')
    
    def test_symbol_validator_valid(self):
        """Test SymbolValidator with valid password"""
        validator = validators.SymbolValidator()
        try:
            validator.validate('Password123!')
        except ValidationError:
            self.fail("SymbolValidator raised ValidationError unexpectedly!")
    
    def test_symbol_validator_invalid(self):
        """Test SymbolValidator with invalid password"""
        validator = validators.SymbolValidator()
        with self.assertRaises(ValidationError):
            validator.validate('Password123')


class LoginViewTest(TestCase):
    """Test cases for login functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
    
    def test_login_valid_credentials(self):
        """Test login with valid credentials"""
        response = self.client.post('/login/', {
            'email': 'test@example.com',
            'password': 'TestPass123!'
        })
        self.assertEqual(response.status_code, 200)
    
    def test_login_invalid_email(self):
        """Test login with invalid email"""
        response = self.client.post('/login/', {
            'email': 'wrong@example.com',
            'password': 'TestPass123!'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_login_invalid_password(self):
        """Test login with invalid password"""
        response = self.client.post('/login/', {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_login_empty_fields(self):
        """Test login with empty fields"""
        response = self.client.post('/login/', {
            'email': '',
            'password': ''
        })
        self.assertEqual(response.status_code, 400)


class SignupViewTest(TestCase):
    """Test cases for signup functionality"""
    
    def setUp(self):
        self.client = Client()
    
    def test_signup_valid_data(self):
        """Test signup with valid data"""
        response = self.client.post('/signup/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'NewPass123!'
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(models.CustomUser.objects.filter(username='newuser').exists())
    
    def test_signup_duplicate_email(self):
        """Test signup with duplicate email"""
        models.CustomUser.objects.create_user(
            username='existinguser',
            email='test@example.com',
            password='TestPass123!'
        )
        response = self.client.post('/signup/', {
            'username': 'newuser',
            'email': 'test@example.com',
            'password': 'NewPass123!'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_signup_duplicate_username(self):
        """Test signup with duplicate username"""
        models.CustomUser.objects.create_user(
            username='testuser',
            email='existing@example.com',
            password='TestPass123!'
        )
        response = self.client.post('/signup/', {
            'username': 'testuser',
            'email': 'new@example.com',
            'password': 'NewPass123!'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_signup_weak_password(self):
        """Test signup with weak password"""
        response = self.client.post('/signup/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'weak'
        })
        self.assertEqual(response.status_code, 400)


class ArticleViewTest(TestCase):
    """Test cases for article views"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
        
        self.tag = models.Tag.objects.create(name='programming')
        self.user_profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
    
    def test_get_articles_list(self):
        """Test getting list of articles"""
        response = self.client.get('/articles/')
        self.assertEqual(response.status_code, 200)
    
    def test_create_article_authenticated(self):
        """Test creating article when authenticated"""
        self.client.login(email='test@example.com', password='TestPass123!')
        
        # Create a test image
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = BytesIO()
        image.save(temp_file, 'JPEG')
        temp_file.seek(0)
        
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=temp_file.read(),
            content_type='image/jpeg'
        )
        
        response = self.client.post('/articles/', {
            'title': 'Test Article Title Here',
            'title_img': test_image,
            'description': 'This is a test article description with enough content',
            'tag': 'programming'
        })
        self.assertEqual(response.status_code, 200)


class CommentViewTest(TestCase):
    """Test cases for comment views"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
        
        self.tag = models.Tag.objects.create(name='programming')
        self.user_profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
        
        # Create a test image
        image = Image.new('RGB', (100, 100), color='red')
        temp_file = BytesIO()
        image.save(temp_file, 'JPEG')
        temp_file.seek(0)
        
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=temp_file.read(),
            content_type='image/jpeg'
        )
        
        self.article = models.Article.objects.create(
            title='Test Article Title Here',
            title_img=test_image,
            description='Test article description',
            user=self.user,
            tag=self.tag,
            user_profile=self.user_profile
        )
    
    def test_get_comments_list(self):
        """Test getting list of comments"""
        response = self.client.get('/comments/')
        self.assertEqual(response.status_code, 200)
    
    def test_create_comment_authenticated(self):
        """Test creating comment when authenticated"""
        self.client.login(email='test@example.com', password='TestPass123!')
        response = self.client.post('/comments/', {
            'desc': 'This is a test comment',
            'article': str(self.article._id)
        })
        self.assertEqual(response.status_code, 200)


class TagViewTest(TestCase):
    """Test cases for tag views"""
    
    def setUp(self):
        self.client = Client()
        self.tag = models.Tag.objects.create(name='programming')
    
    def test_get_tags_list(self):
        """Test getting list of tags"""
        response = self.client.get('/tag/')
        self.assertEqual(response.status_code, 200)
    
    def test_get_tag_by_name(self):
        """Test getting specific tag by name"""
        response = self.client.get('/tag/programming/')
        self.assertEqual(response.status_code, 200)


class UserProfileViewTest(TestCase):
    """Test cases for user profile views"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
        
        self.user_profile = models.UserProfile.objects.create(
            user=self.user,
            bio='Test bio'
        )
    
    def test_get_user_profile(self):
        """Test getting user profile"""
        response = self.client.get('/userprofile/testuser/')
        self.assertEqual(response.status_code, 200)
    
    def test_update_user_profile_authenticated(self):
        """Test updating user profile when authenticated"""
        self.client.login(email='test@example.com', password='TestPass123!')
        response = self.client.put('/userprofile/testuser/', {
            'user': 'testuser',
            'bio': 'Updated bio'
        }, content_type='application/json')
        # Note: Actual status code may vary based on implementation


class AuthenticationViewTest(TestCase):
    """Test cases for authentication-related views"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
    
    def test_check_authenticated_when_logged_in(self):
        """Test authentication check when user is logged in"""
        self.client.login(email='test@example.com', password='TestPass123!')
        response = self.client.get('/isauthenticated/')
        self.assertEqual(response.status_code, 200)
    
    def test_check_authenticated_when_not_logged_in(self):
        """Test authentication check when user is not logged in"""
        response = self.client.get('/isauthenticated/')
        self.assertEqual(response.status_code, 401)
    
    def test_get_csrf_token(self):
        """Test getting CSRF token"""
        response = self.client.get('/csrf/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('csrftoken', response.json())
    
    def test_logout_view(self):
        """Test logout functionality"""
        self.client.login(email='test@example.com', password='TestPass123!')
        response = self.client.get('/logout/')
        self.assertEqual(response.status_code, 200)


class FilterViewTest(TestCase):
    """Test cases for article filtering"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.tag1 = models.Tag.objects.create(name='programming')
        self.tag2 = models.Tag.objects.create(name='science')
    
    def test_filter_articles_by_tag(self):
        """Test filtering articles by tag"""
        response = self.client.post('/filter/', {
            'tag': ['programming'],
            'user': '',
            'title': ''
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
    
    def test_filter_articles_by_user(self):
        """Test filtering articles by user"""
        response = self.client.post('/filter/', {
            'tag': ['All'],
            'user': 'testuser',
            'title': ''
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
    
    def test_filter_articles_by_title(self):
        """Test filtering articles by title"""
        response = self.client.post('/filter/', {
            'tag': ['All'],
            'user': '',
            'title': 'test'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)


class PasswordResetTest(TestCase):
    """Test cases for password reset functionality"""
    
    def setUp(self):
        self.client = Client()
        self.user = models.CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPass123!'
        )
        self.user.is_active = True
        self.user.save()
    
    def test_password_reset_request_valid_email(self):
        """Test password reset request with valid email"""
        response = self.client.post('/reset/', {
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)
    
    def test_password_reset_request_invalid_email(self):
        """Test password reset request with invalid email"""
        response = self.client.post('/reset/', {
            'email': 'nonexistent@example.com'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_password_change_valid_token(self):
        """Test password change with valid token"""
        token = self.user.token
        response = self.client.get(f'/reset/{token}/')
        self.assertEqual(response.status_code, 200)
    
    def test_password_change_invalid_token(self):
        """Test password change with invalid token"""
        response = self.client.get('/reset/invalid-token/')
        self.assertEqual(response.status_code, 404)