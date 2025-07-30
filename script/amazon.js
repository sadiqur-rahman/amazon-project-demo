// Main idea of JavaScript is: 
// 1. Save the data 
// 2. Generate the HTML 
// 3. Make it interactive

// import * brings everything
import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js"; 
import { formatCurrency } from "./utils/money.js";
import { cartQuantity, calculateCartQuantity } from "../data/cart.js";

let productsHTML = ''; // all HTML into this var

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>
      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
      <div class="product-price">
        $${formatCurrency(product.priceCents)}
      </div>
      <div class="product-quantity-container">
        <select class="js-product-quantity js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>
      <button class="add-to-cart-button button-primary js-add-to-cart" 
      data-product-id="${product.id}"> 
        Add to Cart
      </button>
    </div>
  `; // copy all html for 1 product
});

// now put in on the page using DOM.
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// updating cart quantity
function updateCartQuantity() {
  // from cart.js
  calculateCartQuantity();
  if(cartQuantity > 99) {
    document.querySelector('.js-cart-quantity').innerHTML = '99+';
  } else {
    document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity}`;
  }
}

updateCartQuantity();

// use forEach() to loop through the ADD to CART buttons
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      // now create a cart Array. how do we know which product we are adding? ---> Data Attribute (start: data-)
      const {productId} = button.dataset; // destructuring
      const quantitySelect = document.querySelector(`.js-quantity-selector-${productId}`);
      // declared quantity
      const quantity = Number(quantitySelect.value);
      console.log('Selected Qnt:', quantity);

      addToCart(productId, quantity);
      updateCartQuantity();

      // timeout handeling section
      // getting productID from added cart pressed item.
      const addedProduct = document.querySelector(`.js-added-to-cart-${productId}`);

      addedProduct.classList.add('js-added-to-cart-visible');
      console.log('Added ProductID:', addedProduct);

      // step 2
      // Check if there's a previous timeout for this product. 
      // If there is, we should stop it. Thus bring it from the object
      if (addedProduct.timeoutId) {
        clearTimeout(addedProduct.timeoutId);
      }
      
      // setp 1
      // In JavaScript, DOM elements are objects — so you can add your own custom properties to them. 
      // That means timeoutId isn’t something that already exists on DOM elements. 
      // Instead: You create this property the first time you do:
      addedProduct.timeoutId = setTimeout(() => {
        addedProduct.classList.remove('js-added-to-cart-visible');
      }, 2000);
    })
  });