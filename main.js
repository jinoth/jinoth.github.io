document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Remove loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);

    // Typing effect
    const texts = [
        "Data Analyst",
        "AWS & Azure Expert",
        "JLPT N2 Certified",
        "AI & Data Science Enthusiast"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextSpan = document.querySelector('.typed-text');

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        const typingSpeed = isDeleting ? 100 : 200;
        setTimeout(type, typingSpeed);
    }

    type();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        themeToggle.querySelector('i').classList.toggle('fa-sun');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
    });

    // Current date and time
    function updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric', 
            hour12: true 
        };
        document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formStatus = document.getElementById('formStatus');
            const submitButton = e.target.querySelector('button');
            submitButton.disabled = true;
            
            try {
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                };

                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                if (data.success) {
                    showPopup();
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.textContent = 'Failed to send message. Please try again.';
                formStatus.className = 'error';
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Add these functions for popup handling
    function showPopup() {
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('messagePopup');
        
        if (overlay && popup) {
            overlay.classList.add('show');
            popup.classList.add('show');
        }
    }

    function closePopup() {
        const overlay = document.getElementById('overlay');
        const popup = document.getElementById('messagePopup');
        
        if (overlay && popup) {
            overlay.classList.remove('show');
            popup.classList.remove('show');
        }
    }

    // Close popup when clicking overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closePopup);
    }

    // Close popup when clicking close button
    const closeButton = document.querySelector('.popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('messagePopup').classList.contains('show')) {
            closePopup();
        }
    });

    // Translation data
    const translations = {
        en: {
            "nav-about": "About",
            "nav-experience": "Experience",
            "nav-skills": "Skills",
            "nav-education": "Education",
            "hero-title": "Hi, I'm Jinoth Kumar",
            "hero-subtitle": "Data Analyst & IT Engineer",
            "hero-description": "Specializing in data analytics, business intelligence, and cloud solutions. Bridging technology and business needs with innovative solutions.",
            "contact-btn": "Get in Touch",
            "download-cv": "Download CV",
            // Add more translations as needed
        },
        ja: {
            "nav-about": "概要",
            "nav-experience": "職務経歴",
            "nav-skills": "スキル",
            "nav-education": "学歴",
            "hero-title": "はじめまして、ジノス・クマールです",
            "hero-subtitle": "データアナリスト & ITエンジニア",
            "hero-description": "データ分析、ビジネスインテリジェンス、クラウドソリューションを専門としています。技術とビジネスニーズを革新的なソリューションで結びつけます。",
            "contact-btn": "お問い合わせ",
            "download-cv": "履歴書をダウンロード",
            // Add more translations as needed
        }
    };

    // Language switching functionality
    function changeLanguage(lang) {
        // Update active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(lang)) {
                btn.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Store language preference
        localStorage.setItem('preferred-language', lang);
    }

    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navRight = document.querySelector('.nav-right');
        
        if (navToggle && navRight) {
            navToggle.addEventListener('click', () => {
                navRight.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Set initial language
        const savedLang = localStorage.getItem('preferred-language') || 'en';
        changeLanguage(savedLang);
    });
});
