// ========== MENÚ HAMBURGUESA ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ========== SCROLL SUAVE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ========== ANIMACIONES AL HACER SCROLL ==========
const revealElements = document.querySelectorAll('.proyecto-card, .servicio');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
revealOnScroll();

// ========== VALIDACIÓN DE EMAIL ==========
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== FUNCIÓN PARA ABRIR WHATSAPP ==========
function openWhatsApp(formData) {
    const phoneNumber = '573218228344';
    
    let message = `¡Hola! Me interesa una landing page para mi negocio.%0A%0A`;
    message += `*Datos de contacto:*%0A`;
    message += `Nombre: ${formData.nombre}%0A`;
    message += `Email: ${formData.email}%0A`;
    if (formData.telefono) message += `Teléfono: ${formData.telefono}%0A`;
    if (formData.servicio && formData.servicio !== '') message += `Servicio: ${formData.servicio}%0A`;
    message += `%0A*Mensaje:*%0A${formData.mensaje}`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// ========== MOSTRAR MENSAJE EN EL FORMULARIO ==========
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        // Agregar ícono según el tipo
        const icon = type === 'success' ? '✅ ' : '❌ ';
        messageDiv.innerHTML = icon + message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll suave hasta el mensaje
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-esconder después de 6 segundos
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.display = 'none';
                messageDiv.style.opacity = '1';
            }, 300);
        }, 6000);
    }
}

function resetForm(form) {
    if (form) {
        form.reset();
    }
}

// ========== FORMULARIO DE CONTACTO ==========
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const telefono = document.getElementById('telefono')?.value.trim() || '';
        const servicio = document.getElementById('servicio')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';
        
        let hasError = false;
        
        if (!nombre) {
            showFormMessage('Por favor, ingresa tu nombre', 'error');
            hasError = true;
        } else if (!email) {
            showFormMessage('Por favor, ingresa tu email', 'error');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFormMessage('Por favor, ingresa un email válido', 'error');
            hasError = true;
        } else if (!mensaje) {
            showFormMessage('Por favor, cuéntame sobre tu negocio', 'error');
            hasError = true;
        }
        
        if (hasError) {
            e.preventDefault();
            return false;
        }
        
        const formData = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            servicio: servicio,
            mensaje: mensaje
        };
        
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 3000);
        }
        
        setTimeout(() => {
            openWhatsApp(formData);
        }, 100);
        
        setTimeout(() => {
            showFormMessage('¡Mensaje enviado con éxito! Revisa WhatsApp o tu correo. Te contacto en menos de 2 horas.', 'success');
        }, 200);
        
        setTimeout(() => {
            resetForm(contactForm);
        }, 500);
        
        return true;
    });
}

// ========== PROYECTOS: DEMO ==========
document.querySelectorAll('.ver-proyecto').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        
        // Si el enlace es "#" o está vacío, mostrar demo
        if (!href || href === '#' || href === '') {
            e.preventDefault();
            const proyectoNombre = btn.getAttribute('data-proyecto') || 'este proyecto';
            showFormMessage(`✨ "${proyectoNombre}" es una demo. Si te gusta, contáctame y creo una para tu negocio.`, 'success');
            
            const contactSection = document.getElementById('contacto');
            if (contactSection) {
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            }
        }
        // Si tiene una URL real, NO hace nada (el enlace funciona normal)
    });
});

// ========== CARGAR AÑO ACTUAL EN FOOTER ==========
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// ========== CERRAR MENÚ CON ESC ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// ========== PREVENIR ENVÍOS DUPLICADOS ==========
let isSubmitting = false;

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            showFormMessage('Ya estamos procesando tu mensaje. Espera un momento...', 'error');
            return false;
        }
        
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';
        
        if (nombre && email && isValidEmail(email) && mensaje) {
            isSubmitting = true;
            setTimeout(() => {
                isSubmitting = false;
            }, 5000);
        }
    });
}

// ========== VALIDACIÓN EN TIEMPO REAL ==========
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#ff6b6b';
            showFormMessage('Formato de email inválido', 'error');
        } else {
            this.style.borderColor = 'rgba(255,255,255,0.1)';
        }
    });
}

// ========== DETECTAR SI ESTAMOS EN LOCAL (OPCIONAL) ==========
function isLocalHost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
}

// Mostrar mensaje en consola si está en local
if (isLocalHost()) {
    console.log('🔧 Modo local - FormSubmit funcionará cuando subas a Netlify');
}