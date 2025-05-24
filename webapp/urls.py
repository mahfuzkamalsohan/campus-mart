from django.urls import path
from . import views

urlpatterns = [
    path('', views.explorer, name='explorer'),
    path('login/', views.loginpage, name='loginpage'),
    path('signup/', views.signuppage, name='signuppage'),
    path('logout/', views.logoutpage, name='logoutpage'),
    path('welcome/', views.welcomepage, name='welcomepage'),
]

