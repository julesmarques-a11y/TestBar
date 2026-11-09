// Table unique hex → RAL et libellés des couleurs, partagés par les configurateurs, le panier et le devis.
// L'ordre des entrées est l'ordre d'affichage dans la palette.
const hexToRal = {
    "#d0b084": "RAL 1001",
    "#ddc49a": "RAL 1014",
    "#e6d2b5": "RAL 1015",
    "#f1dd38": "RAL 1016",
    "#da6e00": "RAL 2000",
    "#c73f4a": "RAL 3018",
    "#bb1e10": "RAL 3020",
    "#8d3c4b": "RAL 4002",
    "#bb4077": "RAL 4010",
    "#00387a": "RAL 5002",
    "#193153": "RAL 5013",
    "#637d96": "RAL 5014",
    "#222d5a": "RAL 5022",
    "#114232": "RAL 6005",
    "#61993b": "RAL 6018",
    "#b9ceac": "RAL 6019",
    "#8a9977": "RAL 6021",
    "#7aadac": "RAL 6034",
    "#575d5e": "RAL 7012",
    "#4f5358": "RAL 7015",
    "#383e42": "RAL 7016",
    "#2f3234": "RAL 7021",
    "#4c4a44": "RAL 7022",
    "#c5c7c4": "RAL 7035",
    "#7a7b7a": "RAL 7037",
    "#8e9291": "RAL 7042",
    "#8d9295": "RAL 7045",
    "#5a3827": "RAL 8011",
    "#66332b": "RAL 8012",
    "#4a3526": "RAL 8014",
    "#e9e0d2": "RAL 9001",
    "#2b2b2c": "RAL 9004",
    "#0e0e10": "RAL 9005",
    "#f1ece1": "RAL 9010",
    "#f1f0ea": "RAL 9016"
};

// Couleurs proposées dans la palette des configurateurs.
const ralColors = Object.keys(hexToRal);

// Renvoie le libellé RAL d'un code hex (insensible à la casse), ou null s'il est inconnu.
function getRal(hex) {
    if (hex === null || hex === undefined) return null;
    return hexToRal[String(hex).trim().toLowerCase()] || null;
}

// Table { hex: libellé } des RAL personnalisés d'un article du panier (champ custom_rals).
// Les anciens articles n'ont qu'un libellé (custom_ral) et parfois sa couleur (custom_ral_color) :
// le libellé vaut alors pour cette couleur ou, à défaut, pour les couleurs utilisées hors palette.
function getCustomRals(item) {
    const isHex = color => /^#[0-9a-f]{6}$/i.test(color || "");
    const table = {};
    if (!item) return table;

    if (item.custom_rals && typeof item.custom_rals === "object") {
        Object.entries(item.custom_rals).forEach(([hex, label]) => {
            if (isHex(hex) && label) table[hex.toLowerCase()] = String(label);
        });
    } else if (item.custom_ral) {
        const colors = isHex(item.custom_ral_color) ?
            [item.custom_ral_color] :
            (item.colors || []).filter(color => isHex(color) && !getRal(color));
        colors.forEach(hex => {
            table[hex.toLowerCase()] = String(item.custom_ral);
        });
    }
    return table;
}

// Libellé d'une couleur : RAL de la palette, sinon RAL personnalisé de la table `customRals`, sinon null.
function getColorLabel(hex, customRals) {
    const key = String(hex === null || hex === undefined ? "" : hex).trim().toLowerCase();
    return getRal(key) || (customRals && customRals[key]) || null;
}

// Échappe une valeur avant de l'insérer dans du HTML (texte ou attribut entre guillemets).
// À appliquer à tout ce qui vient du panier : libellés RAL saisis par l'utilisateur, modèle, longueur…
function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
