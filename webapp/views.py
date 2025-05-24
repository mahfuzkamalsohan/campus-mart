from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from .forms import ListingForm, ListingImageForm
from .models import Listing, ListingImage
import os

# Create your views here.
def welcomepage(request):
    return render(request, 'welcomepage.html')

@login_required
def create_listing(request):
    if request.method == 'POST':
        form = ListingForm(request.POST)
        if form.is_valid():
            # Create the listing with the user directly
            listing = form.save(commit=False)
            listing.seller = request.user
            listing.save()

            # Handle multiple images
            images = request.FILES.getlist('images')
            if images:
                for i, image in enumerate(images):
                    # Convert 'on' to True, None to False
                    is_primary = request.POST.getlist('is_primary')[i] == 'on' if i < len(request.POST.getlist('is_primary')) else False
                    ListingImage.objects.create(
                        listing=listing,
                        image=image,
                        is_primary=is_primary
                    )

            messages.success(request, 'Listing created successfully!')
            return redirect('listing_detail', pk=listing.pk)
    else:
        form = ListingForm()

    return render(request, 'create_listing.html', {
        'form': form
    })

def explorer(request):
    listings = Listing.objects.filter(is_active=True).order_by('-created_at')
    return render(request, 'explorer.html', {'listings': listings})

def loginpage(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('welcomepage')
    return render(request, 'login.html')

def signuppage(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
       
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        if not email.endswith('.edu'):
            user.delete()
            return render(request, 'signup.html', {'error': 'Only educational mails allowed'})
        return redirect('loginpage')
        
    return render(request, 'signup.html')

def logoutpage(request):
    auth.logout(request)
    return redirect('welcomepage')

@login_required
def listing_detail(request, pk):
    listing = get_object_or_404(Listing, pk=pk)
    return render(request, 'listing_detail.html', {'listing': listing})

@login_required
def my_listings(request):
    listings = Listing.objects.filter(seller=request.user).order_by('-created_at')
    return render(request, 'my_listings.html', {'listings': listings})

@login_required
@require_POST
def delete_listing_image(request, image_id):
    try:
        image = get_object_or_404(ListingImage, id=image_id)
        # Ensure the user owns the listing
        if image.listing.seller != request.user:
            return JsonResponse({'status': 'error', 'message': 'Permission denied'}, status=403)
        
        # Delete the actual image file
        if image.image:
            if os.path.isfile(image.image.path):
                os.remove(image.image.path)
        
        # Delete the image record
        image.delete()
        
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@login_required
def edit_listing(request, pk):
    listing = get_object_or_404(Listing, pk=pk, seller=request.user)
    
    if request.method == 'POST':
        form = ListingForm(request.POST, instance=listing)
        if form.is_valid():
            form.save()
            
            # Handle new images
            images = request.FILES.getlist('images')
            if images:
                for i, image in enumerate(images):
                    is_primary = request.POST.getlist('is_primary')[i] == 'on' if i < len(request.POST.getlist('is_primary')) else False
                    ListingImage.objects.create(
                        listing=listing,
                        image=image,
                        is_primary=is_primary
                    )
            
            # Handle primary image selection
            primary_image_id = request.POST.get('primary_image')
            if primary_image_id:
                # Reset all images to non-primary
                listing.images.all().update(is_primary=False)
                # Set the selected image as primary
                listing.images.filter(id=primary_image_id).update(is_primary=True)
            
            messages.success(request, 'Listing updated successfully!')
            return redirect('listing_detail', pk=listing.pk)
    else:
        form = ListingForm(instance=listing)
    
    context = {
        'form': form,
        'listing': listing,
        'title': 'Edit Listing'
    }
    return render(request, 'edit_listing.html', context)

@login_required
@require_POST
def delete_listing(request, pk):
    try:
        listing = get_object_or_404(Listing, pk=pk, seller=request.user)
        
        # Delete associated images first
        for image in listing.images.all():
            # Delete the actual image file
            if image.image:
                if os.path.isfile(image.image.path):
                    os.remove(image.image.path)
            image.delete()
            
        # Delete the listing
        listing.delete()
        
        messages.success(request, 'Listing deleted successfully!')
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

