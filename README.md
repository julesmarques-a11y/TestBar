# EQUINOX – Configurateur de barres d'obstacles

Site du configurateur : choix d'une gamme, mise aux couleurs RAL, panier, devis en PDF.

- En ligne : <https://julesmarques-a11y.github.io/TestBar/>
- Sur un salon : le même site, installé sur l'écran d'accueil d'une tablette. Une fois ouvert une première fois avec une connexion, il fonctionne **sans réseau**. Chaque devis généré est enregistré dans la tablette, avec les coordonnées du visiteur, et se retrouve dans la page `demandes.html`.

## Avant le salon

### 1. Installer le site sur l'écran d'accueil

La tablette doit être connectée au wifi pour toute cette partie.

**iPad**

1. Ouvrir <https://julesmarques-a11y.github.io/TestBar/> dans **Safari**.
2. Toucher le bouton **Partager** (le carré avec une flèche vers le haut).
3. Choisir **Sur l'écran d'accueil**, puis **Ajouter**.
4. L'icône EQUINOX apparaît sur l'écran d'accueil : c'est par elle qu'il faudra ouvrir le configurateur.

**Tablette Android**

1. Ouvrir <https://julesmarques-a11y.github.io/TestBar/> dans **Chrome**.
2. Toucher le menu **⋮** en haut à droite.
3. Choisir **Ajouter à l'écran d'accueil** (ou **Installer l'application**), puis confirmer.
4. L'icône EQUINOX apparaît sur l'écran d'accueil.

Ouvert par son icône, le configurateur s'affiche en plein écran, sans barre d'adresse, en paysage comme en portrait.

### 2. Première ouverture : wifi obligatoire

1. Wifi activé, ouvrir le configurateur **par son icône** (sur iPad, l'icône ne partage pas ses données avec Safari : c'est bien elle qu'il faut ouvrir).
2. Rester une minute sur la page d'accueil : tout le site (pages, modèles de barres, polices, générateur de PDF) se copie dans la tablette.

À refaire après chaque mise à jour du site : ouvrir l'accueil avec le wifi et attendre une minute. En ligne, le site affiche toujours sa dernière version ; hors ligne, la dernière version copiée.

### 3. Vérifier qu'il marche hors ligne

À faire la veille, sur la tablette qui servira au salon :

1. Passer la tablette en **mode avion** (wifi coupé).
2. Ouvrir le configurateur par son icône.
3. Faire un parcours complet : choisir un modèle dans chaque gamme et un sur-mesure, les colorer, les ajouter au panier, générer le devis avec des coordonnées d'essai, **télécharger le PDF**.
4. Vérifier que le PDF se retrouve dans les téléchargements (voir plus bas) et qu'il s'ouvre.
5. Ouvrir la page des demandes (voir « À la fin du salon ») : la demande d'essai doit y figurer. Essayer l'export CSV.
6. Supprimer la demande d'essai, puis « Nouveau devis » pour repartir d'un panier vide.
7. Désactiver le mode avion.

Si une page ne s'affiche pas en mode avion, refaire l'étape 2 (première ouverture avec wifi), puis recommencer la vérification.

## Pendant le salon

- Après chaque devis, toucher **Nouveau devis** : le panier et les coordonnées du visiteur sont effacés, le configurateur revient à l'accueil. Les couleurs ajoutées à « Mes RAL » sont conservées.
- Le PDF porte le nom du client et le numéro du devis, par exemple `Devis_EQX_Dupont_DV-20261112-101500.pdf`.
- Ne pas utiliser la navigation privée et ne pas effacer les données de navigation de la tablette : les demandes enregistrées seraient perdues.

### Où retrouver les PDF téléchargés

- **iPad** : application **Fichiers** → **Téléchargements** (dans « iCloud Drive » ou « Sur mon iPad », selon Réglages → Safari → Téléchargements). Selon la version d'iPadOS, le PDF peut d'abord s'ouvrir en aperçu : toucher **Partager** → **Enregistrer dans Fichiers**.
- **Android** : application **Fichiers** (ou **Files**) → **Téléchargements**, ou dans Chrome, menu **⋮** → **Téléchargements**.

Un PDF introuvable n'est pas perdu : chaque demande garde le sien, à retélécharger depuis la page des demandes.

## À la fin du salon : exporter les demandes

Les demandes ne quittent pas la tablette toutes seules : il faut les exporter. Chaque tablette a sa propre liste.

1. Ouvrir la page des demandes :
   - depuis l'icône de l'écran d'accueil : descendre en bas d'une page et toucher **cinq fois de suite** le texte « Copyright © SARL EQUINOX » ;
   - depuis le navigateur (Android, ordinateur) : ajouter `demandes.html` à l'adresse du site, soit <https://julesmarques-a11y.github.io/TestBar/demandes.html>.
2. Toucher **Exporter en CSV (Excel)** : le fichier `Demandes_EQUINOX_<date>-<heure>.csv` arrive dans les téléchargements. Il s'ouvre d'un double-clic dans Excel : une ligne par article, les coordonnées du client répétées sur chaque ligne.
3. Au besoin, **Exporter en JSON** : le même contenu pour un traitement informatique, aperçus des barres compris.
4. Sortir le fichier de la tablette (e-mail, AirDrop, clé ou câble USB, espace partagé) et **l'ouvrir pour le vérifier**.
5. Seulement ensuite, **Supprimer toutes les demandes**, et confirmer.

Sur la page des demandes, chaque demande peut aussi être supprimée seule, et son PDF retéléchargé. La mention « Envoyée : non » correspond à un futur envoi par e-mail, qui n'est pas encore en service.

Cette page n'est liée depuis aucune page du site, mais elle n'est pas protégée par un mot de passe : quiconque connaît son adresse voit les demandes enregistrées **sur l'appareil qu'il utilise**. Ne pas laisser la tablette sans surveillance avec des demandes non exportées.

## Développement

Site statique : HTML, CSS et JavaScript sans framework ni étape de construction.

```
python -m http.server
```

puis ouvrir <http://localhost:8000/>. Ne pas ouvrir les fichiers en `file://` : les modèles SVG sont chargés par `fetch`.

- **Hors ligne** : `sw.js` (service worker, « réseau d'abord, cache en secours ») et `manifest.webmanifest`. Tout fichier ajouté au site doit être ajouté à la liste `ASSETS` de `sw.js`, sinon il manquera hors ligne. Les chemins sont relatifs : le site fonctionne sous `/TestBar/` (GitHub Pages) comme à la racine (en local).
- **Demandes** : `js/demandes.js` (base IndexedDB `equinox-demandes`, exports CSV et JSON). Pour brancher un envoi par e-mail, compléter la fonction `sendDemande(demande)` de ce fichier ; elle n'est appelée nulle part pour l'instant, les deux appels à ajouter sont décrits dans son commentaire.
- **Charte graphique** : `DESIGN.md`.
