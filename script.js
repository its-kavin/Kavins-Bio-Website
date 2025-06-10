// A generic throttle function to improve performance of frequent events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}


// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Global variables for elements ---
    const htmlElement = document.documentElement;
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = navbar ? document.querySelectorAll('nav a.nav-link:not([href="#"])') : [];
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = mobileMenu ? document.querySelectorAll('#mobileMenu a.nav-link:not([href="#"])') : [];

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const moonIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;
    const sunIconClass = 'fa-sun';
    const moonIconClass = 'fa-moon';

    function setDarkMode(isDark) {
        if (isDark) {
            htmlElement.classList.add('dark');
            if (moonIcon) moonIcon.classList.replace(moonIconClass, sunIconClass);
            localStorage.setItem('darkMode', 'true');
        } else {
            htmlElement.classList.remove('dark');
            if (moonIcon) moonIcon.classList.replace(sunIconClass, moonIconClass);
            localStorage.setItem('darkMode', 'false');
        }
    }

    if (darkModeToggle) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem('darkMode');
        setDarkMode(savedMode === 'true' || (savedMode === null && prefersDark));
        darkModeToggle.addEventListener('click', () => {
            setDarkMode(!htmlElement.classList.contains('dark'));
        });
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.classList.toggle('active');
            const isExpanded = mobileMenuButton.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
        });
        mobileMenuButton.setAttribute('aria-expanded', 'false');

        // Close mobile menu when a link is clicked
        const allMobileLinks = mobileMenu.querySelectorAll('a');
        allMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Active Navigation Link Highlighting Function ---
    function changeNav() {
        if (!navbar || sections.length === 0) return;

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (navbar.offsetHeight + 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        const allNavLinks = [...navLinks, ...mobileNavLinks];
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.length > 1 && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Run on initial load
    window.addEventListener('load', changeNav);

    // --- Efficient Scroll Handling ---
    function handleScroll() {
        // 1. Navbar scroll effect
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 2. Active Navigation Link Highlighting
        changeNav();

        // 3. Back to Top Button visibility
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'hidden');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.remove('opacity-100');
                backToTopBtn.classList.add('opacity-0');
                setTimeout(() => {
                    if (window.pageYOffset <= 300) backToTopBtn.classList.add('hidden');
                }, 300);
            }
        }
    }

    // Add a single throttled event listener for scrolling
    window.addEventListener('scroll', throttle(handleScroll, 100));

    // --- Set current year in footer ---
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Back to Top Button Click ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Reversible Scroll Animations using Intersection Observer ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Portfolio Card "View Details" functionality ---
    const portfolioCards = document.querySelectorAll('#portfolio .card');
    if (portfolioCards.length > 0) {
        portfolioCards.forEach(card => {
            const clickableArea = card.querySelector('.relative.overflow-hidden.rounded-t-xl');
            const githubLink = card.dataset.githubLink;

            if (clickableArea && githubLink) {
                clickableArea.style.cursor = 'pointer';
                clickableArea.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(githubLink, '_blank', 'noopener,noreferrer');
                });
            }
        });
    }

    // --- Basic Contact Form Submission ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const message = messageInput ? messageInput.value : '';

            // Basic Validation
            if (!name.trim() || !email.trim() || !message.trim()) {
                formMessage.textContent = 'Please fill out all fields.';
                formMessage.className = 'mt-4 text-sm h-5 text-red-500 dark:text-red-400';
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'mt-4 text-sm h-5 text-red-500 dark:text-red-400';
                return;
            }

            // Demo submission feedback
            formMessage.textContent = 'Sending... (Demo - no email sent)';
            formMessage.className = 'mt-4 text-sm h-5 text-blue-600 dark:text-blue-400';
            
            setTimeout(() => {
                formMessage.textContent = 'Thank you! Your message has been "sent".';
                formMessage.className = 'mt-4 text-sm h-5 text-green-600 dark:text-green-400';
                contactForm.reset();
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'mt-4 text-sm h-5';
                }, 5000);
            }, 1500);
        });
    }
});