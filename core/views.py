import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .models import Course, Enrollment, Job


def home(request):
    featured_courses = Course.objects.all()[:6]
    stats = {
        'students': '10K+',
        'partners': '200+',
        'courses': Course.objects.count() or '20+',
        'tutor': 'AI',
    }
    return render(request, 'core/home.html', {'featured_courses': featured_courses, 'stats': stats})


def courses(request):
    query    = request.GET.get('q', '')
    category = request.GET.get('category', '')
    level    = request.GET.get('level', '')

    all_courses = Course.objects.all()
    if query:
        all_courses = all_courses.filter(Q(title__icontains=query) | Q(description__icontains=query))
    if category:
        all_courses = all_courses.filter(category=category)
    if level:
        all_courses = all_courses.filter(level=level)

    categories = Course.CATEGORY_CHOICES
    levels     = Course.LEVEL_CHOICES
    total      = Course.objects.all().count()
    showing    = all_courses.count()

    return render(request, 'core/courses.html', {
        'courses': all_courses,
        'categories': categories,
        'levels': levels,
        'selected_category': category,
        'selected_level': level,
        'query': query,
        'total': total,
        'showing': showing,
    })


def course_detail(request, pk):
    course = get_object_or_404(Course, pk=pk)
    is_enrolled = False
    if request.user.is_authenticated:
        is_enrolled = Enrollment.objects.filter(user=request.user, course=course).exists()
    return render(request, 'core/course_detail.html', {'course': course, 'is_enrolled': is_enrolled})


@login_required
def enroll(request, pk):
    course = get_object_or_404(Course, pk=pk)
    enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
    if created:
        messages.success(request, f'Successfully enrolled in {course.title}!')
    else:
        messages.info(request, f'You are already enrolled in {course.title}.')
    return redirect('dashboard')


@login_required
def dashboard(request):
    enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
    return render(request, 'core/dashboard.html', {'enrollments': enrollments})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'core/login.html')


def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        username  = request.POST.get('username')
        email     = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
        else:
            user = User.objects.create_user(username=username, email=email, password=password1)
            login(request, user)
            messages.success(request, 'Account created! Welcome to Skilstation.')
            return redirect('home')
    return render(request, 'core/register.html')


def logout_view(request):
    logout(request)
    return redirect('home')


def contact(request):
    return render(request, 'core/contact.html')


def chatbot(request):
    courses_data = list(Course.objects.values(
        'title', 'category', 'level', 'price', 'description', 'duration', 'topics'
    ))
    for c in courses_data:
        c['price'] = float(c['price'])  # Fix: Decimal not JSON serializable
    total_courses = Course.objects.count()
    return render(request, 'core/chatbot.html', {
        'courses_data': json.dumps(courses_data),
        'total_courses': total_courses,
    })


@csrf_exempt
def chatbot_api(request):
    if request.method == 'POST':
        try:
            data      = json.loads(request.body)
            message   = data.get('message', '').lower().strip()
            courses_qs = Course.objects.all()
            response  = generate_bot_response(message, courses_qs)
            return JsonResponse({'response': response})
        except Exception:
            return JsonResponse({'response': 'Sorry, I encountered an error. Please try again.'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def generate_bot_response(message, courses_qs):
    # List all courses
    if any(w in message for w in ['list', 'all course', 'show course', 'courses available']):
        course_list = '\n'.join([f"• {c.title} ({c.level}) - ₹{c.price}" for c in courses_qs[:10]])
        return f"Here are our available courses:\n\n{course_list}\n\nWe have {courses_qs.count()} courses in total. Ask me about any specific course!"

    # Match specific course title
    for course in courses_qs:
        if course.title.lower() in message or any(word in message for word in course.title.lower().split()):
            topics = f"\n\n📚 Topics: {course.topics}" if course.topics else ""
            return (f"📘 **{course.title}**\n\n"
                    f"🏷️ Category: {course.category}\n"
                    f"📊 Level: {course.level}\n"
                    f"💰 Price: ₹{course.price}\n"
                    f"⏱️ Duration: {course.duration}\n"
                    f"📝 {course.description}{topics}\n\n"
                    f"Ready to enroll? Visit our Courses page!")

    # AI / ML
    if any(w in message for w in ['ai', 'artificial intelligence', 'machine learning', 'ml']):
        ai_courses = courses_qs.filter(
            Q(category__icontains='AI') | Q(category__icontains='Machine') |
            Q(title__icontains='AI')    | Q(title__icontains='Machine')
        )
        if ai_courses.exists():
            names = ', '.join([c.title for c in ai_courses[:3]])
            return f"🤖 Great choice! Our AI/ML courses include:\n\n{names}\n\nThese courses will help you master AI from fundamentals to advanced topics!"

    # Beginner
    if any(w in message for w in ['beginner', 'start', 'basic', 'newbie', 'new to']):
        beginner = courses_qs.filter(level='Beginner')
        if beginner.exists():
            names = '\n'.join([f"• {c.title} - ₹{c.price}" for c in beginner[:4]])
            return f"🌱 Perfect for beginners! Here are our beginner-friendly courses:\n\n{names}\n\nThese are designed to take you from zero to job-ready!"

    # Python
    if any(w in message for w in ['python', 'py']):
        py = courses_qs.filter(title__icontains='python').first()
        if py:
            return f"🐍 Python is one of our most popular courses!\n\n**{py.title}**\nLevel: {py.level} | Price: ₹{py.price}\nDuration: {py.duration}\n\n{py.description}"

    # Price
    if any(w in message for w in ['price', 'cost', 'fee', 'cheap', 'affordable']):
        cheapest = courses_qs.order_by('price').first()
        if cheapest:
            return f"💰 Our courses start from just ₹{cheapest.price}!\n\nMost affordable: **{cheapest.title}** at ₹{cheapest.price}\n\nWe offer world-class education at the most competitive prices. 🎯"

    # Greeting
    if any(w in message for w in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
        return ("👋 Hello! I'm the Skilstation AI Tutor! I can help you:\n\n"
                "• Find the right course for you\n"
                "• Answer questions about our curriculum\n"
                "• Guide you on career paths\n\n"
                "What would you like to learn today? 🚀")

    # Jobs / Career
    if any(w in message for w in ['job', 'career', 'work', 'placement', 'salary']):
        return ("💼 Great question about careers!\n\n"
                "Our courses are designed to make you job-ready. After completing our programs, "
                "students have been placed in top companies with:\n\n"
                "• Starting salary: ₹4-6 LPA\n"
                "• Senior roles: ₹10-20+ LPA\n"
                "• 10,000+ students placed\n\n"
                "Visit our Job Portal to see current openings! 🎯")

    # Data Science
    if any(w in message for w in ['data science', 'data']):
        ds = courses_qs.filter(Q(category__icontains='Data') | Q(title__icontains='Data')).first()
        if ds:
            return (f"📊 Data Science is in huge demand!\n\n**{ds.title}**\n"
                    f"Level: {ds.level} | Price: ₹{ds.price} | Duration: {ds.duration}\n\n"
                    f"{ds.description}\n\nData Scientists earn ₹8-20 LPA on average!")

    # Web Dev
    if any(w in message for w in ['web', 'frontend', 'backend', 'fullstack', 'html', 'css', 'javascript']):
        web = courses_qs.filter(Q(category__icontains='Web') | Q(title__icontains='Web')).first()
        if web:
            return (f"🌐 Web Development is one of our top categories!\n\n**{web.title}**\n"
                    f"Level: {web.level} | Price: ₹{web.price}\n\n"
                    f"{web.description}\n\nWeb developers are among the highest-paid professionals!")

    # Fallback
    return ("🤔 I'm not sure about that specific query, but I can help you with:\n\n"
            "• 📚 Course recommendations\n"
            "• 💰 Pricing and duration info\n"
            "• 🎯 Career guidance\n"
            "• 🤖 AI/ML, Web Dev, Data Science courses\n\n"
            "Try asking: 'Tell me about Python' or 'Best course for beginners' or 'List all courses'!")


def job_portal(request):
    query    = request.GET.get('q', '')
    category = request.GET.get('category', '')
    job_type = request.GET.get('type', '')

    jobs = Job.objects.all()
    if query:
        jobs = jobs.filter(Q(title__icontains=query) | Q(company__icontains=query) | Q(skills__icontains=query))
    if category:
        jobs = jobs.filter(category=category)
    if job_type:
        jobs = jobs.filter(job_type=job_type)

    categories = Job.CATEGORY_CHOICES
    types      = Job.TYPE_CHOICES

    return render(request, 'core/job_portal.html', {
        'jobs': jobs,
        'categories': categories,
        'types': types,
        'selected_category': category,
        'selected_type': job_type,
        'query': query,
    })


def about(request):
    values = [
        ('01', 'Integrity',   'We operate with complete transparency and honesty in everything we do.'),
        ('02', 'Excellence',  'We strive for the highest standards in our courses, mentoring, and student outcomes.'),
        ('03', 'Inclusivity', 'We welcome learners from all backgrounds and believe in equal opportunities for all.'),
        ('04', 'Innovation',  'We constantly evolve our teaching methods and curriculum to stay ahead of industry trends.'),
        ('05', 'Impact',      "Everything we do is focused on creating a measurable positive impact on our students' lives and careers."),
    ]
    return render(request, 'core/about.html', {'values': values})