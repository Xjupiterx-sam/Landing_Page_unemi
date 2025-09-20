document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    const scrollTop = document.querySelector('.scroll-to-top');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }
    
    fadeElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('active');
        }
    });
    
    function handleScrollAnimations() {
        fadeElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        if (window.scrollY > 300) {
            scrollTop.classList.add('active');
        } else {
            scrollTop.classList.remove('active');
        }
    }

    window.addEventListener('scroll', handleScrollAnimations);

    scrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; 
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;

            clearAllErrors();

            if (!validateName()) isValid = false;

            if (!validateEmail()) isValid = false;

            if (!validateSubject()) isValid = false;

            if (!validateMessage()) isValid = false;

            if (isValid) {
                processFormSubmission();
            }
        });

        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        subjectInput.addEventListener('blur', validateSubject);
        messageInput.addEventListener('blur', validateMessage);

        nameInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeError(this);
            }
        });
        
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(this.value.trim())) {
                removeError(this);
            }
        });
        
        subjectInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeError(this);
            }
        });
        
        messageInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                removeError(this);
            }
        });
    }

    function validateName() {
        const value = nameInput.value.trim();
        if (value === '') {
            showError(nameInput, 'Por favor ingresa tu nombre completo');
            return false;
        }
        if (value.length < 2) {
            showError(nameInput, 'El nombre debe tener al menos 2 caracteres');
            return false;
        }
        removeError(nameInput);
        return true;
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(emailInput, 'Por favor ingresa tu correo electrónico');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, 'Por favor ingresa un email válido');
            return false;
        }
        removeError(emailInput);
        return true;
    }
    
    function validateSubject() {
        const value = subjectInput.value.trim();
        if (value === '') {
            showError(subjectInput, 'Por favor ingresa el asunto del mensaje');
            return false;
        }
        if (value.length < 5) {
            showError(subjectInput, 'El asunto debe tener al menos 5 caracteres');
            return false;
        }
        removeError(subjectInput);
        return true;
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        if (value === '') {
            showError(messageInput, 'Por favor ingresa tu mensaje');
            return false;
        }
        if (value.length < 5) {
            showError(messageInput, 'El mensaje debe tener al menos 5 caracteres');
            return false;
        }
        removeError(messageInput);
        return true;
    }

    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function removeError(input) {
        input.classList.remove('is-invalid');
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    function clearAllErrors() {
        const inputs = [nameInput, emailInput, subjectInput, messageInput];
        inputs.forEach(input => {
            removeError(input);
        });
    }
    
    function processFormSubmission() {
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim(),
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        console.log('Datos del formulario:', formData);
        
        let existingMessages = [];
        try {
            existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        } catch (e) {
            console.warn('Error al recuperar mensajes del localStorage:', e);
            existingMessages = [];
        }
        
        existingMessages.push(formData);
        
        try {
            localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
            console.log('Mensaje guardado exitosamente');
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
        }
        
        showSuccessMessage();
        
        contactForm.reset();
        clearAllErrors();
    }
    
    function showSuccessMessage() {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        
        formSuccess.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            formSuccess.classList.remove('show');
            contactForm.style.display = 'block';
        }, 5000);
    }
    
    function handleResize() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
    
    window.getContactMessages = function() {
        try {
            const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            console.table(messages);
            return messages;
        } catch (e) {
            console.error('Error al recuperar mensajes:', e);
            return [];
        }
    };
    window.clearContactMessages = function() {
        try {
            localStorage.removeItem('contactMessages');
            console.log('Todos los mensajes han sido eliminados');
        } catch (e) {
            console.error('Error al limpiar mensajes:', e);
        }
    };
    
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            if (isInViewport(stat) && !stat.classList.contains('animated')) {
                stat.classList.add('animated');
                const finalNumber = stat.textContent;
                const isPlus = finalNumber.includes('+');
                const isMega = finalNumber.includes('M');
                
                let numericValue = parseInt(finalNumber.replace(/[+M]/g, ''));
                let current = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = Math.floor(current);
                    if (isMega) displayValue += 'M';
                    if (isPlus) displayValue += '+';
                    
                    stat.textContent = displayValue;
                }, 40);
            }
        });
    }
    
    window.addEventListener('scroll', animateNumbers);
    
    animateNumbers();
    console.log('JavaScript cargado correctamente - Banco Pichincha Website');
});