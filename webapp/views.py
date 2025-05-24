from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.db.models import Q
from .forms import ListingForm, ListingImageForm
from .models import Listing, ListingImage
import os
from groq import Groq
from django.core.files.storage import default_storage
from django.conf import settings
from datetime import datetime
import base64


# Create your views here.
def welcomepage(request):
    return render(request, 'welcome.html')

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
    # Get search query and filters from request
    search_query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    price_range = request.GET.get('price', '')
    condition = request.GET.get('condition', '')
    university = request.GET.get('university', '')
    transaction_type = request.GET.get('transaction_type', '')

    # Start with all active listings
    listings = Listing.objects.filter(is_active=True)

    # Apply search query if provided
    if search_query:
        listings = listings.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query)
        )

    # Apply category filter
    if category:
        listings = listings.filter(category=category)

    # Apply price range filter
    if price_range:
        if price_range == '0-50':
            listings = listings.filter(price__lte=50)
        elif price_range == '51-100':
            listings = listings.filter(price__gt=50, price__lte=100)
        elif price_range == '101-200':
            listings = listings.filter(price__gt=100, price__lte=200)
        elif price_range == '201+':
            listings = listings.filter(price__gt=200)

    # Apply condition filter
    if condition:
        listings = listings.filter(condition=condition)

    # Apply university filter
    if university:
        listings = listings.filter(university=university)

    # Apply transaction type filter
    if transaction_type:
        listings = listings.filter(transaction_type=transaction_type)

    # Order by creation date (newest first)
    listings = listings.order_by('-created_at')

    context = {
        'listings': listings,
        'search_query': search_query,
        'selected_category': category,
        'selected_price': price_range,
        'selected_condition': condition,
        'selected_university': university,
        'selected_transaction_type': transaction_type,
    }
    return render(request, 'explorer.html', context)

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

def get_chatbot_response(image_data, request):
    try:
        # Encode image in base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        image_data_url = f"data:image/jpeg;base64,{image_base64}"
            
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What's in this image? write the product name or type strictly in the following format: The product you are searching for is a bicycle, laptop, ps5 etc."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url
                            }
                        }
                    ]
                }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error in get_chatbot_response: {str(e)}")
        return "Sorry, I couldn't analyze the image at this time."

@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        try:
            message = request.POST.get('message', '')
            image = request.FILES.get('image')
            
            response_data = {
                'message': f"Received your message: {message}"
            }
            
            if image:
                try:
                    # Read the image data
                    image_data = image.read()
                    
                    # Create chat_images directory if it doesn't exist
                    chat_images_dir = os.path.join(settings.MEDIA_ROOT, 'chat_images')
                    os.makedirs(chat_images_dir, exist_ok=True)
                    
                    # Save the uploaded image
                    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                    filename = f'chat_images/{timestamp}_{image.name}'
                    file_path = default_storage.save(filename, image)
                    
                    # Get the URL for the saved image
                    image_url = default_storage.url(file_path)
                    response_data['image_url'] = image_url
                    
                    # Get AI response for the image
                    ai_response = get_chatbot_response(image_data, request)
                    response_data['message'] = ai_response
                    
                    # Clean up the response keyword
                    response_keyword = response_data['message'].strip().lower()
                    # Remove trailing punctuation
                    response_keyword = response_keyword.rstrip('.,!?')
                    # Remove any extra whitespace
                    response_keyword = ' '.join(response_keyword.split())
                    print(response_keyword)
                    #render(request, 'explorer.html', {'query': response_keyword})
                except Exception as e:
                    print(f"Error processing image: {str(e)}")
                    response_data['message'] = "Error processing image. Please try again."
            product_name = response_keyword.split("is ")[-1]
            print(product_name)
            search(request, product_name)
            return JsonResponse(response_data)
            
        except Exception as e:
            print(f"Error in chatbot view: {str(e)}")
            return JsonResponse({
                'error': 'An error occurred while processing your request. Please try again.'
            }, status=500)
    
    return render(request, 'chatbot.html')
def search(request, product_name):
    return render(request, 'explorer.html', {'query': product_name})
    

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

