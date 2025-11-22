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
        item.dataset.product = JSON.stringify(p);
        item.innerHTML = `
            <div class="relative w-83 h-83 bg-zinc-100 flex items-center justify-center">
                <img class="w-50 h-50 object-contain" src="${p.images[0]}"/>

                <div class="absolute bottom-0 left-0 w-full py-4 bg-black opacity-0 
                            group-hover:opacity-100 duration-300 flex justify-center">
                    <p class="text-white font-semibold">Add To Basket</p>
                </div>
            </div>

            <p class="inter-light">${p.title}</p>
            <p class="text-[#DB4444]">${p.price}$</p>
        `;
        item.addEventListener("click", () => openProduct(item));
        productsContainer.appendChild(item);
    });
}
//________________Searching
const searchInput = document.getElementById("searchInput");
async function fetchSearchResults(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
        return;
    }
    try {
        const res = await fetch(`https://ilkinibadov.com/api/v1/search?searchterm=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const result = await res.json();
        const products = result.content || [];
        searchOverlay.classList.remove("hidden");
        searchOverlay.classList.add("flex");
        searchTitle.textContent = `Search results for "${searchTerm}"`;
        renderProducts2(products);
    } catch (err) {
        console.error("Search error:", err);
    }
}
function renderProducts2(products) {
    searchResults.innerHTML = "";
    products.forEach(p => {
        const product = { ...p };
        product._id = product._id || product.id || product.productId || "no-id";
        product.price = Number(product.price) || 0;
        product.images = product.images || (product.image ? [product.image] : ["./placeholder.png"]);
        product.description = product.description || p.desc || p.details || "No description ";
        const item = document.createElement("div");
        item.className = "flex flex-col gap-2 cursor-pointer pb-10 group product-item bg-zinc-100 p-2 rounded";
        item.dataset.product = JSON.stringify(product);
        item.innerHTML = `
            <div class="relative w-full h-48 flex items-center justify-center">
                <img class="object-contain h-full" src="${product.images[0]}" />
            </div>
            <p class="inter-light font-semibold">${product.title}</p>
            <p class="text-[#DB4444] font-bold">${product.price}$</p>
        `;
        item.addEventListener("click", () => openProduct(item));
        searchResults.appendChild(item);
    });
}
function openProduct(element) {
    const product = JSON.parse(element.dataset.product);
    product._id = product._id || product.id || product.productId || "no-id";
    product.title = product.title || "No title";
    product.description = product.description || product.desc || product.details || "No description ";
    product.price = Number(product.price) || 0;
    product.images = product.images || (product.image ? [product.image] : ["./placeholder.png"]);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "./productDetail.html";
}
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = searchInput.value.trim();
        if (value) fetchSearchResults(value);
    }
});
