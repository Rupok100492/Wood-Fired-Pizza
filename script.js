/* ===============================
   CART STATE (LOCAL STORAGE SAFE)
================================= */

let cart = JSON.parse(localStorage.getItem("pizzaCart")) || [];

/* ===============================
   SAVE CART
================================= */
function saveCart() {
  localStorage.setItem("pizzaCart", JSON.stringify(cart));
}

/* ===============================
   ADD TO CART (FIXED DUPLICATES)
================================= */
function addToCart(name, price) {
  const item = cart.find(p => p.name === name);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({
      name,
      price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
}

/* ===============================
   REMOVE ITEM
================================= */
function removeItem(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

/* ===============================
   QUANTITY CONTROL
================================= */
function changeQty(name, amount) {
  const item = cart.find(i => i.name === name);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    removeItem(name);
  }

  saveCart();
  renderCart();
}

/* ===============================
   RENDER CART UI (FIXED)
================================= */
function renderCart() {
  const cartBox = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (!cartBox) return;

  cartBox.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const totalItem = item.price * item.qty;
    subtotal += totalItem;

    cartBox.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          £${item.price} × ${item.qty}
        </div>

        <div class="cart-controls">
          <button onclick="changeQty('${item.name}', -1)">-</button>
          <button onclick="changeQty('${item.name}', 1)">+</button>
          <button onclick="removeItem('${item.name}')">✕</button>
        </div>
      </div>
    `;
  });

  const delivery = cart.length > 0 ? 2 : 0;
  const total = subtotal + delivery;

  if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
  if (totalEl) totalEl.innerText = total.toFixed(2);
}

/* ===============================
   PAYMENT SYSTEM
================================= */
function openPayment() {
  const box = document.getElementById("paymentBox");
  if (box) box.classList.remove("hidden");
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty 🍕");
    return;
  }

  alert("Order placed successfully 🍕");

  cart = [];
  saveCart();
  renderCart();

  const box = document.getElementById("paymentBox");
  if (box) box.classList.add("hidden");
}

/* ===============================
   MENU FILTER FIXED
================================= */
function showFull() {
  const full = document.getElementById("fullMenu");
  const set = document.getElementById("setMenu");

  if (!full || !set) return;

  full.style.display = "grid";
  set.style.display = "none";
}

function showSet() {
  const full = document.getElementById("fullMenu");
  const set = document.getElementById("setMenu");

  if (!full || !set) return;

  full.style.display = "none";
  set.style.display = "grid";
}

/* ===============================
   GSAP ANIMATIONS (SAFE)
================================= */
if (typeof gsap !== "undefined") {

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-text", {
    y: 80,
    opacity: 0,
    duration: 1
  });

  gsap.from(".location-card", {
    scrollTrigger: {
      trigger: "#locations",
      start: "top 80%"
    },
    y: 60,
    opacity: 0,
    stagger: 0.2
  });

  gsap.from(".pizza-card", {
    scrollTrigger: {
      trigger: ".menu-grid",
      start: "top 80%"
    },
    y: 60,
    opacity: 0,
    stagger: 0.15
  });

  gsap.from(".customer-card", {
    scrollTrigger: {
      trigger: ".customer-grid",
      start: "top 85%"
    },
    y: 60,
    opacity: 0,
    stagger: 0.2
  });
}

/* ===============================
   NAVBAR SCROLL EFFECT
================================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");

  if (!header) return;

  if (window.scrollY > 50) {
    header.style.background = "rgba(0,0,0,0.9)";
  } else {
    header.style.background = "rgba(0,0,0,0.65)";
  }
});

/* ===============================
   CONTACT FORM UX
================================= */
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector("button");
    btn.innerText = "Sending...";

    setTimeout(() => {
      btn.innerText = "Message Sent ✔";
      form.reset();

      setTimeout(() => {
        btn.innerText = "Send Message";
      }, 2000);
    }, 1000);
  });
}

/* ===============================
   INIT
================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});