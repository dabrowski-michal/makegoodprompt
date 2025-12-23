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

    animateWithScrollTrigger(".case-studies-accordion",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8 },
        ".case-studies-section"
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

// Case Studies Accordion
// TODO: Add more case studies to this array as they become available
const caseStudiesData = [
    {
        id: 'case-study-1',
        title: 'Automated product imagery for e-commerce fashion brand',
        meta: {
            client: 'SAWAY',
            scope: 'E-commerce automation',
            role: 'AI Workflow Design & Implementation'
        },
        blocks: [
            {
                title: 'Context & Challenge',
                paragraphs: [
                    'SAWAY is a Polish e-commerce footwear brand with frequent product launches. Traditional photoshoots with model made image production slow and expensive, while scaling visuals across a growing catalog was difficult. The goal was to automate product imagery generation while preserving the visual quality of existing photos.'
                ],
                imageCaption: 'Existing assets used to maintain brand consistency'
            },
            {
                title: 'Solution & Automation',
                paragraphs: [
                    'I designed an automated image generation pipeline built around structured inputs and repeatable logic. The workflow uses 1 style reference image and 4 product images per SKU, executes prompt logic, generates multiple visual variants, and automatically organizes outputs. The entire process is orchestrated in n8n, allowing batch processing and fully unattended runs, including overnight jobs.'                ],
                imageCaption: 'Automated image generation pipeline in n8n (selected stage)'
            },  
            {
                title: 'Outcome & Impact',
                paragraphs: [
                    'The system reduced the cost per image to $0.09 and the generation time to ~2 minutes per image. Manual photoshoots were removed from the process, while brand consistency was maintained. The automation now scales effortlessly with the product catalog, turning image creation into a repeatable production workflow rather than a manual task.'              ],
                imageCaption: 'Exploring prompting strategies and visual approaches'            }
        ],
        tools: ['n8n', 'Prompt Engineering', 'Image Generation API', 'Workflow Automation']
    }
    // TODO: Add more case studies here, e.g.:
    // {
    //     id: 'case-study-2',
    //     title: 'Case Study #2 — [Client Name]',
    //     subtitle: '[Brief description]',
    //     meta: {
    //         client: '[Client]',
    //         scope: '[Scope]',
    //         role: '[Role]'
    //     },
    //     blocks: [
    //         {
    //             title: 'Block Title',
    //             paragraphs: ['...'],
    //             imageCaption: 'Caption text'
    //         }
    //     ],
    //     tools: ['Tool 1', 'Tool 2']
    // }
];

function generateCaseStudyHTML(caseStudy) {
    const toolsHTML = caseStudy.tools && caseStudy.tools.length > 0
        ? `
            <div class="case-study-tools">
                <span class="case-study-tools-label">Tools used:</span>
                ${caseStudy.tools.map(tool => `<span class="case-study-tool-tag">${tool}</span>`).join('')}
            </div>
        `
        : '';

    // Generate meta row HTML
    const metaHTML = caseStudy.meta
        ? `
            <div class="case-study-meta">
                <div class="case-study-meta-item">
                    <span class="case-study-meta-label">Client:</span>
                    <span class="case-study-meta-value">${caseStudy.meta.client}</span>
                </div>
                <div class="case-study-meta-item">
                    <span class="case-study-meta-label">Scope:</span>
                    <span class="case-study-meta-value">${caseStudy.meta.scope}</span>
                </div>
                <div class="case-study-meta-item">
                    <span class="case-study-meta-label">Role:</span>
                    <span class="case-study-meta-value">${caseStudy.meta.role}</span>
                </div>
            </div>
        `
        : '';

    // Generate blocks HTML with alternating layout
    const imageFiles = ['SawayWebsite.png', 'Automation.png', 'Effects.png'];
    const blocksHTML = caseStudy.blocks
        ? caseStudy.blocks.map((block, index) => {
            const isImageLeft = index % 2 === 0;
            const blockClass = `case-study-block ${isImageLeft ? 'block-image-left' : 'block-image-right'}`;
            const imageFile = imageFiles[index] || 'SawayWebsite.png';
            
            return `
                <div class="${blockClass}" data-block-index="${index}">
                    <div class="case-study-block-image">
                        <img src="img/${imageFile}" alt="${block.imageCaption || 'Case study image'}" class="case-study-image-large">
                        <p class="case-study-image-caption">${block.imageCaption || 'Image placeholder'}</p>
                    </div>
                    <div class="case-study-block-text">
                        <h3 class="case-study-block-title">${block.title}</h3>
                        <div class="case-study-block-content">
                            ${block.paragraphs.map(para => `<p>${para}</p>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '';

    return `
        <div class="case-study-item" data-case-study-id="${caseStudy.id}">
            <button 
                class="case-study-header" 
                aria-expanded="false" 
                aria-controls="${caseStudy.id}-content"
                id="${caseStudy.id}-header"
            >
                <img src="img/saway_logo.png" alt="SAWAY Logo" class="case-study-header-logo">
                <div class="case-study-header-content">
                    <h3 class="case-study-title">${caseStudy.title}</h3>
                </div>
                <i class="fas fa-chevron-down case-study-chevron" aria-hidden="true"></i>
            </button>
            <div 
                class="case-study-content" 
                id="${caseStudy.id}-content" 
                aria-labelledby="${caseStudy.id}-header"
            >
                <div class="case-study-content-inner">
                    <div class="case-study-header-section">
                        ${metaHTML}
                    </div>
                    ${blocksHTML}
                    ${toolsHTML}
                </div>
            </div>
        </div>
    `;
}

function initCaseStudiesAccordion() {
    const accordionContainer = document.getElementById('case-studies-accordion');
    if (!accordionContainer || !caseStudiesData.length) {
        return;
    }

    // Generate HTML from data
    accordionContainer.innerHTML = caseStudiesData.map(generateCaseStudyHTML).join('');

    // Attach event listeners to each case study item
    const caseStudyItems = accordionContainer.querySelectorAll('.case-study-item');
    
    caseStudyItems.forEach(item => {
        const header = item.querySelector('.case-study-header');
        const content = item.querySelector('.case-study-content');
        
        if (!header || !content) return;

        const toggleAccordion = (e) => {
            // Prevent default if it's a keyboard event
            if (e.type === 'keydown') {
                if (e.key !== 'Enter' && e.key !== ' ') {
                    return;
                }
                e.preventDefault();
            }

            const isExpanded = item.classList.contains('is-expanded');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (isExpanded) {
                // Collapse
                item.classList.remove('is-expanded');
                header.setAttribute('aria-expanded', 'false');
                
                if (prefersReducedMotion) {
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    // Hide blocks immediately
                    const blocks = content.querySelectorAll('.case-study-block');
                    blocks.forEach(block => {
                        block.style.opacity = '0';
                    });
                } else {
                    // Animate collapse
                    if (typeof gsap !== 'undefined') {
                        // Fade out blocks first
                        const blocks = content.querySelectorAll('.case-study-block');
                        gsap.to(blocks, {
                            opacity: 0,
                            y: -10,
                            duration: 0.2,
                            ease: 'power2.in'
                        });
                        
                        // Then collapse content
                        gsap.to(content, {
                            maxHeight: 0,
                            opacity: 0,
                            paddingBottom: 0,
                            duration: 0.4,
                            delay: 0.1,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                content.style.maxHeight = '0';
                            }
                        });
                    } else {
                        // Fallback CSS transition
                        content.style.maxHeight = '0';
                        content.style.opacity = '0';
                    }
                }
                } else {
                // Expand
                item.classList.add('is-expanded');
                header.setAttribute('aria-expanded', 'true');
                
                // Set initial height for animation
                content.style.maxHeight = 'none';
                const height = content.scrollHeight;
                content.style.maxHeight = '0';
                
                // Force reflow
                content.offsetHeight;
                
                if (prefersReducedMotion) {
                    content.style.maxHeight = 'none';
                    content.style.opacity = '1';
                    // Show blocks immediately
                    const blocks = content.querySelectorAll('.case-study-block');
                    blocks.forEach(block => {
                        block.style.opacity = '1';
                        block.style.transform = 'none';
                    });
                } else {
                    // Animate expand
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(content, 
                            { maxHeight: 0, opacity: 0, paddingBottom: 0 },
                            {
                                maxHeight: height + 'px',
                                opacity: 1,
                                paddingBottom: 50,
                                duration: 0.4,
                                ease: 'power2.inOut',
                                onComplete: () => {
                                    content.style.maxHeight = 'none';
                                }
                            }
                        );
                        
                        // Stagger animation for blocks
                        const blocks = content.querySelectorAll('.case-study-block');
                        blocks.forEach((block, index) => {
                            gsap.fromTo(block,
                                { opacity: 0, y: 20 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.5,
                                    delay: 0.2 + (index * 0.15),
                                    ease: 'power2.out'
                                }
                            );
                        });
                    } else {
                        // Fallback CSS transition
                        content.style.maxHeight = height + 'px';
                        content.style.opacity = '1';
                    }
                }
            }
        };

        // Click handler
        header.addEventListener('click', toggleAccordion);
        
        // Keyboard handler
        header.addEventListener('keydown', toggleAccordion);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initHoverAnimations();
    initServiceCards();
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initCaseStudiesAccordion();
});
