from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import auth

# Create your views here.
def welcomepage(request):
    return render(request, 'welcomepage.html')
def explorer(request):
    return render(request, 'explorer.html')
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

