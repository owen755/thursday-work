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
    this.renderCartOnPageLoad(); // Renders the cart on page load if items exist
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
    // Simulated API response including an image property.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { 
            id: 1, 
            name: 'haitian fried chicken', 
            price: 1999, 
            description: 'Rich in protein',
            image: 'Haitian Fried Chicken.jpg'
          },
          { 
            id: 2, 
            name: 'Cold-Pressed Moringa Oil', 
            price: 29.99, 
            description: 'Pure natural skincare oil',
            image: 'https://via.placeholder.com/150?text=Moringa+Oil'
          },
          { 
            id: 3, 
            name: 'hamburger', 
            price: 120, 
            description: 'delicious fast food at a good price',
            image: 'The Truth About McDonalds Big Mac Sauce - Mashed.jpg'
          }
        ]);
      }, 500);
    });
  }

  renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">Ksh ${product.price.toFixed(2)}</p>
        <button type="button" class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `).join('');

    // Add event listeners for all "Add to Cart" buttons.
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        this.addToCart(e.target.dataset.id);
      });
    });
  }

  addToCart(productId) {
    // Look up the product with the given id.
    const product = this.getProductById(productId);
    this.cart.push(product);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartCount();
    this.showNotification(`${product.name} has been added to your cart.`);
    this.showCart();
  }

  getProductById(productId) {
    // In a real implementation, this would fetch product details from an API.
    // For simulation, we return a dummy product. Here, we also simulate an image URL.
    const images = {
      1: 'https://via.placeholder.com/150?text=haitian fried chicken',
      2: 'https://via.placeholder.com/150?text=hamburger',
      3: 'https://via.placeholder.com/150?text=Moringa+Tea'
    };
    const names = {
      1: 'haitian fried chicken',
      2: 'hamburger',
      3: 'Moringa Herbal Tea'
    };
    const prices = {
      1: 1999,
      2: 120,
      3: 12.99
    };

    return {
      id: productId,
      name: names[productId] || `Product ${productId}`,
      price: prices[productId] || (Number(productId) * 10),
      image: images[productId] || 'https://via.placeholder.com/150'
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
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <span>${item.name}</span>
            <span>Ksh ${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">Remove</button>
          </li>
        `).join('')}
      </ul>
      <div class="cart-total">
        Total: Ksh ${this.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
      </div>
      <button id="proceed-payment">Proceed to Payment</button>
      <div id="payment-form" style="display:none; margin-top:20px;">
        <h3>Payment Method</h3>
        <form id="payment-method-form">
        <label>
          Payment Method:
          <select name="paymentMethod" id="paymentMethod">
            <option value="card">Credit Card</option>
            <option value="mpesa">MPesa</option>
          </select>
        </label>
        <div id="card-fields">
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
        </div>
         <button type="submit">Pay Now</button>
       
        </form>
        <form>
        <div id="mpesa-fields"> 
          <label>
            MPesa Phone Number:
            <input type="text" name="mpesaNumber" placeholder="07XXXXXXXX" required>
          </label>
        </div>
        <button type="submit">Pay Now</button>
      </form>
      <div id="payment-response"></div>
    </div>
    `;

    // Attach event listeners for remove buttons.
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        this.removeFromCart(index);
      });
    });

    // Show payment form when "Proceed to Payment" is clicked.
    document.getElementById('proceed-payment').addEventListener('click', () => {
      document.getElementById('payment-form').style.display = 'block';
    });

    // Payment form submission simulation.
    const paymentMethodForm = document.getElementById('payment-method-form');
    paymentMethodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate payment processing.
      document.getElementById('payment-response').textContent = 'Payment processed successfully!';
      // Optionally clear the cart after payment.
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

  // Displays a temporary notification.
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
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
