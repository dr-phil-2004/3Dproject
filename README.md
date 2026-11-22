# Algo Lab — structures de données et algorithmes, pas à pas

Un visualiseur d'algorithmes interactif : chaque leçon est une suite d'étapes courtes, illustrée par
un **diagramme isométrique (2.5D) qui s'anime** à chaque étape, avec le pseudocode surligné et des
panneaux d'état (file d'attente, mémoire, espace de recherche…).

Projet reconstruit à partir de la démo publiée par [@DilumSanjaya](https://x.com/DilumSanjaya/status/2124547118220316851)
(« Algo Lab », déployé sur byte-sized-algorithms.vercel.app). C'est une **réimplémentation propre** :
aucun code de l'original n'a été repris. Seuls le comportement, la mise en page et l'ambiance visuelle
ont servi de référence.

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # vérification des types + build de production dans dist/
npm run preview   # sert le build de production
```

Il faut Node 20 ou plus récent.

## Ce qui est inclus

- **Le catalogue complet du cours** : 14 chapitres, 86 leçons, dans la barre latérale (dépliable,
  compteurs par chapitre, barre de progression).
- **8 leçons complètes**, celles visibles dans la démo :
  | Chapitre | Leçon | Étapes |
  |---|---|---|
  | 01 Foundations | Divide & Conquer | 7 |
  | 03 Linked Lists | Singly Linked Lists | 7 |
  | 04 Stacks & Queues | Stacks | 6 |
  | 08 Graphs | Breadth-First Search | 5 |
  | 09 Sorting & Searching | Binary Search | 7 |
  | 09 Sorting & Searching | Quick Sort | 6 |
  | 10 Greedy Algorithms | Huffman Coding | 6 |
  | 14 Hard Problems | P vs NP | 6 |
- Les 78 autres leçons ont une page « Coming soon » (avec leur propre petit diagramme).
- Navigation : boutons Back/Next, frise d'étapes cliquable, flèches **← →** du clavier,
  « Next lesson » en fin de leçon.
- Recherche **⌘K / Ctrl+K** dans tout le cours (flèches + Entrée).
- Thème **clair / sombre** (préférence système par défaut, mémorisé ; `?theme=dark` force le thème).
- Progression sauvegardée dans `localStorage` (une leçon est cochée quand on atteint sa dernière étape),
  page **Progress** récapitulative.
- Liens profonds par étape : `#/binary-search/6` ouvre directement l'étape 6.
- Respect de `prefers-reduced-motion` (pas d'animation).

Les onglets Practice, Cheatsheets et Challenges affichent un écran « pas encore construit ».

## Stack

- **Vite + React 19 + TypeScript** (strict).
- Rendu **SVG** maison, sans WebGL : l'original est lui aussi un dessin isométrique en SVG, et three.js
  n'apporterait rien à ce style « illustration technique » (traits nets, hachures, texte sur les faces).
- `lucide-react` pour les icônes, polices Inter et JetBrains Mono via `@fontsource-variable`.

## Architecture

```
src/
  iso/              Moteur isométrique
    types.ts        Objets de scène : box, slab, wire, edge, tag, panel, tile
    project.ts      Projection 3D → écran (dimétrique 2:1), ordre de dessin, boîtes englobantes
    shapes.tsx      Dessin SVG de chaque type d'objet (faces, hachures, texte posé sur les faces)
    Scene.tsx       Composant <Scene> : interpolation entre deux états, cadrage automatique
    build.ts        Petits constructeurs (box(), slab(), edge(), tag()…)
  lessons/          Une leçon = un fichier de données
    types.ts        Lesson, Step, Panel, Note
    graph.ts        Aides pour les leçons « nœuds et arêtes »
    *.ts            Les 8 leçons
    index.ts        Registre des leçons écrites
  components/       Header (nav, recherche, thème), Sidebar (cours), Lesson (scène, frise,
                    carte d'étape, pseudocode, panneaux)
  course.ts         Catalogue des 14 chapitres / 86 leçons
  state.ts          Route (hash), thème, progression
  styles.css        Jetons de couleur clair/sombre, mise en page, styles du dessin
```

### Comment fonctionne l'animation

Chaque étape décrit sa scène **en entier** comme une liste d'objets identifiés (`id`). Quand on change
d'étape, `<Scene>` apparie les objets par `id` et interpole sur ~0,7 s toutes leurs propriétés
numériques : position, taille, opacité, extrémités des arêtes, et le cadrage (viewBox). Les nouveaux
objets « tombent » en place en fondu, ceux qui disparaissent s'effacent. Une leçon n'a donc jamais à
décrire d'animation : il suffit de dire à quoi ressemble chaque étape. Par exemple, dans Quick Sort les
blocs ont pour `id` leur valeur, et un échange de deux cases devient tout seul un glissement.

Coordonnées : `x` et `y` sur le sol, `z` vers le haut, 1 unité = 1 case de la grille. Pour les arbres
et les graphes, `flat(u, v)` place un objet avec des coordonnées « écran » (u vers la droite, v vers le bas).

### Ajouter une leçon

1. Créer `src/lessons/ma-lecon.ts` qui exporte un objet `Lesson` dont l'`id` correspond à celui de
   `course.ts` (par exemple `queues`).
2. Pour chaque étape : `title`, `tag`, `body` (les `**gras**` sont rendus), éventuellement `note`,
   `lines` (lignes de pseudocode à surligner), `scene` et `panels`.
3. L'ajouter à la liste dans `src/lessons/index.ts`.

Le plus simple est d'écrire une fonction `scene(state)` qui dessine un état de l'algorithme, puis
d'appeler cette fonction avec l'état de chaque étape (voir `binary-search.ts` ou `quick-sort.ts`).

## Reste à faire

- Écrire les 78 leçons restantes (le moteur et les composants sont prêts).
- Les sections Practice, Cheatsheets et Challenges.
- La traduction (le sélecteur de langue est décoratif ; le contenu est en anglais, comme l'original).
- Une mise en page mobile plus soignée (aujourd'hui les colonnes s'empilent sous 1100 px).
