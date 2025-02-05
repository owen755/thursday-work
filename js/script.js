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
    this.renderCartOnPageLoad(); // New addition to ensure cart is rendered on page load
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
    this.showCart();
  }

  getProductById(productId) {
    // In real implementation, fetch from API
    return {
      id: productId,
      name: `Product ${productId}`,
      price: Number(productId) * 10
    };
  }

  updateCartCount() {
    document.querySelector('.cart-count').textContent = `(${this.cart.length})`;
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
        ${this.cart.map(item => `
          <li class="cart-item">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
          </li>
        `).join('')}
      </ul>
      <div class="cart-total">
        Total: $${this.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
      </div>
    `;
  }

  setupForm() {
    const form = document.getElementById('contact-form');
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

  async submitForm(formData) {
    // Simulated API call
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

  // New function to render the cart on page load if it's already in localStorage
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

// Ensure cart is rendered if available when the cart section is visible
window.addEventListener('load', () => {
  if (document.getElementById('cart-contents')) {
    new Marketplace().showCart();
  }
});
