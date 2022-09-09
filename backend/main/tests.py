from django.test import TestCase
from main import models
from main import validators
import datetime
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.urls import reverse
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile


class ArticleTest(TestCase):
    def create_date(self):
        return datetime.datetime(2022,1,4)
    def create(self):
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com',password='ghazi2000')
        tag = models.Tag.objects.create(name='test_tag')
        return models.Article.objects.create(title='SOME TITLE HERE',title_img ='C:/Users/ghazi/Desktop/unknown.png',description='YO!',user=user,tag=tag,date=self.create_date())

    def test_date(self):
        self.assertEqual(self.create_date(), datetime.datetime(2022,1,4))

    
    def test_get(self):

        getter = self.create()
        print(type(getter)) # type of models.Model.Article
        print(type(models.Article)) # type of models.BaseModel
        #Article model inherit from BaseModel, and `isinstance()` function check for type equality with the care of inheritance
        #unlike equality with type(), because type does not check for object inheritance at all.
        #big reason why `isinstance()` is better than using == with type() function
        self.assertIsInstance(getter, models.Article)
        self.assertEqual(getter.__str__(), f"{getter.title} {getter.title_img} {getter.user.username} {getter.tag}")
    

class TagTest(TestCase):
    def create(self):
        tag = models.Tag.objects.create(name='test')
        return tag
    def test_get(self):
        tag = self.create()
        self.assertIsInstance(tag, models.Tag)
        self.assertEqual(tag.name, tag.__str__())
        self.assertEqual(len(tag.name),4)



class CommentTest(TestCase):
    def create(self):
        user = models.CustomUser.objects.create(username='testy',email='test@test.com',password='other test')
        tag = models.Tag.objects.create(name='test')
        article = models.Article.objects.create(tag=tag,title='some_article',description='test',user=user,title_img='C:/Users/ghazi/Desktop/uknown.png',date=timezone.now())
        comment = models.Comment.objects.create(desc='some testing comment', user=article.user,date=timezone.now(),article=article)
        return comment
    def test_get(self):
        comment = self.create()
        self.assertEqual(comment.__str__(), f"{comment.desc} {comment.user} {comment.article}")


#views:

class ArticleViewTest(TestCase):
    def test_get(self):
        url = reverse('article-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
'''
    def test_put(self):
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com',password='ghazi2000')
        tag = models.Tag.objects.create(name='test_tag')
        article = models.Article.objects.create(title='SOME TITLE HERE',title_img ='C:/Users/ghazi/Desktop/unknown.png',description='YO!',user=user,tag=tag,date=timezone.now())
        resp = self.client.put(f'/articles/{article.id}/',data={'title':article.title,'title_img':article.title_img,'description':"test worked",'user':article.user,'date':article.date},content_type='multipart/form-data')
        self.assertEqual(resp.status_code,200 )


    def test_delete(self):
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com',password='ghazi2000')
        tag = models.Tag.objects.create(name='test_tag')
        article = models.Article.objects.create(title='SOME TITLE HERE',title_img ='C:/Users/ghazi/Desktop/unknown.png',description='YO!',user=user,tag=tag,date=self.create_date())
        return models.Article.objects.filter(id=article.id).delete()


def test_post(self):
        url = reverse('article-list')
        user = models.CustomUser.objects.create(username='test',email='test@test',password='test')
        tag = models.Tag.objects.create(name='test')
        small_gif = (
    b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
    b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
    b'\x02\x4c\x01\x00\x3b'
)
        resp =self.client.post(url,data={'title':'test20charactersssssssssok','title_img':SimpleUploadedFile(name='small.gif', content=small_gif,content_type='image/gif'),'user':user,'tag':tag.name,'description':'testy test','date':datetime.datetime.now()},format='multipart')
        print(resp.json())
        self.assertEqual(resp.status_code, 200)'''

class TagViewTest(TestCase):
    def test_get(self):
        url = reverse('tag-list')
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)

class SignupViewTest(TestCase):
    def test_post(self):
        url = reverse('signup-list')
        res = self.client.post(url,data={'username':'testtt','password':'Ghazi@2000','email':'fake@fake.com'})
        self.assertEqual(res.status_code,200)

class CommentViewTest(TestCase):
    def test_post(self):
        url = reverse('comment-list')
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com',password='ghazi2000')
        tag = models.Tag.objects.create(name='tag_test')
        article = models.Article.objects.create(tag=tag,title='some_article',description='test',user=user,title_img='C:/Users/ghazi/Desktop/uknown.png',date=timezone.now())
        res = self.client.post(url,data={'desc':'some comment','date':timezone.now(),'article':article,user:user})
        self.assertEqual(res.status_code, 200)
    def test_get(self):
        url = reverse('comment-list')
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com',password='ghazi2000')
        tag = models.Tag.objects.create(name='tag_test')
        article = models.Article.objects.create(tag=tag,title='some_article',description='test',user=user,title_img='C:/Users/ghazi/Desktop/uknown.png',date=timezone.now())
        res = self.client.get(url)
        self.assertEqual(res.status_code,200)


class LoginViewTest(TestCase):
    def test_login(self):
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com')
        user.set_password('ghazi2000')
        user.save()
        res = self.client.login(email='fakeemail@domain.com',password='ghazi2000')
        self.assertEqual(res,True)
    def test_logout(self):
        user = models.CustomUser.objects.create(username='meghazi',email='fakeemail@domain.com')
        user.set_password('ghazi2000')
        user.save()
        res = self.client.logout()
        self.assertEqual(res,None)
        
    

        