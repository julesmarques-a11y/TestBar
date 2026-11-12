// En-tête et pied de page communs à toutes les pages, injectés au chargement (script chargé avec defer).
// En-tête : logo, bouton « Panier » avec le nombre de barres, barre d'étapes du parcours.
// Pied de page : logo, copyright avec l'année courante, lien vers le site du client.
(function () {
    "use strict";

    const PAGE = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const STEP_OF_PAGE = {
        "index.html": 1,
        "config.html": 2,
        "config_personnalisee.html": 2,
        "config_bar_octo.html": 2,
        "config_personnalisee_forme2.html": 2,
        "panier.html": 3,
        "devis.html": 4
    };
    const currentStep = STEP_OF_PAGE[PAGE] || 1;

    // Le dernier configurateur ouvert est mémorisé : depuis le panier ou le devis, l'étape
    // « Configurer » y ramène (sinon vers le catalogue).
    const LAST_CONFIG_KEY = "lastConfigUrl";
    if (currentStep === 2) {
        try { localStorage.setItem(LAST_CONFIG_KEY, PAGE + window.location.search); } catch (e) { /* stockage indisponible */ }
    }
    let lastConfig = "index.html";
    try { lastConfig = localStorage.getItem(LAST_CONFIG_KEY) || "index.html"; } catch (e) { /* idem */ }

    const STEPS = [
        { number: 1, label: "Choisir", href: "index.html" },
        { number: 2, label: "Configurer", href: lastConfig },
        { number: 3, label: "Panier", href: "panier.html" },
        { number: 4, label: "Devis", href: "devis.html" }
    ];

    // Nombre de barres dans le panier (somme des quantités), hors anciens packs.
    function countCartBars() {
        let cart;
        try { cart = JSON.parse(localStorage.getItem("cart")); } catch (e) { return 0; }
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => {
            if (!item || item.items) return total;
            const quantity = parseInt(item.quantity, 10);
            return total + (quantity > 0 ? quantity : 1);
        }, 0);
    }

    function updateCartCount() {
        const badge = document.getElementById("siteCartCount");
        if (!badge) return;
        const count = countCartBars();
        badge.textContent = String(count);
        badge.parentElement.title = count === 0 ? "Panier vide" : count === 1 ? "1 barre dans le panier" : count + " barres dans le panier";
    }
    window.updateCartCount = updateCartCount;

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function buildSteps() {
        return STEPS.map(step => {
            const inner = `<span class="site-step-num">${step.number}</span><span class="site-step-label">${escapeHtml(step.label)}</span>`;
            if (step.number === currentStep) {
                return `<li><span class="site-step site-step-current" aria-current="step">${inner}</span></li>`;
            }
            if (step.number < currentStep) {
                return `<li><a class="site-step site-step-done" href="${escapeHtml(step.href)}">${inner}</a></li>`;
            }
            return `<li><span class="site-step site-step-todo">${inner}</span></li>`;
        }).join("");
    }

    function buildHeader() {
        const header = document.createElement("header");
        header.className = "site-header";
        header.innerHTML = `
            <div class="site-header-bar">
                <a class="site-logo" href="index.html" title="Accueil du configurateur">
                    <img src="img/logo-equinox.png" alt="EQUINOX – Créateur d'espaces équestres">
                </a>
                <a class="site-cart-btn" href="panier.html">
                    Panier<span class="site-cart-count" id="siteCartCount">0</span>
                </a>
            </div>
            <nav class="site-steps-nav" aria-label="Étapes du parcours">
                <ol class="site-steps">${buildSteps()}</ol>
            </nav>`;
        return header;
    }

    function buildFooter() {
        const footer = document.createElement("footer");
        footer.className = "site-footer";
        footer.innerHTML = `
            <div class="site-footer-inner">
                <a class="site-footer-logo" href="https://www.horsequinox.com/" title="Site EQUINOX">
                    <img src="img/logo-equinox.png" alt="EQUINOX">
                </a>
                <p class="site-footer-text">
                    Copyright © SARL EQUINOX ${new Date().getFullYear()}
                    · <a href="https://www.horsequinox.com/">www.horsequinox.com</a>
                </p>
            </div>`;
        return footer;
    }

    document.body.prepend(buildHeader());
    document.body.append(buildFooter());
    updateCartCount();

    // Panier modifié dans un autre onglet.
    window.addEventListener("storage", event => {
        if (event.key === "cart" || event.key === null) updateCartCount();
    });
})();
