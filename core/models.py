from django.db import models
from django.contrib.auth.models import User


class Course(models.Model):
    LEVEL_CHOICES = [('Beginner','Beginner'),('Intermediate','Intermediate'),('Advanced','Advanced')]
    CATEGORY_CHOICES = [
        ('Web Development','Web Development'),('Data Science','Data Science'),
        ('Artificial Intelligence','Artificial Intelligence'),('Machine Learning','Machine Learning'),
        ('Programming','Programming'),('Cloud Computing','Cloud Computing'),
        ('Cyber Security','Cyber Security'),('Engineering','Engineering'),
        ('Science & Research','Science & Research'),('Business','Business'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, default='')
    duration = models.CharField(max_length=50, default='3 months')
    instructor = models.CharField(max_length=100, default='Expert Instructor')
    topics = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"


class Job(models.Model):
    TYPE_CHOICES = [('Full-time','Full-time'),('Part-time','Part-time'),('Remote','Remote'),('Contract','Contract'),('Internship','Internship')]
    CATEGORY_CHOICES = [
        ('IT Jobs','IT Jobs'),('Data Science','Data Science'),('Marketing','Marketing'),
        ('Finance','Finance'),('HR','HR'),('Engineering','Engineering'),('Design','Design'),
    ]

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    salary = models.CharField(max_length=50)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    description = models.TextField()
    skills = models.CharField(max_length=300, blank=True)
    posted_days_ago = models.IntegerField(default=1)
    apply_url = models.URLField(blank=True, default='#')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"
