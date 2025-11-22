window.onload = () => {
    const basketContainer = document.getElementById("basketContainer");
    const totalPriceElement = document.getElementById("totalPrice");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const searchInput = document.getElementById("searchInput");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchResults = document.getElementById("searchResults");
    const searchTitle = document.getElementById("searchTitle");
    function loadBasket() {
        let basket = JSON.parse(localStorage.getItem("basket")) || [];
        basketContainer.innerHTML = "";

        if (basket.length === 0) {
            basketContainer.innerHTML = `<p class="inner-semibold text-xl">Your basket is empty</p>`;
            totalPriceElement.textContent = "$0.00";
            if (clearAllBtn) clearAllBtn.style.display = "none";
            return;
        }
        if (clearAllBtn) clearAllBtn.style.display = "block";
        let total = 0;
        basket.forEach((item, index) => {
            total += item.price * item.count;
            basketContainer.innerHTML += `
            <div class="p-6 rounded-xl flex flex-col gap-3 group relative bg-white ">
                <div class="relative w-83 h-83 bg-zinc-100 flex items-center justify-center rounded-lg">
                    <img src="${item.image}" class="w-50 h-50 object-contain" />
                    <button class="absolute top-5 right-5 bg-zinc-800 text-white p-2 rounded-full z-10" onclick="removeItem('${item.productId}', ${index})"><img src="./Vector-7.svg" class="w-5 h-5 invert" /></button>
                </div>
                <p class="inter-light ">${item.title}</p>
                <p class="text-[#DB4444] ">$${item.price}</p>
            </div>
            `;
        });

        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }

    function updateTotalPrice() {
        let basket = JSON.parse(localStorage.getItem("basket")) || [];
        let total = basket.reduce((sum, item) => sum + item.price * item.count, 0);
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }
    if (clearAllBtn) clearAllBtn.addEventListener("click", clearAll);
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const value = searchInput.value.trim();
                if (value) fetchSearchResults(value);
            }
        });
    }
    loadBasket();
    async function fetchSearchResults(searchTerm) {
        if (!searchOverlay || !searchResults || !searchTitle) return; 
        try {
            const res = await fetch(`https://ilkinibadov.com/api/v1/search?searchterm=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) throw new Error(`${res.status}`);
            const result = await res.json();
            const products = result.content || [];
            searchOverlay.classList.remove("hidden");
            searchOverlay.classList.add("flex");
            searchTitle.textContent = `${searchTerm}`;
            renderProducts2(products);
        } catch (err) {
            console.error( err);
        }
    }
    function renderProducts2(products) {
        if (!searchResults) return;
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
        product.description = product.description || product.desc || product.details || "No description available";
        product.price = Number(product.price) || 0;
        product.images = product.images || (product.image ? [product.image] : ["./placeholder.png"]);
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "./productDetail.html";
    }
    window.updateCount = async function(productId, index, change) {
        const token = localStorage.getItem("authToken");
        if (!token) {  window.location.href = "login.html"; return; }
        let basket = JSON.parse(localStorage.getItem("basket")) || [];
        let item = basket[index];
        let newCount = item.count + change;
        if (newCount < 1) return;

        try {
            const res = await fetch(`https://ilkinibadov.com/api/v1/basket/update/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ basketItemId: productId, newCount })
            });
            item.count = newCount;
            localStorage.setItem("basket", JSON.stringify(basket));
            document.getElementById(`count-${productId}`).textContent = newCount;
            updateTotalPrice();
        } catch (err) { console.error(err); }
    };

    window.removeItem = async function(productId, index) {
        const token = localStorage.getItem("authToken");
        if (!token) {  window.location.href = "login.html"; return; }
        try {
            await fetch(`https://ilkinibadov.com/api/v1/basket/delete/${productId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            let basket = JSON.parse(localStorage.getItem("basket")) || [];
            basket.splice(index, 1);
            localStorage.setItem("basket", JSON.stringify(basket));
            loadBasket();
        } catch (err) { console.error(err); }
    };

    function clearAll() {
        if (!confirm("Are you sure you want to clear all items from the basket?")) return;
        let basket = JSON.parse(localStorage.getItem("basket")) || [];
        const token = localStorage.getItem("authToken");
        basket.forEach(async item => {
            if (token) await fetch(`https://ilkinibadov.com/api/v1/basket/delete/${item.productId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
        });
        localStorage.removeItem("basket");
        loadBasket();
    }
};
