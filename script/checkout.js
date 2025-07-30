import { cart, removeFromCart, saveToStorage, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { cartQuantity, calculateCartQuantity } from "../data/cart.js";

// Deduplicating / Normalizing data
// Getting the matching product's detail in the cart
let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if(product.id === productId) {
    matchingProduct = product;
  }
  });
  
  // Generating the HTML for the matching product.
  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-cart-quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
            Update
          </span>

          <input type="number" class="quantity-input" min="1">
          <span class="save-quantity-link link-primary js-link-primary" data-product-id="${matchingProduct.id}">Save</span>

          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
});

document.querySelector('.js-order-summary').innerHTML=cartSummaryHTML;

// deleting product from delete button 
// 1. <checkout.js> when we click delete how do we know which product to delete
// 2. <cart.js> remove the product from the cart
// 3. <checkout.js> give a class to cart item container: js-cart-item-container-matchingProductId
// 4. <checkout.js> select the element and put it in: container
// 5. <checkout.js> remove the class from the container/page
document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      // step 1
      // set data-product-id="${matchingProduct.id} in delete button to know which product to delete
      // put that into a deleteProductId as id variable
      const id = link.dataset.productId;
      removeFromCart(id);

      //step 4
      const container = document.querySelector(
        `.js-cart-item-container-${id}`
      );
      //step 5
      container.remove();

      // Show updated cart items on delete
      updateCartQuantity();
    })
  });

// updating cart quantity
function updateCartQuantity() {
  // from cart.js
  calculateCartQuantity();
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
// Show cart items on page load.
updateCartQuantity();

// Update Button: Changing products quantity
document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${id}`);
      container.classList.add('is-editing-quantity');
      
      // showing the product present quantity in the input field
      let product;

      cart.forEach(item => {
        if (item.productId === id) {
          product = item;
        }
      });
      container.querySelector('.quantity-input').value = product.quantity;

    });
  });

// Save Button: Saving the changed quantity
document.querySelectorAll('.js-link-primary')
  .forEach((link) => {
    const id = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${id}`);
    const input = container.querySelector('.quantity-input');

    // save logic function
    function saveQuantity() {
      container.classList.remove('is-editing-quantity');

      // Get previous quantity
      let previousQuantity = 1; // default fallback
      cart.forEach(cartItem => {
        if (cartItem.productId === id) {
          previousQuantity = cartItem.quantity;
        }
      });

      let updatedQuantity = Number(input.value);
      if (isNaN(updatedQuantity) || updatedQuantity <= 0) {
        updatedQuantity = previousQuantity;
        input.value = updatedQuantity; // visually correct it
        alert('Invalid quantity. Must be at least 1.');
      }

      updateQuantity(id, updatedQuantity);
      updateCartQuantity();
      saveToStorage();
      container.querySelector('.js-cart-quantity-label').innerText = updatedQuantity;
    }

    // Part 1: save on click, call the saveQuantity()
    link.addEventListener('click', saveQuantity);

    // Part 2: prevent typing "-"
    input.addEventListener('keydown', (event) => {
      if (event.key === '-') {
        event.preventDefault();
      }
    });

    // Part 3: prevent pasting invalid
    input.addEventListener('paste', (event) => {
      const pasted = Number(event.clipboardData.getData('text'));
      if (isNaN(pasted) || pasted <= 0) {
        event.preventDefault();
        alert('Invalid quantity pasted. Must be at least 1.');
      }
    });

    // Part 4: save on pressing Enter
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        saveQuantity();
      }
    });

    // Part 5: cancel updating pressing Esc
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();

        container.classList.remove('is-editing-quantity');

        // Reset input quantity by previous input.
        let previousQuantity;
        cart.forEach(cartItem => {
        if (cartItem.productId === id) {
          previousQuantity = cartItem.quantity;
        }
      });
      // to clean the input field
      input.value = previousQuantity;
      }
    });
});

