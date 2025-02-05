class Marketplace {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.setupNavigation();
    this.loadProducts();
    this.setupForm();
    this.updateCartCount();
    this.renderCartOnPageLoad(); // Renders cart on page load if items exist
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection(e.target.dataset.section);
        this.setActiveNav(e.target);
      });
    });
  }

  showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.hidden = section.id !== sectionId;
    });
  }

  setActiveNav(activeButton) {
    document.querySelectorAll('.nav-link').forEach(button => {
      button.classList.toggle('active', button === activeButton);
      button.setAttribute('aria-current', button === activeButton ? 'page' : null);
    });
  }

  async loadProducts() {
    try {
      // Simulated API call
      const products = await this.fetchProducts();
      this.renderProducts(products);
    } catch (error) {
      this.showError('Failed to load products. Please try again later.');
    }
  }

  async fetchProducts() {
    // Simulated API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Organic Moringa Powder', price: 19.99, description: 'Rich in antioxidants and nutrients' },
          { id: 2, name: 'Cold-Pressed Moringa Oil', price: 29.99, description: 'Pure natural skincare oil' },
          { id: 3, name: 'Moringa Herbal Tea', price: 12.99, description: 'Detoxifying and energizing blend' }
        ]);
      }, 500);
    });
  }

  renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button type="button" class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `).join('');

    productList.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        this.addToCart(e.target.dataset.id);
      }
    });
  }

  addToCart(productId) {
    const product = this.getProductById(productId);
    this.cart.push(product);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.showNotification(`${product.name} has been added to your cart.`);
    this.showCart();
  }

  getProductById(productId) {
    // In real implementation, fetch from API or data source.
    // For simulation, we return a dummy product based on the id.
    return {
      id: productId,
      name: `Product ${productId}`,
      price: Number(productId) * 10
    };
  }

  updateCartCount() {
    const cartCountElem = document.querySelector('.cart-count');
    if (cartCountElem) {
      cartCountElem.textContent = `(${this.cart.length})`;
    }
  }

  showCart() {
    this.showSection('cart');
    this.setActiveNav(document.querySelector('[data-section="cart"]'));
    this.renderCart();
  }

  renderCart() {
    const cartContents = document.getElementById('cart-contents');
    if (this.cart.length === 0) {
      cartContents.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
      return;
    }

    cartContents.innerHTML = `
      <ul class="cart-list">
        ${this.cart.map((item, index) => `
          <li class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">Remove</button>
          </li>
        `).join('')}
      </ul>
      <div class="cart-total">
        Total: $${this.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
      </div>
      <button id="proceed-payment">Proceed to Payment</button>
      <div id="payment-form" style="display:none; margin-top:20px;">
        <h3>Payment Method</h3>
        <form id="payment-method-form">
         <label>
            mpesa phone number:
            <input type="till 123456" name="number" required>
          </label>
          <button type="submit">Pay Now</button>
          </form>
          <form>
          <label>
            Card Number:
            <input type="text" name="cardNumber" required>
          </label>
          <label>
            Expiry Date:
            <input type="text" name="expiryDate" placeholder="MM/YY" required>
          </label>
          <label>
            CVV:
            <input type="text" name="cvv" required>
          </label>
          <button type="submit">Pay Now</button>
        </form>
        <div id="payment-response"></div>
      </div>
    `;

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        this.removeFromCart(index);
      });
    });

    // Payment processing: show the payment form when "Proceed to Payment" is clicked.
    document.getElementById('proceed-payment').addEventListener('click', () => {
      document.getElementById('payment-form').style.display = 'block';
    });

    // Payment form submission simulation.
    const paymentMethodForm = document.getElementById('payment-method-form');
    paymentMethodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you would integrate with a payment gateway.
      // For simulation, we simply show a success message.
      document.getElementById('payment-response').textContent = 'Payment processed successfully!';
      // Optionally, you might clear the cart after payment.
      this.cart = [];
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCount();
      this.renderCart();
    });
  }

  removeFromCart(index) {
    this.cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.renderCart();
  }

  setupForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        try {
          await this.submitForm(formData);
          this.showFormResponse('Message sent successfully!', 'success');
          form.reset();
        } catch (error) {
          this.showFormResponse('Failed to send message. Please try again.', 'error');
        }
      });
    }
  }

  async submitForm(formData) {
    // Simulated API call for form submission.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.2 ? resolve() : reject();
      }, 1000);
    });
  }

  showFormResponse(message, type) {
    const responseElem = document.getElementById('contact-response');
    if (responseElem) {
      responseElem.textContent = message;
      responseElem.className = `form-response ${type}`;
    }
  }

  showError(message) {
    const productList = document.getElementById('product-list');
    if (productList) {
      productList.innerHTML = `<p class="error">${message}</p>`;
    }
  }

  // Displays a notification for a few seconds.
  showNotification(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Automatically remove after 3 seconds.
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Renders the cart on page load if items exist.
  renderCartOnPageLoad() {
    if (document.getElementById('cart-contents') && this.cart.length > 0) {
      this.renderCart();
    }
  }
}

// Initialize the Marketplace when the window loads.
window.addEventListener('load', () => {
  new Marketplace();
});
