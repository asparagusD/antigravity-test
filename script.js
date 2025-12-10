/* ===================================
   WanderWay - JavaScript Functionality
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initThemeToggle();
    initCookieBanner();
    initNavigation();
    initScrollAnimations();
    initEmailForm();
    initStatCounter();
});

/* ===================================
   Theme Toggle (Light/Dark Mode)
   =================================== */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        // Default to dark theme (no data-theme attribute means dark)
        html.removeAttribute('data-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = html.getAttribute('data-theme');

            if (currentTheme === 'light') {
                // Switch to dark
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

/* ===================================
   Cookie Consent Banner
   =================================== */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');

    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1500);
    } else {
        cookieBanner.classList.add('hidden');
    }

    acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('visible');
        setTimeout(() => {
            cookieBanner.classList.add('hidden');
        }, 300);
    });
}

/* ===================================
   Navigation
   =================================== */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navCta = document.querySelector('.nav-cta');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header with shadow on scroll
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (navCta) {
            navCta.classList.toggle('active');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navCta) {
                navCta.classList.remove('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   Scroll Animations
   =================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ===================================
   Email Form
   =================================== */
function initEmailForm() {
    const emailForm = document.getElementById('emailForm');

    if (!emailForm) return;

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        // Basic email validation
        if (!isValidEmail(email)) {
            showFormMessage(emailInput, 'Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading">Signing up...</span>';

        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign up for FREE';
            emailInput.value = '';
            showFormMessage(emailInput, 'Welcome aboard! Check your email for next steps.', 'success');

            // Clear success message after 5 seconds
            setTimeout(() => {
                const message = emailInput.parentElement.querySelector('.form-message');
                if (message) {
                    message.remove();
                }
            }, 5000);
        }, 1500);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(input, message, type) {
    // Remove existing message if any
    const existingMessage = input.parentElement.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and insert message
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin-top: 8px;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        ${type === 'error'
            ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
            : 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);'}
    `;

    input.parentElement.appendChild(messageEl);

    if (type === 'error') {
        input.style.borderColor = '#ef4444';
        input.addEventListener('input', function handler() {
            input.style.borderColor = '';
            const msg = input.parentElement.querySelector('.form-message');
            if (msg) msg.remove();
            input.removeEventListener('input', handler);
        });
    }
}

/* ===================================
   Stat Counter Animation
   =================================== */
function initStatCounter() {
    const statNumber = document.querySelector('.stat-number');

    if (!statNumber) return;

    const targetCount = parseInt(statNumber.dataset.count, 10);
    let hasAnimated = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounter(statNumber, targetCount);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(statNumber);
}

function animateCounter(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
}

/* ===================================
   Utility Functions
   =================================== */

// Debounce function for performance
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
