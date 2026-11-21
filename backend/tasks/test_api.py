from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from .models import Task, User


class AuthenticationAPITests(APITestCase):
    def test_register_creates_user_and_returns_tokens(self):
        response = self.client.post(
            reverse("register"),
            {
                "name": "Test User",
                "email": "TEST@example.com",
                "password": "StrongTestPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], "test@example.com")
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_login_returns_user_and_tokens(self):
        User.objects.create_user(
            email="login@example.com",
            password="StrongTestPassword123!",
            first_name="Login",
            last_name="User",
        )

        response = self.client.post(
            reverse("login"),
            {
                "email": "login@example.com",
                "password": "StrongTestPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], "login@example.com")
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


class TaskPermissionAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="StrongTestPassword123!",
        )
        self.other_user = User.objects.create_user(
            email="other@example.com",
            password="StrongTestPassword123!",
        )
        self.task = Task.objects.create(
            user=self.owner,
            title="Owner task",
            description="Private task",
        )

    def test_task_endpoints_require_authentication(self):
        response = self.client.get(reverse("task-list-create"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_only_sees_their_own_tasks(self):
        Task.objects.create(user=self.other_user, title="Other task")

        self.client.force_authenticate(user=self.owner)
        response = self.client.get(reverse("task-list-create"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Owner task")

    def test_user_cannot_read_another_users_task(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.get(
            reverse("task-detail", kwargs={"pk": self.task.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_created_task_is_assigned_to_authenticated_user(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            reverse("task-list-create"),
            {
                "title": "New task",
                "description": "Created through the API",
                "project": "Backend",
                "priority": "high",
                "status": "active",
                "due": None,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created = Task.objects.get(pk=response.data["id"])
        self.assertEqual(created.user, self.owner)
