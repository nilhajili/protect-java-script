const viewMoreBtn = document.getElementById('viewMoreBtn');
const yuxariBtn = document.getElementById('yuxariBtn');
let visibleCount = 8; 
function showProducts() {
    const products = document.querySelectorAll('.product-item');

    for (let i = 0; i < products.length; i++) {
        if (i < visibleCount) {
            products[i].classList.remove('hidden');
            products[i].classList.add('flex'); 
        } else {
            products[i].classList.add('hidden');
            products[i].classList.remove('flex');
        }
    }

    if (visibleCount >= products.length) {
        viewMoreBtn.classList.add('hidden');
    } else {
        viewMoreBtn.classList.remove('hidden');
    }
}
showProducts();
yuxariBtn.addEventListener('click', () => {
    visibleCount = 8;
    showProducts();
});
viewMoreBtn.addEventListener('click', () => {
    visibleCount += 4;
    showProducts();
});

