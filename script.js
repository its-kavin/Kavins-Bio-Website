// script.js

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
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

        if (savedMode === 'true' || (savedMode === null && prefersDark)) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }

        darkModeToggle.addEventListener('click', () => {
            setDarkMode(!htmlElement.classList.contains('dark'));
        });
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.classList.toggle('active');
            const isExpanded = mobileMenuButton.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded.toString());
        });
        mobileMenuButton.setAttribute('aria-expanded', 'false');

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = navbar ? document.querySelectorAll('nav a.nav-link:not([href="#"])') : []; 
    const mobileNavLinks = mobileMenu ? document.querySelectorAll('#mobileMenu a.nav-link:not([href="#"])') : [];

    function changeNav() {
        if (!navbar || sections.length === 0) return;

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (navbar.offsetHeight + 50) ) { 
                currentSection = section.getAttribute('id');
            }
        });

        const allNavLinks = [...navLinks, ...mobileNavLinks];
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if(href && href.length > 1 && href.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('load', changeNav); 
    window.addEventListener('scroll', changeNav);

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'hidden');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.remove('opacity-100');
                backToTopBtn.classList.add('opacity-0');
                setTimeout(() => {
                  if(window.pageYOffset <= 300) backToTopBtn.classList.add('hidden');
                }, 300);
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

// Scroll Animations using Intersection Observer
const animatedElements = document.querySelectorAll('.animate-on-scroll');
if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add the class if the element is intersecting (visible)
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } 
            // Remove the class if the element is NOT intersecting (not visible)
            else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // The element is considered "visible" if 10% of it is in the viewport
    });
    animatedElements.forEach(el => observer.observe(el));
}

    // Portfolio Card "View Details" functionality
    const portfolioCards = document.querySelectorAll('#portfolio .card');

    if (portfolioCards.length > 0) {
        portfolioCards.forEach(card => {
            // The clickable area will be the div containing the image and the "View Details" overlay.
            const clickableArea = card.querySelector('.relative.overflow-hidden.rounded-t-xl');
            const githubLink = card.dataset.githubLink; // Read from data-github-link attribute

            if (clickableArea && githubLink) {
                clickableArea.style.cursor = 'pointer'; // Make it look clickable
                clickableArea.addEventListener('click', (e) => {
                    // Prevent default if the clickable area was, for some reason, an anchor itself.
                    e.preventDefault(); 
                    window.open(githubLink, '_blank', 'noopener,noreferrer'); // Open the link in a new tab
                });
            }
        });
    }

    // Basic Contact Form Submission
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