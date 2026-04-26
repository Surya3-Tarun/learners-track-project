from django.core.management.base import BaseCommand
from core.models import Course, Job


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **kwargs):
        # Clear existing
        Course.objects.all().delete()
        Job.objects.all().delete()

        courses = [
            {'title': 'Front End Web Development', 'description': 'Build stunning, responsive user interfaces with HTML, CSS, and JavaScript frameworks.', 'category': 'Web Development', 'level': 'Intermediate', 'price': 5499, 'duration': '3 months', 'instructor': 'Arjun Sharma', 'image_url': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600', 'topics': 'HTML CSS JavaScript React Bootstrap'},
            {'title': 'Back End Web Development', 'description': 'Construct robust server-side applications and APIs with industry-standard technologies.', 'category': 'Web Development', 'level': 'Intermediate', 'price': 5799, 'duration': '3.5 months', 'instructor': 'Priya Nair', 'image_url': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600', 'topics': 'Python Django Node.js REST APIs Databases'},
            {'title': 'Generative AI', 'description': 'Learn to build applications with AI models and prompt engineering techniques.', 'category': 'Artificial Intelligence', 'level': 'Intermediate', 'price': 7999, 'duration': '2.5 months', 'instructor': 'Dr. Meera Patel', 'image_url': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600', 'topics': 'ChatGPT Prompt Engineering LangChain OpenAI Gemini'},
            {'title': 'Data Science with Python', 'description': 'Master data analysis, visualization, and predictive modeling using Python ecosystem.', 'category': 'Data Science', 'level': 'Beginner', 'price': 4999, 'duration': '4 months', 'instructor': 'Rahul Gupta', 'image_url': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', 'topics': 'Python Pandas NumPy Matplotlib Sklearn'},
            {'title': 'Machine Learning & AI', 'description': 'Build intelligent systems with supervised and unsupervised learning algorithms.', 'category': 'Machine Learning', 'level': 'Intermediate', 'price': 7849, 'duration': '4 months', 'instructor': 'Dr. Anil Kumar', 'image_url': 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=600', 'topics': 'Regression Classification Neural Networks TensorFlow Keras'},
            {'title': 'Python Programming', 'description': 'Learn Python from fundamentals to advanced concepts for multiple domains.', 'category': 'Programming', 'level': 'Beginner', 'price': 4108, 'duration': '2.5 months', 'instructor': 'Sneha Raje', 'image_url': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600', 'topics': 'Python OOP File Handling NumPy Flask Basics'},
            {'title': 'Java Programming', 'description': 'Master Java programming for enterprise applications and Android development.', 'category': 'Programming', 'level': 'Beginner', 'price': 4500, 'duration': '3 months', 'instructor': 'Vikram Singh', 'image_url': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600', 'topics': 'Java OOP Spring Boot Android JDBC'},
            {'title': 'Deep Learning', 'description': 'Build neural networks and deep learning models for computer vision and NLP.', 'category': 'Artificial Intelligence', 'level': 'Advanced', 'price': 9999, 'duration': '5 months', 'instructor': 'Dr. Kavitha Rao', 'image_url': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600', 'topics': 'CNN RNN LSTM Transformers PyTorch TensorFlow'},
            {'title': 'Power BI & Data Analytics', 'description': 'Create interactive dashboards and reports for business intelligence.', 'category': 'Data Science', 'level': 'Beginner', 'price': 3999, 'duration': '2 months', 'instructor': 'Suresh Babu', 'image_url': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', 'topics': 'Power BI DAX SQL Excel Tableau'},
            {'title': 'Cloud Computing with AWS', 'description': 'Master Amazon Web Services for cloud architecture, deployment and management.', 'category': 'Cloud Computing', 'level': 'Intermediate', 'price': 8499, 'duration': '3.5 months', 'instructor': 'Anand Krishnan', 'image_url': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600', 'topics': 'AWS EC2 S3 Lambda RDS CloudFormation'},
            {'title': 'Cyber Security', 'description': 'Learn ethical hacking, penetration testing, and security fundamentals.', 'category': 'Cyber Security', 'level': 'Intermediate', 'price': 7499, 'duration': '4 months', 'instructor': 'Rohit Verma', 'image_url': 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600', 'topics': 'Ethical Hacking Kali Linux Pen Testing Network Security'},
            {'title': 'Digital Marketing', 'description': 'Master SEO, social media marketing, and growth hacking strategies.', 'category': 'Business', 'level': 'Beginner', 'price': 3499, 'duration': '2 months', 'instructor': 'Preethi Joseph', 'image_url': 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600', 'topics': 'SEO SEM Social Media Email Marketing Analytics'},
            {'title': 'React.js Complete Course', 'description': 'Build production-grade React applications with hooks, Redux, and modern patterns.', 'category': 'Web Development', 'level': 'Intermediate', 'price': 5999, 'duration': '3 months', 'instructor': 'Arjun Sharma', 'image_url': 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=600', 'topics': 'React Hooks Redux Router Context API'},
            {'title': 'DevOps & CI/CD', 'description': 'Automate software delivery with Docker, Kubernetes, Jenkins, and GitOps.', 'category': 'Engineering', 'level': 'Advanced', 'price': 9499, 'duration': '4.5 months', 'instructor': 'Kiran Reddy', 'image_url': 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600', 'topics': 'Docker Kubernetes Jenkins GitHub Actions Terraform'},
            {'title': 'UI/UX Design', 'description': 'Design beautiful, user-centered digital products with Figma and Adobe XD.', 'category': 'Business', 'level': 'Beginner', 'price': 4299, 'duration': '2.5 months', 'instructor': 'Anjali Mehta', 'image_url': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600', 'topics': 'Figma Adobe XD UI Design UX Research Prototyping'},
        ]

        for c in courses:
            Course.objects.create(**c)

        jobs = [
            {'title': 'React Developer', 'company': 'TechSoft Solutions', 'location': 'Hyderabad', 'job_type': 'Full-time', 'salary': '₹4–8 LPA', 'category': 'IT Jobs', 'description': 'Build dynamic UIs with React.', 'skills': 'React JavaScript CSS', 'posted_days_ago': 2, 'apply_url': '#'},
            {'title': 'Data Scientist', 'company': 'Analytics Corp', 'location': 'Bangalore', 'job_type': 'Full-time', 'salary': '₹8–14 LPA', 'category': 'Data Science', 'description': 'Drive insights from complex data.', 'skills': 'Python ML Pandas', 'posted_days_ago': 1, 'apply_url': '#'},
            {'title': 'Digital Marketing Manager', 'company': 'BrandGrow', 'location': 'Remote', 'job_type': 'Full-time', 'salary': '₹4–7 LPA', 'category': 'Marketing', 'description': 'Lead digital marketing campaigns.', 'skills': 'SEO Google Ads Analytics', 'posted_days_ago': 3, 'apply_url': '#'},
            {'title': 'HR Executive', 'company': 'PeopleFirst', 'location': 'Chennai', 'job_type': 'Full-time', 'salary': '₹3–5 LPA', 'category': 'HR', 'description': 'Manage recruitment and HR processes.', 'skills': 'Recruitment HRMS Communication', 'posted_days_ago': 5, 'apply_url': '#'},
            {'title': 'Financial Analyst', 'company': 'FinEdge', 'location': 'Mumbai', 'job_type': 'Full-time', 'salary': '₹5–9 LPA', 'category': 'Finance', 'description': 'Analyze financial data and trends.', 'skills': 'Excel Financial Modeling Accounting', 'posted_days_ago': 1, 'apply_url': '#'},
            {'title': 'Embedded Systems Engineer', 'company': 'HardTech', 'location': 'Pune', 'job_type': 'Full-time', 'salary': '₹5–10 LPA', 'category': 'Engineering', 'description': 'Work on embedded firmware and drivers.', 'skills': 'C RTOS ARM', 'posted_days_ago': 4, 'apply_url': '#'},
            {'title': 'ML Engineer', 'company': 'AI Ventures', 'location': 'Hyderabad', 'job_type': 'Full-time', 'salary': '₹10–18 LPA', 'category': 'Data Science', 'description': 'Deploy machine learning models at scale.', 'skills': 'Python TensorFlow MLOps', 'posted_days_ago': 0, 'apply_url': '#'},
            {'title': 'Node.js Backend Developer', 'company': 'ServerStack', 'location': 'Remote', 'job_type': 'Contract', 'salary': '₹5–9 LPA', 'category': 'IT Jobs', 'description': 'Build scalable APIs and microservices.', 'skills': 'Node.js Express MySQL', 'posted_days_ago': 0, 'apply_url': '#'},
            {'title': 'Cybersecurity Analyst', 'company': 'SecureNet', 'location': 'Delhi', 'job_type': 'Full-time', 'salary': '₹6–12 LPA', 'category': 'IT Jobs', 'description': 'Protect systems from cyber threats.', 'skills': 'Kali Linux Pen Testing OWASP', 'posted_days_ago': 2, 'apply_url': '#'},
            {'title': 'UI/UX Designer', 'company': 'CreativeHub', 'location': 'Bangalore', 'job_type': 'Full-time', 'salary': '₹4–8 LPA', 'category': 'Design', 'description': 'Design intuitive user experiences.', 'skills': 'Figma Adobe XD Sketch', 'posted_days_ago': 1, 'apply_url': '#'},
            {'title': 'Cloud Architect', 'company': 'CloudWave', 'location': 'Hyderabad', 'job_type': 'Full-time', 'salary': '₹15–25 LPA', 'category': 'IT Jobs', 'description': 'Design and manage cloud infrastructure.', 'skills': 'AWS Azure Terraform Kubernetes', 'posted_days_ago': 3, 'apply_url': '#'},
            {'title': 'Python Developer', 'company': 'DataFlow', 'location': 'Remote', 'job_type': 'Full-time', 'salary': '₹5–10 LPA', 'category': 'IT Jobs', 'description': 'Build data pipelines and automation scripts.', 'skills': 'Python Django Flask', 'posted_days_ago': 2, 'apply_url': '#'},
        ]

        for j in jobs:
            Job.objects.create(**j)

        self.stdout.write(self.style.SUCCESS(f'✅ Seeded {len(courses)} courses and {len(jobs)} jobs!'))
