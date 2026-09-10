from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .auth_views import LoginView

from .views import RegisterView, MeView, TaskListCreateView, TaskDetailView


urlpatterns = [
    path(
        'auth/register/',
        RegisterView.as_view(),
        name='register',
    ),

    path(
        'auth/login/',
        LoginView.as_view(),
        name='login',
    ),

    path(
        'auth/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh',
    ),

    path(
        'auth/me/',
        MeView.as_view(),
        name='me',
    ),
    path(
        "tasks/",
        TaskListCreateView.as_view(),
        name="task-list-create",
    ),

    path(
        "tasks/<int:pk>/",
        TaskDetailView.as_view(),
        name="task-detail",
    ),
]