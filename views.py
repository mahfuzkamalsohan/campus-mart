from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
import os
from datetime import datetime

def chatbot(request):
    return render(request, 'chatbot.html')

@csrf_exempt
def chat_view(request):
    if request.method == 'POST':
        try:
            message = request.POST.get('message', '')
            image = request.FILES.get('image')
            
            # Process the message and image
            response_data = {
                'message': f"Received your message: {message}"
            }
            
            if image:
                try:
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
                    
                    # Add image processing logic here
                    response_data['message'] += f"\nProcessed image: {image.name}"
                except Exception as e:
                    print(f"Error processing image: {str(e)}")
                    response_data['message'] += "\nError processing image. Please try again."
            
            return JsonResponse(response_data)
            
        except Exception as e:
            print(f"Error in chat_view: {str(e)}")
            return JsonResponse({
                'error': 'An error occurred while processing your request. Please try again.'
            }, status=500)
    
    return JsonResponse({
        'error': 'Invalid request method'
    }, status=400) 