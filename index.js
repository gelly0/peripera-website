// Product database (IDs & information)
const productMap = {
    'ink-velvet-tint': { name: 'Ink the Velvet Lip Tint', price: 59.99, imageFile: '01.png' },
    'ink-mood-glowy-tint': { name: 'Peripera Ink Mood Glowy Tint', price: 39.00, imageFile: '02.png' },
    'ink-airy-velvet-tint': { name: 'Peripera Ink Airy Velvet Lip Tint', price: 37.00, imageFile: '03.png' },
    'peripera-syrupy-tok': { name: 'Peripera Syrupy Tok', price: 94.96, imageFile: '04.png' },
    'ink-glasting-lip-gloss': { name: 'Peripera Ink Glasting Lip Gloss', price: 34.00, imageFile: '05.png' },
    'ink-peel-off-lip-stain': { name: 'Peripera Ink Peel Off Lip Stain', price: 26.00, imageFile: '06.png' },
    // Shop page products
    'glowy-01': { name: 'Ink Mood Glowy Tint', price: 57.00, imageFile: '11.png' },
    'glowy-02': { name: 'Ink Mood Glowy Tint', price: 50.46, imageFile: '12.png' },
    'glowy-03': { name: 'Ink Mood Glowy Tint', price: 57.00, imageFile: '13.png' },
    'glowy-04': { name: 'Ink Mood Glowy Tint', price: 55.00, imageFile: '14.png' },
    'shadow-palette': { name: 'Ink Pocket Shadow Palette', price: 84.98, imageFile: '15.png' },
    'glowy-05': { name: 'Ink Mood Glowy Tint', price: 47.00, imageFile: '16.png' },
    'glowy-06': { name: 'Ink Mood Glowy Tint', price: 47.00, imageFile: '17.png' },
    'glowy-07': { name: 'Ink Mood Glowy Tint', price: 50.46, imageFile: '18.png' },
    'velvet-17': { name: 'Peripera Ink the Velvet Lip Tint', price: 59.99, imageFile: '19.png' },
    'velvet-21': { name: 'Peripera Ink the Velvet Lip Tint', price: 59.99, imageFile: '20.png' },
    'jellable-01': { name: 'Peripera Ink Jellable Tint', price: 65.18, imageFile: '21.png' },
    'slip-on-01': { name: 'Peripera Slip On My Lip', price: 37.00, imageFile: '22.png' },
    'peel-off-01': { name: 'Peripera Ink Peel Off Lip Stain', price: 26.00, imageFile: '23.png' },
    'blush-01': { name: 'Pure Blushed Sunshine Cheek Blush', price: 59.72, imageFile: '24.png' },
    'freckle-01': { name: 'Peripera Freckle Pen', price: 37.00, imageFile: '25.png' },
    'syrupy-02': { name: 'Peripera Syrupy Tok', price: 94.96, imageFile: '26.png' }
};

// DOM elements for cart functionality 
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmptyMessage = document.getElementById('cart-empty-message');
const cartSummaryModal = document.getElementById('cart-summary-modal');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');

// DOM elements for auth functionality
const authCard = document.querySelector('.auth-card'); 
const signupBtn = document.querySelector('.btn-signup-nav'); 
const navLinks = document.querySelectorAll('.nav-links-container a'); 

// Cart functions
function loadCart() {
    const storedCart = sessionStorage.getItem('shoppingCart');
    return storedCart ? JSON.parse(storedCart) : {};
}

function saveCart(cart) {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function updateCartCountDisplay() {
    const cart = loadCart();
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function openCartModal() {
    if (!cartModal) return;
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside 
window.onclick = function (event) {
    if (event.target === cartModal) closeCartModal();
};

function renderCartItems() {
    const cart = loadCart();
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    const items = Object.values(cart);

    if (items.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartSummaryModal.style.display = 'none';
        return;
    }

    cartEmptyMessage.style.display = 'none';
    cartSummaryModal.style.display = 'block';

    items.forEach(item => {
        subtotal += item.price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.imageFile}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="item-price-unit-modal">AED ${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
            </div>
        `;
    });

    cartSubtotalElement.textContent = `AED ${subtotal.toFixed(2)}`;
    cartTotalElement.textContent = `AED ${subtotal.toFixed(2)}`;
}

function addToCart(button) {
    const productId = button.getAttribute('data-product-id');
    const productData = productMap[productId];
    if (!productData) return;

    const cart = loadCart();
    if (cart[productId]) {
        cart[productId].quantity++;
    } else {
        cart[productId] = { id: productId, ...productData, quantity: 1 };
    }

    saveCart(cart);
    updateCartCountDisplay();
    showAddedFeedback(button);
}

function updateCartQuantity(productId, change) {
    const cart = loadCart();
    if (!cart[productId]) return;

    cart[productId].quantity += change;
    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }

    saveCart(cart);
    updateCartCountDisplay();
    renderCartItems();
}

function removeFromCart(productId) {
    const cart = loadCart();
    delete cart[productId];
    saveCart(cart);
    updateCartCountDisplay();
    renderCartItems();
}

function showAddedFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 600);
}

// Auth modal handling (for homepage)
if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (authCard) {
            authCard.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Navigation link handling 
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (authCard) {
            authCard.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        const target = link.getAttribute('href');
        if (target && target.startsWith('#about-us')) {
            e.preventDefault();
            const aboutSection = document.querySelector(target);
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Initialize cart count on page load 
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();
});

// Hero slider functionality 
const pages = [
    { h1: "PeriPera", h2: "Unlock Your Inner Pretty Pretty", p: "Innovative K-Beauty that brings joy and confidence to your everyday.", bgColor: "#F9CAD6" },
    { h1: "K-Beauty", h2: "The Global Trend", p: "Born in Seoul, our brand captures the fast-paced energy of modern K-Beauty.", bgColor: "#F4ACB7" },
    { h1: "Innovation", h2: "Formula First", p: "We don't just follow trends—we create them. Our Ink Velvet formula is legendary.", bgColor: "#F9CAD6" },
    { h1: "Community", h2: "Join the Family", p: "Millions of fans worldwide share their looks. Tag #Peripera to join the journey.", bgColor: "#F4ACB7" }
];

let currentSlide = 0;
let slideInterval;

function changeInfo(index) {
    currentSlide = index; 
    const container = document.getElementById('text-container');
    const rectangle = document.getElementById('info-rectangle');
    const buttons = document.querySelectorAll('.hero-dots button');

    if (!container || !rectangle) return;

    buttons.forEach(btn => btn.classList.remove('active'));
    if(buttons[index]) buttons[index].classList.add('active');

    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';

    setTimeout(() => {
        container.innerHTML = `
            <h1>${pages[index].h1}</h1>
            <h2>${pages[index].h2}</h2>
            <p>${pages[index].p}</p>
        `;
        rectangle.style.backgroundColor = pages[index].bgColor;
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 400);
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % pages.length;
        changeInfo(currentSlide);
    }, 5000); 
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Initialize page features 
document.addEventListener('DOMContentLoaded', () => {
    updateCartCountDisplay();

    // Initialize hero slider if on homepage
    if (document.getElementById('text-container')) {
        changeInfo(0);
        startAutoSlide();

        const heroSection = document.querySelector('.peripera-hero-banner');
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
});

// Sign Up & Login toggle
const signupSection = document.getElementById('signup');
const loginSection = document.getElementById('login');
const goToLogin = document.getElementById('go-to-login');

if (goToLogin) {
    goToLogin.addEventListener('click', () => {
        signupSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });
}

// Sign Up form submission
document.getElementById('signup-btn').addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const error = document.getElementById('signup-error');

    if (name && email && password) {
        try {
            const response = await fetch('http://localhost:5000/api/user/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Sign Up Successful! Redirecting to Login...');
                error.style.display = 'none';
                signupSection.classList.add('hidden');
                loginSection.classList.remove('hidden');
            } else {
                error.textContent = data.message || 'Sign Up Failed!';
                error.style.display = 'block';
            }
        } catch (err) {
            error.textContent = 'An error occurred. Please try again.';
            error.style.display = 'block';
        }
    } else {
        error.textContent = 'All fields are required!';
        error.style.display = 'block';
    }
});

// Login form submission
document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const error = document.getElementById('login-error');

    if (email && password) {
        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Welcome back, ${data.user.name}!`);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'index.html'; 
            } else {
                error.textContent = data.message || 'Invalid email or password.';
                error.style.display = 'block';
            }
        } catch (err) {
            error.textContent = 'An error occurred.';
            error.style.display = 'block';
        }
    } else {
        error.textContent = 'All fields are required!';
        error.style.display = 'block';
    }
});