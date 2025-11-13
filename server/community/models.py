# community/models.py

from django.db import models
from django.conf import settings
from pgvector.django import VectorField


# -----------------------------------------------------------
# Post Categories (Experience, Problems, Learning, etc.)
# -----------------------------------------------------------
class PostCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# -----------------------------------------------------------
# Main Post Model
# -----------------------------------------------------------
class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts"
    )

    category = models.ForeignKey(
        PostCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts"
    )

    title = models.CharField(max_length=200)
    content = models.TextField()

    # Optional attachment
    image = models.ImageField(upload_to="community/posts/", null=True, blank=True)

    # AI fields
    ai_vector = VectorField(dimensions=768, null=True, blank=True)
    ai_summary = models.TextField(null=True, blank=True)
    ai_keywords = models.TextField(null=True, blank=True)

    tags = models.CharField(max_length=300, null=True, blank=True)

    # Social metrics
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)

    # Moderation
    is_reported = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# -----------------------------------------------------------
# Likes (1 user can like a post only once)
# -----------------------------------------------------------
class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.user.email} liked {self.post.title}"


# -----------------------------------------------------------
# Comments (Supports replies)
# -----------------------------------------------------------
class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    content = models.TextField()

    # Reply to another comment
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} commented"


# -----------------------------------------------------------
# Post Reports (spam, abuse, etc.)
# -----------------------------------------------------------
class PostReport(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reports")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    reason = models.CharField(max_length=255)
    details = models.TextField(null=True, blank=True)

    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} reported {self.post.title}"


# -----------------------------------------------------------
# Bookmarks / Saved Posts
# -----------------------------------------------------------
class Bookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="bookmarked")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.user.email} bookmarked {self.post.title}"
