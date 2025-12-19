// ===== Лічильники +/− у картках товарів =====
document.querySelectorAll('.items').forEach(function(counter) {
    let minus = counter.querySelector('[data-action="minus"]');
    let plus = counter.querySelector('[data-action="plus"]');
    let current = counter.querySelector('[data-counter]');

    minus.addEventListener('click', function() {
        let value = parseInt(current.textContent);
        if (value > 1) {
            current.textContent = value - 1;
        }
    });

    plus.addEventListener('click', function() {
        let value = parseInt(current.textContent);
        current.textContent = value + 1;
    });
});

// ===== Масив кошика =====
let cart = [];
const cartWrapper = document.querySelector('.cart-wrapper');
const totalPriceEl = document.querySelector('.total-price');
const cartEmptyEl = document.querySelector('[data-cart-empty]');

// ===== Додавання товару в кошик =====
document.querySelectorAll('[data-cart]').forEach(function(button) {
    button.addEventListener('click', function() {
        const product = button.closest('.card');
        const id = product.dataset.id;
        const title = product.querySelector('.item-title').textContent;
        const priceText = product.querySelector('.price__currency').textContent;
        const price = parseFloat(priceText.replace(/\s|грн\./g, ''));
        const imgSrc = product.querySelector('.product-img').getAttribute('src');
        const count = parseInt(product.querySelector('[data-counter]').textContent);

        // перевіряємо чи товар вже є у кошику
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += count;
        } else {
            cart.push({ id, title, price, imgSrc, qty: count });
        }

        renderCart();
    });
});

// ===== Відображення кошика =====
function renderCart() {
    cartWrapper.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartEmptyEl.classList.remove('none');
    } else {
        cartEmptyEl.classList.add('none');
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        cartWrapper.innerHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__top">
                    <div class="cart-item__img"><img src="${item.imgSrc}" alt=""></div>
                    <div class="cart-item__desc">
                        <div class="cart-item__title">${item.title}</div>
                        <div class="cart-item__details">
                            <div class="items items--small">
                                <div class="items__control" data-action="minus">-</div>
                                <div class="items__current">${item.qty}</div>
                                <div class="items__control" data-action="plus">+</div>
                            </div>
                            <div class="price__currency">${item.price} грн.</div>
                            <button class="btn btn-sm btn-danger ms-2" data-action="remove">x</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    totalPriceEl.textContent = total.toFixed(2);
}

// ===== Зміна кількості у кошику =====
cartWrapper.addEventListener('click', function(event) {
    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const cartItem = event.target.closest('.cart-item');
        const id = cartItem.dataset.id;
        const item = cart.find(product => product.id === id);

        if (event.target.dataset.action === 'plus') {
            item.qty++;
        } else if (event.target.dataset.action === 'minus' && item.qty > 1) {
            item.qty--;
        }

        renderCart();
    }

    // ===== Видалення товару =====
    if (event.target.dataset.action === 'remove') {
        const id = event.target.closest('.cart-item').dataset.id;
        cart = cart.filter(product => product.id !== id);
        renderCart();
    }
});
