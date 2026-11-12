// Palette RAL des configurateurs : palette standard, couleur sélectionnée, recherche dans le nuancier
// RAL Classic, saisie libre de secours et section « Mes RAL ».
// À charger après js/ral.js et js/cart.js, sur une page qui contient :
//   #currentColor (couleur sélectionnée : pastille, numéro et nom, au-dessus de la palette),
//   #colorPalette (palette standard, remplie ici : pastilles .color-swatch avec data-color),
//   #ralMore (accordéon sous la palette, replié par défaut, qui contient tout ce qui suit) et
//   #myRalCount (nombre de couleurs de « Mes RAL », dans son titre),
//   #myRals et #myRalPalette (section « Mes RAL »),
//   #ralSearchInput et #ralSearchResults (recherche dans le nuancier),
//   #customRalInput, #customRalColor et #addCustomRalBtn (saisie libre d'une teinte hors nuancier).
// La page appelle initRalPicker({ onSelect }) ; onSelect(hex) est appelé à chaque fois qu'une
// pastille est choisie, et d'abord pour la première couleur de la palette, sélectionnée au chargement.
// Les couleurs de « Mes RAL » sont mémorisées dans localStorage (clé "myRals") : elles réapparaissent,
// après les couleurs standard, dans les quatre configurateurs, jusqu'à ce qu'on les retire une par une.

// Couleurs mémorisées : [{ hex, label, name }], dans l'ordre d'ajout.
function readMyRals() {
    let list;
    try {
        list = JSON.parse(localStorage.getItem("myRals"));
    } catch (error) {
        list = null;
    }
    if (!Array.isArray(list)) return [];
    return list.filter(entry => entry && /^#[0-9a-f]{6}$/i.test(entry.hex) && entry.label)
        .map(entry => ({ hex: String(entry.hex).toLowerCase(), label: String(entry.label), name: String(entry.name || "") }));
}

function writeMyRals(list) {
    localStorage.setItem("myRals", JSON.stringify(list));
}

// Mémorise une couleur (ou met à jour son libellé si elle l'est déjà).
function rememberMyRal({ hex, label, name }) {
    const list = readMyRals().filter(entry => entry.hex !== hex);
    list.push({ hex, label, name: name || "" });
    writeMyRals(list);
}

function forgetMyRal(hex) {
    writeMyRals(readMyRals().filter(entry => entry.hex !== hex));
}

// Libellés de toutes les couleurs ajoutées à « Mes RAL » pendant la session, { hex: libellé }, y compris
// celles retirées depuis : une rayure déjà peinte garde sa couleur, son libellé doit la suivre au panier.
const ralPickerLabels = {};

let ralPickerOnSelect = () => {};

// Libellé d'une couleur connue du configurateur : RAL du nuancier ou couleur de « Mes RAL ».
function knownColorLabel(hex) {
    return getRal(hex) || ralPickerLabels[normalizeHex(hex)] || null;
}

// Texte sous une pastille : le numéro seul pour un RAL Classic (« RAL 6018 » → « 6018 »),
// le libellé entier pour une teinte saisie librement.
function shortRalLabel(label) {
    const match = /^RAL\s*(\d{4})$/i.exec(String(label).trim());
    return match ? match[1] : String(label);
}

// Élément d'une palette : la pastille, le numéro dessous, et le libellé complet (« RAL 6018 –
// Vert jaune ») en infobulle. Renvoie { wrapper, swatch }.
function makeColorItem({ hex, label, name }) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("color-item");

    const swatch = document.createElement("div");
    swatch.classList.add("color-swatch");
    swatch.style.backgroundColor = hex;
    swatch.dataset.color = hex;

    const labelEl = document.createElement("div");
    labelEl.classList.add("color-label");

    wrapper.appendChild(swatch);
    wrapper.appendChild(labelEl);
    wrapper.addEventListener("click", () => selectSwatch(swatch));
    describeColorItem(swatch, label, name);
    return { wrapper, swatch };
}

// Écrit le libellé et le nom d'une couleur sur son élément de palette.
function describeColorItem(swatch, label, name) {
    swatch.dataset.label = label;
    swatch.dataset.name = name || "";
    swatch.parentElement.title = name ? `${label} – ${name}` : label;
    swatch.parentElement.querySelector(".color-label").textContent = shortRalLabel(label);
}

// Remplit la palette standard (#colorPalette).
function buildStandardPalette() {
    const palette = document.getElementById("colorPalette");
    palette.innerHTML = "";
    PALETTE_CODES.forEach(code => palette.appendChild(makeColorItem(ralByCode[code]).wrapper));
}

// Affiche la couleur sélectionnée (pastille, numéro, nom) au-dessus de la palette.
function showCurrentColor(swatch) {
    const box = document.getElementById("currentColor");
    if (!box) return;
    box.querySelector(".current-color-swatch").style.backgroundColor = swatch.dataset.color;
    box.querySelector(".current-color-code").textContent = swatch.dataset.label;
    box.querySelector(".current-color-name").textContent = swatch.dataset.name;
}

// Sélectionne une pastille (palette standard ou « Mes RAL ») comme couleur active.
function selectSwatch(swatch) {
    document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
    swatch.classList.add("selected");
    showCurrentColor(swatch);
    ralPickerOnSelect(swatch.dataset.color);
}

// Pastille affichant la couleur `hex` dans la palette standard ou dans « Mes RAL », ou null.
function findSwatch(hex) {
    return document.querySelector(
        `#colorPalette .color-swatch[data-color="${hex}"], #myRalPalette .color-swatch[data-color="${hex}"]`);
}

// « Mes RAL » n'est affiché que s'il contient des couleurs ; leur nombre figure dans le titre de
// l'accordéon « Autres couleurs RAL · Mes RAL » (#ralMore), replié par défaut.
function updateMyRalCount() {
    const count = document.querySelectorAll("#myRalPalette .color-swatch").length;
    document.getElementById("myRals").hidden = count === 0;
    document.getElementById("myRalCount").textContent = count;
}

// Ajoute une couleur à « Mes RAL », la mémorise (sauf options.remember === false) et la sélectionne
// (sauf options.select === false).
// `label` est le libellé enregistré dans l'article (« RAL 6018 », ou la référence saisie librement),
// `name` le nom du nuancier (« Vert jaune »), facultatif. Une couleur de la palette standard n'est pas
// dupliquée : sa pastille est simplement sélectionnée. Une couleur déjà dans « Mes RAL » non plus :
// son libellé est mis à jour.
function addMyRal({ hex, label, name }, options = {}) {
    hex = String(hex).trim().toLowerCase();
    const select = options.select !== false;

    if (isPaletteColor(hex)) {
        const standard = findSwatch(hex);
        if (standard && select) selectSwatch(standard);
        return standard;
    }

    ralPickerLabels[hex] = label;
    let swatch = findSwatch(hex);

    if (!swatch) {
        const item = makeColorItem({ hex, label, name });
        swatch = item.swatch;
        item.wrapper.classList.add("my-ral-item");

        const remove = document.createElement("button");
        remove.type = "button";
        remove.classList.add("my-ral-remove");
        remove.textContent = "×";
        remove.addEventListener("click", event => {
            event.stopPropagation();
            removeMyRal(hex);
        });
        item.wrapper.appendChild(remove);

        document.getElementById("myRalPalette").appendChild(item.wrapper);
        updateMyRalCount();
    }

    swatch.dataset.customRal = label;
    describeColorItem(swatch, label, name);
    const remove = swatch.parentElement.querySelector(".my-ral-remove");
    remove.title = `Retirer ${label} de Mes RAL`;
    remove.setAttribute("aria-label", remove.title);
    if (options.remember !== false) rememberMyRal({ hex, label, name });
    if (swatch.classList.contains("selected")) showCurrentColor(swatch);

    if (select) {
        selectSwatch(swatch);
        swatch.scrollIntoView({ block: "nearest" });
    }
    return swatch;
}

// Retire une couleur de « Mes RAL » (palette et mémoire). Les rayures déjà peintes avec la gardent,
// et son libellé reste connu (ralPickerLabels) pour le panier. Si elle était la couleur active,
// la première couleur standard la remplace.
function removeMyRal(hex) {
    forgetMyRal(hex);
    const swatch = document.querySelector(`#myRalPalette .color-swatch[data-color="${hex}"]`);
    if (!swatch) return;
    const wasSelected = swatch.classList.contains("selected");
    swatch.parentElement.remove();
    updateMyRalCount();
    if (wasSelected) selectSwatch(document.querySelector("#colorPalette .color-swatch"));
}

// Entrée du nuancier désignée par un libellé qui n'est qu'un numéro RAL Classic (« 3027 », « RAL 3027 »),
// sinon null : « Pantone 3005 » ou « NCS S 1050-R » ne sont pas des RAL Classic.
function classicFromLabel(label) {
    return /^(ral\s*)?\d{4}$/i.test(String(label || "").trim()) ? findRal(label) : null;
}

// Remet dans « Mes RAL » les couleurs hors palette standard d'un article en cours de modification,
// sans les mémoriser : « Mes RAL » reste la liste des couleurs que l'utilisateur a ajoutées lui-même.
// L'accordéon est alors déplié : les couleurs de l'article sont sous les yeux.
function restoreMyRals(item) {
    const customRals = Object.entries(getCustomRals(item));
    customRals.forEach(([hex, label]) => {
        const classic = classicFromLabel(label);
        addMyRal({ hex, label, name: classic ? classic.name : "" }, { select: false, remember: false });
    });
    if (customRals.length) document.getElementById("ralMore").open = true;
}

// Branche la recherche dans le nuancier et la saisie libre.
function initRalPicker({ onSelect } = {}) {
    ralPickerOnSelect = onSelect || (() => {});

    // Palette standard ; sa première couleur est la couleur active au chargement.
    buildStandardPalette();
    selectSwatch(document.querySelector("#colorPalette .color-swatch"));

    // Couleurs mémorisées lors d'une visite précédente, sur ce configurateur ou un autre.
    readMyRals().forEach(entry => addMyRal(entry, { select: false, remember: false }));

    const input = document.getElementById("ralSearchInput");
    const results = document.getElementById("ralSearchResults");
    let entries = [];
    let active = 0;

    function hideResults() {
        results.hidden = true;
        results.innerHTML = "";
        entries = [];
    }

    function pick(entry) {
        addMyRal(entry);
        input.value = "";
        hideResults();
    }

    function highlight() {
        results.querySelectorAll(".ral-search-item").forEach((item, i) => {
            item.classList.toggle("active", i === active);
        });
    }

    // Affiche les teintes qui correspondent au texte saisi.
    function render() {
        if (!normalizeText(input.value)) {
            hideResults();
            return;
        }
        entries = searchRal(input.value);
        active = 0;
        results.innerHTML = "";

        if (entries.length === 0) {
            const empty = document.createElement("li");
            empty.classList.add("ral-search-empty");
            empty.textContent = "Aucune teinte du nuancier RAL Classic ne correspond. Pour une autre teinte, utilisez la saisie libre ci-dessous.";
            results.appendChild(empty);
        }

        entries.forEach(entry => {
            const item = document.createElement("li");
            item.classList.add("ral-search-item");
            item.innerHTML = `<span class="ral-search-swatch" style="background-color:${entry.hex};"></span>` +
                `<span class="ral-search-code">${escapeHtml(entry.label)}</span>` +
                `<span class="ral-search-name">${escapeHtml(entry.name)}</span>`;
            // mousedown plutôt que click seul : le champ perdrait sinon le focus et masquerait la liste avant le clic.
            item.addEventListener("mousedown", event => event.preventDefault());
            item.addEventListener("click", () => pick(entry));
            results.appendChild(item);
        });
        highlight();
        results.hidden = false;
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (entries.length) pick(entries[active]);
        } else if (event.key === "Escape") {
            hideResults();
        } else if (event.key === "ArrowDown" && entries.length) {
            event.preventDefault();
            active = (active + 1) % entries.length;
            highlight();
        } else if (event.key === "ArrowUp" && entries.length) {
            event.preventDefault();
            active = (active - 1 + entries.length) % entries.length;
            highlight();
        }
    });
    document.addEventListener("click", event => {
        if (!event.target.closest(".ral-search")) hideResults();
    });

    // Saisie libre : une teinte hors nuancier, avec sa référence et la couleur d'écran la plus proche.
    document.getElementById("addCustomRalBtn").addEventListener("click", () => {
        const labelInput = document.getElementById("customRalInput");
        const label = labelInput.value.trim().replace(/\s+/g, " ");
        if (!label) {
            showError(labelInput, "Indiquez la référence de la teinte (ex : RAL Design 180 50 15, NCS S 1050-R…).");
            return;
        }

        // Un simple numéro RAL Classic (« 3027 », « RAL 3027 ») : c'est le nuancier qui fait foi.
        const classic = classicFromLabel(label);
        if (classic) {
            addMyRal(classic);
            labelInput.value = "";
            return;
        }

        const hex = document.getElementById("customRalColor").value.toLowerCase();
        if (isPaletteColor(hex)) {
            showError("addCustomRalBtn", `Cette couleur d'écran est déjà celle du ${getRal(hex)} de la palette. Choisissez une couleur d'écran légèrement différente pour votre teinte.`);
            return;
        }
        addMyRal({ hex, label });
        labelInput.value = "";
    });
}
