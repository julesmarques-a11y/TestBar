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

// Gammes des modèles du catalogue (config.html?model=1xx&gamme=...) :
// - « hors cœur » (anciennement « barres de série ») : 3 m ou 3,50 m. Un article sans champ gamme
//   est hors cœur : c'est le cas de tous ceux ajoutés avant que la gamme porte ce nom ;
// - « plein cœur » (champ gamme des articles) : 3 m uniquement.
// Les articles des trois configurateurs à rayures sont « sur mesure ».
const HORS_COEUR = "hors-coeur";
const PLEIN_COEUR = "plein-coeur";
const SUR_MESURE = "sur-mesure";

// Modèles proposés dans chaque gamme (catalogue.html?gamme=...), dans l'ordre d'affichage.
// Le modèle 114 n'est plus proposé : Bar_V114.svg reste pour les paniers qui en contiennent un.
const CATALOGUE = {
    [HORS_COEUR]: {
        label: "Barres hors cœur",
        intro: "Barres de compétition, en 3 m ou 3,50 m. Choisissez un modèle pour le mettre à vos couleurs RAL.",
        models: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 115]
    },
    [PLEIN_COEUR]: {
        label: "Barres plein cœur 3 m",
        intro: "Barres économiques pour l'entraînement, en 3 m uniquement. Choisissez un modèle pour le mettre à vos couleurs RAL.",
        models: [101, 102, 104, 105, 108, 110, 111, 113, 115]
    }
};

function isPleinCoeur(item) {
    return Boolean(item) && item.gamme === PLEIN_COEUR;
}

// Gamme d'un article du panier : HORS_COEUR, PLEIN_COEUR ou SUR_MESURE.
function getGamme(item) {
    if (getConfigPage(item) !== "config.html") return SUR_MESURE;
    return isPleinCoeur(item) ? PLEIN_COEUR : HORS_COEUR;
}

// Statistiques du panier et du devis : nombre de barres (somme des quantités) par gamme, les
// barres hors cœur étant séparées par longueur. Une barre hors cœur sans longueur connue ne
// compte que dans le total.
function countBars(cart) {
    const counts = { horsCoeur3m: 0, horsCoeur35m: 0, pleinCoeur: 0, surMesure: 0, total: 0 };
    cart.forEach(item => {
        const qty = parseInt(item.quantity, 10) > 0 ? parseInt(item.quantity, 10) : 1;
        const gamme = getGamme(item);
        if (gamme === SUR_MESURE) counts.surMesure += qty;
        else if (gamme === PLEIN_COEUR) counts.pleinCoeur += qty;
        else if (item.length === "3m") counts.horsCoeur3m += qty;
        else if (item.length === "3.5m") counts.horsCoeur35m += qty;
        counts.total += qty;
    });
    return counts;
}

// Écrit ces statistiques dans les éléments #countHorsCoeur3m, #countHorsCoeur35m,
// #countPleinCoeur, #countSurMesure et #countTotal de la page.
function showBarCounts(cart) {
    const counts = countBars(cart);
    const set = (id, value) => { document.getElementById(id).textContent = value; };
    set("countHorsCoeur3m", counts.horsCoeur3m);
    set("countHorsCoeur35m", counts.horsCoeur35m);
    set("countPleinCoeur", counts.pleinCoeur);
    set("countSurMesure", counts.surMesure);
    set("countTotal", counts.total);
}

function readCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function writeCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Compteur du bouton « Panier » de l'en-tête (js/layout.js), s'il est chargé.
    if (typeof window.updateCartCount === "function") window.updateCartCount();
}

// Vide le panier après confirmation. Renvoie une promesse : true si le panier a été vidé.
async function clearCart() {
    if (readCart().length === 0) {
        showToast("Le panier est déjà vide.");
        return false;
    }
    const ok = await confirmDialog("Vider le panier ? Tous les articles seront supprimés.", { okLabel: "Vider le panier" });
    if (!ok) return false;
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
// La palanque personnalisée est enregistrée sous le nom de modèle "BARRE 113 PERSONNALISÉE" et
// la barre octo sous "BARRE_OCTO_PERSONNALISABLE" : ces identifiants sont conservés pour que les
// articles déjà au panier restent reconnus et modifiables.
function getModelLabel(item) {
    if (isMatchingPalanque(item)) return `Palanque assortie au modèle ${item.matchedModel}`;
    const page = getConfigPage(item);
    if (page === "config_personnalisee_forme2.html") return "Palanque personnalisée";
    if (page === "config_bar_octo.html") return "Barre octo personnalisée";
    if (page === "config_personnalisee.html") return "Barre personnalisée";
    return `Modèle ${item.model}` + (isPleinCoeur(item) ? " – Plein cœur" : " – Hors cœur");
}

// Configurateurs à rayures : une rayure non peinte y reste blanche (#ffffff, hors palette).
const STRIPE_PAGES = [
    "config_personnalisee.html",
    "config_bar_octo.html",
    "config_personnalisee_forme2.html"
];

// Vrai si l'article vient d'un configurateur à rayures et qu'une rayure y est restée blanche.
// Le SVG est lu dans un document inerte (DOMParser), jamais inséré dans la page.
function hasUnpaintedStripe(item) {
    if (!STRIPE_PAGES.includes(getConfigPage(item))) return false;
    const rects = new DOMParser().parseFromString(item.svg || "", "text/html").querySelectorAll("svg rect");
    return Array.from(rects).some(rect => /^(#fff|#ffffff|white)$/i.test((rect.getAttribute("fill") || "").trim()));
}

// Couleurs d'un article à afficher dans le panier, le devis et le PDF : ses couleurs avec leur
// libellé (RAL personnalisé de l'article ou RAL du nuancier, sinon null), puis, si une rayure est
// restée blanche, une pastille blanche qui signale au peintre qu'il manque un RAL.
function getDisplayColors(item) {
    const customRals = getCustomRals(item);
    const colors = (item.colors || []).map(hex => ({ hex, label: getColorLabel(hex, customRals) }));
    if (hasUnpaintedStripe(item)) colors.push({ hex: "#ffffff", label: "Blanc (RAL à préciser)" });
    return colors;
}

// Adresse du configurateur en mode modification pour la ligne `index` du panier, ou null.
function getEditUrl(item, index) {
    const page = getConfigPage(item);
    if (!page) return null;
    if (page === "config.html") {
        return `config.html?model=${encodeURIComponent(item.model)}&gamme=${getGamme(item)}&edit=${index}`;
    }
    return `${page}?edit=${index}`;
}

// Lit ?edit=<index> dans l'adresse. Renvoie { index, item, snapshot } si la ligne existe
// et appartient bien à ce configurateur (et à ce modèle et cette gamme, pour le catalogue) ;
// sinon null.
function getEditContext(page, model, gamme) {
    const raw = new URLSearchParams(window.location.search).get("edit");
    if (raw === null) return null;

    const index = /^\d+$/.test(raw) ? parseInt(raw, 10) : -1;
    const item = readCart()[index];
    const matches = item && getConfigPage(item) === page &&
        (model === undefined || String(item.model) === String(model)) &&
        (model === undefined || isPleinCoeur(item) === (gamme === PLEIN_COEUR));

    if (!matches) {
        showToast("L'article à modifier est introuvable dans le panier. Vous pouvez configurer une nouvelle barre.", { type: "error" });
        return null;
    }
    return {
        index,
        item,
        snapshot: JSON.stringify(item)
    };
}

// Bandeau en tête du configurateur quand un article du panier est en cours de modification,
// avec un lien « Annuler » qui revient au panier sans rien changer. Si la barre a une palanque
// assortie dans le panier, le bandeau le rappelle.
function showEditBanner(editContext) {
    if (!editContext) return;
    const palanque = findLinkedPalanque(readCart(), editContext.item);
    const banner = document.createElement("div");
    banner.className = "edit-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML = `
        <span class="edit-banner-text">Vous modifiez un article du panier : <strong></strong> (ligne ${editContext.index + 1})${
        palanque ? ` et sa palanque assortie (ligne ${palanque.index + 1})` : ""}.
        Vos changements seront enregistrés avec « Mettre à jour l'article ».</span>
        <a class="btn btn-neutral" href="panier.html">Annuler</a>`;
    banner.querySelector("strong").textContent = getModelLabel(editContext.item);
    const intro = document.querySelector(".page-intro");
    if (intro) intro.prepend(banner);
    else document.body.prepend(banner);
}

// Enregistre un article : remplace la ligne en cours de modification (editContext),
// sinon ajoute une ligne. Renvoie une promesse de "added", "updated" ou "cancelled".
async function saveCartItem(newItem, editContext) {
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
        const ok = await confirmDialog("L'article d'origine a été modifié ou supprimé du panier entre-temps. Ajouter cette barre comme nouvel article ?",
            { okLabel: "Ajouter comme nouvel article" });
        if (!ok) return "cancelled";
        cart.push(newItem);
    } else {
        cart[index] = newItem;
    }
    writeCart(cart);
    return "updated";
}

// ---- Palanque : dessin commun à config_personnalisee_forme2.html et à la palanque assortie ----

// Cadre du dessin de la palanque, en unités du SVG.
const PALANQUE_SHAPE = { x: 200.3155, y: 200.3155, width: 400.522, height: 40.05364 };

// SVG d'une palanque de `totalCm` de long. `stripes` : ses rayures de gauche à droite,
// [{ width: largeur en cm, fill: couleur }]. Les rayures sont rognées sur la forme de la palanque.
function buildPalanqueSvg(stripes, totalCm) {
    const shape = PALANQUE_SHAPE;
    let xUnits = shape.x;
    let stripesMarkup = "";

    stripes.forEach((stripe, i) => {
        const stripeUnitsWidth = (stripe.width / totalCm) * shape.width;
        stripesMarkup += `<rect data-stripe="${i}" x="${xUnits}" y="${shape.y}" width="${stripeUnitsWidth}" height="${shape.height}" fill="${stripe.fill}" stroke="#bdc3c7" stroke-width="0.2" shape-rendering="crispEdges" />`;
        xUnits += stripeUnitsWidth;
    });

    return `<svg viewBox="${shape.x} ${shape.y} ${shape.width} ${shape.height}" width="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="barShapeClip">
      <path d="m 220.64959,220.49723 360.31916,-0.18284 -3.22536,3.60346 -2.32709,3.98622 -1.33592,3.03815 -1.5083,6.85199 -0.10774,2.6072 -343.77008,-0.0667 -1.02082,-8.15132 -3.18435,-6.65819 z" />
      <path d="m 200.56075,220.47031 c 0.0862,-0.68951 -0.15997,-20.06953 -0.15997,-20.06953 l 400.41959,-0.0986 0.0163,20.05791 z" />
      <path d="m 219.39295,218.72499 2.80113,3.63069 357.1007,-0.37707 3.18898,-3.66302 z" />
    </clipPath>
  </defs>
  <g clip-path="url(#barShapeClip)">
    ${stripesMarkup}
  </g>
  <g fill="none" stroke="#000000" stroke-width="0.631" stroke-linecap="round">
    <path d="m 228.63699,240.36812 a 28.321171,28.321171 0 0 0 -8.29508,-20.02609" />
    <path d="m 220.3415,220.3425 h -20.026" />
    <path d="m 200.3155,220.3425 v -20.027" />
    <path d="m 200.3155,200.3155 h 400.522" />
    <path d="m 600.8375,220.3425 v -20.027" />
    <path d="m 600.8375,220.3425 h -20.026" />
    <path d="m 580.81157,220.34203 a 28.321171,28.321171 0 0 0 -8.29508,20.02609" />
    <path d="M 228.63672 240.36914 L 572.51562 240.36914 L 228.63672 240.36914 z" />
  </g>
</svg>`;
}

// ---- Palanque assortie à une barre du catalogue (option de config.html) ----
// C'est un article à part du panier, du devis et du PDF. Il porte le modèle de sa barre
// (matchedModel) et, tant que cette barre est au panier, son identifiant (linkedTo = champ id de
// la barre) : « Modifier » et « Supprimer » sur la barre proposent alors d'en faire autant sur
// la palanque. Son dessin est celui de la palanque personnalisée, avec une rayure par bande de la
// barre : sans barre liée, elle se modifie donc dans config_personnalisee_forme2.html.

function isMatchingPalanque(item) {
    return Boolean(item) && Boolean(item.matchedModel);
}

// Identifiant donné à une barre quand on lui associe une palanque.
function newItemId() {
    return "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Palanque assortie à la barre `bar` dans `cart` : { index, item }, ou null.
function findLinkedPalanque(cart, bar) {
    if (!bar || !bar.id) return null;
    const index = cart.findIndex(item => item && item.linkedTo === bar.id);
    return index === -1 ? null : { index, item: cart[index] };
}

// Barre à laquelle la palanque `palanque` est assortie dans `cart` : { index, item }, ou null.
function findLinkedBar(cart, palanque) {
    if (!palanque || !palanque.linkedTo) return null;
    const index = cart.findIndex(item => item && item.id === palanque.linkedTo);
    return index === -1 ? null : { index, item: cart[index] };
}

// Article « palanque assortie » de la barre `bar` (qui doit avoir un id). `bands` : les bandes de
// la barre de gauche à droite, [{ share: part de la longueur, fill: couleur }] ; la palanque a la
// longueur de la barre, les mêmes couleurs dans le même ordre et les mêmes RAL personnalisés.
function makeMatchingPalanque(bar, bands, heightMm, quantity) {
    const totalCm = bar.length === "3.5m" ? 350 : 300;
    const widths = bands.map(band => band.share * totalCm);
    return {
        model: "PALANQUE ASSORTIE",
        matchedModel: String(bar.model),
        linkedTo: bar.id,
        colors: [...new Set(bands.map(band => band.fill))],
        quantity: quantity,
        length: bar.length,
        height: heightMm + " mm",
        svg: buildPalanqueSvg(bands.map((band, i) => ({ width: widths[i], fill: band.fill })), totalCm),
        stripes: bands.length,
        widths_cm: widths,
        total_length_cm: totalCm,
        custom_rals: { ...(bar.custom_rals || {}) },
        sourcePage: "config_personnalisee_forme2.html"
    };
}

// Enregistre la palanque assortie de la barre `bar` : remplace celle du panier, sinon l'ajoute
// juste après la barre. `palanque` à null : retire celle du panier.
function saveLinkedPalanque(bar, palanque) {
    if (!bar.id) return;
    const cart = readCart();
    const existing = findLinkedPalanque(cart, bar);
    if (existing && palanque) {
        cart[existing.index] = palanque;
    } else if (existing) {
        cart.splice(existing.index, 1);
    } else if (palanque) {
        const barIndex = cart.findIndex(item => item && item.id === bar.id);
        cart.splice(barIndex === -1 ? cart.length : barIndex + 1, 0, palanque);
    }
    writeCart(cart);
}

// Message après enregistrement d'un article : « Continuer » reste sur la page, « Voir le panier » y va.
function notifyCartSaved(result, addedMessage) {
    if (result === "cancelled") return;
    showToast(result === "updated" ? "Article mis à jour dans le panier." : addedMessage, {
        type: "success",
        actions: [
            { label: "Continuer" },
            { label: "Voir le panier", href: "panier.html", primary: true }
        ]
    });
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

// Table { hex: libellé } à enregistrer dans l'article : les couleurs hors palette standard ajoutées
// au configurateur (nuancier ou saisie libre, voir js/ral-picker.js) ET utilisées sur la barre
// (`colorsUsed` : couleurs des rayures ou des bandes).
function collectCustomRals(colorsUsed) {
    const used = colorsUsed.map(color => String(color).toLowerCase());
    const table = {};
    document.querySelectorAll(".color-swatch[data-custom-ral]").forEach(swatch => {
        if (used.includes(swatch.dataset.color)) {
            table[swatch.dataset.color] = swatch.dataset.customRal;
        }
    });
    // Couleurs retirées de « Mes RAL » mais encore sur la barre : leur libellé a été conservé.
    if (typeof ralPickerLabels === "object") {
        used.forEach(hex => {
            if (!table[hex] && !isPaletteColor(hex) && ralPickerLabels[hex]) table[hex] = ralPickerLabels[hex];
        });
    }
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
