document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu');

    const closeMobileMenu = () => {
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.innerHTML = '&#9776;';
    };

    if (mobileMenuBtn && mobileMenuOverlay) {
        // Open / Close toggle
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.toggle('active');
            mobileMenuBtn.innerHTML = mobileMenuOverlay.classList.contains('active') ? '&#10005;' : '&#9776;';
        });

        // Dedicated close button inside overlay
        const closeBtn = document.getElementById('mobile-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMobileMenu);
        }

        // Event delegation — catches clicks on ANY child (links, buttons, etc.)
        mobileMenuOverlay.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (target && target.id !== 'mobile-close-btn') {
                e.preventDefault(); // prevent instant jump
                const href = target.getAttribute('href');
                closeMobileMenu();
                // Wait for overlay slide-out animation (400ms) then navigate
                setTimeout(() => {
                    if (href && href.startsWith('#')) {
                        const section = document.querySelector(href);
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                    } else if (href) {
                        window.location.href = href;
                    }
                }, 350);
            }
        });
    }

    // --- Arc Gallery Generation ---
    const arcPivot = document.getElementById('arc-pivot');
    if (arcPivot) {
        const arcImages = [
            'assets/after-1.jpeg',
            'assets/after-2.jpeg',
            'assets/after-3.jpeg',
            'assets/after-4.jpeg',
            'assets/after-5.jpeg',
            'assets/after-6.jpeg',
            'assets/after-7.jpeg',
            'assets/after-8.jpeg',
            'assets/after-9.jpeg',
            'assets/after-10.jpeg',
            'assets/after-11.jpeg',
            'assets/after-12.jpeg'
        ];

        const renderArc = () => {
            arcPivot.innerHTML = '';
            
            let radius = 480;
            let cardSize = 120;
            const width = window.innerWidth;
            
            if (width < 640) {
                radius = 260; cardSize = 80;
            } else if (width < 1024) {
                radius = 360; cardSize = 100;
            } else {
                radius = 480; cardSize = 120;
            }

            // Also dynamically control the wrapper height based on radius so layout flows properly
            const arcWrapper = document.getElementById('arc-wrapper');
            if (arcWrapper) {
                arcWrapper.style.height = `${radius * 1.2}px`;
            }

            const startAngle = 20;
            const endAngle = 160;
            const count = arcImages.length;
            const step = (endAngle - startAngle) / (count - 1);

            arcImages.forEach((src, i) => {
                const angle = startAngle + step * i;
                const angleRad = (angle * Math.PI) / 180;
                
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                const wrapper = document.createElement('div');
                wrapper.className = 'arc-item animate-arc-up';
                wrapper.style.width = `${cardSize}px`;
                wrapper.style.height = `${cardSize}px`; /* Force perfectly square */
                wrapper.style.left = `calc(50% + ${x}px)`;
                wrapper.style.bottom = `${y}px`;
                wrapper.style.transform = `translate(-50%, 50%)`;
                wrapper.style.animationDelay = `${i * 100}ms`;
                wrapper.style.zIndex = count - i;

                const card = document.createElement('div');
                card.className = 'arc-card';
                card.style.width = '100%';
                card.style.height = '100%';
                card.style.transform = `rotate(${angle / 4}deg)`;

                const img = document.createElement('img');
                img.src = src;

                card.appendChild(img);
                wrapper.appendChild(card);
                arcPivot.appendChild(wrapper);
            });
        };

        renderArc();
        window.addEventListener('resize', renderArc);
    }
    // --- Navbar & Back to Top Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const topBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to Top Button Visibility
        if (topBtn) {
            if (window.scrollY > 500) {
                topBtn.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
            }
        }
    });

    // Scroll back to top on click
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's the demo container, trigger the grid animation
                if (entry.target.classList.contains('demo-container')) {
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, 500);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .demo-container').forEach(el => {
        observer.observe(el);
    });

    // --- Before/After Slider Logic ---
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(sliderContainer => {
        const sliderBefore = sliderContainer.querySelector('.slider-before');
        const sliderHandle = sliderContainer.querySelector('.slider-handle');

        if (sliderBefore && sliderHandle) {
            let isDragging = false;

            const updateSlider = (xPosition) => {
                const rect = sliderContainer.getBoundingClientRect();
                let percentage = ((xPosition - rect.left) / rect.width) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                
                sliderBefore.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                sliderHandle.style.left = `${percentage}%`;
            };

            const startDrag = () => { isDragging = true; };
            const stopDrag = () => { isDragging = false; };
            const moveDrag = (e) => {
                if (isDragging) {
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    updateSlider(clientX);
                }
            };

            sliderHandle.addEventListener('mousedown', startDrag);
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('mousemove', moveDrag);

            sliderHandle.addEventListener('touchstart', startDrag, {passive: true});
            window.addEventListener('touchend', stopDrag);
            window.addEventListener('touchmove', moveDrag, {passive: true});
        }
    });




    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    if (themeBtn) {
        themeBtn.innerHTML = sunIcon;
        // Check saved preference
        const savedTheme = localStorage.getItem('rengen-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeBtn.innerHTML = moonIcon;
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            
            themeBtn.innerHTML = isLight ? moonIcon : sunIcon;
            localStorage.setItem('rengen-theme', isLight ? 'light' : 'dark');

            // Update mobile menu background if it's open
            if(navLinks.style.display === 'flex') {
                navLinks.style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(5, 5, 10, 0.95)';
            }
        });
    }



});
