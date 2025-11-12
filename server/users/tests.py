# users/tasks.py
from celery import shared_task
from users.emails import send_password_reset_email, send_verification_email

@shared_task(bind=True, max_retries=3)
def send_password_reset_task(self, user_id, reset_link):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    try:
        return send_password_reset_email(user, reset_link)
    except Exception as e:
        raise self.retry(exc=e, countdown=30)

@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, user_id, verification_link):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    try:
        return send_verification_email(user, verification_link)
    except Exception as e:
        raise self.retry(exc=e, countdown=30)
