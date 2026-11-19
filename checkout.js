
const CHECKOUT_KEY = "sweetBiteCheckout";

function readBakeryCart() {
    if (typeof getCart === "function") {
        return getCart();
    }

    try {
        return JSON.parse(localStorage.getItem("bakeryCart")) || [];
    } catch {
        return [];
    }
}

function money(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const checkoutCart = readBakeryCart();
const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutForm = document.getElementById("checkoutForm");

function displayCheckoutSummary() {
    if (!checkoutCart.length) {
        checkoutItems.innerHTML =
            '<p>Your cart is empty. Please add products first.</p>';
        checkoutSubtotal.textContent = money(0);

        checkoutForm.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    let subtotal = 0;

    checkoutItems.innerHTML = checkoutCart.map(item => {
        const price = Number(item.price) || 0;
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const lineTotal = price * quantity;

        subtotal += lineTotal;

        return `
            <div class="d-flex justify-content-between gap-3 mb-3">
                <span>${escapeCheckoutText(item.name)} × ${quantity}</span>
                <strong>${money(lineTotal)}</strong>
            </div>
        `;
    }).join("");

    checkoutSubtotal.textContent = money(subtotal);
}

function escapeCheckoutText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!checkoutCart.length) {
        alert("Your cart is empty. Please add products first.");
        return;
    }

    if (!checkoutForm.checkValidity()) {
        checkoutForm.reportValidity();
        return;
    }

    const subtotal = checkoutCart.reduce((total, item) => {
        return total +
            (Number(item.price) || 0) *
            Math.max(1, Number(item.quantity) || 1);
    }, 0);

    const orderDetails = {
        customer: {
            name: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            address: document.getElementById("address").value.trim(),
            district: document.getElementById("district").value.trim(),
            postalCode: document.getElementById("postalCode").value.trim(),
            instructions: document.getElementById("instructions").value.trim()
        },
        items: checkoutCart.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1)
        })),
        subtotal,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(orderDetails));
    window.location.href = "payment.html";
});

displayCheckoutSummary();
