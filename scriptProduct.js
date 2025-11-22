async function loadProduct() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (!product) {
        alert("No product data found!");
        return;
    }

    console.log("Loaded product:", product);
    document.getElementById('title').textContent = product.title;
    document.getElementById('description').textContent = product.description;
    document.getElementById('price').textContent = `$${product.price.toFixed(2)}`;
    const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
    if (images.length > 0) {
        const mainImage = document.getElementById('main-image');
        const thumbs = document.getElementById('thumbs');
        mainImage.src = images[0];
        thumbs.innerHTML = '';

        images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.className = 'w-[170px] h-[138px] object-contain cursor-pointer bg-zinc-100 rounded-md p-1';
            if (index === 0) thumb.classList.add('border-black');

            thumb.addEventListener('click', () => {
                mainImage.src = img;
                [...thumbs.children].forEach(t => t.classList.remove('border-black'));
                thumb.classList.add('border-black');
            });

            thumbs.appendChild(thumb);
        });
    }
    try {
        if (!product._id) {
            console.warn("Product _id missing, cannot fetch similar products");
            renderSimilarProducts([]);
            return;
        }

        const res = await fetch(`https://ilkinibadov.com/api/v1/products/${product._id}/similar`);
        const data = await res.json();
        console.log("Similar products by ID:", data);

        let similarProducts = [];
        if (Array.isArray(data)) {
            similarProducts = data;
        } else if (data?.success && Array.isArray(data.products)) {
            similarProducts = data.products;
        }

        renderSimilarProducts(similarProducts);

    } catch (err) {
        console.error("Error fetching similar products:", err);
        renderSimilarProducts([]);
    }
}
function renderSimilarProducts(products) {
    const container = document.getElementById('similarProducts');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `<p class="text-center text-black">No similar products found.</p>`;
        return;
    }

    products.forEach(p => {
        let imgSrc = "./placeholder.png";
        if (p.images && Array.isArray(p.images) && p.images.length > 0) {
            imgSrc = p.images[0];
            if (imgSrc.startsWith("./")) imgSrc = window.location.origin + "/" + imgSrc.replace("./", "");
        }

        const item = document.createElement("div");
        item.className = "flex flex-col gap-2 cursor-pointer pb-10 group product-item";

        item.innerHTML = `
            <div class="relative w-83 h-83 bg-zinc-100 flex items-center justify-center">
                <img class="w-50 h-50 object-contain" src="${imgSrc}" />
                <div class="absolute bottom-0 left-0 w-full py-4 bg-black opacity-0 
                    group-hover:opacity-100 duration-300 flex justify-center">
                    <p class="text-white font-semibold">Add To Basket</p>
                </div>
            </div>
            <p class="inter-light text-black">${p.title}</p>
            <p class="text-[#DB4444]">${p.price}$</p>
        `;

        item.addEventListener("click", () => {
            localStorage.setItem("selectedProduct", JSON.stringify(p));
            window.location.href = "./productDetail.html";
        });

        container.appendChild(item);
    });
}

window.addEventListener('DOMContentLoaded', loadProduct);


//_______
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