from django.urls import path
from . import views

urlpatterns = [
    path('', views.explorer, name='explorer'),
    path('login/', views.loginpage, name='loginpage'),
    path('signup/', views.signuppage, name='signuppage'),
    path('logout/', views.logoutpage, name='logoutpage'),
    path('welcome/', views.welcomepage, name='welcomepage'),
    path('listings/create/', views.create_listing, name='create_listing'),
    path('listings/<int:pk>/', views.listing_detail, name='listing_detail'),
    path('listings/<int:pk>/edit/', views.edit_listing, name='edit_listing'),
    path('listings/<int:pk>/delete/', views.delete_listing, name='delete_listing'),
    path('listings/image/<int:image_id>/delete/', views.delete_listing_image, name='delete_listing_image'),
    path('my-listings/', views.my_listings, name='my_listings'),
    path('chatbot/', views.chatbot, name='chatbot'),
    path('search/', views.search, name='search'),
]

