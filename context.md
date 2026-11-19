# Collection Lineage Web: project context

Handoff notes for Claude Code. This is a family-tree site for Andrew's cannabis strain collection, built in a Claude (Cowork) session.

## What it is

- One static page, `index.html`, hosted on GitHub Pages from this repo (`themoch/lineage-d8691514f9`)
- Shows 40 strains in Andrew's collection from 12 breeders, each traced back as far as public sources go
- Each tree reads top to bottom: oldest ancestors at the top, the collection strain at the bottom
- Meant to be shared by link only. Not meant to be found through search.
- The same page also exists as a private Claude artifact. That copy is separate and won't update from this repo.

## Hard requirements

- **Stay hidden from search:** keep `<meta name="robots" content="noindex, nofollow, noarchive">` and `<meta name="referrer" content="no-referrer">` in `<head>`
- **Don't link or publicize** the repo or the page
- **Static site, no build:** `data.js` (data + shared model), `style.css`, pages `index.html`, `table.html`, `breeding.html`. The only external script is dagre 0.8.5 from cdnjs, plus Google Fonts.
- **Layout:** must work at phone width, about 400px. The page never scrolls sideways; the tree scrolls inside its own `.scroller` box.
- **Light and dark themes:** every color is a CSS variable on `:root`, redefined for dark mode

## File structure (inside index.html)

1. **`<head>`:** meta tags and the `<style>` block. Color variables:
   - `--mine`: collection strains (purple)
   - `--own`: Andrew's own crosses (orange)
   - `--archive` / `--archive-line`: Archive ancestors
   - `--offsite` / `--offsite-line`: other breeders
   - `--unknown` / `--unknown-line`: dead ends, drawn dashed
   - `--hl`: highlight
   - `--edge`: lines between boxes
2. **Body markup:** header, strain buttons (`#chips`, filled in by JS), legend, controls, `.stage` with `<svg id="g">`, detail panel `#detail`, Breeding read panel, lineage table `#tbody`
3. **`<script>` with the data:** two arrays, `N` (strains) and `E` (parent links)
4. **`<script>` with the app:** a single IIFE (self-running function) that does layout, drawing and the analysis bars

## Data model

`N` rows are `[id, label, src, mine, flower, aroma, cross, url, breeder]`:

- **`id`:** short lowercase key, unique
- **`src`:** one of these constants:
  - `A` = `'archive'` (Archive Seed Bank strain or ancestor)
  - `O` = `'offsite'` (another breeder, parents known)
  - `U` = `'unknown'` (founder or dead end, parents not known)
  - `W` = `'own'` (Andrew's own cross)
- **`mine`:** `1` if the strain is in the collection, `0` if it's only an ancestor
- **`flower`, `aroma`:** use `''` when the source doesn't say. Never invent values.
- **`cross`:** the lineage text shown in the detail panel, including caveats
- **`url`:** source page as plain text, or `''`
- **`breeder`:** needed for collection strains, because the buttons are grouped by it

`E` rows are `[childId, parentId, kind]`:

- **`kind` omitted:** a normal cross (solid line)
- **`'sel'`:** a selection or pheno of one parent, like an F2 male or a named cut (dotted line)
- **`'dash'`:** an unconfirmed link (dashed line)
- **Unnamed intermediate crosses** get their own node. Example: `bbgf` "Blueberry x Grapefruit" sits between Diablo and its two grandparents.
- **No cycles.** Check for them whenever you add links.

## App behavior

- **Views:**
  - One strain's tree: just the strain and its ancestors (the default view)
  - `'all'`: the full web
  - `'b:<Breeder>'`: one breeder's strains plus their ancestors
- **Layout:** dagre, top to bottom
  - A single tree uses the `network-simplex` ranker
  - The full web and breeder webs use `longest-path`, which lines the collection strains up along the bottom
- **Drawing:** hand-built SVG. Lines are smoothed curves through dagre's points, with arrow markers.
- **Taps:**
  - In a single tree, tapping a box opens that strain's tree
  - In a web, the first tap highlights a strain's ancestors and descendants; a second tap opens its tree
- **Saved settings:** localStorage keys `lw-view` (last view) and `lw-dead` (the "Show dead ends" switch). Every read and write is wrapped in try/catch.
- **Zoom:** −/+ buttons and "Fit width" change the scale. The scroller box handles panning.

## Analysis (partly hand-written: update it when strains change)

- **Moonbow share bars:** computed in JS for Archive strains only
  - Moonbow is Zkittlez x Dosidos, the backbone of most Archive strains
  - Each parent contributes 50%; a `'sel'` link passes 100%
  - Lemonheads v2, Dream Machine and Crazy Hazey are 3-way crosses, `(a x b) x c`, so they're weighted `[.25, .25, .5]`. Hard-coded in `fr()`.
- **Breeding read panel:** hand-written HTML
  - Bullets on links between the Archive and non-Archive strains, Andrew's own crosses, closest and most distant pairs, and the dead-end caveat
  - Counts like "15 Archive strains" and "34 strains · 10 breeders" are typed into the copy. Update them by hand.
  - Better long term: generate this panel from the data.

## Collection as of 2026-11-11

- **Archive Seed Bank (15):** Wraith, Zumo, Nubo, Lemon Venom, Nu Walka, Ichibo, Ichiban, Bingo!, Lemonheads v2, Circle Jerk, Moonbow 112 IX, Crazy Hazey, Dream Machine, Oishii, Dosi-Cake
- **Cookies Fam:** Biscotti
- **Next Generation Seed Co:** Diablo
- **Oni Seed Co:** Sour Trop
- **Bred by 42:** Cross of the Titans
- **Unknown breeder:** (GG4 x I-95) x Chemdog S1
- **Copa Genetics:** Salmon Creek Big Bud F2, Truffle Alert, Icy OG, Meigs OG
- **Mass Medical:** Golden PuTang, Laos Landrace, Watermelon Hashplant, Valedictorian, Medi Pak, Golden Pineapple
- **Hazeman Seeds:** Blue Tuna
- **Brisco's Beans:** Money Tree
- **Andrew Moch (own crosses):** Fish Sticks (Blue Tuna x Icy OG), Bubble PAK (Bubble Gum x Medi Pak)

## Data decisions and open questions

- **Names:**
  - Andrew's "Crazy Haze" is Archive's Crazy Hazey
  - "Oishi" is Oishii
  - Archive's "Ichiban" product page is titled "Ichiban – Toad Venom x Oishii"
- **Circle Jerk:** no Archive page exists. Super Runtz x Oishii comes from a Strainly resale listing.
- **Flavor Pack #7:** parentage is from SeedFinder (Hollywood Pure Kush x Moonbow), not Archive. Drawn as dashed links.
- **Golden Pineapple:** Andrew wrote (C99 x White Widow) x PuTang. SeedFinder calls that cross Golden PuTang and lists Golden Pineapple as C99 x White Widow. The tree follows SeedFinder. Confirm with Andrew.
- **Medusa:** uses Andrew's lineage (Pure Kush x Mendo Breath), not Nirvana Seeds' Medusa
- **Diablo:** the breeder also credits a South African sativa that SeedFinder's tree doesn't show. The tree follows SeedFinder.
- **Wedding Cake:** parentage is disputed (Triangle Kush x Animal Mints vs Cherry Pie x GSC). Left as a dead end.
- **Widely reported, not breeder-confirmed:**
  - White Truffle = a Gorilla Butter pheno
  - Gorilla Butter = GG4 x Peanut Butter Breath
  - Peanut Butter Breath = Dosidos x Mendo Breath
  - GG4 = Chem's Sister x Sour Dubb x Chocolate Diesel
  - Mendo Breath = OGKB x Mendo Montage
  - Jilly Bean = Orange Velvet x Space Queen
  - Space Queen = Romulan x C99
  - Tropicana Cookies = GSC x Tangie
- **No published parents (dead ends):** Nu Diesel, DogWalker OG, Super Runtz, Albert Walker, Lemon Peel, Lemon Lime Line, Animal Mintz, Sin Mint Cookies, I-95, Medi Haze, Poison Potion, Tuna Kush, Meigs Gold, Watermelon Hashplant's other parent, Big Sur Holy Weed

## Sources

- Archive strain library (lineage for every Archive strain): https://archiveseedbank.com/collections/strain-library-no-auctions
- Archive product pages: https://archiveseedbank.com/products/<slug> (`url` holds each one)
- SeedFinder genealogy: https://seedfinder.eu/en/strain-info/<strain>/<breeder>/genealogy
  - Correct slugs that work: `do-si-dos/archive-seed-bank`, `face-off-og-bx1/archive-seed-bank`, `og-kush-breath/unknown-or-legendary`, `the-original-z/dying-breed-seeds`, `biscotti/cookie-fam-genetics`, `sherbadough/archive-seed-bank`
- Blue Tuna (Blue Dream x Tuna Kush): https://dcseedexchange.com/product/blue-tuna-blue-dream-x-tuna-kush-12-regular-seeds/
- Circle Jerk: https://strainly.io/en/listings/509379-archive-seedbank-circle-jerk

## How to add a strain

1. Look up the lineage: the breeder's page first, then SeedFinder genealogy. Record flower time and aroma only when a source states them.
2. Add the `N` row with `mine: 1` and a `breeder`. Add a node for every new ancestor, and reuse existing ids where the strain is the same (e.g. `zkittlez`, `ogkb`, `dosidos`, `gsc`, `blueberry`, `afghani`, `thai`, `pakistani`, `chemdog`).
3. Add the `E` links. Use `'sel'` for a cut, F2 or pheno selection, and `'dash'` for anything unconfirmed.
4. Check for duplicate ids, links that point to missing nodes, and cycles.
5. Update the hand-written copy: the header counts, the Breeding read bullets, and the notes under the table if there's a naming or source conflict.
6. Open the page at 1280px and 400px, in light and dark mode, and check that the console shows no errors.

## Ideas for next steps

- Move `N`/`E` into `strains.json` and build `index.html` with a small Node script. JavaScript is preferred.
- Generate the Breeding read panel from the data: most-shared ancestors, closest pairs, best outcrosses.
- Add search and filters, e.g. by breeder, flower time, or ancestor ("show everything with OGKB").
- Add a "plan a cross" tool: pick two strains, see the ancestors they share, and get an expected percentage of each ancestor's genetics.

## Parent data (added 2026-11-18)
- `D` now also has entries for 68 ancestors (`mine:0`), researched from public sources (Leafly, Seedfinder, breeder pages). Extra keys: `src` (URL) and `conflict` (where sources disagree with the `cross` text). Unverifiable fields are omitted; intermediate crosses and unknown founders have no entry.
- The detail panel in `index.html` shows a collapsible "Parents" section per strain with each direct parent's table. Source URLs came from search results and are not all individually verified.
