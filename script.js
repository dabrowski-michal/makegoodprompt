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

    animateWithScrollTrigger(".case-studies-carousel",
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

// Case Studies Carousel
// TODO: Add more case studies to this array as they become available
const caseStudiesData = [
    {
        id: 'case-study-1',
        logoSrc: 'img/saway_logo.png',
        title: 'Automated product imagery for e-commerce fashion brand',
        meta: {
            client: 'SAWAY',
            scope: 'E-commerce automation',
            role: 'AI Workflow Design & Implementation'
        },
        blocks: [
            {
                title: 'Context & Challenge',
                image: 'SawayWebsite.png',
                paragraphs: [
                    'SAWAY is a Polish e-commerce footwear brand with frequent product launches. Traditional photoshoots with model made image production slow and expensive, while scaling visuals across a growing catalog was difficult. The goal was to automate product imagery generation while preserving the visual quality of existing photos.'
                ],
                imageCaption: 'Existing assets used to maintain brand consistency'
            },
            {
                title: 'Solution & Automation',
                image: 'Automation.png',
                paragraphs: [
                    'I designed an automated image generation pipeline built around structured inputs and repeatable logic. The workflow uses 1 style reference image and 4 product images per SKU, executes prompt logic, generates multiple visual variants, and automatically organizes outputs. The entire process is orchestrated in n8n, allowing batch processing and fully unattended runs, including overnight jobs.'
                ],
                imageCaption: 'Automated image generation pipeline in n8n (selected stage)'
            },
            {
                title: 'Outcome & Impact',
                image: 'Effects.png',
                paragraphs: [
                    'The system reduced the cost per image to $0.09 and the generation time to ~2 minutes per image. Manual photoshoots were removed from the process, while brand consistency was maintained. The automation now scales effortlessly with the product catalog, turning image creation into a repeatable production workflow rather than a manual task.'
                ],
                imageCaption: 'Exploring prompting strategies and visual approaches'
            }
        ],
        tools: ['n8n', 'Prompt Engineering', 'Image Generation API', 'Workflow Automation']
    }
    // TODO: Add more case studies here, e.g.:
    // {
    //     id: 'case-study-2',
    //     logoSrc: 'img/client_logo.png',
    //     meta: {
    //         client: '[Client]',
    //         scope: '[Scope]',
    //         role: '[Role]'
    //     },
    //     blocks: [
    //         {
    //             title: 'Block Title',
    //             image: 'filename.png',
    //             paragraphs: ['...'],
    //             imageCaption: 'Caption text'
    //         }
    //     ],
    //     tools: ['Tool 1', 'Tool 2']
    // }
];

function generateCaseStudyPanelHTML(caseStudy) {
    const toolsHTML = caseStudy.tools && caseStudy.tools.length > 0
        ? `
            <div class="case-study-tools">
                <span class="case-study-tools-label">Tools used:</span>
                ${caseStudy.tools.map(tool => `<span class="case-study-tool-tag">${tool}</span>`).join('')}
            </div>
        `
        : '';

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

    const blocksHTML = caseStudy.blocks
        ? caseStudy.blocks.map((block, index) => {
            const isImageLeft = index % 2 === 0;
            const blockClass = `case-study-block ${isImageLeft ? 'block-image-left' : 'block-image-right'}`;
            const imageFile = block.image || 'SawayWebsite.png';

            return `
                <div class="${blockClass}" data-block-index="${index}">
                    <div class="case-study-block-image">
                        <img src="img/${imageFile}" alt="${block.imageCaption || 'Case study image'}" class="case-study-image-large">
                        <p class="case-study-image-caption">${block.imageCaption || ''}</p>
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
        <div class="case-study-content-inner">
            <div class="case-study-header-section">
                <img src="${caseStudy.logoSrc}" alt="${caseStudy.meta?.client || ''} Logo" class="case-study-panel-logo">
                <h3 class="case-study-title">${caseStudy.title}</h3>
                ${metaHTML}
            </div>
            ${blocksHTML}
            ${toolsHTML}
        </div>
    `;
}

function animatePanelIn(panel) {
    if (typeof gsap === 'undefined') return;
    const blocks = panel.querySelectorAll('.case-study-block');
    gsap.fromTo(panel,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
    gsap.fromTo(blocks,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.15, ease: 'power2.out' }
    );
}

function initCaseStudiesCarousel() {
    const navContainer = document.getElementById('case-studies-nav');
    const panelContainer = document.getElementById('case-studies-panel');
    if (!navContainer || !panelContainer || !caseStudiesData.length) return;

    navContainer.innerHTML = caseStudiesData.map((cs, i) =>
        `<button class="case-studies-nav-btn${i === 0 ? ' is-active' : ''}" data-index="${i}">${cs.meta?.client || cs.title}</button>`
    ).join('');

    panelContainer.innerHTML = generateCaseStudyPanelHTML(caseStudiesData[0]);
    animatePanelIn(panelContainer);

    navContainer.querySelectorAll('.case-studies-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index, 10);
            navContainer.querySelectorAll('.case-studies-nav-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            panelContainer.innerHTML = generateCaseStudyPanelHTML(caseStudiesData[index]);
            animatePanelIn(panelContainer);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initHoverAnimations();
    initServiceCards();
    initMobileMenu();
    initSmoothScrolling();
    initCaseStudiesCarousel();
});
