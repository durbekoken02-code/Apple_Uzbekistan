 (() => {
  const catalog = [
    { name: "iPhone 18 Pro", price: 1099, href: "#iphone-pro" },
    { name: "MacBook Pro", price: 1999, href: "#mac" },
    { name: "Apple Watch", price: 429, href: "#watch" },
    { name: "iPad Air", price: 599, href: "#ipad" },
    { name: "AirPods", price: 249, href: "#airpods" },
    { name: "HomePod Audio", price: 299, href: "#tv-home" },
    { name: "MagSafe Accessory", price: 99, href: "#accessories" },
  ];

  let bag = [];
  let activeModalProduct = null;

  const bagCountEl = document.getElementById("bagCount");
  const bagItemsEl = document.getElementById("bagItems");
  const bagTotalEl = document.getElementById("bagTotal");
  const bagDrawer = document.getElementById("bagDrawer");
  const backdrop = document.getElementById("backdrop");

  function renderBag() {
    const totalCount = bag.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = bag.reduce((sum, item) => sum + item.price * item.qty, 0);

    bagCountEl.textContent = String(totalCount);
    bagTotalEl.textContent = `$${totalPrice.toLocaleString()}`;

    if (bag.length === 0) {
      bagItemsEl.innerHTML = `<p style="color:#6e6e73;font-size:14px;">Your bag is empty.</p>`;
      return;
    }

    bagItemsEl.innerHTML = bag
      .map(
        (item, idx) => `
        <div class="bag-item">
          <div>
            <strong>${item.name}</strong><br />
            <small style="color:#6e6e73;">$${item.price.toLocaleString()} × ${item.qty}</small>
          </div>
          <button class="close-drawer-btn" data-remove-idx="${idx}">Remove</button>
        </div>
      `
      )
      .join("");
  }

  function addToBag(name, price) {
    const existing = bag.find((i) => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      bag.push({ name, price: Number(price), qty: 1 });
    }
    renderBag();
    openBag();
  }

  function openBag() {
    bagDrawer.classList.add("open");
    backdrop.classList.add("open");
    bagDrawer.setAttribute("aria-hidden", "false");
  }

  function closeAllDrawers() {
    bagDrawer.classList.remove("open");
    backdrop.classList.remove("open");
    productModal.classList.remove("open");
    navLinks.classList.remove("open");
    bagDrawer.setAttribute("aria-hidden", "true");
    productModal.setAttribute("aria-hidden", "true");
  }

  // Add to bag buttons
  document.querySelectorAll(".add-bag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToBag(btn.dataset.name, btn.dataset.price);
    });
  });

  // Remove item inside bag
  bagItemsEl.addEventListener("click", (e) => {
    const target = e.target.closest("[data-remove-idx]");
    if (!target) return;
    const idx = Number(target.dataset.removeIdx);
    bag.splice(idx, 1);
    renderBag();
  });

  document.getElementById("bagToggleBtn").addEventListener("click", openBag);
  document.getElementById("closeBagBtn").addEventListener("click", closeAllDrawers);
  backdrop.addEventListener("click", closeAllDrawers);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!bag.length) return;
    alert("Demo checkout complete. Thank you for exploring this Apple UI clone!");
    bag = [];
    renderBag();
    closeAllDrawers();
  });

  // Product modal
  const productModal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");

  document.querySelectorAll(".open-modal-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      activeModalProduct = {
        name: btn.dataset.product,
        price: Number(btn.dataset.price),
      };
      modalTitle.textContent = activeModalProduct.name;
      modalPrice.textContent = `$${activeModalProduct.price.toLocaleString()}`;
      productModal.classList.add("open");
      backdrop.classList.add("open");
      productModal.setAttribute("aria-hidden", "false");
    });
  });

  document.getElementById("closeModalBtn").addEventListener("click", closeAllDrawers);
  document.getElementById("modalAddBtn").addEventListener("click", () => {
    if (activeModalProduct) {
      addToBag(activeModalProduct.name, activeModalProduct.price);
      productModal.classList.remove("open");
    }
  });

  // Mobile burger menu
  const navLinks = document.getElementById("navLinks");
  const burgerBtn = document.getElementById("burgerBtn");
  burgerBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Search drawer
  const searchDrawer = document.getElementById("searchDrawer");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function renderSearch(query = "") {
    const q = query.trim().toLowerCase();
    const matches = catalog.filter((item) => item.name.toLowerCase().includes(q));
    searchResults.innerHTML = matches
      .map(
        (item) =>
          `<a class="search-chip" href="${item.href}" data-close-search="1">${item.name} — $${item.price}</a>`
      )
      .join("");
  }

  document.getElementById("searchToggleBtn").addEventListener("click", () => {
    searchDrawer.classList.toggle("open");
    if (searchDrawer.classList.contains("open")) {
      searchInput.focus();
      renderSearch(searchInput.value);
    }
  });

  document.getElementById("closeSearchBtn").addEventListener("click", () => {
    searchDrawer.classList.remove("open");
  });

  searchInput.addEventListener("input", (e) => renderSearch(e.target.value));
  searchResults.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-search]")) {
      searchDrawer.classList.remove("open");
    }
  });

  // Mobile footer accordion
  document.querySelectorAll(".footer-col h4").forEach((heading) => {
    heading.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        heading.parentElement.classList.toggle("open");
      }
    });
  });

  // Scroll reveal observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  renderBag();
})();