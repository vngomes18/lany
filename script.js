// Carrossel 3D com Three.js

// Configurações do Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
renderer.setClearColor(0x000000, 0);

// Habilitar sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.getElementById('carousel-container').appendChild(renderer.domElement);

// Configurações de luz
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Luz principal frontal
const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.set(0, 5, 10);
mainLight.castShadow = true;
scene.add(mainLight);

// Spotlight principal para destaque frontal
const spotLight = new THREE.SpotLight(0xffffff, 2.0);
spotLight.position.set(0, 15, 25);
spotLight.angle = Math.PI / 3;
spotLight.penumbra = 0.2;
spotLight.decay = 1.5;
spotLight.distance = 100;
spotLight.castShadow = true;
scene.add(spotLight);

// Luzes laterais para realce
const leftLight = new THREE.PointLight(0xffffff, 1.0, 50);
leftLight.position.set(-20, 0, 0);
scene.add(leftLight);

const rightLight = new THREE.PointLight(0xffffff, 1.0, 50);
rightLight.position.set(20, 0, 0);
scene.add(rightLight);

// Criar grupo para as imagens
const group = new THREE.Group();
scene.add(group);

// Carregar texturas das imagens
const textureLoader = new THREE.TextureLoader();
const images = [
    'https://images.unsplash.com/photo-1611501275019-9b5cda9563c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610247948543-29c11f3f95d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1612451469365-6e3b4c5e9b4f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80'
];

const imageWidth = 12;
const imageHeight = 18;
const radius = 25;

// Criar planos com as imagens
images.forEach((image, index) => {
    const texture = textureLoader.load(image);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
    const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        roughness: 0.3,
        metalness: 0.2,
        reflectivity: 0.5,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.castShadow = true;
    plane.receiveShadow = true;

    const angle = (index / images.length) * Math.PI * 2;
    plane.position.x = Math.cos(angle) * radius;
    plane.position.z = Math.sin(angle) * radius;
    plane.rotation.y = -angle;

    plane.rotation.x = THREE.MathUtils.degToRad(8);
    
    group.add(plane);
});

camera.position.z = 45;
camera.position.y = 8;

// Variáveis para interação
let targetRotation = 0;
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let isDragging = false;
let autoRotate = true;
const autoRotateSpeed = 0.003;

// Event listeners para interação
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);
document.addEventListener('touchend', onDocumentTouchEnd, false);

function onDocumentMouseDown(event) {
    isDragging = true;
    autoRotate = false;
    mouseXOnMouseDown = event.clientX - window.innerWidth / 2;
    targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
    if (isDragging) {
        mouseX = event.clientX - window.innerWidth / 2;
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    }
}

function onDocumentMouseUp() {
    isDragging = false;
    setTimeout(() => {
        autoRotate = true;
    }, 2000);
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        autoRotate = false;
        mouseXOnMouseDown = event.touches[0].pageX - window.innerWidth / 2;
        targetRotationOnMouseDown = targetRotation;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - window.innerWidth / 2;
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    }
}

function onDocumentTouchEnd() {
    setTimeout(() => {
        autoRotate = true;
    }, 2000);
}

// Animação
function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
        targetRotation += autoRotateSpeed;
    }

    group.rotation.y += (targetRotation - group.rotation.y) * 0.05;

    group.children.forEach((plane) => {
        const distance = plane.position.distanceTo(camera.position);
        const angle = Math.abs(((group.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - plane.rotation.y);
        
        const scale = Math.max(0.7, 1.4 - distance * 0.02);
        plane.scale.setScalar(scale);

        plane.material.opacity = angle < Math.PI ? 1.0 : 0.4;
        plane.material.clearcoat = angle < Math.PI / 2 ? 0.5 : 0.2;
    });

    renderer.render(scene, camera);
}

// Responsividade
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
}

animate();

// Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dotsContainer = document.querySelector('.slider-dots');

let currentSlide = 0;
let autoSlideInterval;
const autoSlideDelay = 5000; // 5 segundos

// Criar dots de navegação
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

// Função para ir para um slide específico
function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

// Função para atualizar o slider
function updateSlider() {
    // Atualizar posição do slider
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Atualizar dots ativos
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // Atualizar classes active para animação
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// Função para próximo slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

// Função para slide anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

// Event listeners para botões
prevButton.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

// Controles de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
    }
});

// Controles de touch
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

slider.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
});

slider.addEventListener('touchend', () => {
    const touchDiff = touchStartX - touchEndX;
    if (Math.abs(touchDiff) > 50) { // Mínimo de movimento para considerar swipe
        if (touchDiff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        resetAutoSlide();
    }
});

// Auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Pausar auto slide quando o mouse está sobre o slider
slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

slider.addEventListener('mouseleave', startAutoSlide);

// Iniciar auto slide
startAutoSlide();

// Garantir que as imagens estejam carregadas antes de iniciar
window.addEventListener('load', () => {
    updateSlider();
});

// Portfolio Filters
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Função para mostrar itens do portfólio
function showPortfolioItems() {
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.classList.add('visible');
    });
}

// Função para filtrar itens
function filterPortfolioItems(category) {
    portfolioItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            // Mostrar item
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.classList.add('visible');
        } else {
            // Esconder item
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Event listeners para os botões de filtro
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adicionar classe active ao botão clicado
        button.classList.add('active');

        // Filtrar itens
        filterPortfolioItems(button.dataset.filter);
    });
});

// Mostrar todos os itens ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showPortfolioItems();
});

// Função para verificar se um elemento está visível na tela
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para animar itens visíveis
function animateVisibleItems() {
    portfolioItems.forEach(item => {
        if (isElementInViewport(item) && item.style.display !== 'none') {
            item.classList.add('visible');
        }
    });
}

// Observador de interseção para animar itens quando entrarem na viewport
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.style.display !== 'none') {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

// Observar todos os itens do portfólio
portfolioItems.forEach(item => {
    portfolioObserver.observe(item);
});

// Animar itens visíveis ao rolar a página
window.addEventListener('scroll', animateVisibleItems);

// Modal
const modal = document.getElementById('portfolio-modal');
const closeModal = document.querySelector('.close-modal');
const viewButtons = document.querySelectorAll('.view-details-btn');

// Dados dos trabalhos (simulação de banco de dados)
const portfolioData = {
    1: {
        title: 'Delicada Fine Line',
        images: {
            main: 'https://images.unsplash.com/photo-1611501275019-9b5cda9563c9',
            process: 'https://images.unsplash.com/photo-1611501275019-9b5cda9563c9',
            healed: 'https://images.unsplash.com/photo-1611501275019-9b5cda9563c9',
            detail: 'https://images.unsplash.com/photo-1611501275019-9b5cda9563c9'
        },
        details: {
            duration: '3 horas',
            size: '15cm',
            location: 'Braço',
            style: 'Fine Line'
        },
        description: 'Uma delicada composição em fine line que combina elementos florais com traços minimalistas. Trabalho realizado com agulhas ultrafinas para garantir os detalhes mais sutis.'
    },
    // Adicionar mais dados para outros trabalhos...
};

// Abrir modal
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const workId = button.dataset.id;
        const work = portfolioData[workId];

        // Preencher dados do modal
        document.querySelector('.modal-title').textContent = work.title;
        document.querySelector('.modal-main-image').src = work.images.main;
        document.querySelectorAll('.modal-thumb')[0].src = work.images.process;
        document.querySelectorAll('.modal-thumb')[1].src = work.images.healed;
        document.querySelectorAll('.modal-thumb')[2].src = work.images.detail;

        // Preencher detalhes
        document.querySelector('.detail-item:nth-child(1) strong').textContent = work.details.duration;
        document.querySelector('.detail-item:nth-child(2) strong').textContent = work.details.size;
        document.querySelector('.detail-item:nth-child(3) strong').textContent = work.details.location;
        document.querySelector('.detail-item:nth-child(4) strong').textContent = work.details.style;

        // Preencher descrição
        document.querySelector('.modal-description p').textContent = work.description;

        // Mostrar modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    });
});

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Trocar imagem principal ao clicar nas miniaturas
const thumbnails = document.querySelectorAll('.modal-thumb');
const mainImage = document.querySelector('.modal-main-image');

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const newSrc = thumb.src;
        const oldSrc = mainImage.src;
        
        // Animação de troca
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.style.opacity = '1';
        }, 300);

        // Atualizar miniatura
        thumb.src = oldSrc;
    });
});

// Animação de entrada dos itens do portfólio
function animatePortfolioItems() {
    portfolioItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Iniciar animação quando a página carregar
window.addEventListener('load', animatePortfolioItems);

// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Fechar menu ao redimensionar a janela
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
            }
        });
    }
});

// Scroll suave para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de fade-in para elementos
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos com classes específicas
document.querySelectorAll('.about-content, .contact-content, .portfolio-item').forEach(element => {
    fadeInObserver.observe(element);
});

// Atualizar navbar ao rolar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Galeria de imagens
const galleryItems = document.querySelectorAll('.portfolio-item');

if (galleryItems) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <img src="${item.querySelector('img').src}" alt="${item.querySelector('h3').textContent}">
                </div>
            `;

            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });
}

// Formulário de contato
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aqui você pode adicionar a lógica para enviar o formulário
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        contactForm.reset();
    });
}

// Lazy loading de imagens
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});
