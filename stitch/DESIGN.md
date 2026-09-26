---
name: Precision Logistics
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#069669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
  code-data:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets warehouse managers, logistics coordinators, supply chain analysts, and inventory audit specialists who handle complex, high-velocity stock movements under tight operational timelines. The core personality is systematic, high-fidelity, and authoritative—engineered to deliver immediate situational awareness and reduce cognitive friction across data-dense workflows.

The visual direction follows **Modern Corporate with High-Density Functionalism**. It avoids unnecessary skeuomorphic flourishes or decorative excess, favoring sharp information architecture, unambiguous state differentiation, and crisp structural delineations. Interfaces prioritize scan speed: SKU codes, bin locations, batch lots, and inventory deltas must be identifiable in fractions of a second. Micro-interactions are deliberate and swift, reinforcing operational confidence through immediate visual validation.

## Colors

The palette balances deep industrial foundation tones with semantic accents calibrated for mission-critical warehouse status displays:

- **Foundation Canvas & Surfaces**: Default background uses slate `neutral-50` (`#F8FAFC`) with structural container levels in pure white (`#FFFFFF`) and alternate row shading in `neutral-100` (`#F1F5F9`). Structural borders adhere strictly to crisp hairline slate `border-default` (`#E2E8F0`).
- **Primary Industrial Slate**: Deep slate navy (`#0F172A` and `#1E293B`) anchors primary navigation bars, sidebar surfaces, table headers, and structural headings, lending weight and high contrast.
- **Cobalt Interactive Accent**: Vibrant cobalt blue (`#2563EB`, active hover `#1D4ED8`, focus ring `#93C5FD`) serves exclusively for interactive affordances: primary CTAs, active tab strokes, selected row checkboxes, and actionable breadcrumb links.
- **Operational Semantics**:
  - *Success / Validated*: Emerald (`#059669` base, `#ECFDF5` background wash) for 'In Stock', 'Received', 'Count Reconciled', and 'Completed Order'.
  - *Warning / Attention*: Amber (`#D97706` base, `#FFFBEB` background wash) for 'Low Stock Reorder Point', 'Pending Audit', and 'Partially Fulfilled'.
  - *Critical / Danger*: Ruby crimson (`#DC2626` base, `#FEF2F2` background wash) for 'Out of Stock', 'Discrepancy Detected', 'Damaged Lot', and 'Quarantine'.
  - *Movement Directives*: Dedicated directional hues for transaction streams—emerald for incoming replenishment (`+`), slate-navy for internal multi-bin transfers (`⇄`), amber for manual variance adjustments (`⟳`), and crimson for dispatch deduction (`-`).

## Typography

The design system uses **Geist** throughout all headlines, running text, data cells, and technical indicators. Geist provides mechanical clarity, compact vertical metrics, and optical legibility required for high-density enterprise software.

Crucial typography rules for inventory data:
- **Tabular Lining Numbers**: All monetary values, unit quantities, on-hand counts, batch barcodes, and SKU codes must render with CSS `font-variant-numeric: tabular-nums` or `font-feature-settings: "tnum" 1`. This guarantees clean vertical alignment across columns in comparison sheets, audit trails, and packing slips.
- **Technical Codes**: SKU codes, serial identifiers, warehouse bay/aisle/shelf tags, and tracking numbers use `code-data` with slight tracking expansion (`+0.02em`) and medium weight (`500`) to prevent character misinterpretation in warehouse lighting.
- **Section Headers and Meta Labels**: All navigation subheads and table column labels leverage `label-sm` in all-caps with generous character spacing (`0.03em`) in muted slate (`#64748B`) to establish immediate structural boundaries.

## Layout & Spacing

The layout model is an enterprise-optimized fluid grid driven by an anchor desktop breakpoint with responsive structural adaptation:

- **Desktop (1280px and above)**: Persistent 260px condensed sidebar navigation, followed by a fluid content canvas divided into a 12-column layout. Column gutters sit at `1.5rem` (`gutter-desktop`) with outer screen margins set to `2rem` (`margin-desktop`).
- **Tablet / Industrial Mobile Computers (768px – 1279px)**: Sidebar shifts to an icon-rail (72px wide) with flyout fly-menus. Data table layouts prioritize priority columns, collapsing supplementary metadata into secondary expandable rows. Column gutters adjust to `1rem` (`gutter`).
- **Handheld / Barcode Terminals (Below 768px)**: Canvas margins drop to `1rem` (`margin`). The structural sidebar collapses into a drawer accessed via top-bar navigation. Multi-column tables collapse into vertical card lists optimized for one-thumb inspection and rapid barcode verification.
- **Rhythm**: Component interiors maintain strict multiples of 4px. Data rows maintain compact padding (`0.5rem` vertical) for ultra-dense views, scaling up to standard (`0.75rem` vertical) for general operational views.

## Elevation & Depth

Visual hierarchy uses a refined hybrid of **tonal layering** and **low-contrast outlines**, eliminating heavy drop shadows that clutter dense tabular environments.

- **Level 0 (Canvas Base)**: Cool slate `#F8FAFC` background. Never casts shadows.
- **Level 1 (Card & Table Containers)**: Solid white `#FFFFFF` surface enclosed by a 1px solid hairline border in `#E2E8F0`. Depth is conveyed strictly through color contrast between the white tile and slate canvas, augmented only on subtle hover with an ambient, tinted diffusion: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Dropdowns, Popovers, & Bulk Action Bars)**: Floating elements (e.g., location selectors, filter drawers, floating bulk-action dock) use `box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)` combined with an `#CBD5E1` border ring.
- **Level 3 (Modal Overlays & Quick-Audit Flyouts)**: High-priority drawers and confirmation sheets sit over a 40% tinted slate scrim (`rgba(15, 23, 42, 0.40)`) with backdrop blur (`blur(2px)`), casting a directional elevation shadow: `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`.

## Shapes

The design system implements a **Soft (Level 1)** geometric standard. Industrial applications require maximized pixel space for numerical alignment; sharp to soft corners communicate precision and data stability.

- **Inputs, Buttons, and Table Containers**: Base corner radius is `0.25rem` (4px). This maintains crisp structural lines along vertical data streams.
- **Panels, Master Cards, and Modal Windows**: Encased in `rounded-lg` (`0.5rem` / 8px) with strict 1px hairline perimeter borders.
- **Status Badges, Directional Delta Chips, and Avatar Tokens**: Strict full-pill shape (`9999px`) to create an immediate shape-language divergence between interactive/structural containers (rectilinear) and state indicators (pill-shaped).

## Components

### 1. Navigation Sidebar
- **Structure**: Deep navy background (`#0F172A`) with a subtle 1px border-right (`#1E293B`).
- **Section Headers**: Uppercase `label-sm` in slate `#64748B` with `0.5rem` bottom margin (e.g., 'OPERATIONS', 'MASTER DATA', 'CONFIGURATION').
- **Nav Items**: Height 36px, `0.25rem` radius. Inactive: slate `#94A3B8` icon and text. Hover: `#1E293B` background with white text. Active: vibrant cobalt fill `#2563EB` with white text and high-contrast icon.

### 2. High-Density Data Tables
- **Header**: Slate `#F8FAFC` background, 36px height, text in uppercase `label-sm` (`#475569`). Fixed border-bottom in 1px `#CBD5E1`. Sort indicators use persistent directional arrows.
- **Rows**: Alternating subtle zebra striping (`#FFFFFF` to `#F8FAFC`), row height 40px (compact) or 48px (standard). Text rendered in `body-md` with tabular numerals. Hover state triggers `#F1F5F9`. Selected row adds `#EFF6FF` background with a 2px left border accent in `#2563EB`.
- **Batch Action Toolbar**: When rows are checked, a floating toolbar pins to the bottom-center of the viewport: deep navy pill (`#0F172A`), white label displaying count (e.g., "14 SKUs Selected"), flanked by secondary action buttons ('Print Labels', 'Adjust Location', 'Archive').

### 3. Status Badges & Pill Indicators
- **Dimensions**: Height 22px, horizontal padding `0.625rem`, font `label-sm` bold, full-pill radius (`9999px`).
- **Variants**:
  - *In Stock / Done*: `#ECFDF5` background, `#059669` text, `#A7F3D0` border.
  - *Low Stock / Pending*: `#FFFBEB` background, `#D97706` text, `#FDE68A` border.
  - *Out of Stock / Critical*: `#FEF2F2` background, `#DC2626` text, `#FECACA` border.
  - *Draft / Idle*: `#F1F5F9` background, `#475569` text, `#E2E8F0` border.

### 4. Real-Time Stock Movement Indicators
Inline micro-chips visualizing stock variance:
- **Incoming (+)**: `#059669` text with prefix icon `+` (e.g., `+120 EA`).
- **Outgoing (-)**: `#DC2626` text with prefix icon `-` (e.g., `-45 EA`).
- **Transfer (⇄)**: `#1E293B` text with dual arrow prefix `⇄` (e.g., `⇄ Bay B-04`).
- **Adjustment (⟳)**: `#D97706` text with reload icon `⟳` (e.g., `⟳ -2 EA (Audit)`).

### 5. Buttons & Actions
- **Primary Button**: Solid `#2563EB` fill, `#FFFFFF` text, `0.25rem` radius, height 36px. Hover: `#1D4ED8`. Focus ring: 2px offset with `#93C5FD`.
- **Secondary Button**: `#FFFFFF` background, 1px `#CBD5E1` border, `#0F172A` text. Hover: `#F8FAFC` background with `#94A3B8` border.
- **Destructive Action**: `#DC2626` background, `#FFFFFF` text. Hover: `#B91C1C`.
- **Icon Action Buttons**: 32x32px square, `0.25rem` radius, transparent background, `#64748B` icon, shifting to `#E2E8F0` background on hover.

### 6. Inputs & Search Fields
- **Warehouse Global Search**: Height 36px, embedded leading search icon and trailing keyboard shortcut token (`⌘K`). `#FFFFFF` background with 1px `#CBD5E1` border, transitioning to 2px `#2563EB` ring on focus.
- **Location Tag Chips**: Interactive compact tags (e.g., `A-12-03`) styled with `#F1F5F9` background, 1px `#E2E8F0` border, `code-data` typography, and an optional pin icon for instant warehouse map modal opening.

### 7. Form Controls & Selection
- **Checkboxes**: 16x16px, `0.25rem` radius, 1.5px border `#94A3B8`. Checked: `#2563EB` solid fill with sharp white check glyph.
- **Radio Buttons**: 16x16px circle, matching interactive border states with solid `#2563EB` center dot on active selection.