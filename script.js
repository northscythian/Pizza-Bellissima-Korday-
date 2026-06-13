// ===== МЕНЮ (РЕДАКТИРУЙТЕ ЗДЕСЬ) =====
let menuData = [
    { id: 1, name: "Маргарита", category: "Пиццы", description: "Томатный соус, моцарелла, базилик", price: 2500, image: "Photo/Margherita.jpeg" },
    { id: 2, name: "Диавола", category: "Пиццы", description: "Острая пепперони, моцарелла, чили", price: 3200, image: "Photo/Spicy_Diavola_pizza_pepperon.jpeg" },
    { id: 3, name: "Четыре сыра", category: "Пиццы", description: "Моцарелла, горгонзола, пармезан, фонтана", price: 3500, image: "Photo/Quattro_Formaggi_pizza_cheese_pull_202606122125.jpeg" },
    { id: 4, name: "Карбонара", category: "Пиццы", description: "Бекон, яйцо, пармезан, сливочный соус", price: 3600, image: "Photo/Carbonara_pizza_with_pancetta_bacon_202606122127.jpeg" },
    { id: 5, name: "Каприччоза", category: "Пиццы", description: "Ветчина, грибы, артишоки, оливки", price: 3800, image: "Photo/Capricciosa pizza.jpeg" },
    { id: 6, name: "Брускетта", category: "Закуски", description: "Гренки с томатами, чесноком, базиликом", price: 1200, image: "Photo/Italian bruschetta.jpeg" },
    { id: 7, name: "Фриттура Миста", category: "Закуски", description: "Кальмары, креветки, овощи в кляре", price: 2200, image: "Photo/Mixed fried seafood platter Frittura Mista.jpeg" },
    { id: 8, name: "Капрезе", category: "Салаты", description: "Моцарелла, томаты, базилик, оливковое масло", price: 1800, image: "Photo/Caprese salad.jpeg" },
    { id: 9, name: "Руккола с пармезаном", category: "Салаты", description: "Руккола, пармезан, томаты черри", price: 1600, image: "Photo/Arugula salad with shaved parmesan curls.jpeg" },
    { id: 10, name: "Лимонад", category: "Напитки", description: "Домашний лимонад", price: 500, image: "" },
    { id: 11, name: "Тирамису", category: "Десерты", description: "Кофе, маскарпоне, какао", price: 750, image: "" },
    { id: 12, name: "Панна Котта", category: "Десерты", description: "Ванильный десерт с ягодным соусом", price: 650, image: "" },
    { id: 13, name: "Трюфельный соус", category: "Соусы", description: "Сливочный соус с трюфелем", price: 250, image: "" },
    { id: 14, name: "Агродольче", category: "Соусы", description: "Сладко-кислый итальянский соус", price: 180, image: "" }
];

let cart = {};
let currentCategory = "all";
let searchText = "";

// Получение пути к фото
function getImagePath(item) {
    if (item.image && item.image !== "") return item.image;
    return "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg";
}

// Отображение меню
function renderMenu() {
    let filtered = menuData;
    
    if (currentCategory !== "all") {
        filtered = filtered.filter(item => item.category === currentCategory);
    }
    
    if (searchText.trim() !== "") {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:40px;">🍕 Ничего не найдено</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(item => `
        <div class="menu-card">
            <div class="card-img" style="background-image: url('${getImagePath(item)}'); background-size: cover; background-position: center;"></div>
            <div class="card-info">
                <div class="card-title">${escapeHtml(item.name)}</div>
                <div class="card-desc">${escapeHtml(item.description)}</div>
                <div class="card-price">${item.price.toLocaleString()} ₸</div>
                <button class="add-btn" data-id="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}">Добавить →</button>
            </div>
        </div>
    `).join("");
    
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            addToCart(id, name, price);
        });
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Корзина
function addToCart(id, name, price) {
    if (cart[id]) cart[id].quantity++;
    else cart[id] = { id, name, price, quantity: 1 };
    updateCartUI();
    showToast(`✓ ${name} добавлена`);
    saveCart();
}

function updateCartUI() {
    const items = Object.values(cart);
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    
    const cartCountEl = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");
    const cartItemsEl = document.getElementById("cart-items");
    
    if (cartCountEl) cartCountEl.innerText = totalQty;
    if (cartTotalEl) cartTotalEl.innerHTML = totalPrice.toLocaleString() + " ₸";
    if (!cartItemsEl) return;
    
    if (items.length === 0) {
        cartItemsEl.innerHTML = "<p style='text-align:center;color:#888;padding:20px;'>Корзина пуста</p>";
        return;
    }
    
    cartItemsEl.innerHTML = items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <p>${item.price.toLocaleString()} ₸ x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="qty-plus" data-id="${item.id}">+</button>
                <button class="item-remove" data-id="${item.id}">🗑️</button>
            </div>
        </div>
    `).join("");
    
    document.querySelectorAll(".qty-minus").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            if (cart[id].quantity > 1) cart[id].quantity--;
            else delete cart[id];
            updateCartUI();
            saveCart();
        };
    });
    
    document.querySelectorAll(".qty-plus").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            cart[id].quantity++;
            updateCartUI();
            saveCart();
        };
    });
    
    document.querySelectorAll(".item-remove").forEach(btn => {
        btn.onclick = () => {
            delete cart[parseInt(btn.dataset.id)];
            updateCartUI();
            saveCart();
        };
    });
}

function showToast(msg) {
    const toast = document.createElement("div");
    toast.innerHTML = msg;
    toast.style.cssText = `position:fixed;bottom:20px;left:20px;background:#2ecc71;color:white;padding:12px 20px;border-radius:30px;z-index:2000;animation:fadeOut 2s forwards;`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function saveCart() {
    localStorage.setItem("pizzaCart", JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem("pizzaCart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCartUI();
        } catch(e) {}
    }
}

// Telegram
const BOT_TOKEN = "8895293528:AAHX6k1TCDBSw_019BvrSU0jQYXyMTek7pY";
const CHAT_ID = "6017544408";

async function sendOrder(order) {
    const itemsText = Object.values(order.items).map(i => 
        `${i.name} x${i.quantity} = ${(i.price * i.quantity).toLocaleString()} ₸`
    ).join("\n");
    
    const text = `🍕 НОВЫЙ ЗАКАЗ!\n\n👤 ${order.name}\n📞 ${order.phone}\n📍 ${order.address}\n💳 ${order.payment}\n\n📋 Состав:\n${itemsText}\n\n💰 Итого: ${order.total.toLocaleString()} ₸\n${order.comment ? `\n📝 ${order.comment}` : ""}`;
    
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text })
        });
        const data = await res.json();
        if (data.ok) {
            alert("✅ Заказ принят!");
            return true;
        } else {
            alert("❌ Ошибка отправки. Попробуйте позже.");
            return false;
        }
    } catch(e) {
        alert("❌ Ошибка сети. Проверьте интернет.");
        return false;
    }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    loadCart();
    
    // Категории
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.cat;
            renderMenu();
        });
    });
    
    // Поиск
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchText = e.target.value;
            renderMenu();
        });
    }
    
    // Корзина
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCart = document.getElementById("close-cart");
    
    if (cartBtn && cartSidebar) cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
    if (closeCart && cartSidebar) closeCart.addEventListener("click", () => cartSidebar.classList.remove("open"));
    
    // Модалка
    const checkoutBtn = document.getElementById("checkout-btn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    
    if (checkoutBtn && modal) {
        checkoutBtn.addEventListener("click", () => {
            if (Object.keys(cart).length === 0) {
                showToast("Корзина пуста");
                return;
            }
            modal.classList.add("show");
            if (cartSidebar) cartSidebar.classList.remove("open");
        });
    }
    if (closeModal && modal) closeModal.addEventListener("click", () => modal.classList.remove("show"));
    
    // Отправка заказа
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name")?.value || "";
            const phone = document.getElementById("phone")?.value || "";
            const address = document.getElementById("address")?.value || "";
            const comment = document.getElementById("comment")?.value || "";
            const paymentSelect = document.getElementById("payment");
            const payment = paymentSelect?.value === "cash" ? "Наличные" : paymentSelect?.value === "card" ? "Карта" : "Kaspi.kz";
            
            if (!name || !phone || !address) {
                showToast("Заполните имя, телефон и адрес");
                return;
            }
            
            const order = {
                items: cart,
                total: Object.values(cart).reduce((s, i) => s + i.price * i.quantity, 0),
                name, phone, address, comment, payment
            };
            
            const btn = document.querySelector(".submit-btn");
            if (btn) {
                btn.disabled = true;
                btn.textContent = "⏳ Отправка...";
            }
            
            const success = await sendOrder(order);
            
            if (success) {
                cart = {};
                updateCartUI();
                saveCart();
                if (modal) modal.classList.remove("show");
                if (orderForm) orderForm.reset();
            }
            
            if (btn) {
                btn.disabled = false;
                btn.textContent = "✅ Подтвердить заказ";
            }
        });
    }
});

const style = document.createElement('style');
style.textContent = `@keyframes fadeOut { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }`;
document.head.appendChild(style);
