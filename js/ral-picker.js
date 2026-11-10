// Recherche dans le nuancier RAL Classic, saisie libre de secours et section « Mes RAL » des configurateurs.
// À charger après js/ral.js et js/cart.js, sur une page qui contient :
//   #colorPalette (palette standard : pastilles .color-swatch avec data-color),
//   #myRals et #myRalPalette (section « Mes RAL », sous la palette standard),
//   #ralSearchInput et #ralSearchResults (recherche dans le nuancier),
//   #customRalInput, #customRalColor et #addCustomRalBtn (saisie libre d'une teinte hors nuancier).
// La page appelle initRalPicker({ onSelect }) une fois la palette standard construite ;
// onSelect(hex) est appelé quand une pastille de « Mes RAL » est choisie.

// Libellés de toutes les couleurs ajoutées à « Mes RAL » pendant la session, { hex: libellé }, y compris
// celles retirées depuis : une rayure déjà peinte garde sa couleur, son libellé doit la suivre au panier.
const ralPickerLabels = {};

let ralPickerOnSelect = () => {};

// Libellé d'une couleur connue du configurateur : RAL de la palette standard ou couleur de « Mes RAL ».
function knownColorLabel(hex) {
    const key = String(hex === null || hex === undefined ? "" : hex).trim().toLowerCase();
    return getRal(key) || ralPickerLabels[key] || null;
}

// Sélectionne une pastille (palette standard ou « Mes RAL ») comme couleur active.
function selectSwatch(swatch) {
    document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
    swatch.classList.add("selected");
    ralPickerOnSelect(swatch.dataset.color);
}

// Pastille affichant la couleur `hex` dans la palette standard ou dans « Mes RAL », ou null.
function findSwatch(hex) {
    return document.querySelector(
        `#colorPalette .color-swatch[data-color="${hex}"], #myRalPalette .color-swatch[data-color="${hex}"]`);
}

// Ajoute une couleur à « Mes RAL » et la sélectionne (sauf options.select === false).
// `label` est le libellé enregistré dans l'article (« RAL 6018 », ou la référence saisie librement),
// `name` le nom du nuancier (« Vert jaune »), facultatif. Une couleur de la palette standard n'est pas
// dupliquée : sa pastille est simplement sélectionnée. Une couleur déjà dans « Mes RAL » non plus :
// son libellé est mis à jour.
function addMyRal({ hex, label, name }, options = {}) {
    hex = String(hex).trim().toLowerCase();
    const select = options.select !== false;

    if (getRal(hex)) {
        const standard = findSwatch(hex);
        if (standard && select) selectSwatch(standard);
        return standard;
    }

    ralPickerLabels[hex] = label;
    let swatch = findSwatch(hex);

    if (!swatch) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("color-item", "my-ral-item");

        swatch = document.createElement("div");
        swatch.classList.add("color-swatch");
        swatch.style.backgroundColor = hex;
        swatch.dataset.color = hex;

        const labelEl = document.createElement("div");
        labelEl.classList.add("color-label");

        const nameEl = document.createElement("div");
        nameEl.classList.add("color-name");

        wrapper.appendChild(swatch);
        wrapper.appendChild(labelEl);
        wrapper.appendChild(nameEl);
        wrapper.addEventListener("click", () => selectSwatch(swatch));

        document.getElementById("myRalPalette").appendChild(wrapper);
        document.getElementById("myRals").hidden = false;
    }

    swatch.dataset.customRal = label;
    swatch.title = name ? `${label} – ${name}` : label;
    swatch.parentElement.querySelector(".color-label").textContent = label;
    swatch.parentElement.querySelector(".color-name").textContent = name || "";

    if (select) {
        selectSwatch(swatch);
        swatch.scrollIntoView({ block: "nearest" });
    }
    return swatch;
}

// Entrée du nuancier désignée par un libellé qui n'est qu'un numéro RAL Classic (« 3027 », « RAL 3027 »),
// sinon null : « Pantone 3005 » ou « NCS S 1050-R » ne sont pas des RAL Classic.
function classicFromLabel(label) {
    return /^(ral\s*)?\d{4}$/i.test(String(label || "").trim()) ? findRal(label) : null;
}

// Remet dans « Mes RAL » les couleurs hors palette standard d'un article en cours de modification.
function restoreMyRals(item) {
    Object.entries(getCustomRals(item)).forEach(([hex, label]) => {
        const classic = classicFromLabel(label);
        addMyRal({ hex, label, name: classic ? classic.name : "" }, { select: false });
    });
}

// Branche la recherche dans le nuancier et la saisie libre.
function initRalPicker({ onSelect } = {}) {
    ralPickerOnSelect = onSelect || (() => {});

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
            alert("Indiquez la référence de la teinte (ex : RAL Design 180 50 15, NCS S 1050-R…).");
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
        if (getRal(hex)) {
            alert(`Cette couleur d'écran est déjà celle du ${getRal(hex)} de la palette. Choisissez une couleur d'écran légèrement différente pour votre teinte.`);
            return;
        }
        addMyRal({ hex, label });
        labelInput.value = "";
    });
}
