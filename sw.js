// Service worker : garde tout le site en cache pour qu'il fonctionne sans réseau (salon).
// Stratégie « réseau d'abord, cache en secours » :
// - en ligne, chaque fichier vient du réseau (toujours la dernière version) et sa copie en cache
//   est renouvelée ;
// - hors ligne, ou si le réseau ne répond pas en quelques secondes, c'est la dernière copie vue
//   qui est servie.
// Tous les chemins sont relatifs à ce fichier : le site fonctionne aussi bien sous /TestBar/
// (GitHub Pages) qu'à la racine (python -m http.server).
//
// À TENIR À JOUR : tout fichier ajouté au site (page, script, style, image, police, modèle SVG)
// doit être ajouté à ASSETS, sinon il ne sera disponible hors ligne qu'après avoir été affiché
// une fois en ligne.

const CACHE = "equinox-site-v1";

const ASSETS = [
    "index.html",
    "catalogue.html",
    "sur-mesure.html",
    "config.html",
    "config_personnalisee.html",
    "config_bar_octo.html",
    "config_personnalisee_forme2.html",
    "panier.html",
    "devis.html",
    "demandes.html",
    "manifest.webmanifest",
    "css/site.css",
    "css/ral-picker.css",
    "js/layout.js",
    "js/notify.js",
    "js/ral.js",
    "js/cart.js",
    "js/ral-picker.js",
    "js/demandes.js",
    "js/vendor/html2pdf.bundle.min.js",
    "fonts/nunito.woff2",
    "fonts/inter.woff2",
    "fonts/crimson-pro-700.woff2",
    "fonts/crimson-pro-700italic.woff2",
    "img/logo-equinox.png",
    "img/icone-equinox.png",
    "img/apercu-barre-personnalisee.svg",
    "img/apercu-barre-octo.svg",
    "img/apercu-palanque.svg",
    "Bar_V101.svg",
    "Bar_V102.svg",
    "Bar_V103.svg",
    "Bar_V104.svg",
    "Bar_V105.svg",
    "Bar_V106.svg",
    "Bar_V107.svg",
    "Bar_V108.svg",
    "Bar_V109.svg",
    "Bar_V110.svg",
    "Bar_V111.svg",
    "Bar_V112.svg",
    "Bar_V113.svg",
    "Bar_V114.svg",
    "Bar_V115.svg"
];

// Dossier du site, par exemple "https://…/TestBar/".
const ROOT = new URL("./", self.location).href;

// Au-delà de ce délai sans réponse du réseau (wifi sans Internet, signal faible), la copie en
// cache est servie ; la réponse du réseau, si elle finit par arriver, renouvelle quand même le cache.
const NETWORK_TIMEOUT = 3000;

// Après un tel dépassement, le réseau est tenu pour inutilisable pendant SLOW_NETWORK_PAUSE : on
// ne lui laisse plus que SLOW_NETWORK_TIMEOUT avant de servir la copie en cache, pour ne pas
// imposer le délai complet à chaque fichier de chaque page. Dès qu'une réponse du réseau arrive,
// on revient au délai normal.
const SLOW_NETWORK_PAUSE = 60000;
const SLOW_NETWORK_TIMEOUT = 500;
let slowUntil = 0;

// Délai minimal entre deux renouvellements complets du cache (voir refreshAll).
const REFRESH_INTERVAL = 30000;

// Clé de cache d'une adresse : sans paramètres (config.html?model=101 et config.html?model=102
// sont la même page) ; le dossier du site vaut index.html.
function cacheKey(url) {
    const key = new URL(url);
    key.search = "";
    key.hash = "";
    if (key.pathname.endsWith("/")) key.pathname += "index.html";
    return key.href;
}

// Réponse du site lui-même, complète et sans redirection : la seule qu'on met en cache. Un portail
// wifi qui redirige vers sa page de connexion ne doit pas remplacer les pages du site.
function isSiteResponse(response) {
    return response.ok && response.type === "basic" && !response.redirected;
}

// Télécharge `url` sans passer par le cache HTTP du navigateur.
function fetchFresh(url) {
    return fetch(url, { cache: "no-cache", credentials: "same-origin" });
}

// Copie d'une réponse du site, telle qu'elle est mise en cache et remise aux pages : avec
// « Cache-Control: no-cache ». Sans cela, le navigateur réutilise de lui-même, sans repasser par
// ce service worker, les scripts et les styles déjà chargés dans l'onglet : une mise à jour du
// site n'apparaîtrait qu'à moitié.
function pageCopy(response) {
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-cache");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

// Met en cache tous les fichiers du site. `strict` : échoue si un seul fichier manque.
async function cacheAll(strict) {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async path => {
        const url = new URL(path, ROOT).href;
        try {
            const response = await fetchFresh(url);
            if (!isSiteResponse(response)) throw new Error(`${path} : réponse ${response.status}`);
            await cache.put(cacheKey(url), pageCopy(response));
        } catch (error) {
            if (strict) throw error;
        }
    }));
}

// Renouvelle tout le cache en arrière-plan, pour que la version disponible hors ligne soit
// complète et cohérente, et pas seulement faite des pages affichées. Déclenché à l'ouverture de
// l'accueil et dès qu'un fichier reçu du réseau diffère de sa copie en cache (site mis à jour).
// `force` : sans attendre le délai minimal (un seul renouvellement à la fois dans tous les cas).
let lastRefresh = 0;
let refreshing = null;

function refreshAll(force) {
    if (refreshing) return refreshing;
    if (!force && Date.now() - lastRefresh < REFRESH_INTERVAL) return Promise.resolve();
    lastRefresh = Date.now();
    refreshing = cacheAll(false).finally(() => { refreshing = null; });
    return refreshing;
}

// Version d'une réponse, pour savoir si le fichier a changé depuis sa mise en cache.
function versionOf(response) {
    return response.headers.get("ETag") || response.headers.get("Last-Modified") || "";
}

self.addEventListener("install", event => {
    // Premier chargement : tout le site est mis en cache d'un coup. Si un fichier manque,
    // l'installation échoue et sera retentée à la prochaine ouverture.
    event.waitUntil(cacheAll(true).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
    event.waitUntil((async () => {
        // Caches d'une version précédente de ce fichier.
        const names = await caches.keys();
        await Promise.all(names.filter(name => name.startsWith("equinox-site-") && name !== CACHE)
            .map(name => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET" || !request.url.startsWith(ROOT)) return;

    const key = cacheKey(request.url);
    const cached = caches.open(CACHE).then(cache => cache.match(key));

    // Résultat du réseau : { page } (réponse du site, à remettre à la page) ou { other } (erreur,
    // redirection, portail wifi : tout ce qui n'est pas le site).
    const network = fetchFresh(request.url).then(async response => {
        if (!isSiteResponse(response)) return { other: response };
        slowUntil = 0;
        const previous = await cached;
        const page = pageCopy(response);
        const copy = page.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(key, copy)));

        const changed = previous && versionOf(previous) !== versionOf(page);
        const isHome = request.mode === "navigate" && key === new URL("index.html", ROOT).href;
        if (changed || isHome) event.waitUntil(refreshAll(changed));
        return { page };
    });
    // La réponse du réseau renouvelle le cache même si la copie en cache a déjà été servie.
    event.waitUntil(network.catch(() => { /* hors ligne */ }));

    // Réseau d'abord ; cache en secours si le réseau échoue, répond autre chose que le site
    // (erreur, portail wifi) ou tarde trop.
    const fresh = network.then(
        async ({ page, other }) => {
            if (page) return page;
            const copy = await cached;
            if (copy) return copy;
            // Une page ne peut pas recevoir une réponse déjà redirigée : on refait la redirection.
            return other.redirected && request.mode === "navigate" ? Response.redirect(other.url, 302) : other;
        },
        async () => (await cached) || Response.error());
    const delay = Date.now() < slowUntil ? SLOW_NETWORK_TIMEOUT : NETWORK_TIMEOUT;
    let answered = false;
    const slow = new Promise(resolve => setTimeout(resolve, delay)).then(async () => {
        const copy = await cached;
        if (copy && !answered && delay === NETWORK_TIMEOUT) slowUntil = Date.now() + SLOW_NETWORK_PAUSE;
        return copy || fresh;
    });

    event.respondWith(Promise.race([fresh, slow]).finally(() => { answered = true; }));
});
