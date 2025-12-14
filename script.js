// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill bars animation on scroll
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (barPosition < screenPosition) {
            const width = window.getComputedStyle(bar).width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }
    });
};

// Run skill bar animation on scroll
let skillsAnimated = false;
window.addEventListener('scroll', () => {
    if (!skillsAnimated) {
        const skillsSection = document.querySelector('.skills');
        const skillsPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (skillsPosition < screenPosition) {
            animateSkillBars();
            skillsAnimated = true;
        }
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe stat cards
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--dark-bg)';
        navbar.style.backdropFilter = 'none';
    }
});

// Counter animation for stats
const animateCounter = (element, target, suffix) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toString() + suffix;
        }
    }, 20);
};

// Trigger counter animation when stats section is visible
let statsAnimated = false;
window.addEventListener('scroll', () => {
    if (!statsAnimated) {
        const aboutSection = document.querySelector('.about');
        const aboutPosition = aboutSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (aboutPosition < screenPosition) {
            const statNumbers = document.querySelectorAll('.stat-card h3');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                // Extract number and suffix separately
                const match = text.match(/^(\d+)(.*)$/);
                if (match) {
                    const number = parseInt(match[1]);
                    const suffix = match[2];
                    stat.textContent = '0' + suffix;
                    animateCounter(stat, number, suffix);
                }
            });
            statsAnimated = true;
        }
    }
});

// Add scroll-to-top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollButton.className = 'scroll-to-top';
scrollButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 999;
`;

document.body.appendChild(scrollButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollButton.style.display = 'flex';
    } else {
        scrollButton.style.display = 'none';
    }
});

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollButton.addEventListener('mouseenter', () => {
    scrollButton.style.transform = 'translateY(-5px)';
});

scrollButton.addEventListener('mouseleave', () => {
    scrollButton.style.transform = 'translateY(0)';
});
