export let cart = JSON.parse(localStorage.getItem('cart')) || [];
// when cart is empty lcaolstorage gives null, so we use 3 default values here.


export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// adding items into cart
export function addToCart(productId, quantity) {
  // for Increasing Quantity
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  // step 2: if it's in the cart, increase the quantity
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    // step 3: push the product into the array.
    cart.push({
      productId,
      quantity
    });
  }
  saveToStorage();
}

// step 2
// removing a product function
// 1. Create a new array
// 2. Loop through the cart
// 3. add each product to the new array except deleteProductId 
// 4. repalce the cart with newCart
export function removeFromCart(deleteProductId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.productId !== deleteProductId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

// Calculating Cart Quantity
export let cartQuantity;
export function calculateCartQuantity() {
  // finding total quantity
  let newCartQuantity = 0; 
  cart.forEach((cartItem) => {
    newCartQuantity += cartItem.quantity;
  });
  cartQuantity = newCartQuantity;
};

// Updating Quantity
export function updateQuantity(id, updatedQuantity) {
  cart.forEach(cartItem => {
    if (cartItem.productId === id) {
      cartItem.quantity = updatedQuantity;
    }
  });
}