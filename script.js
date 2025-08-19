// Header background effect on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 100) {
        header.style.background = 'rgba(30, 74, 140, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Smooth scrolling for anchor links
Array.from(document.querySelectorAll('a[href^="#"]')).forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for cards (features, services, products, categories)
(function initCommonObserver() {
    if (!('IntersectionObserver' in window)) return;
    const cards = document.querySelectorAll('.feature-card, .service-card, .category-card, .product-card');
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
})();

// Vehículos: Modal functionality
(function initVehiclesModalAndForm() {
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const vehicleInterest = document.getElementById('vehicleInterest');

    let currentVehicle = '';

    function openModal(vehicleName) {
        if (!contactModal || !vehicleInterest) return;
        currentVehicle = vehicleName || '';
        vehicleInterest.textContent = `Estoy interesado/a en: ${currentVehicle}`;
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!contactModal) return;
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Expose globally for onclick handlers
    window.openModal = openModal;
    window.closeModal = closeModal;

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (contactModal && event.target === contactModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                vehiculo: currentVehicle,
                nombre: (document.getElementById('nombre') || {}).value,
                email: (document.getElementById('email') || {}).value,
                telefono: (document.getElementById('telefono') || {}).value,
                tipoCliente: (document.getElementById('tipoCliente') || {}).value,
                consulta: (document.getElementById('consulta') || {}).value,
                mensaje: (document.getElementById('mensaje') || {}).value
            };

            console.log('Form data:', formData);
            const numero = "34602256248";
            const mensaje = `
                Nombre: ${formData.nombre}\n
                Email: ${formData.email}\n
                Teléfono: ${formData.telefono}\n
                Tipo de cliente: ${formData.tipoCliente}\n
                Consulta: ${formData.consulta}\n
                Mensaje: ${formData.mensaje}
            `;
            window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
//            alert('¡Gracias por tu consulta! Un asesor de ventas se contactará en las próximas 24 horas.');
            closeModal();
            contactForm.reset();
        });
    }
})();

// Vehículos: Filters
(function initVehicleFilters() {
    const tipo = document.getElementById('tipo');
    const marca = document.getElementById('marca');
    const precio = document.getElementById('precio');

    if (!tipo || !marca || !precio) return;

    function filterVehicles() {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        const vehiclesGrid = document.getElementById('vehiclesGrid');
        const noResults = document.getElementById('noResults');
        let visibleCount = 0;

        vehicleCards.forEach(card => {
            const cardTipo = card.getAttribute('data-tipo');
            const cardMarca = card.getAttribute('data-marca');
            const cardPrecio = card.getAttribute('data-precio');

            const tipoMatch = !tipo.value || cardTipo === tipo.value;
            const marcaMatch = !marca.value || cardMarca === marca.value;
            const precioMatch = !precio.value || cardPrecio === precio.value;

            if (tipoMatch && marcaMatch && precioMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (!vehiclesGrid || !noResults) return;
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            vehiclesGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            vehiclesGrid.style.display = 'grid';
        }
    }

    [tipo, marca, precio].forEach(filter => filter.addEventListener('change', filterVehicles));
})();

// Vehículos: Intersection Observer for vehicle cards
(function initVehicleCardsObserver() {
    if (!('IntersectionObserver' in window)) return;
    const cards = document.querySelectorAll('.vehicle-card');
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
})();

// Accesorios: minimal cart handler to avoid undefined function errors
(function initAddToCartStub() {
    if (!window.addToCart) {
        window.addToCart = function(productName, price) {
            console.log('Producto agregado:', { productName, price });
            alert(`Se agregó "${productName}" al carrito.`);
        };
    }
})();

// Accesorios: cart and filters logic
(function initAccessoriesPage() {
    const cartSummary = document.getElementById('cartSummary');
    if (!cartSummary) return;

    let cart = [];
    let cartVisible = false;

    function updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (!cartCount || !cartItems || !cartTotal) return;

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <button data-remove="${item.name}" style="background: #ef4444; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">×</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartItems.querySelectorAll('button[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-remove')));
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: ${total.toLocaleString()}`;
    }

    function toggleCart() {
        const summary = document.getElementById('cartSummary');
        if (!summary) return;
        cartVisible = !cartVisible;
        summary.classList.toggle('show', cartVisible);
    }

    function showCartMessage(productName) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-yellow);
            color: var(--primary-blue);
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        message.textContent = `${productName} agregado al pedido`;
        document.body.appendChild(message);
        setTimeout(() => { if (message.parentNode) message.parentNode.removeChild(message); }, 3000);
    }

    function addToCart(productName, price) {
        if (typeof price !== 'number') price = Number(price) || 0;
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price, quantity: 1 });
        }
        updateCartDisplay();
        showCartMessage(productName);
        if (!cartVisible) toggleCart();
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCartDisplay();
    }

    function contactForPurchase() {
        if (cart.length === 0) {
            alert('Tu pedido está vacío. Agregá productos antes de contactarnos.');
            return;
        }
        const cartDetails = cart.map(item => `• ${item.name} - Cantidad: ${item.quantity} - ${(item.price * item.quantity).toLocaleString()}`).join('\n');
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Serás redirigido para contactar con un asesor.\n\nResumen de tu pedido:\n${cartDetails}\n\nTotal: ${total.toLocaleString()} pesos argentinos`);
        const numero = "34602256248";
        const mensaje = `
            Hola, quiero comprar los siguientes productos:
            ${cartDetails}
            Total: ${total.toLocaleString()} pesos argentinos
        `;
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }

    // Expose globals
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.toggleCart = toggleCart;
    window.contactForPurchase = contactForPurchase;

    // Filters (buttons and category cards)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const searchInput = document.getElementById('productsSearch');

    let currentFilter = 'all';
    let currentSearch = '';

    function normalize(text) {
        return (text || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function applyProductsFilter() {
        const search = normalize(currentSearch);
        productCards.forEach(card => {
            const category = (card.getAttribute('data-category') || '').toLowerCase();
            const title = (card.querySelector('h3') || {}).textContent || '';
            const desc = (card.querySelector('.product-description') || {}).textContent || '';
            const catText = (card.querySelector('.product-category') || {}).textContent || '';
            const haystack = normalize(`${title} ${desc} ${catText} ${category}`);

            const matchesCategory = (currentFilter === 'all') || (category === currentFilter);
            const matchesSearch = !search || haystack.includes(search);

            card.style.display = (matchesCategory && matchesSearch) ? 'block' : 'none';
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.getAttribute('data-filter') || 'all';
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyProductsFilter();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value || '';
            applyProductsFilter();
        });
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === category) btn.click();
            });
            const productsSection = document.querySelector('.products-section');
            if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const summary = document.getElementById('cartSummary');
        const isInsideCart = summary && summary.contains(e.target);
        const isAddButton = (e.target && (e.target.classList && e.target.classList.contains('add-cart-button')));
        const isToggle = (e.target && (e.target.classList && e.target.classList.contains('cart-toggle')));
        if (cartVisible && !isInsideCart && !isAddButton && !isToggle) {
            toggleCart();
        }
    });

    // Initial apply
    applyProductsFilter();
})(); 