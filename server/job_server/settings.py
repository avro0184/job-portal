from pathlib import Path
from dotenv import load_dotenv
import os
from datetime import timedelta

# ✅ Load environment variables
load_dotenv()

# ✅ Define BASE_DIR
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Security - Secret Key from .env
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")

# ✅ Debug Mode - Keep False in Production
DEBUG = os.getenv("DEBUG", "True") == "True"

# ✅ Allowed Hosts
import json
ALLOWED_HOSTS = json.loads(os.getenv("ALLOWED_HOSTS", '["*"]'))

# ✅ CORS Configuration
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False") == "True"
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")


CSRF_TRUSTED_ORIGINS = [
    origin.strip() for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if origin.strip()
]
CORS_ALLOW_CREDENTIALS = True
from corsheaders.defaults import default_headers, default_methods
# ✅ Add X-PASSKEY header globally (safe — just allowed, not required)
CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-PASSKEY",
    "x-passkey",
]

CORS_ALLOW_METHODS = list(default_methods)


# Channels
ASGI_APPLICATION = 'mcq_server.asgi.application'

# Celery (optional beat)
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://127.0.0.1:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://127.0.0.1:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_SERIALIZER = "json"


# ✅ Installed Apps
INSTALLED_APPS = [
    "jazzmin", 
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Required by allauth
    'django.contrib.sites',

    # Allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    # Providers
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    "rest_framework",
    'rest_framework_simplejwt.token_blacklist' ,
    "rest_framework_simplejwt",
    'corsheaders',
    'channels',
    'django_celery_beat',
    'users',
]

SITE_ID = 1

JAZZMIN_SETTINGS = {
    "site_title": "Job Management Admin",
    "site_header": "Job Management Admin Panel",
    "welcome_sign": "Welcome, Admin 👋",
    "copyright": "My Org ©",
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "custom_links": {},
    "default_icon_parents": "fa fa-folder",
    "default_icon_children": "fa fa-file",
    "theme": "darkly",  
    "show_sidebar_user": False, 
}


GOOGLE_CLIENT_ID=os.getenv("GOOGLE_CLIENT_ID")
FB_APP_ID=os.getenv("FB_APP_ID")
FB_APP_SECRET=os.getenv("FB_APP_SECRET")
LOGIN_REDIRECT_URL = '/study'   # where to redirect after login
LOGOUT_REDIRECT_URL = '/signin'  # where to redirect after logout
LOGIN_URL = '/signin'
ACCOUNT_EMAIL_VERIFICATION = 'none'


AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # default
    'allauth.account.auth_backends.AuthenticationBackend',  # allauth
]


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",  # ✅ Enable JWT
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",  # ✅ Require authentication by default
    ),
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.getenv("REDIS_URL", "redis://127.0.0.1:6379")],
            "capacity": 2000,
            "expiry": 10,
        },
    },
}

CELERY_BEAT_SCHEDULE = {

}




# ---- Celery queues & routes ----
from kombu import Queue


CELERY_TASK_TRACK_STARTED = True

CELERY_TASK_QUEUES = (
    Queue("celery"),   # default
)

CELERY_TASK_ROUTES = {
}




CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_ACKS_LATE = False


# Redis cache (exam cache আলাদা DB)
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/2",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    },
    "exam": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/3",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    },
}

CELERY_TIMEZONE = "Asia/Dhaka"
CELERY_ENABLE_UTC = True



# ✅ Middleware Configuration
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'django.middleware.locale.LocaleMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LANGUAGE_CODE = 'en'

from django.utils.translation import gettext_lazy as _
LANGUAGES = [
    ('en', _('English')),
    ('bn', _('Bangla')),
]


LOCALE_PATHS = [BASE_DIR / "locale"]

USE_I18N = True 

# ✅ Root URL Configuration
ROOT_URLCONF = "job_server.urls"

# ✅ Templates Configuration
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ✅ WSGI Application
WSGI_APPLICATION = "job_server.wsgi.application"

# ✅ Custom User Model
AUTH_USER_MODEL = "users.User"  # Ensure User model exists in `users/models.py`

# ✅ Database Configuration
DATABASES = {
    "default": {
        "ENGINE": os.getenv("DB_ENGINE", "django.db.backends.postgresql"),
        "NAME": os.getenv("DB_NAME", "mydatabase"),
        "USER": os.getenv("DB_USER", "myuser"),
        "PASSWORD": os.getenv("DB_PASSWORD", "mypassword"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

# ✅ Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ✅ Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_TZ = True

# ✅ Static & Media Files
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]


# ✅ Default Auto Field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ JWT Authentication Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),  # Access token valid for 1 day
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),  # Refresh token valid for 7 days
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,  # ✅ Uses environment variable
    "AUTH_HEADER_TYPES": ("Bearer",),  # ✅ Changed from "Token" to "Bearer"
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "AUTH_COOKIE": "access",
    "AUTH_COOKIE_REFRESH": "refresh",
    "AUTH_COOKIE_SECURE": True,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SAMESITE": "None",

}



SOCIALACCOUNT_PROVIDERS = {
    "facebook": {
        "METHOD": "oauth2",
        "SCOPE": ["email", "public_profile"],
        "FIELDS": [
            "id", "email", "name", "first_name", "last_name"
        ],
        "AUTH_PARAMS": {"auth_type": "reauthenticate"},
    },
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}

PASSWORD_RESET_TIMEOUT = int(os.getenv("PASSWORD_RESET_TIMEOUT", "2592000"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "2525"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "")


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {"format": "[{levelname}] {asctime} {name}: {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "simple"},
    },
    "loggers": {
        "mcq": {"handlers": ["console"], "level": "DEBUG", "propagate": True},
        "celery": {"handlers": ["console"], "level": "INFO"},
    },
}

