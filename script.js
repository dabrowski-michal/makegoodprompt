// Register GSAP plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialize GSAP animations
function initAnimations() {
    if (typeof gsap === 'undefined') {
        return;
    }

    const heroIcon = document.getElementById('hero-icon');
    const headline = document.getElementById('headline');
    const ctaButton = document.getElementById('cta-button');

    if (heroIcon) {
        gsap.set(heroIcon, { scale: 0, opacity: 0 });
        gsap.to(heroIcon, {
            duration: 1,
            scale: 1,
            opacity: 1,
            ease: "back.out(1.7)"
        });
    }

    if (headline) {
        const originalText = headline.textContent.trim() || "Make Good Prompt";
        headline.textContent = '';
        gsap.set(headline, { opacity: 1 });

        const tl = gsap.timeline({ delay: 0.5 });
        for (let i = 0; i < originalText.length; i++) {
            tl.to(headline, {
                duration: 0.05,
                onComplete: () => {
                    headline.textContent += originalText[i];
                }
            });
        }
    }

    if (ctaButton) {
        gsap.set(ctaButton, { y: 50, opacity: 0 });
        gsap.to(ctaButton, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)",
            delay: 2
        });
    }

    const animateWithScrollTrigger = (selector, fromVars, toVars, triggerSelector) => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        const options = {
            duration: 0.8,
            ease: "power3.out",
            ...toVars
        };

        if (typeof ScrollTrigger !== 'undefined' && triggerSelector) {
            options.scrollTrigger = {
                trigger: triggerSelector,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            };
        }

        gsap.fromTo(elements, fromVars, options);
    };

    animateWithScrollTrigger(".service-card",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, stagger: 0.15 },
        ".services-section"
    );

    animateWithScrollTrigger(".about-content",
        { opacity: 0, x: -80 },
        { opacity: 1, x: 0, duration: 1 },
        ".about-section"
    );

    animateWithScrollTrigger(".contact-content",
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1 },
        ".contact-section"
    );
}

// Hover animations
function initHoverAnimations() {
    if (typeof gsap === 'undefined') {
        return;
    }

    const heroIcon = document.getElementById('hero-icon');
    if (heroIcon) {
        heroIcon.addEventListener('mouseenter', () => {
            gsap.to(heroIcon, {
                duration: 0.3,
                scale: 1.15,
                filter: "drop-shadow(0 0 30px rgba(255, 157, 0, 1)) drop-shadow(0 0 60px rgba(255, 157, 0, 0.6))"
            });
        });
        heroIcon.addEventListener('mouseleave', () => {
            gsap.to(heroIcon, {
                duration: 0.3,
                scale: 1,
                filter: "none"
            });
        });
    }

    const headerLogo = document.querySelector('.logo-header');
    if (headerLogo) {
        headerLogo.addEventListener('mouseenter', () => {
            gsap.to(headerLogo, {
                duration: 0.3,
                scale: 1.1,
                filter: "brightness(1.2)"
            });
        });
        headerLogo.addEventListener('mouseleave', () => {
            gsap.to(headerLogo, {
                duration: 0.3,
                scale: 1,
                filter: "brightness(1)"
            });
        });
    }

    const ctaButton = document.getElementById('cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to(ctaButton, {
                duration: 0.3,
                background: "linear-gradient(45deg, #FFD046, #FF9D00)",
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(255, 157, 0, 0.4)"
            });
        });
        ctaButton.addEventListener('mouseleave', () => {
            gsap.to(ctaButton, {
                duration: 0.3,
                background: "linear-gradient(45deg, #FF9D00, #FFD046)",
                scale: 1,
                boxShadow: "0 5px 20px rgba(255, 157, 0, 0.3)"
            });
        });
    }

    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            gsap.to(profileImage, {
                duration: 0.3,
                rotation: 5
            });
        });
        profileImage.addEventListener('mouseleave', () => {
            gsap.to(profileImage, {
                duration: 0.3,
                rotation: 0
            });
        });
    }
}

// Service cards interactions (desktop + touch)
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (!serviceCards.length) {
        return;
    }

    const isTouchPointer = (pointerType) => pointerType === 'touch' || pointerType === 'pen';

    const deactivateAll = () => {
        serviceCards.forEach((card) => card.classList.remove('is-active'));
    };

    serviceCards.forEach((card) => {
        card.addEventListener('focusout', (event) => {
            if (!card.contains(event.relatedTarget)) {
                card.classList.remove('is-active');
            }
        });

        card.addEventListener('pointerup', (event) => {
            if (!isTouchPointer(event.pointerType)) {
                return;
            }

            const wasActive = card.classList.contains('is-active');
            deactivateAll();

            if (!wasActive) {
                card.classList.add('is-active');
                card.focus({ preventScroll: true });
            }
        });
    });

    document.addEventListener('pointerdown', (event) => {
        if (!isTouchPointer(event.pointerType)) {
            return;
        }

        if (!event.target.closest('.service-card')) {
            deactivateAll();
        }
    });

    window.addEventListener('resize', () => {
        const hoverSupported = window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches;
        if (hoverSupported) {
            deactivateAll();
        }
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                // Close menu
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            } else {
                // Open menu
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
                body.classList.add('menu-open');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    // Formspree handles submission server-side; no custom JS required.
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initHoverAnimations();
    initServiceCards();
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
});
