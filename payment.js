
const ORDER_DETAILS_KEY = "sweetBiteCheckout";
const COMPLETED_ORDER_KEY = "sweetBiteLastOrder";

function paymentMoney(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function paymentEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

let checkoutDetails;

try {
    checkoutDetails = JSON.parse(localStorage.getItem(ORDER_DETAILS_KEY));
} catch {
    checkoutDetails = null;
}

const paymentItems = document.getElementById("paymentItems");
const paymentSubtotal = document.getElementById("paymentSubtotal");
const paymentCustomer = document.getElementById("paymentCustomer");
const paymentForm = document.getElementById("paymentForm");

if (
    !checkoutDetails ||
    !checkoutDetails.customer ||
    !Array.isArray(checkoutDetails.items) ||
    checkoutDetails.items.length === 0
) {
    paymentForm.innerHTML = `
        <p>Your checkout information was not found.</p>
        <a href="cart.html" class="btn main-btn w-100">
            Return to Shopping Cart
        </a>
    `;

    paymentItems.innerHTML = "";
    paymentSubtotal.textContent = paymentMoney(0);
    paymentCustomer.textContent = "";
} else {
    const subtotal = checkoutDetails.items.reduce((sum, item) => {
        return sum +
            (Number(item.price) || 0) *
            Math.max(1, Number(item.quantity) || 1);
    }, 0);

    paymentItems.innerHTML = checkoutDetails.items.map(item => `
        <div class="d-flex justify-content-between gap-3 mb-3">
            <span>
                ${paymentEscape(item.name)}
                × ${Math.max(1, Number(item.quantity) || 1)}
            </span>
            <strong>
                ${paymentMoney(
                    (Number(item.price) || 0) *
                    Math.max(1, Number(item.quantity) || 1)
                )}
            </strong>
        </div>
    `).join("");

    paymentSubtotal.textContent = paymentMoney(subtotal);

    paymentCustomer.innerHTML = `
        <strong>${paymentEscape(checkoutDetails.customer.name)}</strong><br>
        ${paymentEscape(checkoutDetails.customer.address)}<br>
        ${paymentEscape(checkoutDetails.customer.district)}<br>
        ${paymentEscape(checkoutDetails.customer.phone)}
    `;

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedMethod =
            paymentForm.querySelector('input[name="paymentMethod"]:checked');

        if (!selectedMethod) {
            alert("Please select a payment method.");
            return;
        }

        const orderId = "SB" + Date.now().toString().slice(-8);
        const method = selectedMethod.value;

        const order = {
            ...checkoutDetails,
            orderId,
            paymentMethod: method,
            paymentStatus: method === "Cash on Delivery"
                ? "Pay on delivery"
                : "Pending bank transfer confirmation",
            orderStatus: "Order placed",
            total: subtotal,
            placedAt: new Date().toISOString()
        };

        // Save the order record in this browser.
        localStorage.setItem(
            COMPLETED_ORDER_KEY,
            JSON.stringify(order)
        );

        // Demonstration cart cleanup.
        if (typeof saveCart === "function") {
            saveCart([]);
        } else {
            localStorage.removeItem("bakeryCart");
        }

        localStorage.removeItem(ORDER_DETAILS_KEY);

        window.location.href = "order-success.html";
    });
}
