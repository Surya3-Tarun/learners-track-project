from django.contrib import admin
from .models import Course, Enrollment, Job

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'price', 'instructor')
    list_filter = ('category', 'level')
    search_fields = ('title', 'description')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at', 'progress')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'category', 'salary')
    list_filter = ('category', 'job_type')
    search_fields = ('title', 'company')
