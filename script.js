/**
 * LorenArt Fotografia - Script Interativo
 * Funcionalidades: Menu Mobile, Header com Blur, Filtros da Galeria,
 * Lightbox Modal, Validação de Formulário e Efeitos de Rolagem
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualização do Ano no Rodapé
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 2. Cabeçalho Dinâmico no Scroll
    const header = document.getElementById('header');
    const handleScrollHeader = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader, { passive: true });
    handleScrollHeader();

    // 3. Menu Mobile Drawer
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Fechar ao clicar em qualquer link de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // 4. Scrollspy (Destacar link da seção ativa)
    const sections = document.querySelectorAll('main section[id]');
    const updateActiveNavOnScroll = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

    // 5. Parallax Suave no Fundo da Capa
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            if (scrollPos < window.innerHeight) {
                parallaxBg.style.transform = `translate3d(0, ${scrollPos * 0.28}px, 0) scale(1.05)`;
            }
        }, { passive: true });
    }

    // 6. Filtros Interativos da Galeria
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const fotoItems = document.querySelectorAll('.foto-item');

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza botão ativo
            filtroBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            fotoItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // 7. Lightbox Modal para Visualização em Alta Definição
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentFotoIndex = 0;
    let visibleFotos = [];

    const updateVisibleFotos = () => {
        visibleFotos = Array.from(fotoItems).filter(item => !item.classList.contains('hide'));
    };

    const showLightboxAt = (index) => {
        updateVisibleFotos();
        if (visibleFotos.length === 0) return;

        if (index < 0) index = visibleFotos.length - 1;
        if (index >= visibleFotos.length) index = 0;
        currentFotoIndex = index;

        const targetItem = visibleFotos[currentFotoIndex];
        const img = targetItem.querySelector('img');
        const title = targetItem.getAttribute('data-title') || '';
        const desc = targetItem.getAttribute('data-desc') || '';
        const categoryBadge = targetItem.querySelector('.foto-badge');
        const category = categoryBadge ? categoryBadge.textContent : '';

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        lightboxCategory.textContent = category;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Abertura ao clicar no card ou no botão de zoom
    fotoItems.forEach(item => {
        const card = item.querySelector('.foto-card');
        if (card) {
            card.addEventListener('click', () => {
                updateVisibleFotos();
                const index = visibleFotos.indexOf(item);
                if (index !== -1) {
                    showLightboxAt(index);
                }
            });
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxAt(currentFotoIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxAt(currentFotoIndex + 1);
        });
    }

    // Fechar ao clicar no fundo escuro
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Navegação por teclado (ESC para fechar, setas para navegar)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showLightboxAt(currentFotoIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showLightboxAt(currentFotoIndex + 1);
        }
    });

    // 8. Envio do Formulário de Contato com Feedback em Tempo Real
    const formContato = document.getElementById('formContato');
    const btnEnviar = document.getElementById('btnEnviar');
    const toast = document.getElementById('toastNotification');

    const showToast = () => {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    };

    if (formContato && btnEnviar) {
        formContato.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ativa estado de carregamento do botão
            btnEnviar.classList.add('loading');
            btnEnviar.disabled = true;

            // Simula envio assíncrono para o servidor
            setTimeout(() => {
                btnEnviar.classList.remove('loading');
                btnEnviar.disabled = false;
                formContato.reset();
                showToast();
            }, 1000);
        });
    }

    // 9. Voltar ao Topo Suave
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
