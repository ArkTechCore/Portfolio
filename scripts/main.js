// Simple & Working JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle (works on all pages)
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.nav-menu-btn');      // index.html
    const navToggle = document.querySelector('.nav-toggle');      // projects.html

    function setMenu(open) {
        if (!navLinks) return;

        navLinks.classList.toggle('active', open);
        document.body.classList.toggle('nav-open', open);

        // Animate index hamburger (3 lines)
        if (menuBtn) {
            const lines = menuBtn.querySelectorAll('.menu-line');
            if (lines.length === 3) {
                if (open) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            }
        }

        // Animate projects hamburger (3 spans)
        if (navToggle) {
            const spans = navToggle.querySelectorAll('.hamburger span');
            if (spans.length === 3) {
                if (open) {
                    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const open = !navLinks?.classList.contains('active');
            setMenu(open);
        });
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const open = !navLinks?.classList.contains('active');
            setMenu(open);
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
        if (!navLinks || !navLinks.classList.contains('active')) return;

        const clickedInsideNav = e.target.closest('.nav-links') || e.target.closest('.nav-menu-btn') || e.target.closest('.nav-toggle');
        if (!clickedInsideNav) setMenu(false);
    });

    // Animate skill meters when in view
    function animateSkillMeters() {
        const skillMeters = document.querySelectorAll('.meter-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const meter = entry.target;
                    const width = meter.getAttribute('data-level');
                    
                    // Animate the meter
                    setTimeout(() => {
                        meter.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        meter.style.width = width + '%';
                    }, 300);
                    
                    observer.unobserve(meter);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        skillMeters.forEach(meter => {
            observer.observe(meter);
        });
    }
    
    // Animate project cards on scroll
    function animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card-3d');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        // Show/hide back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Navbar scroll effect
        const navbar = document.querySelector('.nav-3d');
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(5, 5, 16, 0.95)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'rgba(10, 10, 26, 0.9)';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                this.reset();
            }, 3000);
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip for # only
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const lines = menuBtn.querySelectorAll('.menu-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize animations
    animateSkillMeters();
    animateProjectCards();
    
    // Typewriter effect for hero text
    const textLines = document.querySelectorAll('.text-line');
    textLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5 + 0.3}s`;
    });
    
    // Add hover effect to skill cubes
    const skillCubes = document.querySelectorAll('.skill-cube');
    skillCubes.forEach(cube => {
        cube.addEventListener('mouseenter', () => {
            cube.style.transition = 'transform 0.5s';
        });
    });
    
    // Update current year in footer
    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-copy p').innerHTML = 
        document.querySelector('.footer-copy p').innerHTML.replace('2024', currentYear);
});