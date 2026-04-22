# The Grid

Site corporate premium construit avec `Next.js 16`, `React 19`, `Payload CMS 3`, `next-intl` et un back-office sur mesure pour piloter le contenu, les traductions, les medias et la direction artistique.

Production: `https://the-grid.vercel.app`  
Repository backup: `https://github.com/monsiaz/the-grid`

## Ce projet met en avant

Ce repo illustre une approche produit tres complete, a la croisee du design, de la performance et de l'outillage editorial:

- architecture frontend moderne avec `Next.js App Router`
- CMS headless/admin customise avec `Payload`
- internationalisation multi-locale
- optimisation images, CDN, cache et rendu
- iteration rapide en production via `Vercel`
- experience admin pensee pour des equipes non techniques

## Savoir-faire technique mis en avant

Le projet valorise particulierement les competences suivantes:

- conception d'experiences web premium, rapides et orientees conversion
- integration pixel-perfect a partir de maquettes et demandes client
- structuration de contenus pilotables depuis un back-office
- SEO technique et architecture de rendu performante
- optimisation Core Web Vitals, assets, cache et delivery
- mise en place de workflows de publication, traduction et revalidation
- creation d'outils editoriaux qui reduisent la dependance au code

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Payload CMS 3`
- `next-intl`
- `Postgres` en prod / `SQLite` en local
- `Vercel Blob` pour la mediatheque
- `Resend` pour les formulaires email
- `Framer Motion` pour les animations
- `Sass` + styles globaux personnalises

## Fonctionnalites cles

- pages marketing multi-sections: home, about, services, drivers, news, contact
- back-office personnalise avec branding The Grid, labels FR et navigation adaptee
- globals et collections editables depuis le BO
- gestion des tags news et des blocs de contenu
- mediatheque connectee a `Vercel Blob`
- formulaires contact et newsletter avec traitement email
- systeme de traductions sur plusieurs locales
- revalidation a la demande pour voir les changements du BO en production rapidement
- composants visuels riches: sliders, cartes retournables, hero sections, contenus dynamiques

## Focus Vercel et performance

Le projet a ete pense pour une mise en ligne fluide sur `Vercel`:

- deploiement simple du frontend et du CMS sur une meme base Next.js
- optimisation des connexions base de donnees pour eviter la saturation en build
- revalidation on-demand apres sauvegarde BO
- images servies en `AVIF` / `WebP`
- cache long sur les assets statiques
- compatibilite `Vercel Blob` pour les uploads medias

## Historique recent des livraisons Vercel

Extrait des iterations recentes poussees avant deploiement:

- `bde99b8` - backup complet de l'etat actuel du projet
- `e0c466f` - ajustement du cadrage image services sur mobile
- `2f718f3` - affinage du scale et du focus de l'image services
- `d7d2cb3` - design admin The Grid, navigation groupee, labels FR
- `46a16bd` - footer mobile raccourci et plus propre
- `c175fa3` - bandeau traductions collapsible dans le BO
- `4cb0565` - footer + locale switcher mobiles simplifies
- `6a4310f` - recadrage final de la photo Guillaume via Blob
- `9fa5660` - simplification du locale switcher
- `f0367b4` - homepage traduite en chinois dans la base
- `be57203` - SVG inline restants pour fiabiliser le rendu prod
- `4c9808f` - formulaire contact mobile avec reveal anime

## Lancer le projet en local

```bash
pnpm install
pnpm dev
```

Puis ouvrir `http://localhost:3000`.

## Scripts utiles

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm seed
```

## Environnement

Variables attendues selon l'environnement:

- `PAYLOAD_SECRET`
- `DATABASE_URL` ou `DATABASE_URI`
- `BLOB_READ_WRITE_TOKEN`
- variables email liees a l'envoi des formulaires

Les fichiers `.env*` sont gardes hors versionning.

## Resume

`The Grid` n'est pas seulement un site vitrine. C'est un socle web moderne qui montre la capacite a concevoir une plateforme editoriale haut de gamme, performante, multi-locale et exploitable en autonomie par une equipe metier.
