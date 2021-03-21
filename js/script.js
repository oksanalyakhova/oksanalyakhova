const select = document.getElementById('select');
const selectPrice = document.getElementById('select-price');
const item = [...document.getElementsByClassName('product-box__item')];
const number = document.getElementById('number');
const amount = document.getElementById('amount');
const modal = document.getElementById('modal');
const fields = [...modal.querySelectorAll('.modal input')];
const fields_regex = {
    name: /^[a-zA-Z]+([a-zA-Z ])*$/,
    email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/
}

// events
document.addEventListener('change', selectChange);
document.addEventListener('click', addToCart);
document.addEventListener('click', checkCart);
document.addEventListener('click', submit);

// select
function selectChange(e) {
    const {target} = e;
    if (target.id !== 'select' && target.id !== 'select-price') return;

    const selected = parseInt(select.value);
    const selectedPrice = parseInt(selectPrice.value);

    // hide list
    hideList(item);

    // show selected items
    item.forEach((el) => {
        const category = parseInt(el.dataset.category);
        const price = parseInt(el.dataset.price);

        if ((selected === category && selectedPrice >= price) ||
            (selected === 0 && selectedPrice >= price) ||
            (selectedPrice === 0 && selected === category) ||
            (selected === 0 && selectedPrice === 0)) {
                showList(el);
        }
    })
}

function hideList(els) {
    els.forEach((el) => {
        if (el.classList.contains('is-shown')) el.classList.remove('is-shown');
        el.classList.add('is-hidden');
    })
}

function showList(el) {
    if (el.classList.contains('is-hidden')) el.classList.remove('is-hidden');
    el.classList.add('is-shown');
}

// add to cart
function addToCart(e) {
    const {target} = e;
    if (!target.classList.contains('product-box__btn')) return;

    const product = target.closest('.product-box__item');
    const numbers = product.querySelector('.qty__item');
    const amounts = product.dataset.price;

    if (numbers.value === '') {
        numbers.value = 1;
        showCartData(target,1, parseInt(amounts))
    } else {
        showCartData(target, 1,
            amounts * parseInt(numbers.value))
    }

    target.dataset.clicked = 'true';
}

function showCartData(t, n, a) {
    const currentNumber = number.innerText;
    const currentAmount = amount.innerText;

    if (currentNumber !== 'XXX') {
        t.dataset.clicked === 'true'
            ? number.innerText = parseInt(currentNumber)
            : number.innerText = parseInt(currentNumber) + 1
    } else {
        number.innerText = n;
    }

    currentAmount !== 'XXX'
        ? amount.innerText = parseInt(currentAmount) + a
        : amount.innerText = a;
}

// check cart
function checkCart(e) {
    const {target} = e;
    if (!target.classList.contains('btn-check')) return;

    if (!modal.classList.contains('is-shown')) {
        modal.classList.add('is-shown');
    }
}

// submit form
function submit(e) {
    const {target} = e;
    if (!target.classList.contains('submit')) return;

    e.preventDefault();
    validate();
}

function validate() {
    let e = 0;
    let regex = undefined;

    function mark(object, expression) {
        if (expression) {
            object.classList.add('invalid');
            e++;
        } else {
            object.classList.add('valid');
        }
    }

    fields.forEach((el) => {
        switch (el.dataset.validate) {
            case 'name':
                regex = fields_regex.name;
                mark(el, !regex.test(el.value));
                break;
            case 'email':
                regex = fields_regex.email;
                mark(el, !regex.test(el.value));
                break;
        }
    })

    if (e === 0) {
        successOrder();
        return true;
    } else {
        errorOrder()
        return false;
    }
}

function errorOrder() {
    alert('Fill in the fields correctly!');
}

function successOrder() {
    alert('Thank you for your order!');
    modal.classList.remove('is-shown');
    number.innerText = 'XXX';
    amount.innerText = 'XXX';
}
