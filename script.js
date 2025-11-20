//_____________ view more button 
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

//______________________ Category 
const categories = document.querySelectorAll('.category'); 
const productsContainer = document.getElementById("products-container");
categories.forEach(cat => {
    cat.addEventListener("click", () => {
        const categoryName = cat.id.toLowerCase(); 
        fetchProductsByCategory(categoryName);
    });
});
async function fetchProductsByCategory(category) {
    try {
        const res = await fetch(`https://ilkinibadov.com/api/v1/products/category/${category}`);
        const data = await res.json();

        renderProducts(data);
    } catch (err) {
        console.error(err);
    }
}
function renderProducts(products) {
    productsContainer.innerHTML = "";

    products.forEach(p => {
        const item = document.createElement("div");
        item.className = "flex flex-col gap-2 cursor-pointer pb-10 group product-item";
        item.innerHTML = `
            <div class="relative w-83 h-83 bg-zinc-100 flex items-center justify-center">
                <img class="w-50 h-50 object-contain" src="${p.images[0]}"/>

                <!-- This element reacts to hover on the parent group -->
                <div class="absolute bottom-0 left-0 w-full py-4 bg-black opacity-0 
                            group-hover:opacity-100 duration-300 flex justify-center">
                    <p class="text-white font-semibold">Add To Basket</p>
                </div>
            </div>

            <p class="inter-light">${p.title}</p>
            <p class="text-[#DB4444]">${p.price}$</p>
        `;

        productsContainer.appendChild(item);
    });
}
//________________Searching

//________________Searching
function renderProducts2(products) {
    productsContainer.innerHTML = "";

    products.forEach(p => {
        const item = document.createElement("div");
        item.className = "flex flex-col gap-2 cursor-pointer pb-10 group product-item";
        item.innerHTML = `
            <div class="relative w-83 h-83 bg-zinc-100 flex items-center justify-center">
                <img class="w-50 h-50 object-contain" src="${p.image}" />

                <div class="absolute bottom-0 left-0 w-full py-4 bg-black opacity-0 
                            group-hover:opacity-100 duration-300 flex justify-center">
                    <p class="text-white font-semibold">Add To Basket</p>
                </div>
            </div>

            <p class="inter-light">${p.title}</p>
            <p class="text-[#DB4444]">${p.price}$</p>
        `;

        productsContainer.appendChild(item);
    });
}

const searchInput = document.getElementById("searchInput");

async function fetchSearchResults(searchTerm) {
    try {
        if (!searchTerm || searchTerm.length < 2) {
            alert("Please type at least 2 characters");
            return;
        }

        const res = await fetch(`https://ilkinibadov.com/api/v1/search?searchterm=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        const products = result.content || [];

        searchOverlay.classList.remove("hidden");
        searchOverlay.classList.add("flex");
        searchTitle.textContent = `Search results for "${searchTerm}"`;

        searchResults.innerHTML = "";
        if (products.length === 0) {
            searchResults.innerHTML = `<p class="col-span-4 text-center text-white">No products found</p>`;
        } else {
            products.forEach(p => {
                const item = document.createElement("div");
                item.className = "flex flex-col gap-2 cursor-pointer pb-10 group product-item bg-zinc-100 p-2 rounded";
                item.innerHTML = `
                    <div class="relative w-full h-48 flex items-center justify-center">
                        <img class="object-contain h-full" src="${p.image}" />
                    </div>
                    <p class="inter-light">${p.title}</p>
                    <p class="text-[#DB4444]">${p.price}$</p>
                `;
                searchResults.appendChild(item);
            });
        }

    } catch (err) {
        console.error("Search error:", err);
    }
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = searchInput.value.trim();
        if (value) fetchSearchResults(value);
    }
});
//_____________
async function loadProducts() {
    const res = await fetch("https://ilkinibadov.com/api/v1/products?page=1&limit=24");
    const data = await res.json();

    const container = document.getElementById("products-container");
    container.innerHTML = '';

    data.products.forEach(product => {
        const card = document.createElement('div');
        card.className = "product-item cursor-pointer flex flex-col gap-2";
        card.setAttribute("data-product", JSON.stringify(product));

        card.innerHTML = `
            <div class="w-full h-40 bg-zinc-100 flex items-center justify-center">
                <img class="w-32 h-32 object-contain" src="${product.images[0]}" />
            </div>
            <p class="text-sm">${product.title}</p>
            <p class="font-bold">$${product.price.toFixed(2)}</p>
        `;

        card.addEventListener("click", () => openProduct(card));
        container.appendChild(card);
    });
}

function openProduct(el) {
    const product = JSON.parse(el.getAttribute("data-product"));
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "productDetail.html"; // make sure this matches your detail page filename
}

window.addEventListener("DOMContentLoaded", loadProducts);
