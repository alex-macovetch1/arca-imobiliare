# ARCA — agenție imobiliară, Chișinău

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · CSS Modules.
Fără Tailwind, fără bibliotecă de UI, fără dependențe în afara Next/React.

```
npm run dev     # localhost:3000
npm run build
```

---

## Structura

```
app/
  layout.tsx            root: fonturile, <LangProvider>, metadata globală
  globals.css           tokenurile, resetul, utilitarele (.wrap .btn .kicker .rv ...)
  not-found.tsx         404, cu Nav și Footer montate manual (e în afara grupului)
  sitemap.ts robots.ts  generate din PROPERTIES / COMPLEXES / AGENTS
  (site)/
    layout.tsx          Nav + main + Footer + ContactRail + Reveal
    page.tsx            homepage
    proprietati/        rezultate (browser cu filtre) + [slug] anunțul
    complexe/           ansambluri + [slug] ansamblul
    agenti/             echipa + [slug] agentul
    indice/             Indicele ARCA (medianele €/m² pe sector)
    credit/  ghid/      calculator ipotecar · ghidul cumpărătorului
    vinde/  despre/  contact/  favorite/  confidentialitate/
  admin/                panoul agenției (parolă în ADMIN_KEY)
  api/lead              endpointul tuturor formularelor
  api/admin             panoul: sesiune + operațiile pe date
components/
  Nav.tsx  Footer.tsx  LangSwitch.tsx  ContactRail.tsx
  Hero.tsx  SearchBar.tsx  SectorGrid.tsx  MarketBand.tsx  HomePicks.tsx
  ComplexStrip.tsx  GuideCards.tsx  Stats.tsx  AgentStrip.tsx  CtaBand.tsx
  PropertyCard.tsx      SINGURUL card de proprietate din tot site-ul
  Filters.tsx  FiltersPanel.tsx  FiltersCore.ts  SortBar.tsx  MapPanel.tsx
  Gallery.tsx  ViewingForm.tsx  LeadRequestForm.tsx  MortgageCalculator.tsx
  PriceIndexBand.tsx    poziția prețului față de banda sectorului
  AgentCard.tsx  SimilarList.tsx  PageIntro.tsx  NotFoundView.tsx
  Logo.tsx            <Logo/> (logotipul) și <Arch/> (arcada hairline)
  Icons.tsx           toate iconițele, 24x24, stroke 1.5, currentColor
  Reveal.tsx          un singur IntersectionObserver pentru toată pagina
lib/
  types.ts            sursa unică de adevăr pentru forma datelor
  lang.tsx            LangProvider, useLang(), t()
  content.ts          AGENCY, NAV, FOOTER_LINKS, hărțile de etichete, UI
  properties.ts       PROPERTIES (24)
  agents.ts           AGENTS (4)
  complexes.ts        COMPLEXES (4) + complexProperties() + complexName()
  sectors.ts          SECTORS (12) + CITY_SECTORS (cele 6 cu dală foto)
  market-index.ts     Indicele ARCA: benzile €/m², sursa unică a cifrelor
  favorites.ts        proprietățile salvate (localStorage, un singur store)
  next-viewing.ts     primul interval liber de vizionare
  format.ts           preț, €/m², suprafață, etaj, dată, distanță, telefon
public/
  img/                fotografiile (vezi mai jos)
  harti/chisinau.jpg  planul stilizat folosit de toate anunțurile
```

Fără folder `src/`. Componentele stau plat în `components/`, fiecare cu
`.module.css` alături, exact ca la proiectul anterior.

---

## Convenții — obligatorii, altfel iese inconsecvent între agenți

### CSS

- **Un `.module.css` per componentă**, importat ca `import styles from "./Nume.module.css"`,
  clasele accesate `styles.numeClasa` (camelCase).
- **Utilitarele globale se scriu ca string simplu**, nu prin `styles`:
  `className="wrap sec"`, `` className={`btn ${styles.cta}`} ``.
- Globale disponibile: `.wrap` `.wrap-wide` `.sec` `.sec-accent` `.grid-cards`
  `.kicker` `.lead` `.serif` `.spec` `.num` `.legal` `.link` `.clamp-2`
  `.btn` `.btn-line` `.btn-line-dark` `.field` `.ph` `.ph-portrait` `.ph-scrim`
  `.badge` `.badge-clay` `.arch` `.rv` `.rvimg`.
- **Nu se scrie niciodată o culoare literală.** Doar variabilele din `:root`.
- Colțuri drepte peste tot (`--r: 0`). Rotunjit doar avatarul agentului,
  markerul de hartă și săgețile de galerie (`--r-full`).
- Alama (`--brass`) e **numai linie de 1px sau subliniere**. Niciodată text,
  niciodată fundal.
- `--clay` apare exact în două locuri: badge-ul „Preț redus" și prețul vechi tăiat.
- Hover pe card: se schimbă **doar** `box-shadow` (`--sh-1` → `--sh-2`). Fără
  scale, fără translate.
- Animații doar pe `transform` și `opacity`.

### Traduceri

Fiecare text vizibil e o pereche `T = { ro, ru }`. Fără engleză nicăieri.

```tsx
"use client";
import { useLang } from "@/lib/lang";

const { t, lang } = useLang();
<h2>{t(UI.pricePosition)}</h2>
<p>{t({ ro: "Text scurt", ru: "Короткий текст" })}</p>
```

- Etichetele de interfață stau în `UI` din `lib/content.ts`. **Dacă îți trebuie o
  etichetă nouă, o adaugi acolo**, nu inline în pagină.
- Valorile de enum (sector, stare, fond, facilitate…) se traduc prin hărțile din
  `lib/content.ts`: `SECTOR_LABEL`, `SECTOR_IN`, `DEAL_LABEL`, `KIND_LABEL`,
  `KIND_PLURAL`, `FLAG_LABEL`, `STATUS_LABEL`, `FUND_LABEL`, `CONDITION_LABEL`,
  `LAYOUT_LABEL`, `BUILDING_LABEL`, `HEATING_LABEL`, `PARKING_LABEL`,
  `AMENITY_LABEL`, `POI_LABEL`, `STAGE_LABEL`, `LEAD_SOURCE_LABEL`,
  `LEAD_STATE_LABEL`.
- Limba se ține în `localStorage` sub cheia **`imobil-lang`** și se pune pe
  `<html lang>` / `<html data-lang>`. Serverul randează mereu română; alegerea se
  citește după mount (altfel pică hidratarea).
- `useLang()` e hook de client. O pagină server care are nevoie de text bilingv
  își pune conținutul într-o componentă client mică.

### Citirea datelor

```ts
import { PROPERTIES, getProperty, FEATURED, NEWEST } from "@/lib/properties";
import { AGENTS, getAgent } from "@/lib/agents";
import { SECTORS, CITY_SECTORS, SECTOR_BY_SLUG } from "@/lib/sectors";
import { AGENCY, NAV, UI, SECTOR_LABEL } from "@/lib/content";
```

`PROPERTY_BY_SLUG` și `PROPERTY_BY_ID` există deja — nu face `.find()` în JSX.

### Formatare

**Nimeni nu formatează un număr inline.** Totul din `lib/format.ts`:

```ts
formatPrice(155000)                  // "155 000 €" cu spațiu insecabil
formatRent(950, lang)                // "950 €/lună" · "950 €/мес."
formatDealPrice(property, lang)      // alege singur preț sau chirie
formatPricePerSqm(1987, lang)        // "1 987 €/m²" · "€/м²"
formatArea(67, lang)                 // "67 m²" · "67 м²"  (zecimala cu virgulă)
formatLand(6.5, lang)                // "6,5 ari" · "6,5 сот."
formatFloor(4, 9, lang)              // "Etaj 4 / 9" · "Этаж 4 / 9"
formatFloorShort(4, 9, lang)         // pentru rândul de specs din card
formatYear(2022, "finalizat", lang)  // "2022 (finalizat)"
formatMeters(140, lang)              // "140 m" sub 1 km; "1,2 km" peste
formatDate("2026-07-24", lang)       // "24 iulie 2026" · "24 июля 2026"
formatDateTime(iso, lang)            // "24 iulie, 16:20" — tabelul de lead-uri
formatCount(24, "proprietate", "proprietăți", lang)   // pune „de" corect în RO
formatRooms(3, lang)                 // "3 camere" · "3 комн."
toMDL(155000)                        // "≈ 3 107 750 MDL" (doar pe pagina anunțului)
normalizePhone("069 84 16 40")       // "+37369841640" sau null
displayPhone("+37369841640")         // "+373 69 84 16 40"
```

`EUR_MDL = 20.05`, o singură constantă pentru tot site-ul.

### Imagini

- **Un singur raport pe tot site-ul: 3:2.** Portretele de agent: 4:5.
- Fiecare `<Image>` primește `width`+`height` **sau** stă într-o cutie cu
  `aspect-ratio` (folosește `.ph` / `.ph-portrait`). Zero deplasare la încărcare.
- `sizes` explicit pe fiecare imagine. Pe card:
  `sizes="(max-width:700px) 100vw, (max-width:1099px) 50vw, 358px"`.
- `priority` doar pe hero. Restul lazy (implicit).
- Atenție Next 16: `images.qualities` e implicit `[75]`. Nu pune `quality={90}`
  fără să adaugi valoarea în `next.config.ts`.

### Animația de apariție

Pui `className="rv"` pe bloc (sau `rvimg` pe cutia foto) și, opțional,
`style={{ "--d": "120ms" } as React.CSSProperties}` pentru decalaj.
`<Reveal/>` din layout se ocupă de restul — are `usePathname()` în dependințe și
un `MutationObserver` pe `document.body`, ca blocurile paginii următoare să nu
rămână invizibile după navigarea prin meniu. **Nu-l modifica fără să testezi
navigarea între două pagini.**

### Header transparent peste fotografie

`components/Nav.tsx` are constanta `OVERLAY_ROUTES`. Dacă pagina ta începe cu o
fotografie full-bleed, **adaugi ruta acolo** și îi dai secțiunii hero
`margin-top: calc(var(--h-header) * -1)`. Altfel headerul e opac din start.
Înălțimea headerului nu se schimbă niciodată: `--h-header` (72px / 60px mobil).
Pentru barele sticky de sub header există `--h-subbar` (56px).

### Next.js 16 — capcane

- `params` și `searchParams` sunt **Promise**. Se așteaptă:
  `const { slug } = await props.params;`
- Tipurile generate: `PageProps<'/proprietati/[slug]'>`, `LayoutProps<...>`.
- Convenția `middleware.ts` a fost înlocuită cu **`proxy.ts`** (pentru `/admin`).
- Rutele dinamice au nevoie de `generateStaticParams` ca să fie prerandate.

---

## Datele care există deja

**24 de proprietăți**, verificate automat: prețul cade în banda sectorului,
suprafața în banda numărului de camere, `pricePerSqm === Math.round(price / area)`,
minimum 8 fotografii fiecare, sluguri și coduri unice, fără fotografii repetate
în aceeași galerie.

| | |
|---|---|
| Tranzacție | 19 vânzare · 5 chirie |
| Tip | 18 apartamente · 3 case · 2 birouri · 1 comercial |
| Camere | 4×1 · 8×2 · 5×3 · 3×4 · 1×5 · 3 fără camere (comercial/birou) |
| Sectoare | Centru 7 · Botanica 3 · Buiucani 3 · Râșcani 3 · Ciocana 2 · Telecentru 2 · Poșta Veche 1 · Durlești 1 · Stăuceni 1 · Codru 1 |
| Fond | 15 bloc nou · 9 fond vechi |
| Stare | 12 euroreparație · 4 cosmetică · 4 design individual · 3 variantă albă · 1 necesită reparație |
| Marcaje | 4 exclusivități · 3 noi · 2 preț redus · 3 comision 0% · 4 gata de mutat |
| Featured | 6 (`FEATURED`) |
| Agenți | Andrei 9 · Victor 6 · Natalia 5 · Cristina 4 |

**Codurile ofertelor**: AR-1042 … AR-1374. Slugul conține codul la final.
Pentru chirii, `price` e euro **pe lună** și `pricePerSqm` e chiria pe metru
pătrat pe lună — decide interfața dacă o afișează.

Pentru `kind: "comercial" | "birou"`, `rooms` e `0`: filtrul de camere se aplică
doar apartamentelor și caselor.

### Ansambluri referite din proprietăți

Patru proprietăți au `complexSlug`. Numele, dezvoltatorul și pagina fiecărui
ansamblu vin din `lib/complexes.ts` — nimic nu mai deduce numele din slug:

| complexSlug | nume | dezvoltator | sector |
|---|---|---|---|
| `newton-house` | Newton House | Basconslux | buiucani |
| `grenoble-residence` | Grenoble Residence | Dansicons | botanica |
| `eco-city-residence` | Eco City Residence | Glorinal | ciocana |
| `favorit-residence` | Favorit Residence | Exfactor Grup | riscani |

Alte nume de dezvoltatori deja folosite în portofoliu: Exfactor Grup, Lagmar
Impex, Basconslux, Dansicons, Astercon Grup, Glorinal.

### Ce nu există (deliberat)

`lib/leads.ts` — logica de lead-uri stă în `app/api/_data/` (model, store, rows),
fiindcă numai serverul o folosește. `lib/filters.ts` — implementarea filtrelor
stă în `components/FiltersCore.ts`, lângă componentele care o consumă.

Panoul `/admin` ține modificările într-un overlay separat (`app/api/_data/store.ts`,
un fișier JSON în `data/`, pe Vercel în `/tmp`). Paginile publice citesc direct
`lib/properties.ts`, deci ce ascunzi în panou nu dispare de pe site — pentru un
client real se schimbă implementarea store-ului pe o bază de date și paginile
publice citesc prin `propertyRows()`.

Parola panoului se pune în `.env.local`:

```
ADMIN_KEY=…
```

Fără ea panoul acceptă parola de rezervă `arca` și spune asta pe ecranul de login.

---

## Fotografiile — `public/img/`

Toate sunt de pe Unsplash (imagini libere), redimensionate și recomprimate local
cu `sharp` (progresive, mozjpeg, sub 300 KB fiecare, 6,4 MB în total).

| fișier | dimensiune | ce e |
|---|---|---|
| `hero.jpg` | 1800×1013 | fațadă interbelică, hero-ul homepage-ului |
| `apt-01` … `apt-20.jpg` | 1600×1067 | interioare de apartament |
| `house-01` … `house-04.jpg` | 1600×1067 | exterioare de case |
| `block-01` … `block-06.jpg` | 1600×1067 | fațade de bloc (și pentru ansambluri) |
| `sector-centru`, `-botanica`, `-buiucani`, `-riscani`, `-ciocana`, `-telecentru.jpg` | 800×533 | dalele de sector de pe homepage |
| `agent-01` … `agent-04.jpg` | 640×800 | portretele celor 4 agenți, 4:5 |
| `office.jpg` | 1600×1067 | spațiu de birou / comercial |
| `harti/chisinau.jpg` | 1464×720 | plan stilizat, în paleta ARCA |

Ce arată fiecare `apt-*` e declarat în harta `SHOWS` din `lib/properties.ts`
(living, bucătărie, dormitor, baie, zonă de luat masa, birou) — de acolo se
construiește `alt`-ul bilingv al fiecărei fotografii. Dacă adaugi imagini noi,
adaugi și intrarea în `SHOWS`.

`harti/chisinau.jpg` e singurul `mapImage` al tuturor anunțurilor. Markerul se
pune din `property.coords` de către componenta care randează harta. Când apar
hărți reale per proprietate, se schimbă doar constanta `MAP` din `properties.ts`.

---

## Paleta, pe scurt

| token | valoare | unde |
|---|---|---|
| `--paper` | `#F6F4EF` | fundalul paginii |
| `--surface` | `#FFFFFF` | carduri, bare sticky, panouri |
| `--surface-2` | `#EDEAE3` | benzi alternate, placeholder de imagine |
| `--line` / `--line-2` | `#E3DFD6` / `#CFC9BC` | hairline-uri, borduri de input |
| `--ink` / `--ink-2` / `--ink-3` | `#1A1D1A` / `#4E5249` / `#6B6F66` | titluri / text curent / etichete |
| `--forest` / `--forest-2` / `--forest-soft` | `#1E3B32` / `#162C25` / `#E7EDE9` | accentul unic |
| `--brass` | `#B58B4C` | doar linii de 1px |
| `--clay` | `#9E4A2E` | doar „Preț redus" |

Ritm: secțiune `--sec` 96px (`--sec-m` 56px pe mobil), două secțiuni de accent la
`--sec-accent` 128px, container `--maxw` 1170px, gutter `--gut` 24/16px, grila de
carduri `--gap` 24px.

Fonturi: **Literata** (serif — titluri, titlul cardului, adresa, citate) și
**Manrope** (sans — preț, specs, etichete, butoane, inputuri, tabele, navigație,
cifre). Ambele cu subsetul chirilic. Niciodată invers: prețul nu e serif,
adresa nu e sans. Scara e în variabile: `--t-h1-hero`, `--t-h1`, `--t-h2`,
`--t-h3`, `--t-card`, `--t-lead`, `--t-body`, `--t-spec`, `--t-eyebrow`,
`--t-price-card`, `--t-price-detail`, `--t-figure` (plus `--lh-*` pereche).
