from allauth.account.adapter import DefaultAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect
from django.contrib import messages
from django.core.exceptions import ValidationError

class EduAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        """
        Always allow the signup page to be viewed.
        Actual email validation happens in `clean_email`.
        """
        return True

    def clean_email(self, email):
        """
        Validate that the email ends with `.edu` during signup.
        """
        email = email.lower().strip()
        if not email.endswith('.edu'):
            raise ValidationError("Only educational (.edu) email addresses are allowed.")
        return email

    def pre_social_login(self, request, sociallogin):
        """
        Validate `.edu` email in social logins (Google, Facebook, etc.).
        """
        email = (sociallogin.user.email or '').lower().strip()
        if not email.endswith('.edu'):
            messages.error(request, "Only educational (.edu) email addresses are allowed.")
            raise ImmediateHttpResponse(redirect('loginpage'))  # Redirect to login page

    def pre_login(self, request, user, **kwargs):
        """
        Validate `.edu` email during regular email login.
        """
        if not user.email.lower().endswith('.edu'):
            messages.error(request, "Only educational (.edu) email addresses are allowed.")
            raise ImmediateHttpResponse(redirect('loginpage'))  # Redirect to login page
        return super().pre_login(request, user, **kwargs)