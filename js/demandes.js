// Historique des demandes de devis, enregistré dans le navigateur (IndexedDB) : il n'y a pas de
// serveur, les demandes restent sur l'appareil jusqu'à leur export depuis demandes.html.
// devis.html enregistre une demande à chaque PDF généré ; demandes.html les liste, les exporte
// (CSV pour Excel, JSON) et les supprime.
//
// Une demande :
// {
//   id            clé attribuée par la base à l'enregistrement
//   numero        numéro de devis, ex. "DV-20261112-101500"
//   date          date et heure de génération (ISO 8601)
//   client        { nom, prenom, societe, telephone, email, ville, numeroCommande,
//                   dateLivraison (AAAA-MM-JJ), commentaire }
//   statistiques  { horsCoeur3m, horsCoeur35m, pleinCoeur, surMesure, total } (nombres de barres)
//   articles      [{ designation, quantite, longueur, hauteur, diametre,
//                    couleurs: [{ hex, ral }], apercu (image SVG en data URL) }]
//   envoyee       false tant que la demande n'a pas été envoyée par email (voir sendDemande)
//   exportee      true une fois la demande exportée en CSV ou en JSON
//   pdf           le PDF remis au visiteur (ArrayBuffer), pour le retélécharger à l'identique
// }

const DEMANDES_DB = "equinox-demandes";
const DEMANDES_STORE = "demandes";

function openDemandesDb() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error("IndexedDB indisponible dans ce navigateur."));
            return;
        }
        const request = indexedDB.open(DEMANDES_DB, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(DEMANDES_STORE, { keyPath: "id", autoIncrement: true });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("Base des demandes bloquée par un autre onglet."));
    });
}

// Exécute `work(store)` dans une transaction et renvoie sa valeur une fois la transaction validée.
// `work` renvoie une requête IndexedDB (son résultat est la valeur renvoyée) ou rien.
async function withDemandesStore(mode, work) {
    const db = await openDemandesDb();
    try {
        return await new Promise((resolve, reject) => {
            const transaction = db.transaction(DEMANDES_STORE, mode);
            const request = work(transaction.objectStore(DEMANDES_STORE));
            transaction.oncomplete = () => resolve(request ? request.result : undefined);
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error || new Error("Enregistrement interrompu."));
        });
    } finally {
        db.close();
    }
}

// Enregistre une demande et renvoie son id. On demande au passage au navigateur de ne pas effacer
// ces données de lui-même quand la place vient à manquer.
async function saveDemande(demande) {
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => { /* refusé : l'enregistrement se fait quand même */ });
    }
    return withDemandesStore("readwrite", store => store.add(demande));
}

// Toutes les demandes, de la plus récente à la plus ancienne.
async function listDemandes() {
    const demandes = await withDemandesStore("readonly", store => store.getAll());
    return demandes.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

// Modifie des champs des demandes `ids`, par exemple { exportee: true }.
function updateDemandes(ids, changes) {
    return withDemandesStore("readwrite", store => {
        ids.forEach(id => {
            const request = store.get(id);
            request.onsuccess = () => {
                if (request.result) store.put({ ...request.result, ...changes });
            };
        });
    });
}

function deleteDemande(id) {
    return withDemandesStore("readwrite", store => store.delete(id));
}

function deleteAllDemandes() {
    return withDemandesStore("readwrite", store => store.clear());
}

// ---- Envoi par email (à brancher) ----

// Envoie une demande par email à EQUINOX. PAS ENCORE BRANCHÉ : cette fonction n'est appelée nulle
// part, c'est le seul endroit à compléter le jour où un service d'envoi est choisi (par exemple
// un POST vers un service de formulaires ou une petite API : le PDF est dans demande.pdf, son nom
// dans demandePdfFileName(demande)). Elle doit lever une erreur si l'envoi échoue.
// Ensuite, deux appels suffisent :
// - dans devis.html, après saveDemande(), tenter l'envoi (il échouera hors ligne, sans gravité) ;
// - dans demandes.html, un bouton « Envoyer » pour les demandes restées « Envoyée : non ».
// Dans les deux cas : await sendDemande(demande), puis updateDemandes([demande.id], { envoyee: true }).
async function sendDemande(demande) {
    throw new Error("L'envoi des demandes par email n'est pas encore configuré.");
}

// ---- Fichiers ----

// Texte utilisable dans un nom de fichier : sans accents, sans espaces ni ponctuation.
function fileNamePart(text) {
    return String(text || "")
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
}

// Nom du PDF d'un devis : le nom du client puis le numéro, pour le retrouver dans les
// téléchargements, par exemple Devis_EQX_Dupont_DV-20261112-101500.pdf.
function devisPdfFileName(nom, numero) {
    const name = fileNamePart(nom);
    return `Devis_EQX_${name ? name + "_" : ""}${numero}.pdf`;
}

function demandePdfFileName(demande) {
    return devisPdfFileName(demande.client && demande.client.nom, demande.numero);
}

// Fait télécharger `blob` sous le nom `fileName`.
function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ---- Exports ----

const pad2 = n => String(n).padStart(2, "0");

// "2026-11-12T10:15:00.000Z" → { jour: "12/11/2026", heure: "11:15" } (heure locale).
function demandeDateParts(isoDate) {
    const date = new Date(isoDate);
    if (isNaN(date)) return { jour: "", heure: "" };
    return {
        jour: `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`,
        heure: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
    };
}

// "2027-01-15" → "15/01/2027".
function isoDayToFr(isoDay) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay || "");
    return match ? `${match[3]}/${match[2]}/${match[1]}` : (isoDay || "");
}

// Cellule d'un CSV destiné à Excel (séparateur point-virgule).
// - Les retours à la ligne deviennent « / » : une ligne du fichier reste une ligne du tableau.
// - `text: true` (téléphone, numéros) : la valeur est écrite ="…", sans quoi Excel la convertit en
//   nombre et perd le 0 ou le + du début.
// - Un texte libre qui commence par = + - ou @ serait lu par Excel comme une formule : il est
//   précédé d'une apostrophe.
function csvCell(value, { text = false } = {}) {
    let cell = String(value === null || value === undefined ? "" : value).replace(/\s*[\r\n]+\s*/g, " / ").trim();
    if (text && cell) cell = `="${cell.replace(/"/g, "")}"`;
    else if (/^[=+\-@]/.test(cell)) cell = "'" + cell;
    return /[;"]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

// CSV de toutes les demandes : une ligne par article, les coordonnées répétées sur chaque ligne.
// UTF-8 avec BOM, séparateur point-virgule, fins de ligne CRLF : s'ouvre d'un double-clic dans Excel.
function demandesToCsv(demandes) {
    const header = ["N° devis", "Date", "Heure", "Envoyée", "Nom", "Prénom", "Société ou club", "Téléphone",
        "Email", "Ville", "N° commande", "Livraison souhaitée", "Commentaire",
        "Article", "Quantité", "Longueur", "Hauteur", "Diamètre", "Couleurs"];
    const rows = [header.map(title => csvCell(title))];

    demandes.forEach(demande => {
        const client = demande.client || {};
        const { jour, heure } = demandeDateParts(demande.date);
        const contact = [
            csvCell(demande.numero), csvCell(jour), csvCell(heure), csvCell(demande.envoyee ? "oui" : "non"),
            csvCell(client.nom), csvCell(client.prenom), csvCell(client.societe),
            csvCell(client.telephone, { text: true }), csvCell(client.email), csvCell(client.ville),
            csvCell(client.numeroCommande, { text: true }), csvCell(isoDayToFr(client.dateLivraison)),
            csvCell(client.commentaire)
        ];
        const articles = demande.articles && demande.articles.length ? demande.articles : [{}];
        articles.forEach(article => {
            const couleurs = (article.couleurs || []).map(couleur => couleur.ral || couleur.hex).join(", ");
            rows.push(contact.concat([
                csvCell(article.designation), csvCell(article.quantite), csvCell(article.longueur),
                csvCell(article.hauteur), csvCell(article.diametre), csvCell(couleurs)
            ]));
        });
    });
    return "﻿" + rows.map(row => row.join(";")).join("\r\n") + "\r\n";
}

// JSON de toutes les demandes, aperçus compris ; le PDF, binaire, n'y figure pas.
function demandesToJson(demandes) {
    return JSON.stringify(demandes.map(({ pdf, ...demande }) => demande), null, 2);
}
