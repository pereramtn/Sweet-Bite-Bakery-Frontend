
const bakeryProducts = [
    // Cake Items
    { id: 1, name: "Birthday Cake", price: 4500, image: "images/birthday-cake.jpg" },
    { id: 2, name: "Chocolate Cake", price: 3800, image: "images/chocolate-cake.webp" },
    { id: 3, name: "Wedding Cake", price: 15000, image: "images/wedding-cakes.jpg" },
    { id: 4, name: "Red Velvet Cake", price: 4200, image: "images/red-velvet-cake.jpg" },
    { id: 5, name: "Black Forest Cake", price: 4000, image: "images/black-forest-cake.webp" },
    { id: 6, name: "Vanilla Cake", price: 3500, image: "images/vanilla-cake.jpg" },

    // Cupcake Items
    { id: 7, name: "Vanilla Cupcakes", price: 350, image: "images/cup-cakes.webp" },
    { id: 8, name: "Chocolate Cupcakes", price: 400, image: "images/chocolate-cupcake.jpg" },
    { id: 9, name: "Strawberry Cupcake", price: 420, image: "images/strawberry-cupcake.jpg" },
    { id: 10, name: "Red Velvet Cupcake", price: 450, image: "images/red-velvet-cupcake.jpg" },

    // Pastry Items
    { id: 11, name: "Butter Croissant", price: 280, image: "images/croissant.jpg" },
    { id: 12, name: "Chocolate Donut", price: 250, image: "images/donut.jpg" },
    { id: 13, name: "Cream Puff", price: 220, image: "images/cream-puff.jpg" },
    { id: 14, name: "Fruit Pastry", price: 380, image: "images/fruit-pastry.jpg" },
    { id: 15, name: "Egg Pastry", price: 200, image: "images/egg-pastry.jpg" },

    // Bakery Snack Items
    { id: 16, name: "Fish Roll", price: 150, image: "images/fish-roll.jpg" },
    { id: 17, name: "Egg Roll", price: 130, image: "images/egg-roll.jpg" },
    { id: 18, name: "Fish Bun", price: 180, image: "images/fish-bun.jpg" },
    { id: 19, name: "Vegetable Roll", price: 120, image: "images/vegetable-roll.jpg" },
    { id: 20, name: "Fish Patty", price: 140, image: "images/fish-patty.jpg" },
    { id: 21, name: "Sausage Roll", price: 200, image: "images/sausage-roll.jpg" },

    // Drinks
    { id: 22, name: "Iced Coffee", price: 450, image: "images/iced-coffee.jpg" },
    { id: 23, name: "Fresh Orange Juice", price: 350, image: "images/fresh-orange-juice.jpg" },
    { id: 24, name: "Chocolate Milkshake", price: 500, image: "images/milkshake.jpg" },

    // Bread Items
    { id: 25, name: "Fresh Bread", price: 180, image: "images/fresh-bread.jpg" },
    { id: 26, name: "Brown Bread", price: 250, image: "images/brown-bread.jpg" },
    { id: 27, name: "Garlic Bread", price: 300, image: "images/garlic-bread.jpg" }
];

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("sweetBiteCart")) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("sweetBiteCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    const element = document.getElementById("cartCount");

    if (element) element.textContent = count;
}

function addToCart(id) {
    const product = bakeryProducts.find(item => item.id === id);

    if (!product) return;

    if (typeof Swal !== "undefined") {
        Swal.fire({
            title: "Add to Cart?",
            text: `Do you want to add ${product.name} to your cart?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#64141A",
            cancelButtonColor: "#B59F93",
            background: "#FFF0F0",
         color: "#64141A",
            confirmButtonText: "Yes, add it!",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                addProductToCart(product);

                Swal.fire({
                    title: "Added Successfully!",
                    text: `${product.name} has been added to your cart.`,
                    icon: "success",
                    confirmButtonColor: "#64141A",
                    background: "#FFF0F0",
                    color: "#64141A",
                });
            }
        });
    } else {
        addProductToCart(product);
        alert(product.name + " added to cart!");
    }
}

function addProductToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
}

function changeQuantity(id, amount) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    const updated = cart.filter(item => item.quantity > 0);
    saveCart(updated);
    renderCart();
}

function removeFromCart(id) {
    const updated = getCart().filter(item => item.id !== id);
    saveCart(updated);
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    if (!container || !totalElement) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Your shopping cart is empty.</p>";
        totalElement.textContent = "Rs. 0";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        return `
            <div class="d-flex align-items-center gap-3 border-bottom py-3">
                <img src="${item.image}" alt="${item.name}"
                     class="cart-product-image">

                <div class="flex-grow-1">
                    <h6>${item.name}</h6>
                    <p>Rs. ${item.price.toLocaleString("en-US")}</p>

                    <button class="btn btn-sm btn-outline-secondary"
                        onclick="changeQuantity(${item.id}, -1)">−</button>

                    <span class="mx-2">${item.quantity}</span>

                    <button class="btn btn-sm btn-outline-secondary"
                        onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <div class="text-end">
                    <strong>Rs. ${subtotal.toLocaleString("en-US")}</strong>
                    <br>
                    <button class="btn btn-sm text-danger"
                        onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    totalElement.textContent = "Rs. " + total.toLocaleString("en-US");
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();
});
