# KOPAR — Design System & Style Reference
> **Architecture & UI Guidelines for AI Agents & Developers**
> A modern, high-contrast, minimalist fintech design system built for collaborative household expense management. Engineered for instant visual clarity, seamless usability, and digital trust.

---

## 1. Brand Essence & Philosophy

- **Name:** KOPAR (Finanzas Compartidas & Hogar)
- **Aesthetic:** High-contrast light mode with architectural clarity.
- **Core Principle:** Minimalist, deliberate, and readable. Depth is created through crisp 1px borders (`#dedfe2`) and contrasting background color blocks (`#ffffff` vs `#f7f8f9`), **never with blurry drop shadows**.
- **Signature Accent:** A single electric **Coinbase Blue** (`#0052ff`), reserved strictly for primary calls-to-action, active indicators, and brand identity marks.

---

## 2. Design Tokens — Color Palette

| Token Name | Hex Value | CSS Variable | Tailind Class | Role & Usage |
|---|---|---|---|---|
| **Coinbase Blue** | `#0052ff` | `--color-coinbase-blue` | `bg-[#0052ff]`, `text-[#0052ff]` | Primary CTAs, active tab indicators, brand logo, primary highlights. |
| **Interactive Blue**| `#578bfa` | `--color-interactive-blue` | `text-[#578bfa]` | Secondary text links, hover states, clickable inline labels. |
| **Midnight** | `#0a0b0d` | `--color-midnight` | `bg-[#0a0b0d]`, `text-[#0a0b0d]` | Primary headings, dark accents, main body text. |
| **Pure White** | `#ffffff` | `--color-pure-white` | `bg-[#ffffff]`, `text-[#ffffff]` | Page canvas, main card backgrounds, modal bodies. |
| **Slate** | `#5b616e` | `--color-slate` | `text-[#5b616e]` | Secondary text, descriptive labels, subtitles, inactive icons. |
| **Ash** | `#8a919e` | `--color-ash` | `text-[#8a919e]` | Helper text, disabled states, subtle metadata and timestamps. |
| **Frost** | `#f7f8f9` | `--color-frost` | `bg-[#f7f8f9]` | Section backgrounds, card inner containers, hovered row states. |
| **Cloud** | `#eef0f3` | `--color-cloud` | `bg-[#eef0f3]` | Progress bar tracks, neutral badges, subtle dividers. |
| **Pewter** | `#dedfe2` | `--color-pewter` | `border-[#dedfe2]` | **Universal 1px border** for cards, inputs, buttons, and dividers. |
| **Positive Green**| `#27ad75` | `--color-positive-green` | `text-[#27ad75]`, `bg-[#27ad75]/10` | "Te deben", positive balances, paid status, budget surplus. |
| **Negative Red** | `#f0616d` | `--color-negative-red` | `text-[#f0616d]`, `bg-[#f0616d]/10` | "Debes", negative balances, debt alerts, budget overspend (>90%). |

---

## 3. Typography & Text Hierarchy

All headings utilize **Manrope** (Display), while interactive controls and body copy utilize **Inter** (Sans).

```css
--font-coinbasedisplay: 'Manrope', ui-sans-serif, system-ui, sans-serif;
--font-coinbasesans: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Typographic Scale

| Hierarchy | Font Family | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| **Display / H1** | `font-display` (Manrope) | `28px` - `36px` | Bold / Extrabold (`800`) | `-0.02em` | Main section titles ("Balance general", "Presupuesto"). |
| **Heading / H2** | `font-display` (Manrope) | `20px` - `24px` | Bold (`700`) | `-0.01em` | Header brand logo ("KOPAR"), card titles, modal titles. |
| **Subheading** | `font-sans` (Inter) | `16px` - `18px` | Semibold (`600`) | Normal | Card subsections, member names, large amounts. |
| **Body Primary** | `font-sans` (Inter) | `14px` - `15px` | Medium / Semibold | Normal | Transaction concepts, list item titles, form labels. |
| **Body Secondary**| `font-sans` (Inter) | `12px` - `13px` | Regular (`400`) | Normal | Metadata (`Pagó Mateo • Ayer`), descriptions, subcategories. |
| **Micro / Tag** | `font-sans` (Inter) | `10px` - `11px` | Semibold / Bold | `0.05em` (uppercase) | Status badges (`PAGADO`, `DEBES`), category labels. |

---

## 4. Spacing & Geometric Radii System

The layout strictly abides by an **8px base rhythmic grid**.

### Border Radii Standards

- **Buttons & Action Pills:** `rounded-full` (`56px` or `9999px`) — Always fully rounded elongated pills.
- **Badges & Filter Tags:** `rounded-full` (`9999px`) — Pill chips with balanced horizontal padding.
- **Main Container Cards:** `rounded-[24px]` (24px) — Clean, rounded corners for primary panels.
- **Inner Containers / List Items:** `rounded-[16px]` (16px) — Follows the nested radius rule (`24px - 8px padding = 16px`).
- **Form Inputs & Modals:** Inputs use `rounded-[12px]`, Modals use `rounded-[28px]`.

---

## 5. UI Component Blueprint

### 5.1. Header (`Header.tsx`)
- **Sticky positioning:** `sticky top-0 z-30 bg-[#ffffff] border-b border-[#dedfe2] px-6 py-4`.
- **Brand Title:** App logo square with `rounded-[7px]`, followed by `KOPAR` in `font-display text-[20px] font-extrabold tracking-wider`.
- **Right Utilities:** 
  - Quick invite button with `UserPlus` icon (`rounded-full h-9 w-9 border border-[#dedfe2]`).
  - Notification bell button with unread count badge indicator.

### 5.2. Onboarding Wizard (`OnboardingWizard.tsx`)
- 4-step minimal wizard without cognitive clutter:
  - **Paso 1:** Identidad del hogar y selector de divisa principal en dropdown con buscador.
  - **Paso 2:** Perfil del creador (Administrador) e invitaciones dinámicas por correo (mínimo 1 integrante requerido).
  - **Paso 3:** Definición del presupuesto mensual total del hogar y distribución porcentual sugerida/ajustable por categorías (`cat_fijos`, `cat_recurrentes`, `cat_ocasionales`, `cat_imprevistos`) con validación de balance 100% y opción de omitir.
  - **Paso 4:** Registro opcional del primer gasto común o inicio con balance limpio en $0.
- Progreso: Indicador segmentado de 4 partes (`#eef0f3` track, `#0052ff` activo).
- Contenedores: `rounded-[24px] bg-[#f7f8f9] border border-[#dedfe2]`.
- Controles: Botones CTA `rounded-full` (`#0052ff`), inputs `rounded-[12px]` y sub-tarjetas `rounded-[16px]`.

### 5.3. Balance Card (`BalanceCard.tsx`)
- Outer container: `bg-[#ffffff] border border-[#dedfe2] rounded-[24px] overflow-hidden`.
- Editorial photo banner: `aspect-[21/11.25] bg-cover relative border-b border-[#dedfe2]`.
- Bottom-right cover personalization button: Single `<Camera />` icon in `bg-[#0a0b0d]/80 hover:bg-[#0052ff] rounded-full p-2`.
- Content section:
  - Title: `text-[28px] sm:text-[32px] font-extrabold text-[#0a0b0d]`.
  - Financial breakdown box: `bg-[#f7f8f9] rounded-[16px] border border-[#dedfe2] p-4 sm:p-5`.
  - Row items: Debes (Red `#f0616d`), Te deben (Green `#27ad75`), and Net Balance Pill.

### 5.3. Quick Actions Grid (`QuickActions.tsx`)
- Balanced 2-column grid (`grid grid-cols-2 gap-3 px-4 sm:px-6 mb-6`).
- **Primary CTA:** `bg-[#0052ff] text-[#ffffff] hover:bg-[#0052ff]/90 py-3.5 px-4 rounded-full text-xs font-semibold`.
- **Secondary CTA:** `bg-[#ffffff] text-[#0a0b0d] hover:bg-[#f7f8f9] py-3.5 px-4 rounded-full text-xs font-semibold border border-[#dedfe2]`.

### 5.4. Activity & Transaction Rows (`RecentActivity.tsx`, `ActividadTab.tsx`)
- Row container: `flex items-center gap-4 bg-[#ffffff] border border-[#dedfe2] hover:bg-[#f7f8f9] p-4 rounded-[16px] cursor-pointer transition-all`.
- Category Icon: `w-10 h-10 rounded-full flex items-center justify-center text-white`.
- Middle Section:
  - Top: Expense title (`text-[15px] font-semibold text-[#0a0b0d]`).
  - Middle: `Subcategory/Category • Payer` inline text (`text-[12px] text-[#5b616e]`).
  - Bottom: Relative date timestamp (`text-[11px] text-[#8a919e]`).
- Right Section: Formatted amount (`text-[15px] font-bold text-[#0a0b0d]`) + Status pill (`PAGADO` / `DEBES`).

### 5.5. Budget Progress & Category Breakdown (`PresupuestoTab.tsx`)
- Card header with total budget concept, values, and percentage pill badge (`{overallPercentage}% ejecutado`) placed directly below the amount.
- Progress bar: `bg-[#eef0f3] h-2.5 rounded-full overflow-hidden` with dynamic bar (`bg-[#0052ff]` or `bg-[#f0616d]`).
- Sub-bar metadata: Remaining budget (`Disponible: $...`) placed cleanly below the progress bar.
- Card footer: Category count and `SlidersHorizontal` pill button opening full modal.

### 5.6. Bottom Navigation Bar (`BottomNavigation.tsx`)
- Fixed bottom container: `fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#dedfe2] py-2 px-4`.
- Constrained width: `max-w-xl mx-auto flex items-center justify-around`.
- Tabs: **Inicio**, **Actividad**, **Presupuesto**, **Hogar**.
- Active Tab state: `text-[#0052ff] font-bold` with active indicator; Inactive state: `text-[#5b616e] hover:text-[#0a0b0d]`.

### 5.7. Modals & Dialogs
- Backdrop: `fixed inset-0 z-50 bg-[#0a0b0d]/50 backdrop-blur-xs flex items-center justify-center p-4`.
- Dialog window: `bg-[#ffffff] rounded-[28px] border border-[#dedfe2] max-w-lg w-full overflow-hidden`.
- Currency Input Pattern: Prefix symbol placed with `absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none select-none`, input styled with `pl-11 pr-3 py-2.5 border border-[#dedfe2] rounded-[12px] text-sm font-semibold`.

---

## 6. Number & Currency Formatting Guidelines

Always format monetary figures using Colombian/Spanish thousand-separator standards:
```typescript
// Standard format:
currency + amount.toLocaleString('es-CO')
// Example output:
// COP $185.000  |  $45.000  |  USD $1.250
```

---

## 7. Rules for Future Agents (Strict Do's & Don'ts)

###  DO
- **Stick strictly to the 10 token palette:** `#0052ff`, `#578bfa`, `#ffffff`, `#0a0b0d`, `#5b616e`, `#8a919e`, `#f7f8f9`, `#eef0f3`, `#dedfe2`, `#27ad75`, `#f0616d`.
- **Use `rounded-full` (56px) for all buttons and interactive tags.**
- **Use `rounded-[24px]` for all main cards.**
- **Keep currency prefix separated from input digits with `pl-11` left padding.**
- **Use subtle borders (`#dedfe2`) and contrasting background surfaces (`#f7f8f9`) instead of drop shadows.**
- **Maintain single-line inline metadata** (`Concepto • Pagó Persona • Fecha`) to preserve vertical rhythm.

### ❌ DO NOT
- **DO NOT add gradient text, glowing drop shadows, or dark mode glassmorphism.**
- **DO NOT create rectangular buttons with sharp 4px/0px corners.** Buttons must always be pill-shaped.
- **DO NOT add redundant hero eyebrows or multiple labels saying the same thing** (e.g., avoid stacking "Resumen Financiero", "Balance General", "Total Neto" in the same card).
- **DO NOT use third-party icon libraries other than `lucide-react`.**
- **DO NOT hardcode arbitrary colors outside the token table.**
