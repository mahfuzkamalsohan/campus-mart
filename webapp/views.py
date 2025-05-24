from django.shortcuts import render, redirect

# Create your views here.
def welcomepage(request):
    return render(request, 'welcomepage.html')

def loginpage(request):
    return render(request, 'login.html')

def signuppage(request):
    return render(request, 'signup.html')

def logoutpage(request):
    return redirect('welcomepage')

