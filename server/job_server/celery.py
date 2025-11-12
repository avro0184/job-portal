from celery import Celery
from django.conf import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "job_server.settings")

app = Celery("job_server")

app.config_from_object("django.conf:settings", namespace="CELERY")

# Default discover for tasks.py
app.autodiscover_tasks()

# Extra discover for beat_tasks.py
def autodiscover_extra(module_name="beat_tasks"):
    for app_name in settings.INSTALLED_APPS:
        try:
            __import__(f"{app_name}.{module_name}")
        except ModuleNotFoundError:
            pass

autodiscover_extra()
