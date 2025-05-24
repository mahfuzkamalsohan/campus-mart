from allauth.account.adapter import DefaultAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from django.shortcuts import redirect
from django.contrib import messages
from django.core.exceptions import ValidationError

class EduAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        email = self._get_email_from_request(request)
        if not email.endswith('.edu'):
            messages.error(request, 'Only educational email addresses are allowed')
            raise ImmediateHttpResponse(redirect('loginpage'))  # this *is* the redirect
        return True  # signup allowed

    def clean_email(self, email):
        if not email.endswith('.edu'):
            raise ValidationError("Only educational email addresses are allowed")
        return email

    def pre_social_login(self, request, sociallogin):
        email = sociallogin.user.email or ''
        if not email.endswith('.edu'):
            messages.error(request, 'Only educational email addresses are allowed')
            raise ImmediateHttpResponse(redirect('loginpage'))

    def _get_email_from_request(self, request):
        return request.POST.get('email', '').strip().lower()
