// Fonctions partagées du panier (localStorage, clé "cart") :
// lecture / écriture, vidage, et modification d'un article depuis son configurateur.
// À charger après js/ral.js.

// Configurateurs capables de rouvrir un article du panier (champ sourcePage des articles).
const CONFIG_PAGES = [
    "config.html",
    "config_personnalisee.html",
    "config_bar_octo.html",
    "config_personnalisee_forme2.html"
];

function readCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function writeCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Vide le panier après confirmation. Renvoie true si le panier a été vidé.
function clearCart() {
    if (readCart().length === 0) {
        alert("Le panier est déjà vide.");
        return false;
    }
    if (!confirm("Vider le panier ? Tous les articles seront supprimés.")) return false;
    writeCart([]);
    return true;
}

// Les packs de barres n'existent plus. Un navigateur qui les a utilisés peut encore avoir un pack
// dans son panier (article { packSize, items }) et les clés de travail de l'ancien parcours :
// on les retire au chargement de la page, avant toute lecture du panier.
function removeLegacyPacks() {
    ["tempPack", "selectedPackSize", "selectedBarsCount", "currentPack"]
        .forEach(key => localStorage.removeItem(key));

    const cart = readCart();
    if (!Array.isArray(cart)) return;
    const bars = cart.filter(item => !(item && item.items));
    if (bars.length !== cart.length) writeCart(bars);
}
removeLegacyPacks();

// Page de configuration d'un article, ou null s'il n'est pas modifiable (modèle inconnu).
// Les articles ajoutés avant l'introduction de sourcePage n'ont pas ce champ :
// on déduit alors la page à partir du nom de modèle.
function getConfigPage(item) {
    if (!item) return null;
    if (CONFIG_PAGES.includes(item.sourcePage)) return item.sourcePage;

    const model = String(item.model || "");
    if (/^\d+$/.test(model)) return "config.html";
    if (model === "BARRE PERSONNALISÉE") return "config_personnalisee.html";
    if (model === "BARRE_OCTO_PERSONNALISABLE") return "config_bar_octo.html";
    if (model === "BARRE 113 PERSONNALISÉE") return "config_personnalisee_forme2.html";
    return null;
}

// Nom d'un article tel qu'il est affiché dans le panier, le devis et le PDF.
// La palanque personnalisée est enregistrée sous le nom de modèle "BARRE 113 PERSONNALISÉE" :
// cet identifiant est conservé pour que les articles déjà au panier restent reconnus et modifiables.
function getModelLabel(item) {
    if (getConfigPage(item) === "config_personnalisee_forme2.html") return "Palanque personnalisée";
    return `Modèle ${item.model}`;
}

// Adresse du configurateur en mode modification pour la ligne `index` du panier, ou null.
function getEditUrl(item, index) {
    const page = getConfigPage(item);
    if (!page) return null;
    if (page === "config.html") {
        return `config.html?model=${encodeURIComponent(item.model)}&edit=${index}`;
    }
    return `${page}?edit=${index}`;
}

// Lit ?edit=<index> dans l'adresse. Renvoie { index, item, snapshot } si la ligne existe
// et appartient bien à ce configurateur (et à ce modèle, pour le catalogue) ; sinon null.
function getEditContext(page, model) {
    const raw = new URLSearchParams(window.location.search).get("edit");
    if (raw === null) return null;

    const index = /^\d+$/.test(raw) ? parseInt(raw, 10) : -1;
    const item = readCart()[index];
    const matches = item && getConfigPage(item) === page &&
        (model === undefined || String(item.model) === String(model));

    if (!matches) {
        alert("L'article à modifier est introuvable dans le panier. Vous pouvez configurer une nouvelle barre.");
        return null;
    }
    return {
        index,
        item,
        snapshot: JSON.stringify(item)
    };
}

// Enregistre un article : remplace la ligne en cours de modification (editContext),
// sinon ajoute une ligne. Renvoie "added", "updated" ou "cancelled".
function saveCartItem(newItem, editContext) {
    const cart = readCart();

    if (!editContext) {
        cart.push(newItem);
        writeCart(cart);
        return "added";
    }

    // Le panier a pu changer dans un autre onglet : on vérifie que la ligne est toujours
    // la même, et on la recherche ailleurs si elle a été décalée par une suppression.
    let index = editContext.index;
    if (JSON.stringify(cart[index]) !== editContext.snapshot) {
        index = cart.findIndex(item => JSON.stringify(item) === editContext.snapshot);
    }

    if (index === -1) {
        if (!confirm("L'article d'origine a été modifié ou supprimé du panier entre-temps. Ajouter cette barre comme nouvel article ?")) {
            return "cancelled";
        }
        cart.push(newItem);
    } else {
        cart[index] = newItem;
    }
    writeCart(cart);
    return "updated";
}

// Sélectionne `value` dans le <select> `id`, seulement si cette option existe.
function setSelectValue(id, value) {
    const select = document.getElementById(id);
    const wanted = String(value);
    if (Array.from(select.options).some(option => option.value === wanted)) {
        select.value = wanted;
    }
}

// Largeurs de rayures enregistrées dans un article, ou null si elles sont inexploitables.
function validStripeWidths(widths) {
    const ok = Array.isArray(widths) && widths.length > 0 &&
        widths.every(w => typeof w === "number" && w > 0);
    return ok ? widths : null;
}

// Recopie sur les rayures affichées les couleurs des rayures du SVG enregistré dans l'article.
function restoreStripeColors(savedSvg) {
    const savedRects = new DOMParser()
        .parseFromString(savedSvg || "", "text/html")
        .querySelectorAll("svg rect");

    document.querySelectorAll("#svgContainer svg rect").forEach((rect, i) => {
        const fill = savedRects[i] && savedRects[i].getAttribute("fill");
        if (fill) rect.setAttribute("fill", fill);
    });
}

// Table { hex: libellé } à enregistrer dans l'article : les RAL personnalisés ajoutés à la palette
// du configurateur ET utilisés sur la barre (`colorsUsed` : couleurs des rayures).
function collectCustomRals(colorsUsed) {
    const used = colorsUsed.map(color => color.toLowerCase());
    const table = {};
    document.querySelectorAll("#colorPalette .color-swatch[data-custom-ral]").forEach(swatch => {
        if (used.includes(swatch.dataset.color)) {
            table[swatch.dataset.color] = swatch.dataset.customRal;
        }
    });
    return table;
}

// Vrai si le clic vient d'un doigt ou d'un stylet plutôt que d'une souris.
function isFingerTap(event) {
    if (event.pointerType) return event.pointerType !== "mouse";
    return window.matchMedia("(pointer: coarse)").matches;
}

// Sur téléphone, les rayures et les zones les plus étroites des barres ne font que quelques pixels
// de large : trop peu pour un doigt. Chaque pièce de `shapes` reçoit donc une surface tactile d'au
// moins 28 px de large, prolongée de 8 px au-dessus et au-dessous, et parmi les pièces dont la
// surface contient le point touché (x, y), on renvoie celle dont le centre est le plus proche.
// Une pièce étroite se touche ainsi en visant à peu près, sans gêner les pièces larges voisines.
// Renvoie null si le point est trop loin de toute pièce.
function shapeAtFinger(shapes, x, y) {
    const MIN_WIDTH = 28;
    const PAD_Y = 8;
    let best = null;
    let bestDistance = Infinity;

    shapes.forEach(shape => {
        const rect = shape.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const padX = Math.max(0, (MIN_WIDTH - rect.width) / 2);
        if (x < rect.left - padX || x > rect.right + padX) return;
        if (y < rect.top - PAD_Y || y > rect.bottom + PAD_Y) return;

        const distance = Math.abs(x - (rect.left + rect.right) / 2);
        if (distance < bestDistance) {
            best = shape;
            bestDistance = distance;
        }
    });
    return best;
}

// Configurateurs à rayures : au doigt, c'est la rayure la plus proche du point touché qui est
// colorée (voir shapeAtFinger) ; à la souris, le clic reste exact. `paint(rect)` colore la rayure.
// À appeler une fois : l'écoute porte sur #svgContainer, qui survit aux régénérations de la barre.
function enableFingerStripes(paint) {
    const svgContainer = document.getElementById("svgContainer");
    svgContainer.addEventListener("click", event => {
        if (!isFingerTap(event)) return;
        const stripe = shapeAtFinger(svgContainer.querySelectorAll("svg rect"), event.clientX, event.clientY);
        if (!stripe) return;
        event.stopPropagation();
        paint(stripe);
    }, true);
}
