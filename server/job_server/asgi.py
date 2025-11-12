import os
from django.conf import settings
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "job_server.settings")

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from exam.ws_auth import JWTAuthMiddleware
import exam.routing
import course.live_routing
import chat.routing

django_app = get_asgi_application()

if settings.DEBUG:
    from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler
    http_app = ASGIStaticFilesHandler(django_app)
else:
    http_app = django_app

combined_websocket_routes = exam.routing.websocket_urlpatterns + course.live_routing.websocket_urlpatterns + chat.routing.websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": http_app,
    "websocket": JWTAuthMiddleware(        # First try JWT from query string
        AuthMiddlewareStack(               # Then fallback to session auth
            URLRouter(combined_websocket_routes)
        )
    ),
})
