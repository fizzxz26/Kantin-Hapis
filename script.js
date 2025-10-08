const products = [
  { id: 1, name: "Mie Ayam", price: 10000, category: "Makanan", img: "mie ayam.png" },
  { id: 2, name: "Es Teh Manis", price: 5000, category: "Minuman", img: "es teh.png" },
  { id: 3, name: "Indomie Kuah/Goreng", price: 6000, category: "Makanan", img: "indomie kombo.png" },
  { id: 4, name: "Kripik Kaca", price: 6000, category: "Snack", img: "Kripca.png" },
  { id: 5, name: "Kopi Susu", price: 10000, category: "Minuman", img: "Kopsu Jago.png" },
  { id: 6, name: "Matcha Latte", price: 12000, category: "Minuman", img: "MatchaLatte.png" }
];

const productList = document.getElementById("product-list");
const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const toggleCart = document.getElementById("toggle-cart");
const categorySelect = document.getElementById("category");
const searchInput = document.getElementById("search");

const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

let cart = {};
let showCart = false;

function renderProducts() {
  const query = searchInput.value.toLowerCase();
  const category = categorySelect.value;
  productList.innerHTML = "";

  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(query) &&
      (category === "Semua" || p.category === category)
  );

  if (filtered.length === 0) {
    productList.innerHTML = "<p class='no-product'>Tidak ada produk ditemukan.</p>";
    return;
  }

  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src=\"${p.img}\" alt=\"${p.name}\">
      <div class=\"info\">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <div class=\"bottom\">
          <strong>Rp${p.price.toLocaleString()}</strong>
          <button onclick=\"addToCart(${p.id})\">Tambah</button>
        </div>
      </div>`;
    productList.appendChild(div);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!cart[id]) cart[id] = { ...item, qty: 1 };
  else cart[id].qty++;
  updateCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCart();
}

function removeItem(id) {
  delete cart[id];
  updateCart();
}

function clearCart() {
  cart = {};
  updateCart();
}

function updateCart() {
  cartContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  Object.values(cart).forEach(item => {
    total += item.qty * item.price;
    count += item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src=\"${item.img}\" alt=\"${item.name}\">
      <div class=\"details\">
        <p>${item.name}</p>
        <p>Rp${(item.price * item.qty).toLocaleString()} <small>(${item.qty}x)</small></p>
      </div>
      <div class=\"qty-controls\">
        <button onclick=\"changeQty(${item.id}, -1)\">−</button>
        <span>${item.qty}</span>
        <button onclick=\"changeQty(${item.id}, 1)\">+</button>
        <button onclick=\"removeItem(${item.id})\" style=\"color:red\">✕</button>
      </div>`;
    cartContainer.appendChild(div);
  });

  cartTotal.textContent = "Rp" + total.toLocaleString();
  cartCount.textContent = count;
}

toggleCart.addEventListener("click", () => {
  showCart = !showCart;
  document.getElementById("cart").classList.toggle("hidden", !showCart);
});

document.getElementById("checkout").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("Keranjang masih kosong!");
  } else {
    alert(`Checkout berhasil! Total: Rp${cartTotal.textContent}`);
    clearCart();
  }
});

document.getElementById("clear-cart").addEventListener("click", clearCart);
searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);

renderProducts();
updateCart();