document.addEventListener('DOMContentLoaded', function() {
    // Dados do portfólio
    const portfolioData = {
        1: {
            title: "Delicada Fine Line",
            category: "fine-line",
            description: "Uma tatuagem delicada em fine line no braço, representando a beleza da simplicidade e elegância. O traço fino e preciso cria uma obra de arte minimalista que se integra perfeitamente à anatomia do cliente.",
            images: [
                "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1611501275020-9b5cda994e8d?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1611501275021-9b5cda994e8d?auto=format&fit=crop&w=800"
            ],
            specs: {
                style: "Fine Line",
                duration: "2-3 horas",
                healing: "2-3 semanas"
            }
        },
        2: {
            title: "Traços Minimalistas",
            category: "minimalista",
            description: "Uma composição minimalista no pulso que combina elementos geométricos simples com traços orgânicos. A tatuagem demonstra como menos pode ser mais, criando um impacto visual forte com elementos sutis.",
            images: [
                "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1562962231-16e4623d36e6?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1562962232-16e4623d36e6?auto=format&fit=crop&w=800"
            ],
            specs: {
                style: "Minimalista",
                duration: "1-2 horas",
                healing: "2 semanas"
            }
        },
        3: {
            title: "Jardim Secreto",
            category: "floral",
            description: "Uma composição floral delicada na costela que combina diferentes espécies de flores em um arranjo harmonioso. A tatuagem cria um efeito de movimento e profundidade, transformando a área em um jardim eterno.",
            images: [
                "https://images.unsplash.com/photo-1610634798744-3ba3198b3930?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1610634798745-3ba3198b3930?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1610634798746-3ba3198b3930?auto=format&fit=crop&w=800"
            ],
            specs: {
                style: "Floral",
                duration: "3-4 horas",
                healing: "3-4 semanas"
            }
        },
        4: {
            title: "Padrões Geométricos",
            category: "geometrica",
            description: "Uma tatuagem geométrica no ombro que explora a interação entre diferentes formas e padrões. A composição cria um efeito visual intrigante que se transforma conforme o movimento do corpo.",
            images: [
                "https://images.unsplash.com/photo-1611501267509-fd8cf7c2f9a5?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1611501267510-fd8cf7c2f9a5?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1611501267511-fd8cf7c2f9a5?auto=format&fit=crop&w=800"
            ],
            specs: {
                style: "Geométrica",
                duration: "2-3 horas",
                healing: "2-3 semanas"
            }
        },
        5: {
            title: "Palavras Eternas",
            category: "escrita",
            description: "Uma tatuagem de escrita no antebraço que combina elegância e significado pessoal. A caligrafia foi especialmente escolhida para refletir a personalidade do cliente e o significado das palavras.",
            images: [
                "https://images.unsplash.com/photo-1578301978069-45264734cddc?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1578301978070-45264734cddc?auto=format&fit=crop&w=800",
                "https://images.unsplash.com/photo-1578301978071-45264734cddc?auto=format&fit=crop&w=800"
            ],
            specs: {
                style: "Escrita",
                duration: "1-2 horas",
                healing: "2 semanas"
            }
        }
    };

    // Elementos DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolioModal');
    const closeModal = document.querySelector('.close-modal');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');

    // Função para filtrar itens
    function filterItems(category) {
        portfolioItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Função para mostrar detalhes no modal
    function showDetails(itemId) {
        const item = portfolioData[itemId];
        if (!item) return;

        // Atualizar conteúdo do modal
        document.querySelector('.modal-title').textContent = item.title;
        document.querySelector('.modal-style').textContent = item.specs.style;
        document.querySelector('.modal-duration').textContent = item.specs.duration;
        document.querySelector('.modal-healing').textContent = item.specs.healing;
        document.querySelector('.modal-description p').textContent = item.description;

        // Atualizar imagens
        const mainImage = document.querySelector('.modal-main-image');
        const thumbnailsContainer = document.querySelector('.modal-thumbnails');
        
        mainImage.src = item.images[0];
        mainImage.alt = item.title;

        // Limpar e adicionar thumbnails
        thumbnailsContainer.innerHTML = '';
        item.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `${item.title} - Imagem ${index + 1}`;
            thumbnail.addEventListener('click', () => {
                mainImage.src = image;
            });
            thumbnailsContainer.appendChild(thumbnail);
        });

        // Mostrar modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            // Filtrar itens
            filterItems(button.dataset.filter);
        });
    });

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            showDetails(itemId);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Animação de entrada dos itens
    function showPortfolioItems() {
        portfolioItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Inicializar animação
    showPortfolioItems();
}); 