# Charte graphique EQUINOX – relevé du site officiel et transposition au simulateur

Relevé fait le 10 novembre 2026 dans Chrome headless (styles calculés, pas lus dans un fichier de maquette)
sur https://www.horsequinox.com/ (accueil) et https://www.horsequinox.com/barre-plein-coeur-300/350m
(Obstacles → Barre Plein-coeur 3,00m). Le site est un site Odoo (thème « vertical », pied de page
« minimalist »), ce qui explique certaines valeurs en fractions de pixel : ce sont des `rem` Bootstrap
(1 rem = 16 px).

## 1. Captures de référence

| Page | 1280 px | 375 px |
|---|---|---|
| Accueil, page entière | [horsequinox-accueil-1280.png](design/captures/horsequinox-accueil-1280.png) | [horsequinox-accueil-375.png](design/captures/horsequinox-accueil-375.png) |
| Accueil, haut de page (en-tête + bandeau) | [horsequinox-accueil-1280-haut.png](design/captures/horsequinox-accueil-1280-haut.png) | – |
| Barre Plein-coeur, page entière | [horsequinox-barre-plein-coeur-1280.png](design/captures/horsequinox-barre-plein-coeur-1280.png) | [horsequinox-barre-plein-coeur-375.png](design/captures/horsequinox-barre-plein-coeur-375.png) |
| Barre Plein-coeur, haut de page | [horsequinox-barre-plein-coeur-1280-haut.png](design/captures/horsequinox-barre-plein-coeur-1280-haut.png) | – |

## 2. Logo

| Fichier | Origine | Dimensions | Remarques |
|---|---|---|---|
| [img/logo-equinox.png](img/logo-equinox.png) | `https://www.horsequinox.com/web/image/website/1/logo/EQUINOX` (logo de l'en-tête) | 1164 × 360 px, PNG RGBA, fond transparent | Ratio 3,23:1. Affiché à 388 × 120 px dans l'en-tête sur grand écran, 259 × 80 px sur téléphone, 258 × 80 px dans le pied de page. |
| [img/icone-equinox.png](img/icone-equinox.png) | Favicon du site (`/web/image/website/1/favicon`, fichier .ico converti en PNG) | 256 × 256 px | Utilisable pour un favicon ou une icône d'application. |

**Pas de version SVG disponible** : le site ne sert le logo qu'en PNG (Odoo), aucun fichier vectoriel n'est
référencé dans les pages. Les seuls SVG du site sont des illustrations de produits.

Couleurs mesurées dans les pixels du logo : bleu marine `#1E314A` (lettres et cartouche), orange `#EF7D30`
(le X et les deux points). Elles diffèrent légèrement des couleurs du thème CSS (`#203049` et `#E18244`,
voir ci-dessous) : le logo est un peu plus foncé et son orange plus vif. On garde les couleurs CSS du site
pour l'interface, le logo reste tel quel.

## 3. Couleurs (valeurs calculées sur la page)

Palette du thème Odoo (variables `--o-cc*` du site) :

| Rôle | Valeur | Où on la voit |
|---|---|---|
| Couleur principale (« o-color-1 ») | `#203049` rgb(32, 48, 73) | bouton « Contactez-nous » de l'en-tête, fond du bloc « Qualité », fond de la section « Retrouvez-nous sur vos événements », cartouche derrière le titre du bandeau, liens, texte des boutons orange, logo et icônes du pied de page |
| Couleur d'accent (« o-color-2 ») | `#E18244` rgb(225, 130, 68) | boutons « Contactez-nous » du bandeau, « Prendre un rendez-vous », « Je veux personnaliser barres », « Demande de devis », sous-titre « Économique - Entrainement », numéros 01-04, fond du bloc « Service », icônes carrées de la liste « Rencontrons-nous » |
| Gris clair (« o-color-3 ») | `#F7F6F6` rgb(247, 246, 246) | fond de la section « Qui sommes-nous », texte du bouton marine (`#F7F6F6`, pas blanc pur), bordure des pastilles |
| Noir doux (« o-color-4 ») | `#242424` rgb(36, 36, 36) | titres h2 dans les sections sur fond gris |
| Blanc (« o-color-5 ») | `#FFFFFF` | fond de page, en-tête, pied de page, cartes |
| Texte courant | `#212529` rgb(33, 37, 41) | tout le texte (Bootstrap `$gray-900`) |
| Texte atténué | `rgba(33, 37, 41, 0.7)` | ligne de copyright |
| Liens du menu | `#000000` (lien actif) et `rgba(0, 0, 0, 0.65)` (autres), survol `rgba(0, 0, 0, 0.8)` | menu principal |
| Bordures | `rgba(33, 37, 41, 0.15)` (`color-mix(currentColor 15 %)`) | filets `<hr>`, bordure des cartes |
| Fond de bouton neutre | `rgba(0, 0, 0, 0.05)` | bouton « Se connecter », bouton loupe |

États de survol mesurés (transition `0.15s ease-in-out` sur couleur, fond, bordure et ombre) :

| Élément | Normal | Survol |
|---|---|---|
| Bouton marine (`#203049`) | fond `#203049`, texte `#F7F6F6` | fond `#101926` rgb(16, 25, 38), texte `#C7C0C0` |
| Bouton orange (`#E18244`) | fond `#E18244`, texte `#203049` | fond `#D16721` rgb(209, 103, 33), texte `#010102` |
| Lien du pied de page | `#203049`, sans soulignement | `#090D14`, souligné |
| Lien du menu | `rgba(0,0,0,0.65)` | `rgba(0,0,0,0.8)` |

Le survol d'un bouton est donc un assombrissement d'environ 15 % du fond, sans changement de taille ni d'ombre.

## 4. Polices

Trois familles Google Fonts, chargées depuis `fonts.googleapis.com` par le site :

| Usage | Famille | Graisses chargées par le site | Graisses réellement utilisées |
|---|---|---|---|
| Texte courant, pied de page, en-tête | **Nunito** | 300, 400, 700 (+ italiques) | 400 presque partout, 300 pour les textes `.lead`, 700 pour quelques mots en gras |
| Titres (h1 à h6, titres de cartes) | **Crimson Pro** | 300, 400, 700 (+ italiques) | demandé en 600 et 900, rendu avec la graisse 700 (seule graisse grasse chargée) ; 700 italique pour le sous-titre du bandeau |
| Menu et boutons | **Inter** | 300, 400, 700 (+ italiques) | 400 (menu, boutons), 700 pour le texte des boutons orange mis en gras |

Tailles et interlignes calculés :

| Élément | Famille | Taille à 1280 px | Taille à 375 px | Graisse | Interligne | Couleur |
|---|---|---|---|---|---|---|
| Corps (`body`, `p`) | Nunito | 16 px | 16 px | 400 | 24 px (1,5) | `#212529` |
| Texte de l'en-tête, menu | Inter | 18 px (1,125 rem) | – | 400 | 27 px | `#000` / `rgba(0,0,0,0.65)` |
| h1 (titre produit « Barre Plein-coeur 3,00m ») | Crimson Pro | 50 px (3,125 rem) | 31,4 px | 600 → 700 | 1,2 | `#212529` |
| h2 (« Qui sommes-nous ? ») | Crimson Pro | 38 px (2,375 rem) | 26,9 px | 600 → 700 | 1,2 | `#242424` |
| h3 (sous-titres, « Service ») | Crimson Pro | 24 px (1,5 rem) | 21,5 px | 600 → 700 | 1,2 | `#212529` ou `#E18244` quand mis en avant |
| h4 / h5 / h6 | Crimson Pro | 20 / 18 / 16 px | – | 600 → 700 | 1,2 | `#212529` |
| Titre de carte (`.card-title`, h5) | Crimson Pro | 18 px | – | 600 → 700 | 21,6 px | `#212529` |
| `.lead` (chapeau) | Nunito | 18 px | 18 px | 300 | 27 px | `#212529` |
| Boutons | Inter | 16 px dans le contenu, 18 px dans l'en-tête | idem | 400 (700 si gras) | 24 px | selon bouton |
| Grands numéros 01-04 | Nunito | 50 px | – | 400 | – | `#E18244` |
| Copyright | Nunito | 16 px | – | 400 | 24 px | `rgba(33,37,41,0.7)` |

Marges des titres : `margin: 0 0 0.5rem` (8 px) ; paragraphes : `margin: 0 0 16px`. Pas de lettrage
(letter-spacing normal), pas de capitales forcées.

### Licences et embarquement local

Les trois familles sont publiées sous licence **SIL Open Font License 1.1** (libre, redistribution et
embarquement autorisés, y compris commercial) :

- Nunito – Vernon Adams, Cyreal, Jacques Le Bailly, https://fonts.google.com/specimen/Nunito
- Crimson Pro – Jacques Le Bailly, https://fonts.google.com/specimen/Crimson+Pro
- Inter – Rasmus Andersson, https://fonts.google.com/specimen/Inter

Le simulateur doit rester autonome : on **n'appelle pas** `fonts.googleapis.com`, on embarque les fichiers
`.woff2` (sous-ensemble latin) dans `fonts/` avec des règles `@font-face` dans `css/site.css`, et
`font-display: swap`. Fichiers à embarquer, limités aux graisses réellement utilisées :

| Fichier | Famille | Graisse / style |
|---|---|---|
| `fonts/nunito-300.woff2` | Nunito | 300 normal |
| `fonts/nunito-400.woff2` | Nunito | 400 normal |
| `fonts/nunito-700.woff2` | Nunito | 700 normal |
| `fonts/crimson-pro-700.woff2` | Crimson Pro | 700 normal |
| `fonts/crimson-pro-700italic.woff2` | Crimson Pro | 700 italique |
| `fonts/inter-400.woff2` | Inter | 400 normal |
| `fonts/inter-700.woff2` | Inter | 700 normal |

Soit sept fichiers, environ 20 à 30 ko chacun. Polices de repli si un fichier ne charge pas :
`Georgia, "Times New Roman", serif` pour Crimson Pro ; `"Segoe UI", Tahoma, Arial, sans-serif` pour
Nunito et Inter (c'est la police actuelle du simulateur, donc rien ne casse).

Les titres sont rendus avec la graisse 700 : on demandera directement `font-weight: 700` plutôt que 600
pour éviter une graisse synthétisée.

## 5. Boutons

Deux boutons « pilule » (classe Odoo `btn btn-custom rounded-circle`), sans ombre, sans capitales :

| Propriété | Bouton marine (action principale, en-tête) | Bouton orange (appel à l'action dans le contenu) | « Se connecter » (neutre) |
|---|---|---|---|
| Fond | `#203049` | `#E18244` | `rgba(0, 0, 0, 0.05)` |
| Texte | `#F7F6F6` | `#203049` (en gras 700 sur certains boutons) | `#212529` |
| Bordure | 1 px transparente | 1 px transparente | aucune |
| Rayon | 100 px (pilule) | 100 px (pilule) | 1 px (carré) |
| Padding | 7,2 px 21,6 px (0,45 em 1,35 em) | 7,2 px 21,6 px | 7,58 px 20 px |
| Police | Inter 18 px (en-tête) / 16 px (contenu), 400 | Inter 16 px, 400 ou 700 | Inter 18 px |
| Hauteur résultante | 43 px (en-tête), 40 px (contenu) | 40 px (46 px quand le texte est sur un `<span>` plus grand) | 43 px |
| Survol | fond `#101926`, texte `#C7C0C0` | fond `#D16721`, texte `#010102` | – |
| Transition | 0,15 s ease-in-out | 0,15 s ease-in-out | 0,15 s |

Les variables Odoo définissent aussi un bouton « standard » Bootstrap (`--btn-border-radius: 1px`,
`--btn-padding: 0.474rem 1.25rem`, `--btn-font-size: 1.2rem`, bordure 2 px) mais il n'apparaît sur aucune
des deux pages : seules les pilules sont visibles.

## 6. En-tête

Relevé à 1280 px (hauteur totale 203 px, fond blanc, séparé du contenu par un fin filet : option Odoo
« bordure solide », ombre désactivée) :

1. **Barre haute** (padding 16 px en haut) : à gauche la loupe dans un rond gris `rgba(0,0,0,0.05)` de
   48 px, les icônes Facebook (`#3B5999`) et Instagram (`#CF2872`), le téléphone en Inter 18 px
   `rgba(0,0,0,0.65)` ; au centre le logo à 120 px de haut (`--logo-height: 7.5rem`) ; à droite
   « Se connecter » (neutre) et « Contactez-nous » (pilule marine, 18 px).
2. **Menu** : une rangée centrée, Inter 18 px, liens `padding: 8px`, hauteur 43 px, lien actif en noir,
   autres en `rgba(0,0,0,0.65)`, chevron sur les menus déroulants, fin de l'en-tête à 203 px.
3. Au défilement, l'en-tête se fixe et le logo passe à 40 px (`--fixed-logo-height: 2.5rem`).

À 375 px : logo à 80 px de haut à gauche (padding 8 px), bouton hamburger à droite (icône trois traits,
`rgba(0,0,0,0.65)`), hauteur 96 px, pas de barre haute ni de menu visible.

Conteneur : `max-width: 1140px`, `padding: 0 15px`, gouttière de grille 30 px (Bootstrap).

## 7. Sections, titres de section et cartes

- Rythme vertical des sections : `padding-top` 48 / 56 / 72 px et `padding-bottom` 48 / 72 px selon
  les blocs ; section appel à l'action marine `padding: 136px 0 64px` avec un bord supérieur incliné
  (forme SVG Odoo). Le simulateur reprendra 56 px en haut et 72 px en bas pour une section standard,
  48 px pour une section secondaire.
- Alternance de fonds : blanc / gris `#F7F6F6` / marine `#203049` (texte blanc, titres blancs).
- **Titres de section** : h2 Crimson Pro 38 px centré ou aligné à gauche selon le bloc, **sans filet ni
  soulignement** (contrairement au simulateur actuel qui a un trait rouge sous chaque titre). Un sous-titre
  éventuel est un h3 24 px, parfois en orange `#E18244`.
- Sur le bandeau d'accueil, le titre est posé sur un **cartouche marine** (`background: #203049`,
  texte `#F7F6F6`, Crimson Pro 28 px / 900, padding 1,4 px 0 2,8 px) et le sous-titre en Crimson Pro
  italique sur un cartouche identique.
- **Images** : coins arrondis `border-radius: 6.4px` (0,4 rem) ; l'image d'illustration de la section
  « Rencontrons-nous » a en plus `box-shadow: 0 4px 16px rgba(0,0,0,0.12)`.
- **Carte produit / carte d'information** (`.card`) : fond blanc, `border-radius: 6.4px`, bordure 0,
  `box-shadow: 0 8px 16px #FF9C00` (halo orange, voir la carte « catalogue » de l'accueil), image à gauche
  en `object-fit: cover`, corps `padding: 24px`, titre Crimson Pro 18 px / 700, texte Nunito 16 px, bouton
  pilule marine en bas. Les vignettes de la grille « Service / Qualité » sont des tuiles sans rayon,
  `padding: 10px`, fond orange ou marine, titre Crimson Pro 24 px en marine sur orange et en orange sur
  marine.
- **Pastilles de couleurs** (page Barre Plein-coeur) : ronds de 40 px environ, libellé RAL en dessous en
  petit gris, six par rangée, sans bordure. C'est l'équivalent direct de la palette du simulateur.
- Liste « Rencontrons-nous » : icône FontAwesome dans un carré orange 48 × 48 px, `border-radius: 6.4px`.

## 8. Pied de page

Fond blanc, `padding` 10 px, hauteur 157 px :

- à gauche le logo à 80 px de haut ; au centre les liens (Nunito 16 px, `#203049`, survol souligné
  `#090D14`) ; à droite les icônes Instagram et Facebook en `#203049`, 35 × 40 px ;
- ligne de copyright séparée (57 px de haut, blanc) : « Copyright © SARL EQUINOX » en
  `rgba(33,37,41,0.7)`, mention Odoo à droite.

## 9. Espacements et divers

| Élément | Valeur |
|---|---|
| Base typographique | 16 px, interligne 1,5 |
| Rayon standard (images, cartes, icônes) | 6,4 px (0,4 rem) ; pilules 100 px ; badges 800 px |
| Paragraphe | `margin-bottom: 16px` |
| Titre | `margin-bottom: 8px` |
| Conteneur | 1140 px max, 15 px de marge latérale |
| Hauteur du logo | 120 px (en-tête), 40 px (en-tête fixe), 80 px (téléphone, pied de page) |
| Champs de formulaire (variables Odoo) | `padding: 0.375rem 0.75rem` (6 px 12 px), 16 px, bordure 1 px, rayon Bootstrap par défaut ; aucun formulaire n'est visible sur les deux pages |
| Icônes | FontAwesome 4.7, 18 px dans l'en-tête, 32 px dans le pied de page |

## 10. Transposition au simulateur : variables `:root` de `css/site.css`

Les valeurs ci-dessous remplacent le thème actuel (bleu `#2c3e50`, rouge `#e74c3c`, vert `#27ae60`,
Segoe UI). Les noms existants sont conservés pour que les pages n'aient pas à changer ; les nouvelles
variables sont ajoutées.

```css
:root {
    /* Polices embarquées (fonts/, voir § 4) */
    --font-family: 'Nunito', 'Segoe UI', Tahoma, Arial, sans-serif;
    --font-family-headings: 'Crimson Pro', Georgia, 'Times New Roman', serif;
    --font-family-ui: 'Inter', 'Segoe UI', Tahoma, Arial, sans-serif;   /* menu, boutons */
    --font-size-base: 16px;
    --line-height-base: 1.5;
    --font-weight-headings: 700;

    /* Couleurs de la charte EQUINOX */
    --color-dark: #203049;              /* marine : en-tête, titres sur fond sombre, bouton principal */
    --color-dark-hover: #101926;
    --color-text: #212529;
    --color-text-headings: #242424;
    --color-text-muted: rgba(33, 37, 41, 0.7);
    --color-text-on-dark: #F7F6F6;
    --color-accent: #E18244;            /* orange : appel à l'action, sélection, mise en avant */
    --color-accent-hover: #D16721;
    --color-accent-dark: #D16721;       /* ancien nom conservé */
    --color-accent-tint: #FBEADC;       /* orange très clair pour les survols de lignes (dérivé, pas mesuré) */
    --color-success: #203049;           /* les actions « valider » deviennent marine */
    --color-success-dark: #101926;
    --color-orange: #E18244;
    --color-orange-dark: #D16721;
    --color-grey: rgba(0, 0, 0, 0.05);  /* bouton neutre « Se connecter » */
    --color-grey-dark: rgba(0, 0, 0, 0.1);
    --color-light: #F7F6F6;
    --color-white: #FFFFFF;

    /* Fonds et bordures */
    --color-page-bg: #FFFFFF;
    --color-surface: #FFFFFF;
    --color-bg-soft: #F7F6F6;
    --color-bg-panel: #F7F6F6;
    --color-bg-disabled: #F7F6F6;
    --color-border: rgba(33, 37, 41, 0.15);
    --color-border-light: rgba(33, 37, 41, 0.15);
    --color-border-soft: rgba(33, 37, 41, 0.15);
    --color-border-faint: rgba(33, 37, 41, 0.1);
    --color-input-border: rgba(33, 37, 41, 0.15);
    --color-ink: #000;
    --color-text-strong: #212529;
    --color-text-soft: rgba(33, 37, 41, 0.7);

    /* Formes */
    --radius: 6.4px;                    /* images, cartes, champs */
    --radius-pill: 100px;               /* boutons */
    --shadow-card: 0 8px 16px rgba(225, 130, 68, 0.35);  /* halo orange des cartes, atténué */
    --shadow-image: 0 4px 16px rgba(0, 0, 0, 0.12);
    --transition: 0.15s ease-in-out;

    /* Mise en page */
    --container-max: 1140px;
    --container-gutter: 15px;
    --section-padding-top: 56px;
    --section-padding-bottom: 72px;
    --logo-height: 120px;
    --logo-height-mobile: 80px;

    --swatch-ring: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-accent);
}
```

Deux valeurs ne sont pas mesurées sur le site et sont proposées : `--color-accent-tint` (le site n'a pas
de ligne survolée) et l'atténuation du halo orange des cartes (`#FF9C00` opaque sur le site, trop fort pour
une liste de produits).

### Ce que cela change page par page (à faire dans une tâche suivante, rien n'est modifié ici)

- **En-tête** : fond blanc au lieu du bandeau marine, logo `img/logo-equinox.png` centré à 120 px de haut
  (80 px sur téléphone), filet inférieur remplacé par une ombre légère, titre de page en dessous dans une
  section plutôt que dans l'en-tête. Le bouton « Retour » devient un bouton neutre `rgba(0,0,0,0.05)` à
  coins carrés, comme « Se connecter ».
- **Titres de section** : Crimson Pro 24 px / 700 sans le trait rouge ; titre principal de page en 38 px.
- **Boutons** : pilules Inter 16 px, marine pour l'action principale (ajouter au panier, générer le devis),
  orange pour l'appel à l'action secondaire (voir le panier, personnaliser), neutre pour retour / vider ;
  survol par assombrissement, sans capitales ni lettrage.
- **Cartes du catalogue** (`index.html`) : rayon 6,4 px, bordure transparente, ombre `--shadow-card` au
  survol, nom du modèle en Crimson Pro 18 px / 700.
- **Palette RAL** : pastilles rondes sans bordure comme sur la page Barre Plein-coeur, sélection par
  anneau orange (`--swatch-ring`), libellé en gris atténué.
- **Panier et devis** : compteurs en Crimson Pro, filet orange remplacé par une bordure gauche marine ou
  orange, fond des blocs `#F7F6F6`.
- **Pied de page** : logo à 80 px, « Copyright © SARL EQUINOX » en gris atténué, fond blanc.
- **PDF du devis** : mêmes polices (html2canvas lit les `@font-face` locales), titre en Crimson Pro, filet
  orange `#E18244` ; vérifier la génération réelle du PDF après le changement de police.
- **Favicon** : `img/icone-equinox.png` peut remplacer `favicon.svg` si le client préfère son icône.
