from django.db import models
from django.contrib.auth.models import User


# Create your models here.
# class User(models.Model):
#     username = models.CharField(max_length=100)
#     email = models.EmailField(max_length=100)
#     password = models.CharField(max_length=100)
#     date_joined = models.DateTimeField(auto_now_add=True)
# 
#     def __str__(self):
#         return self.username

class Listing(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
    ]
    
    TRANSACTION_CHOICES = [
        ('buy', 'Buy'),
        ('rent', 'Rent'),
        ('exchange', 'Exchange'),
    ]

    CATEGORY_CHOICES = [
        ('mobile', 'Mobile'),
        ('laptop', 'Laptop'),
        ('powerbank', 'Powerbank'),
        ('headphones', 'Headphones'),
        ('other_electronics', 'Other Electronics'),
        ('textbooks', 'Textbooks'),
        ('novels', 'Novels'),
        ('study_guides', 'Study Guides'),
        ('tutoring', 'Tutoring'),
        ('freelance', 'Freelance'),
        ('other_services', 'Other Services'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_CHOICES)
    university = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.seller.username}"

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listings/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.listing.title}"