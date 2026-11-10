# EQUINOX – Configurateur de barres d'obstacles

## Projet

- Site statique du configurateur de barres d'obstacles EQUINOX : HTML + JS vanilla, pas de build, pas de framework, pas de dépendance npm.
- Le panier vit dans `localStorage` (clé `"cart"`).

## Parcours principal à ne jamais casser

`index.html` → `config.html?model=1xx` (ou les 3 configurateurs personnalisés : `config_personnalisee.html`, `config_bar_octo.html`, `config_personnalisee_forme2.html`) → `panier.html` → `devis.html` (PDF via html2pdf).

## Tester en local

Les SVG sont chargés par `fetch`, donc tester avec un serveur local, pas en `file://` :

```
python -m http.server
```

## Règles de travail

- Changements minimaux et ciblés, pas de refonte non demandée.
- Textes de l'interface en français.

## Après chaque tâche

1. Vérifier qu'il n'y a pas d'erreur JS dans la console sur les pages touchées.
2. Donner la liste des tests manuels à faire.
3. Commiter directement sur `main` (un commit par tâche, ou par point quand la tâche en liste plusieurs), puis `git push origin main` à la fin de la tâche.
