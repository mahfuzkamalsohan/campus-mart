from allauth.account.adapter import DefaultAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect
from django.contrib import messages

class EduAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        # Always allow signup, we'll check email in pre_social_login
        return True

    def pre_social_login(self, request, sociallogin):
        email = sociallogin.user.email
        if not email or not email.endswith('.edu'):
            messages.error(request, "Only educational email addresses are allowed.")
            raise ImmediateHttpResponse(redirect('login'))

    def authentication_error(self, request, provider_id, error=None, exception=None, extra_context=None):
        messages.error(request, "Authentication failed. Please try again.")
        return redirect('login')