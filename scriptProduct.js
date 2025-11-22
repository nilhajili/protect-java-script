async function loadProduct() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    console.log("Loaded product:", product);
    document.getElementById('title').textContent = product.title;
    document.getElementById('description').textContent = product.description;
    const price = Number(product.price);
    document.getElementById('price').textContent = `$${isNaN(price) ? product.price : price.toFixed(2)}`;
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
            renderSimilarProducts([]);
            return;
        }
        const res = await fetch(`https://ilkinibadov.com/api/v1/products/${product._id}/similar`);
        const data = await res.json();
        console.log( data);
        let similarProducts = [];
        if (Array.isArray(data)) {
            similarProducts = data;
        } else if (data?.success && Array.isArray(data.products)) {
            similarProducts = data.products;
        }
        renderSimilarProducts(similarProducts);
    } catch (err) {
        console.error( err);
        renderSimilarProducts([]);
    }
}
function renderSimilarProducts(products) {
    const container = document.getElementById('similarProducts');
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = `<p class="text-center text-black">No similar products</p>`;
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
const searchInput = document.getElementById("searchInput");

async function fetchSearchResults(searchTerm) {
    try {
        const res = await fetch(`https://ilkinibadov.com/api/v1/search?searchterm=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        const products = result.content || [];
        searchOverlay.classList.remove("hidden");
        searchOverlay.classList.add("flex");
        searchTitle.textContent = `"${searchTerm}"`;
        renderProducts2(products);

    } catch (err) {
        console.error("Search error", err);
    }
}
function renderProducts2(products) {
    searchResults.innerHTML = "";

    products.forEach(p => {
        const product = { ...p };
        product._id = product._id || product.id || product.productId || "no-id";
        product.price = Number(product.price) || 0;
        product.images = product.images || (product.image ? [product.image] : ["./placeholder.png"]);
        product.description = product.description || p.desc || p.details || "No description";
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
///_________________________
const addToBasketBtn = document.getElementById("addToBasketBtn");
addToBasketBtn.addEventListener("click", addToBasket);

async function addToBasket() {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const token = localStorage.getItem("authToken");

    if (!product || !product._id) {
        alert("Product not found");
        return;
    }

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://ilkinibadov.com/api/v1/basket/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: product._id,
                count: 1
            })
        });

        const data = await response.json();
        console.log("Add to basket response:", data);
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                window.location.href = "login.html";
                return;
            }
            alert(data.message );
            return;
        }
        let basket = JSON.parse(localStorage.getItem("basket")) || [];
        basket.push({
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || "",
            count: 1
        });
        localStorage.setItem("basket", JSON.stringify(basket));
        window.location.href = "basket.html";

    } catch (err) {
        console.error(err);
    }
}
