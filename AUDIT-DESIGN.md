# Audit design — GOSTA TRANS

- **Date :** 2026-08-18
- **Commit audité :** `d7a2257` (état courant du dépôt)
- **Méthode :** lecture du code (tokens, composants, feuille de style), calcul des contrastes WCAG, vérification responsive / motion / accessibilité. Aucune modification apportée — audit seul.
- **Règle de cadrage :** on *ajuste* le design existant, on ne le *redessine* pas. Les points marqués **[décision]** ne sont pas corrigés : ils demandent un choix de ta part.

> Note : depuis le point de sauvegarde `ca13408`, un travail parallèle a désaturé le rouge (`#C81E2C → #9E3B42`), passé les hovers ambre en rouge, et rempli les boutons outline. Cet audit reflète cet état-là, pas l'ancien.

---

## Verdict en une ligne

Le design est **cohérent et maîtrisé** — système de tokens unique, une seule recette de carte, un seul système de motion, contrastes WCAG AA respectés partout. Ce n'est pas du « vibe-codé ». Les points à corriger sont surtout de la **finition** et **3 vrais trous d'accessibilité**, pas des défauts de conception.

---

## Système visuel (référence)

| Rôle | Token | Valeur |
|---|---|---|
| Titre + corps | `--font-display` / `--font-body` | **Manrope** (hiérarchie par la graisse seule) |
| Libellés / méta | `--font-mono` | JetBrains Mono |
| Structure | `--navy-deep` / `--navy-mid` / `--navy-line` | `#000000` / `#111111` / `#222222` |
| Accent | `--red` / `--red-dark` | `#9E3B42` / `#6E2A30` |
| Fond | `--sand` / `--sand-deep` | `#FFFFFF` / `#ECECEC` |
| Texte secondaire | `--steel` | `#59626E` |
| Accent chaud | `--amber` | `#E8A33D` |

Radius carte `rounded-2xl` · ombre unique `0_1px_2px + 0_12px_28px_-18px` · hover `-translate-y-[3px]` + ombre approfondie · easing `cubic-bezier(0.2,0.7,0.2,1)`. Motif de marque : `.hazard-stripe` (bande de danger rouge/blanc).

---

## Contrastes (WCAG, recalculés pour la palette actuelle)

| Paire | Ratio | Verdict |
|---|---|---|
| Blanc sur rouge `#9E3B42` (boutons) | **6,6:1** | AA ✓ (AAA grand texte) |
| Rouge `#9E3B42` sur blanc (liens, tags) | **6,6:1** | AA ✓ |
| Ambre `#E8A33D` sur noir (eyebrows, icônes) | **9,7:1** | AAA ✓ |
| Steel `#59626E` sur blanc (corps) | **6,2:1** | AA ✓ |
| `#cfd6e0` sur noir (texte sur sombre) | ~14:1 | AAA ✓ |
| `#8b96a8` sur noir (bas de footer) | ~7,0:1 | AA ✓ |
| Ambre `#E8A33D` sur blanc | 2,2:1 | ✗ **mais jamais utilisé ainsi** — l'ambre est toujours sur fond sombre |

**Conclusion contraste :** rien à corriger. La désaturation du rouge a même *amélioré* le contraste (rouge plus foncé). La discipline « ambre uniquement sur sombre » est respectée partout.

---

## Points à améliorer

### D1 — [décision] · MOYEN · L'alternance de sections blanc/blanc est invisible
`--sand` vaut `#FFFFFF`, soit exactement `bg-white`. Les sections alternent pourtant `bg-white` et `bg-[var(--sand)]` :

- blanc : About (`About.tsx:13`), ServiceShowcase BTP (`ServiceShowcase.tsx:15`), Partners (`Partners.tsx:19`)
- « sand » : ServiceShowcase Logistique (`ServiceShowcase.tsx:65`), Projects (`Projects.tsx:84`), Testimonials (`Testimonials.tsx:30`)

Rendu réel : **une seule nappe blanche continue**. La séparation ne tient qu'au padding vertical. Le code porte un système à deux couleurs qui n'en produit qu'une.
**Recommandation :** soit rendre `--sand` légèrement cassé (`#FAFAF8`) pour que l'alternance se voie enfin, soit unifier sur un seul token si le tout-blanc est voulu — mais choisir, car en l'état l'intention du code ne se voit pas.

### D2 — [auto] · MOYEN · a11y · `prefers-reduced-motion` ne stoppe pas les carrousels
Le bloc `globals.css:67-73` ne réduit que les durées **CSS**. Les `setInterval` JS continuent de tourner : Hero 6 s (`HeroCarousel.tsx:28`), Projects 4 s (`Projects.tsx:64`), Testimonials 7 s (`Testimonials.tsx:20`), rotateur de téléphone du header 3,5 s. Les transitions framer-motion (JS/WAAPI) ne sont pas touchées non plus. → un utilisateur « réduire les animations » voit toujours du contenu défiler seul.
**Recommandation :** lire `useReducedMotion()` (déjà fourni par framer-motion, **aucune dépendance ajoutée**) et suspendre les intervalles quand la préférence est active.

### D3 — [auto] · MOYEN · a11y · Indicateurs de focus ad hoc
Pas de règle `:focus-visible` globale (la seule est sur `.btn-liquid`, `globals.css:114`). Les champs font `focus:outline-none` puis un simple changement de couleur de bordure (`QuoteForm.tsx:65/81/142`, `HeroSearch.tsx:74`) — subtil ; le `LanguageSwitcher` remplace par une bordure ambre sur navy (delta faible). Les liens de cartes et flèches de carrousel s'appuient sur l'outline par défaut du navigateur.
**Recommandation :** un seul token d'anneau de focus global (`:focus-visible { outline: 2px solid var(--red); outline-offset: 2px }`), au lieu de supprimer l'outline sans le remplacer clairement.

### D4 — [auto] · MOYEN · a11y · Le carrousel de témoignages ne se met pas en pause
`Testimonials.tsx:20-27` : l'auto-défilement (7 s) n'a **ni pause au survol ni pause au focus**, contrairement à Hero et Projects. WCAG 2.2.2 : tout mouvement auto > 5 s doit pouvoir être suspendu. Les flèches prev/next existent mais ne stoppent pas le minuteur.
**Recommandation :** ajouter un état `paused` calqué sur `Projects.tsx:64-81`.

### D5 — [auto] · FAIBLE · Rythme vertical irrégulier
Paddings sans échelle unique : About `py-12 md:py-16`, ServiceShowcase `py-16 md:py-20`, Testimonials/Partners `py-20`, CTASection `py-12`. Comme toutes les sections sont blanches (cf. D1), ces écarts sont le **seul** séparateur — l'irrégularité se voit d'autant plus. (Le `pt-40` de Projects est justifié : il laisse la place au formulaire qui déborde.)
**Recommandation :** normaliser les sections standard sur une échelle unique (ex. `py-20 md:py-28`).

### D6 — [auto] · FAIBLE · Deux icônes pour le même « lire la suite »
Projects utilise `ChevronRight` (`Projects.tsx:161`) ; ServiceShowcase utilise `ArrowRight` déguisé en `ChevronRightInline` (`ServiceShowcase.tsx:117-123`) ; About et CTASection utilisent `ArrowRight`. Même action, deux glyphes.
**Recommandation :** unifier sur `ArrowRight`.

### D7 — [auto] · FAIBLE · Gris codés en dur hors tokens
`border-[#D1D1D1]` (`Projects.tsx:100/107`, `Testimonials.tsx:43/74`, `QuoteForm.tsx:65/81/142`), `bg-[#E1E1E1]` (`Testimonials.tsx:87`), plus `#8b96a8` / `#cfd6e0` (Footer, QuoteSection). Ces neutres ne passent par aucune variable — légère dérive vs `--steel` / `--sand-deep`.
**Recommandation :** introduire un ou deux tokens neutres (`--line`, `--muted`) et les router dessus.

### D8 — [auto] · FAIBLE · Saut de taille du titre hero à 640 px
`text-[13vw] sm:text-6xl` (`HeroCarousel.tsx:90`) : juste sous `sm`, 13vw ≈ 83 px ; à 640 px ça tombe à 60 px → le titre **rétrécit quand l'écran s'élargit**.
**Recommandation :** `clamp()` pour une montée en taille continue.

### D9 — [décision] · goût · Voiles d'image très sombres
Hero : `bg-black/75` plat (`HeroCarousel.tsx:71`). QuoteSection empile dégradé + `bg-black/50 backdrop-blur-sm` + dégradé haut (`QuoteSection.tsx:20-22`). À 75 % sur fond noir, les photos hero sont presque éteintes — choix de lisibilité assumé, mais les images ne « travaillent » plus beaucoup.
**Recommandation :** ta décision — baisser à ~55-60 % (+ léger dégradé directionnel) si tu veux que les photos respirent, ou garder si la priorité reste le contraste du titre.

---

## Ce qui est déjà solide (à ne pas toucher)

- **Système de tokens unique** — tout passe par des variables CSS, pas de hex éparpillés (hors D7).
- **Une seule recette de carte** — radius, ombre, hover, easing identiques dans Projects / ServiceShowcase / News / contact. C'est l'inverse du désordre vibe-codé.
- **Usage couleur discipliné** — rouge = accent unique, ambre = toujours sur sombre, navy/noir = structure.
- **Motion centralisé** — `Reveal.tsx` (une entrée d'animation, `viewport once`, un easing) réutilisé partout.
- **Contrastes AA partout** (tableau ci-dessus).
- **Typographie systématique** — échelle `text-4xl/5xl` pour les titres, `font-display uppercase tracking-wide` pour les libellés, `font-mono` pour la méta.
- **Motif de marque intentionnel** — `hazard-stripe` relie les deux métiers (transport / BTP).

---

## Récap

| # | Sévérité | Type | Sujet |
|---|---|---|---|
| D1 | Moyen | décision | Alternance blanc/blanc invisible |
| D2 | Moyen | auto (a11y) | reduced-motion ne stoppe pas les carrousels JS |
| D3 | Moyen | auto (a11y) | Focus-visible ad hoc, pas de token global |
| D4 | Moyen | auto (a11y) | Témoignages sans pause (WCAG 2.2.2) |
| D5 | Faible | auto | Rythme vertical irrégulier |
| D6 | Faible | auto | Deux icônes pour « lire la suite » |
| D7 | Faible | auto | Gris codés en dur hors tokens |
| D8 | Faible | auto | Saut de taille du titre hero à 640 px |
| D9 | goût | décision | Voiles d'image très sombres |

**7 [auto]** corrigeables sans redessiner (dont 3 a11y) · **2 [décision]** en attente de ton choix.

---

## Corrections appliquées (2026-08-18)

Les 9 points ont été traités (`tsc` OK · `eslint` 0 erreur · `next build` 40/40 pages). Règle respectée : **on a ajusté l'existant, rien n'a été redessiné** ; aucune dépendance ajoutée (`useReducedMotion` vient de framer-motion, déjà présent).

| # | Décision / correction |
|---|---|
| D1 | `--sand` : `#FFFFFF` → **`#F5F5F5`** (gris neutre, pas crème). L'alternance blanc / sand est enfin visible ; les cartes blanches gagnent un léger relief sur les sections sand. |
| D2 | `useReducedMotion()` branché sur les **4** minuteurs auto : Hero, Projects, Testimonials, rotateur de numéros du header. « Réduire les animations » stoppe désormais tout défilement automatique. |
| D3 | Anneau de focus clavier global ajouté (`:focus-visible` rouge, offset 2px). Les champs de formulaire gardent leur focus par bordure (priorité de spécificité) ; liens/flèches/boutons ont enfin un focus visible. |
| D4 | Témoignages : ajout de l'état `paused` + pause au survol **et au focus** (`onFocusCapture`/`onBlurCapture`), calqué sur Projects. WCAG 2.2.2 respecté. |
| D5 | Rythme vertical normalisé sur **`py-20 md:py-28`** pour les sections de contenu (About, Services, ServiceShowcase ×2, Testimonials, News, bas de Projects). Bandes volontairement compactes laissées telles quelles : CTA rouge (`py-12`) et bandeau Partners (`py-20` + marquee). |
| D6 | « Lire la suite / voir plus » unifié sur **`ArrowRight`** (Projects, News, Services). Les chevrons restent là où ils ont un sens : flèches de navigation des carrousels et puces de liste. `ChevronRightInline` (qui affichait déjà une flèche) renommé `ArrowRightInline`. |
| D7 | Deux tokens neutres ajoutés : **`--line` (#D1D1D1)** et **`--line-soft` (#E1E1E1)**. Tous les gris d'UI clairs y sont routés (`#D1D1D1`, `#E1E1E1`, `#E8E8E8`, `#EEEEEE`) sur Projects, Testimonials, QuoteForm, ContactModal, Header, page Contact. Reliquat crème `#f0ede4` → `--sand-deep`. **Non traité volontairement** : les gris de *texte sur fond sombre* (`#cfd6e0`, `#dfe4ec`, `#9aa5b5`, `#8b96a8`…) — ils forment une échelle de hiérarchie intentionnelle, leur tokenisation ne change rien visuellement, et `#cfd6e0` sert aussi de couleur de dessin dans `HeroScene` (SVG). À faire en passe d'hygiène dédiée si souhaité. |
| D8 | Titre hero : `text-[13vw] sm:text-6xl md:text-7xl` → **`text-[clamp(2.5rem,13vw,4.5rem)]`**. Plus de rétrécissement à 640px, montée en taille continue, plafond à 72px. |
| D9 | Voiles adoucis : hero `bg-black/75` → **`/60`**, section devis `bg-black/50` → **`/40`**. Les photos respirent, le titre reste lisible (blanc sur ≥ 60% de noir). |

