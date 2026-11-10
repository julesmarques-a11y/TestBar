// Nuancier RAL Classic et libellés des couleurs, partagés par les configurateurs, le panier et le devis.
//
// Table RAL_CLASSIC : numéro, nom français, hex approché, pour les 216 teintes du nuancier RAL Classic.
// Source : couleursral.fr, rubrique « Couleurs RAL Classic » (https://couleursral.fr/ral-classic et ses neuf
// pages par teinte, de /ral-classic/teintes-de-jaune à /ral-classic/teintes-de-blanc-et-noir), relevée le
// 10 novembre 2026. Noms recoupés avec les alias français des éléments « RAL xxxx » de Wikidata ; seule
// correction apportée : « Gris fonçé nacré » (coquille du site) devient « Gris foncé nacré » pour le RAL 9023.
// Les hex sont des approximations d'écran : seule la référence RAL fait foi.
// Les 35 couleurs de la palette standard (PALETTE_CODES) gardent l'hex qu'elles avaient avant l'ajout
// du nuancier complet : il est déjà enregistré dans les articles des paniers existants.
const RAL_CLASSIC = [
    ["1000", "Beige vert", "#c5bb8a"],
    ["1001", "Beige", "#d0b084"],
    ["1002", "Jaune sable", "#c7ae72"],
    ["1003", "Jaune de sécurité", "#e6b019"],
    ["1004", "Jaune or", "#d2a40e"],
    ["1005", "Jaune miel", "#bc9611"],
    ["1006", "Jaune maïs", "#cf9804"],
    ["1007", "Jaune narcisse", "#d49300"],
    ["1011", "Beige brun", "#a38454"],
    ["1012", "Jaune citron", "#cfb539"],
    ["1013", "Blanc perlé", "#dfdbc7"],
    ["1014", "Ivoire", "#ddc49a"],
    ["1015", "Ivoire clair", "#e6d2b5"],
    ["1016", "Jaune soufre", "#f1dd38"],
    ["1017", "Jaune safran", "#e4af56"],
    ["1018", "Jaune zinc", "#ebd346"],
    ["1019", "Beige gris", "#9c917b"],
    ["1020", "Jaune olive", "#999167"],
    ["1021", "Jaune colza", "#e5c000"],
    ["1023", "Jaune signalisation", "#e6be05"],
    ["1024", "Jaune ocre", "#ad9451"],
    ["1026", "Jaune brillant", "#ffff00"],
    ["1027", "Jaune curry", "#998420"],
    ["1028", "Jaune melon", "#f2a500"],
    ["1032", "Jaune genêt", "#cfa81e"],
    ["1033", "Jaune dahlia", "#e4a02d"],
    ["1034", "Jaune pastel", "#d9a156"],
    ["1035", "Beige nacré", "#898271"],
    ["1036", "Or nacré", "#746341"],
    ["1037", "Jaune soleil", "#db9a17"],
    ["2000", "Orangé jaune", "#da6e00"],
    ["2001", "Orangé rouge", "#a74d23"],
    ["2002", "Orangé sang", "#ac3721"],
    ["2003", "Orangé pastel", "#e17c30"],
    ["2004", "Orangé pur", "#cc5608"],
    ["2005", "Orangé brillant", "#ff4612"],
    ["2007", "Orangé clair brillant", "#ffad19"],
    ["2008", "Orangé rouge clair", "#d66c21"],
    ["2009", "Orangé signalisation", "#c9560d"],
    ["2010", "Orangé de sécurité", "#bc602d"],
    ["2011", "Orangé foncé", "#cf7421"],
    ["2012", "Orangé saumon", "#c2674f"],
    ["2013", "Orangé nacré", "#824128"],
    ["2017", "Orangé RAL", "#dc5b00"],
    ["3000", "Rouge feu", "#962a27"],
    ["3001", "Rouge de sécurité", "#8f1e24"],
    ["3002", "Rouge carmin", "#8d1f24"],
    ["3003", "Rouge rubis", "#7c0d24"],
    ["3004", "Rouge pourpre", "#651927"],
    ["3005", "Rouge vin", "#561e27"],
    ["3007", "Rouge noir", "#3d2326"],
    ["3009", "Rouge oxyde", "#643730"],
    ["3011", "Rouge brun", "#6e2124"],
    ["3012", "Rouge beige", "#b7856e"],
    ["3013", "Rouge tomate", "#8a2f28"],
    ["3014", "Vieux rose", "#bc6f72"],
    ["3015", "Rose clair", "#cc9ea4"],
    ["3016", "Rouge corail", "#963d2f"],
    ["3017", "Rosé", "#b9535b"],
    ["3018", "Rouge fraise", "#c73f4a"],
    ["3020", "Rouge signalisation", "#bb1e10"],
    ["3022", "Rouge saumon", "#be6954"],
    ["3024", "Rouge brillant", "#ee1729"],
    ["3026", "Rouge clair brillant", "#f71027"],
    ["3027", "Rouge framboise", "#9e1b3c"],
    ["3028", "Rouge pur", "#b92726"],
    ["3031", "Rouge oriental", "#973238"],
    ["3032", "Rouge rubis nacré", "#661925"],
    ["3033", "Rose nacré", "#94352d"],
    ["4001", "Lilas rouge", "#7c5b80"],
    ["4002", "Violet rouge", "#8d3c4b"],
    ["4003", "Violet bruyère", "#b65a88"],
    ["4004", "Violet bordeaux", "#5f1837"],
    ["4005", "Lilas bleu", "#746395"],
    ["4006", "Pourpre signalisation", "#852e6f"],
    ["4007", "Violet pourpre", "#44263c"],
    ["4008", "Violet de sécurité", "#7c477d"],
    ["4009", "Violet pastel", "#95838f"],
    ["4010", "Telemagenta", "#bb4077"],
    ["4011", "Violet nacré", "#685c80"],
    ["4012", "Mûre nacré", "#67657a"],
    ["5000", "Bleu violet", "#35496b"],
    ["5001", "Bleu vert", "#294763"],
    ["5002", "Bleu outremer", "#00387a"],
    ["5003", "Bleu saphir", "#203151"],
    ["5004", "Bleu noir", "#1e222c"],
    ["5005", "Bleu de sécurité", "#134a85"],
    ["5007", "Bleu brillant", "#466589"],
    ["5008", "Bleu gris", "#2f3a44"],
    ["5009", "Bleu azur", "#365875"],
    ["5010", "Bleu gentiane", "#0e457a"],
    ["5011", "Bleu acier", "#222c3e"],
    ["5012", "Bleu clair", "#457fb3"],
    ["5013", "Bleu cobalt", "#193153"],
    ["5014", "Bleu pigeon", "#637d96"],
    ["5015", "Bleu ciel", "#3172ad"],
    ["5017", "Bleu signalisation", "#0f518a"],
    ["5018", "Bleu turquoise", "#47848d"],
    ["5019", "Bleu capri", "#265682"],
    ["5020", "Bleu océan", "#113e4d"],
    ["5021", "Bleu d'eau", "#216d76"],
    ["5022", "Bleu nocturne", "#222d5a"],
    ["5023", "Bleu distant", "#4d648a"],
    ["5024", "Bleu pastel", "#6c8daa"],
    ["5025", "Gentiane nacré", "#3c6379"],
    ["5026", "Bleu nuit nacré", "#1b2b4d"],
    ["6000", "Vert patine", "#4a7363"],
    ["6001", "Vert émeraude", "#40693a"],
    ["6002", "Vert feuillage", "#3b5b2f"],
    ["6003", "Vert olive", "#4f553e"],
    ["6004", "Vert bleu", "#214245"],
    ["6005", "Vert mousse", "#114232"],
    ["6006", "Olive gris", "#3c3d32"],
    ["6007", "Vert bouteille", "#2e3526"],
    ["6008", "Vert brun", "#333327"],
    ["6009", "Vert sapin", "#2a372c"],
    ["6010", "Vert herbe", "#4e6e39"],
    ["6011", "Vert réséda", "#6a7c5b"],
    ["6012", "Vert noir", "#2f3b39"],
    ["6013", "Vert jonc", "#777659"],
    ["6014", "Olive jaune", "#454339"],
    ["6015", "Olive noir", "#3c3f38"],
    ["6016", "Vert turquoise", "#256753"],
    ["6017", "Vert mai", "#5c8144"],
    ["6018", "Vert jaune", "#61993b"],
    ["6019", "Vert blanc", "#b9ceac"],
    ["6020", "Vert oxyde chromique", "#3b4634"],
    ["6021", "Vert pâle", "#8a9977"],
    ["6022", "Olive brun", "#3b382e"],
    ["6024", "Vert signalisation", "#3a8258"],
    ["6025", "Vert fougère", "#5d703e"],
    ["6026", "Vert opale", "#0d5951"],
    ["6027", "Vert clair", "#88b5b3"],
    ["6028", "Vert pin", "#3d5547"],
    ["6029", "Vert menthe", "#226c45"],
    ["6032", "Vert de sécurité", "#417e57"],
    ["6033", "Turquoise menthe", "#568480"],
    ["6034", "Turquoise pastel", "#7aadac"],
    ["6035", "Vert nacré", "#2e4f31"],
    ["6036", "Vert opal nacré", "#27514a"],
    ["6037", "Vert pur", "#3f8c3d"],
    ["6038", "Vert brillant", "#20a339"],
    ["6039", "Vert fibre", "#abc251"],
    ["7000", "Gris petit-gris", "#7b858d"],
    ["7001", "Gris argent", "#8b949b"],
    ["7002", "Gris olive", "#7d7965"],
    ["7003", "Gris mousse", "#76776a"],
    ["7004", "Gris de sécurité", "#969799"],
    ["7005", "Gris souris", "#696d6b"],
    ["7006", "Gris beige", "#716c60"],
    ["7008", "Gris kaki", "#6c6040"],
    ["7009", "Gris vert", "#5b6058"],
    ["7010", "Gris tente", "#575b57"],
    ["7011", "Gris fer", "#535a5e"],
    ["7012", "Gris basalte", "#575d5e"],
    ["7013", "Gris brun", "#545146"],
    ["7015", "Gris ardoise", "#4f5358"],
    ["7016", "Gris anthracite", "#383e42"],
    ["7021", "Gris noir", "#2f3234"],
    ["7022", "Gris terre d'ombre", "#4c4a44"],
    ["7023", "Gris béton", "#7d7f76"],
    ["7024", "Gris graphite", "#45494e"],
    ["7026", "Gris granit", "#394345"],
    ["7030", "Gris pierre", "#8c8c83"],
    ["7031", "Gris bleu", "#5d676d"],
    ["7032", "Gris silex", "#b1b1a1"],
    ["7033", "Gris ciment", "#7c8273"],
    ["7034", "Gris jaune", "#8c8870"],
    ["7035", "Gris clair", "#c5c7c4"],
    ["7036", "Gris platine", "#949292"],
    ["7037", "Gris poussière", "#7a7b7a"],
    ["7038", "Gris agate", "#adb0a9"],
    ["7039", "Gris quartz", "#68675f"],
    ["7040", "Gris fenêtre", "#969ca1"],
    ["7042", "Gris signalisation A", "#8e9291"],
    ["7043", "Gris signalisation B", "#4f5352"],
    ["7044", "Gris soie", "#b3b2a9"],
    ["7045", "Telegris 1", "#8d9295"],
    ["7046", "Telegris 2", "#7c8287"],
    ["7047", "Telegris 4", "#c5c5c5"],
    ["7048", "Gris souris nacré", "#7a7871"],
    ["8000", "Brun vert", "#816d44"],
    ["8001", "Brun terre de Sienne", "#8f6833"],
    ["8002", "Brun de sécurité", "#704f40"],
    ["8003", "Brun argile", "#74502f"],
    ["8004", "Brun cuivré", "#814d37"],
    ["8007", "Brun fauve", "#67492f"],
    ["8008", "Brun olive", "#694f2b"],
    ["8011", "Brun noisette", "#5a3827"],
    ["8012", "Brun rouge", "#66332b"],
    ["8014", "Brun sépia", "#4a3526"],
    ["8015", "Marron", "#57332b"],
    ["8016", "Brun acajou", "#483026"],
    ["8017", "Brun chocolat", "#42332e"],
    ["8019", "Brun gris", "#3b3736"],
    ["8022", "Brun noir", "#201f20"],
    ["8023", "Brun orangé", "#965d33"],
    ["8024", "Brun beige", "#6f543c"],
    ["8025", "Brun pâle", "#6e5b4b"],
    ["8028", "Brun terre", "#4c3e30"],
    ["8029", "Cuivre nacré", "#764537"],
    ["9001", "Blanc crème", "#e9e0d2"],
    ["9002", "Blanc gris", "#d4d5cd"],
    ["9003", "Blanc de sécurité", "#ebecea"],
    ["9004", "Noir de sécurité", "#2b2b2c"],
    ["9005", "Noir foncé", "#0e0e10"],
    ["9006", "Aluminium blanc", "#9a9d9d"],
    ["9007", "Aluminium gris", "#828280"],
    ["9010", "Blanc pur", "#f1ece1"],
    ["9011", "Noir graphite", "#25282a"],
    ["9012", "Blanc salle blanche", "#f2f1e1"],
    ["9016", "Blanc signalisation", "#f1f0ea"],
    ["9017", "Noir signalisation", "#262625"],
    ["9018", "Blanc papyrus", "#c6cbc6"],
    ["9022", "Gris clair nacré", "#818382"],
    ["9023", "Gris foncé nacré", "#767779"]
];

// Table { code: { code, label, name, hex } } du nuancier, ex. ralByCode["6018"].name === "Vert jaune".
const ralByCode = {};
RAL_CLASSIC.forEach(([code, name, hex]) => {
    ralByCode[code] = { code, label: "RAL " + code, name, hex };
});

// Entrée du nuancier pour un numéro RAL ("6018", "RAL 6018", "ral6018"…), ou null s'il n'y figure pas.
function findRal(code) {
    const digits = String(code === null || code === undefined ? "" : code).replace(/\D/g, "");
    return ralByCode[digits] || null;
}

// Normalise un texte pour la recherche : minuscules, sans accents, espaces réduits.
function normalizeText(text) {
    return String(text === null || text === undefined ? "" : text)
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/\s+/g, " ").trim();
}

// Teintes du nuancier correspondant à `query` : un numéro ou un début de numéro (« 6018 », « RAL 60 »),
// ou un bout du nom français (« vert », « bleu ciel »). Au plus `limit` entrées, dans l'ordre du nuancier.
function searchRal(query, limit = 40) {
    const q = normalizeText(query).replace(/^ral\s*/, "");
    if (!q) return [];
    const digits = /^[\d ]+$/.test(q) ? q.replace(/ /g, "") : null;
    const matches = RAL_CLASSIC.filter(([code, name]) =>
        digits ? code.startsWith(digits) : normalizeText(name).includes(q));
    return matches.slice(0, limit).map(([code]) => ralByCode[code]);
}

// Couleurs de la palette standard des configurateurs, dans l'ordre d'affichage.
const PALETTE_CODES = ["1001", "1014", "1015", "1016", "2000", "3018", "3020", "4002", "4010", "5002", "5013", "5014", "5022", "6005", "6018", "6019", "6021", "6034", "7012", "7015", "7016", "7021", "7022", "7035", "7037", "7042", "7045", "8011", "8012", "8014", "9001", "9004", "9005", "9010", "9016"];

// Table unique hex → « RAL xxxx » : la palette standard d'abord (ordre d'affichage), puis le reste
// du nuancier. Toute couleur du nuancier a donc un libellé, qu'elle soit ou non dans la palette.
const hexToRal = {};
PALETTE_CODES.forEach(code => {
    hexToRal[ralByCode[code].hex] = ralByCode[code].label;
});
RAL_CLASSIC.forEach(([code, , hex]) => {
    if (!hexToRal[hex]) hexToRal[hex] = "RAL " + code;
});

// Couleurs proposées dans la palette standard des configurateurs.
const ralColors = PALETTE_CODES.map(code => ralByCode[code].hex);

function normalizeHex(hex) {
    return String(hex === null || hex === undefined ? "" : hex).trim().toLowerCase();
}

// Renvoie le libellé « RAL xxxx » d'un code hex du nuancier (insensible à la casse), ou null s'il
// n'en fait pas partie (couleur par défaut d'un SVG, teinte hors nuancier saisie librement…).
function getRal(hex) {
    return hexToRal[normalizeHex(hex)] || null;
}

// Vrai si le code hex est une des couleurs de la palette standard.
function isPaletteColor(hex) {
    return ralColors.includes(normalizeHex(hex));
}

// Table { hex: libellé } des RAL personnalisés d'un article du panier (champ custom_rals).
// Les anciens articles n'ont qu'un libellé (custom_ral) et parfois sa couleur (custom_ral_color) :
// le libellé vaut alors pour cette couleur ou, à défaut, pour les couleurs utilisées hors palette standard.
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
            (item.colors || []).filter(color => isHex(color) && !isPaletteColor(color));
        colors.forEach(hex => {
            table[hex.toLowerCase()] = String(item.custom_ral);
        });
    }
    return table;
}

// Libellé d'une couleur : RAL personnalisé de la table `customRals` (libellé choisi par l'utilisateur
// pour cette couleur d'écran), sinon RAL du nuancier, sinon null.
function getColorLabel(hex, customRals) {
    const key = normalizeHex(hex);
    return (customRals && customRals[key]) || getRal(key) || null;
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
