// ========== VARIABLES GLOBALES ==========
let isSubmitting = false;
let scrollTimeout;

// ========== UTILIDADES ==========
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isLocalHost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
}

// ========== MANEJO DE MENSAJES ==========
function showFormMessage(message, type, duration = 6000) {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    // Limpiar timeout anterior si existe
    if (window.messageTimeout) clearTimeout(window.messageTimeout);
    
    // Iconos según el tipo
    const icons = {
        success: '✅ ',
        error: '❌ ',
        warning: '⚠️ ',
        info: 'ℹ️ '
    };
    
    messageDiv.innerHTML = icons[type] || '' + message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    messageDiv.style.opacity = '1';
    
    // Scroll suave hasta el mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-esconder después de la duración especificada
    window.messageTimeout = setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.style.opacity = '1';
        }, 300);
    }, duration);
}

// ========== RESET FORMULARIO ==========
function resetForm(form) {
    if (form) {
        form.reset();
        // Resetear estilos de validación
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'rgba(255,255,255,0.1)';
        });
    }
}

// ========== ENVÍO A FORMULARIO (CORREO) ==========
async function submitToFormSubmit(formData) {
    const formDataObj = new FormData();
    
    formDataObj.append('nombre', formData.nombre);
    formDataObj.append('email', formData.email);
    formDataObj.append('telefono', formData.telefono);
    formDataObj.append('servicio', formData.servicio);
    formDataObj.append('mensaje', formData.mensaje);
    formDataObj.append('_captcha', 'false');
    formDataObj.append('_subject', 'Nuevo cliente desde tu portafolio');
    
    try {
        const response = await fetch('https://formsubmit.co/gutierrezalvaradoyezith@gmail.com', {
            method: 'POST',
            body: formDataObj
        });
        
        if (response.ok) {
            return true;
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        console.error('Error al enviar a FormSubmit:', error);
        return false;
    }
}

// ========== FORMULARIO DE CONTACTO (SOLO CORREO) ==========
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Prevenir envíos duplicados
        if (isSubmitting) {
            showFormMessage('Ya estamos procesando tu mensaje. Por favor espera...', 'warning', 3000);
            return false;
        }
        
        // Obtener valores
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const telefono = document.getElementById('telefono')?.value.trim() || '';
        const servicio = document.getElementById('servicio')?.value || '';
        const mensaje = document.getElementById('mensaje')?.value.trim() || '';
        
        // Validaciones
        let hasError = false;
        
        if (!nombre) {
            showFormMessage('Por favor, ingresa tu nombre', 'error');
            hasError = true;
        } else if (!email) {
            showFormMessage('Por favor, ingresa tu email', 'error');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFormMessage('Por favor, ingresa un email válido (ejemplo: nombre@dominio.com)', 'error');
            hasError = true;
        } else if (!mensaje) {
            showFormMessage('Por favor, cuéntame sobre tu negocio', 'error');
            hasError = true;
        }
        
        if (hasError) return false;
        
        // Marcar como enviando
        isSubmitting = true;
        
        // Guardar estado original del botón
        const originalText = submitBtn?.innerHTML || 'Enviar';
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        }
        
        const formData = { nombre, email, telefono, servicio, mensaje };
        
        // ENVÍO A CORREO (FormSubmit)
        const emailSent = await submitToFormSubmit(formData);
        
        // Mostrar mensaje según resultado
        if (emailSent) {
            showFormMessage('✓ ¡Mensaje enviado con éxito! Te contactaré por correo en menos de 24 horas.', 'success', 5000);
            resetForm(contactForm);
        } else {
            showFormMessage('❌ Hubo un error al enviar el mensaje. Por favor, contáctame directamente por WhatsApp usando el botón flotante.', 'error', 8000);
        }
        
        // Restaurar botón
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
        // Resetear flag después de 5 segundos
        setTimeout(() => {
            isSubmitting = false;
        }, 5000);
        
        return false;
    });
    
    // Validación en tiempo real con debounce
    let validationTimeout;
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    this.style.borderColor = '#ff6b6b';
                } else {
                    this.style.borderColor = 'rgba(255,255,255,0.1)';
                }
            }, 500);
        });
    }
    
    // Validación en tiempo real para otros campos
    const requiredFields = ['nombre', 'mensaje'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = 'rgba(78, 205, 196, 0.5)';
                    setTimeout(() => {
                        this.style.borderColor = 'rgba(255,255,255,0.1)';
                    }, 1000);
                } else {
                    this.style.borderColor = 'rgba(255,255,255,0.1)';
                }
            });
        }
    });
}

// ========== MENÚ HAMBURGUESA ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
    if (navLinks?.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        // Restaurar scroll cuando se cierra el menú
        document.body.style.overflow = '';
    }
}

function openMenu() {
    if (navLinks && !navLinks.classList.contains('active')) {
        navLinks.classList.add('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
        // Prevenir scroll cuando el menú está abierto
        document.body.style.overflow = 'hidden';
    }
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

// ========== SCROLL SUAVE ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '' || href === 'javascript:void(0)') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 15, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            } else {
                navbar.style.background = 'rgba(15, 15, 15, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    });
}

// ========== ANIMACIONES CON INTERSECTION OBSERVER ==========
const revealElements = document.querySelectorAll('.proyecto-card, .servicio, .sobre-mi-wrapper');

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// Fallback para navegadores antiguos
if (!window.IntersectionObserver) {
    window.addEventListener('scroll', function scrollFallback() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 150) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    window.dispatchEvent(new Event('scroll'));
}

// ========== PROYECTOS DEMO ==========
document.querySelectorAll('.ver-proyecto').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        const proyectoNombre = btn.getAttribute('data-proyecto') || 'este proyecto';
        
        // Si es una demo (sin URL real)
        if (!href || href === '#' || href === '' || href === 'javascript:void(0)') {
            e.preventDefault();
            e.stopPropagation();
            
            showFormMessage(`✨ "${proyectoNombre}" es una demo. Si te gusta el diseño, contáctame y creo una página personalizada para tu negocio.`, 'info', 5000);
            
            // Scroll suave al formulario
            setTimeout(() => {
                const contactSection = document.getElementById('contacto');
                if (contactSection) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }, 2000);
        }
    });
});

// ========== FOOTER - ACTUALIZAR AÑO ==========
const footerElement = document.querySelector('.footer-bottom p');
if (footerElement) {
    const currentYear = new Date().getFullYear();
    footerElement.innerHTML = `&copy; ${currentYear} Emerson Gutierrez - Gutierrez.dev. Diseños que convierten.`;
}

// ========== CERRAR MENÚ CON ESC ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// ========== RECARGAR ANIMACIONES AL REDIMENSIONAR ==========
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.IntersectionObserver) {
            revealElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                observer.observe(el);
            });
        }
        
        // Cerrar menú en resize si está abierto y es desktop
        if (window.innerWidth > 768 && navLinks?.classList.contains('active')) {
            closeMenu();
        }
    }, 250);
});

// ========== DETECTAR SI ESTAMOS EN LOCAL ==========
if (isLocalHost()) {
    console.log('🔧 Modo local - El portafolio está funcionando correctamente');
    console.log('💡 Sugerencia: Para probar el formulario, sube a Netlify o GitHub Pages');
}

// ========== PREVENIR RECARGA DE PÁGINA CON BOTONES VACÍOS ==========
document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]').forEach(emptyLink => {
    emptyLink.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ========== AGREGAR CLASE ACTIVA AL NAVBAR EN SCROLL ==========
const sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active-link');
            }
        });
    });
}

// Añadir estilo para el enlace activo
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active-link {
        color: #4ecdc4 !important;
        position: relative;
    }
    .nav-links a.active-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
        border-radius: 2px;
    }
    @media (max-width: 768px) {
        .nav-links a.active-link::after {
            bottom: -10px;
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Portafolio cargado correctamente | Envío solo por correo');