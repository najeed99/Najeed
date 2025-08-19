document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const cartBtn = document.getElementById('cartBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const otpField = document.getElementById('otpField');
    const phoneNumber = document.getElementById('phoneNumber');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cartCount');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    // Cart Data
    let cart = [];
    
    // Initialize animations
    initAnimations();
    
    // Event Listeners
    loginBtn.addEventListener('click', openLoginModal);
    closeModal.addEventListener('click', closeLoginModal);
    cartBtn.addEventListener('click', openCartSidebar);
    closeCartBtn.addEventListener('click', closeCartSidebar);
    sendOtpBtn.addEventListener('click', sendOtp);
    verifyOtpBtn.addEventListener('click', verifyOtp);
    checkoutBtn.addEventListener('click', proceedToCheckout);
    
    // Add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeLoginModal();
        }
        if (event.target === cartSidebar) {
            closeCartSidebar();
        }
    });
    
    // Initialize deal timer
    initDealTimer();
    
    // Functions
    function initAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-up, .flip-animation').forEach(el => {
            observer.observe(el);
        });
    }
    
    function openLoginModal() {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLoginModal() {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function openCartSidebar() {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function sendOtp() {
        const phone = phoneNumber.value.trim();
        
        if (!phone || phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }
        
        // Simulate sending OTP
        sendOtpBtn.style.display = 'none';
        otpField.style.display = 'block';
        verifyOtpBtn.style.display = 'block';
        
        // In a real app, you would send the OTP to the user's phone
        console.log(`OTP sent to ${phone}`);
        alert(`OTP sent to ${phone} (simulated)`);
    }
    
    function verifyOtp() {
        const otp = otpField.value.trim();
        
        if (!otp || otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }
        
        // Simulate OTP verification
        alert('Phone number verified successfully! (simulated)');
        closeLoginModal();
    }
    
    function handleGoogleSignIn(response) {
        // Handle Google Sign-In response
        console.log('Google Sign-In response:', response);
        alert('Google Sign-In successful! (simulated)');
        closeLoginModal();
    }
    
    function addToCart(event) {
        const button = event.target;
        const productCard = button.closest('.product-card');
        const productId = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('₹', '').replace(',', ''));
        const productImg = productCard.querySelector('.product-img').src;
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productId,
                price: productPrice,
                img: productImg,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Animation effect
        button.textContent = 'Added!';
        button.style.backgroundColor = 'var(--success-color)';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        }, 300);
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            button.style.backgroundColor = 'var(--primary-color)';
        }, 2000);
    }
    
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items display
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalAmount.textContent = '₹0';
            return;
        }
        
        let totalAmount = 0;
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            cartItemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="btn-quantity minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="btn-quantity plus">+</button>
                        </div>
                        <button class="btn-remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add event listeners for quantity buttons
            const minusBtn = cartItemElement.querySelector('.minus');
            const plusBtn = cartItemElement.querySelector('.plus');
            const removeBtn = cartItemElement.querySelector('.btn-remove-item');
            const quantityDisplay = cartItemElement.querySelector('.quantity');
            
            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    quantityDisplay.textContent = item.quantity;
                } else {
                    cart = cart.filter(cartItem => cartItem.id !== item.id);
                    cartItemElement.remove();
                }
                updateCart();
            });
            
            plusBtn.addEventListener('click', () => {
                item.quantity += 1;
                quantityDisplay.textContent = item.quantity;
                updateCart();
            });
            
            removeBtn.addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                cartItemElement.remove();
                updateCart();
            });
            
            totalAmount += item.price * item.quantity;
        });
        
        // Update total amount
        cartTotalAmount.textContent = `₹${totalAmount.toLocaleString()}`;
    }
    
    function proceedToCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Proceeding to checkout with ${cart.reduce((total, item) => total + item.quantity, 0)} items. Total: ${cartTotalAmount.textContent} (simulated)`);
        closeCartSidebar();
    }
    
    function initDealTimer() {
        // Set deal end time (24 hours from now)
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 12);
        endTime.setMinutes(endTime.getMinutes() + 45);
        endTime.setSeconds(endTime.getSeconds() + 30);
        
        function updateTimer() {
            const now = new Date();
            const diff = endTime - now;
            
            if (diff <= 0) {
                clearInterval(timerInterval);
                document.querySelector('.deal-timer').innerHTML = '<div class="deal-ended">Deal Ended!</div>';
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('deal-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('deal-mins').textContent = mins.toString().padStart(2, '0');
            document.getElementById('deal-secs').textContent = secs.toString().padStart(2, '0');
        }
        
        // Update timer immediately and then every second
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});