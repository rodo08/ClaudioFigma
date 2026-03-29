# Streamer Card — Web Component

A streamer/influencer profile card built as a native Web Component with Shadow DOM, Constructable Stylesheets, and custom events. No framework, no dependencies.

## Table of contents

- [Demo](#demo)
- [Stack](#stack)
- [Context: from Figma to code without a design system](#context-from-figma-to-code-without-a-design-system)
- [Components](#components)
- [`<streamer-card>` attributes](#streamer-card-attributes)
- [Usage](#usage)
- [Dev setup](#dev-setup)
- [Bidirectional flow: Claude Code ↔ Figma](#bidirectional-flow-claude-code--figma)
  - [Recommended flow: Figma → Code first](#recommended-flow-figma--code-first)
  - [Use case: sending code structure to Figma](#use-case-sending-code-structure-to-figma)
  - [Flow optimisation](#flow-optimisation)
- [Claude interaction lessons](#claude-interaction-lessons)
- [Conclusions](#conclusions)
- [Evaluation: bringing the Figma design into code](#evaluation-bringing-the-figma-design-into-code)

---

## Demo

<!-- Add demo videos here. Suggested structure:

### ❌ Fail case — [short description]
[video or gif]

### ✅ Success case — [short description]
[video or gif]

-->

---

## Stack

- **Web Components** — Custom Elements + Shadow DOM
- **Constructable Stylesheets** — `new CSSStyleSheet()` / `adoptedStyleSheets`
- **TypeScript**
- **Rspack** — bundler with HMR

---

## Context: from Figma to code without a design system

### The scenario

A common situation in day-to-day work: a Figma concept with no defined design system that needs to be implemented for web. No tokens, no systematic naming, no exportable variables — just frames, local styles, and designer judgment.

### First iteration: Claude as direct developer

In the initial iteration, Claude Code was asked to generate HTML/CSS directly from the Figma design description. The result was an **extremely high token consumption with very low precision**: Claude interpreted the design approximately, proposing successive corrections that accumulated more tokens without converging to the original design.

### Solution: hybrid implementation

The approach that worked was a hybrid flow where each party's role is assigned based on the nature of the task:

```
Claude proposes
  ↓
Developer evaluates the precision and quality of the result
  ↓
  ├── High precision → accepted
  ├── Minor adjustment → developer corrects manually
  └── Clear and bounded task → delegated to Claude Code
```

- **Claude Code** is used for well-defined tasks: changing a specific value, refactoring a pattern, generating repetitive structure.
- **The developer adjusts manually** when the task requires fine visual judgment that Claude cannot infer from code alone.

This hybrid flow was what allowed the original Figma design to be implemented faithfully, without over-consuming tokens and while maintaining control over visual decisions.

---

## Components

| Component | Tag | Emits |
|---|---|---|
| `StreamerCard` | `<streamer-card>` | `vote-submitted` |
| `StreamerVibe` | `<streamer-vibe>` | `vibe-change` |
| `StreamerRating` | `<streamer-rating>` | `rating-change` |
| `StreamerModal` | `<streamer-modal>` | `vote-submit`, `vote-cancel` |

### Interaction flow

1. User selects a **vibe** (❤️ up / 💀 down)
2. User selects a **rating** (Meh / Ok / Good / Fire)
3. When both are selected, a **modal** appears to confirm
4. On confirm → `vote-submitted` fires with `{ vibe, rating }`
5. On cancel → both inputs reset

---

## `<streamer-card>` attributes

| Attribute | Description |
|---|---|
| `name` | Real name — used in the card body and image alt |
| `channel` | Display name shown in the author header (fallback to `name`) |
| `logo` | Logo image URL (shown in author header) |
| `avatar` | Avatar image URL (main card image) |
| `badge` | `"new"` or `"popular"` |
| `twitch` | Follower count (e.g. `85K`) |
| `youtube` | Follower count |
| `instagram` | Follower count |
| `tiktok` | Follower count |

---

## Usage

### Option A — Declarative HTML

```html
<script type="module" src="./dist/bundle.js"></script>

<streamer-card
  name="Jane Doe"
  channel="STREAMER"
  logo="./assets/logo.svg"
  avatar="./assets/avatar.png"
  badge="new"
  twitch="85K"
  youtube="234K"
  instagram="112K"
  tiktok="891K"
></streamer-card>
```

### Option B — Programmatic (JS/TS)

```ts
import './components/streamer-card';

const card = document.createElement('streamer-card');
card.setAttribute('name', 'Jane Doe');
card.setAttribute('channel', 'STREAMER');
card.setAttribute('avatar', './assets/avatar.png');
card.setAttribute('badge', 'new');
card.setAttribute('twitch', '85K');

card.addEventListener('vote-submitted', (e) => {
  const { vibe, rating } = (e as CustomEvent).detail;
  console.log({ vibe, rating });
});

document.querySelector('#root')!.appendChild(card);
```

| | Option A | Option B |
|---|---|---|
| Static data | ideal | unnecessary |
| Data from API | hard | ideal |
| Multiple cards | multiple tags | loop over array |
| Frameworks | possible | more natural |

---

## Dev setup

```bash
bun install
bun run dev     # dev server at http://localhost:8080
bun run build   # production build
bun run preview # preview production build
```

---

## Bidirectional flow: Claude Code ↔ Figma

This project is designed to integrate with Figma via the `claude-talk-to-figma-mcp` MCP.

### Recommended flow: Figma → Code first

The correct starting point is **bringing the Figma design into code**, not the other way around. This ensures the code faithfully reflects design decisions and that future synchronisations are predictable.

```
Figma (design source of truth)
  ↓  read variables, colours, typography, spacing
Claude Code
  ↓  translate tokens to component CSS
Code (reflection of the design)
  ↓  code changes → sync back to Figma
Figma (updated)
```

1. **Figma → Code**: Claude reads the design in Figma (variables, styles, nodes) and updates the Web Component styles to match.
2. **Code → Figma**: When an adjustment is made in code, Claude is told the file, the affected lines and what changed — Claude updates the corresponding node in Figma without re-reading the entire tree.

> The reverse flow (Code → Figma as starting point) causes divergence: the Figma design becomes outdated and subsequent synchronisation is more costly.

### Use case: sending code structure to Figma

When a component exists in code but **has no representation in Figma**, its structure can be generated directly from code using MCP tools. The documented case is `<streamer-modal>`:

**Structure sent (executed via MCP):**
```
Frame "streamer-modal" (340×auto, #1a1a1a, radius 30px)   — auto-layout VERTICAL, gap 20, padding 32
├── Text  "Confirm your vote"        — 19px Bold, #ffffff
├── Text  "for Jane Doe"             — 13px, #888888
├── Frame "modal-summary"            — #242424, radius 16px, padding 16/20, auto-layout VERTICAL, gap 10
│   ├── Frame "summary-row-vibe"     — auto-layout HORIZONTAL, SPACE_BETWEEN, transparent fill
│   │   ├── Text "VIBE"              — 10px, #888
│   │   └── Text "❤️ Love it"        — 13px Bold, #fff
│   └── Frame "summary-row-rating"  — auto-layout HORIZONTAL, SPACE_BETWEEN, transparent fill
│       ├── Text "RATING"            — 10px, #888
│       └── Text "Fire 🔥"           — 13px Bold, #fff
└── Frame "modal-buttons"            — auto-layout HORIZONTAL, gap 10, transparent fill
    ├── Frame "btn-submit"           — #f472b6, radius 30px, centred auto-layout → Text "Submit" 14px 600
    └── Frame "btn-cancel"           — #313131, radius 30px, centred auto-layout → Text "Cancel" 14px 600
```

**What is excluded when translating code → Figma:**
- Overlay with `backdrop-filter: blur` — non-structural effects
- `box-shadow` and transitions — interactive states
- The `:host([open])` state — visibility logic

**Known friction points:**
- Figma auto-layout must be configured **after** creating children. The result is a static frame, not an interactive component.
- Intermediate rows (summary-row, modal-buttons) need a transparent fill (alpha 0) to avoid covering the parent container's background.
- Buttons require their own centred auto-layout for text to be centred inside; without it the text appears in the top-left corner.
- `SPACE_BETWEEN` in horizontal auto-layout is the equivalent of CSS `justify-content: space-between` — necessary to separate label and value in each summary row.

### Flow optimisation

Lessons learned to reduce friction and token consumption in the synchronisation cycle.

#### Prompts when generating design in Figma (Claude → Figma)

Generating nodes, variables and styles in Figma consumes tokens excessively if the prompt is generic. To mitigate this:

- Describe the component with a **clear hierarchical structure** before requesting its creation: which nodes, which properties, which variables.
- **Separate variable creation from frame creation** into distinct prompts when the design is complex.
- Avoid "create a nice design" — be specific: dimensions, hex colours, typography, spacing.

#### Syncing code changes to Figma (Code → Figma)

When notifying Claude of a code change so it can be reflected in Figma, always specify:

- **File** where the change was made (e.g. `src/components/streamer-card/stylesFigma.ts`)
- **Line(s)** affected (e.g. line 147)
- **What changed** (e.g. `border-radius: 8px` → `30px`)

This prevents Claude from having to re-read entire files to detect differences, reducing token usage and speeding up synchronisation.

---

## Claude interaction lessons

Communication patterns that caused confusion during joint development and how to avoid them.

### 1. Architecture instructions without sufficient context

**What happened:** "Don't use any CSS template, just keep using `index.css`" was interpreted as removing Shadow DOM and moving all CSS to `index.css`.

**What was intended:** Only switch the card's CSS source from `styles.ts` to `stylesFigma.ts`.

**Lesson:** When an instruction affects the project architecture, specify which file or pattern should change, not just the desired outcome.

---

### 2. Wrong CSS property due to colloquial synonym

**What happened:** "Give it a bit more padding, try 12px" → `padding` was applied to the `.author` container instead of the `gap` between icons.

**What was intended:** Increase the `gap` of the platform icons to `12px`.

**Lesson:** For specific CSS adjustments, use the exact property name (`gap`, `padding`, `margin`) and specify the selector or element it applies to.

---

### 3. Adjustment location without a reference selector

**What happened:** "Padding-top of 5px" was applied to `.author` because that was the element being discussed in context.

**What was intended:** `padding-top: 5px` on the first `div` child inside `.author`.

**Lesson:** For CSS adjustments on nested elements, specify the exact selector or describe it relative to the DOM: "in the div containing the logo", "in the first child of .author".

---

## Conclusions

The Code → Figma flow fails when a code change has no unambiguous Figma node to point to. Synchronisation is only predictable when the change affects a **variable with a matching name** or a **node identifiable by file and line**.

---

## Evaluation: bringing the Figma design into code

To synchronise the Figma design with this Web Component while maintaining all its functionality, changes are concentrated exclusively in the **visual layer**. The logic (Custom Events, attributes, Shadow DOM, interaction flow) is not touched.

### What does not change

| File | Reason |
|---|---|
| `streamer-card.ts` — event logic | The `vibe-change`, `rating-change`, `vote-submitted` orchestration is independent of the design |
| `streamer-vibe.ts` — HTML structure and events | The `<input type="radio">` elements and the `vibe-change` event are pure logic |
| `streamer-rating.ts` — structure and events | The `ratings` array (values) and the `rating-change` event are not visual |
| `streamer-modal.ts` — structure and events | `show()`, `hide()`, `vote-submit`, `vote-cancel` do not depend on style |
| `index.ts` — bootstrap | The programmatic instantiation of the component does not change |

### What changes

**`src/components/streamer-card/styles.ts`** — The main file to update. All hardcoded values (`#1a1a1a`, `#eee`, `30px`, `370px`, `#ff623f`, `#00a6ed`) must be replaced with Figma tokens:

- `--background-color`: card background colour
- `--text-color`: primary text colour
- `--border-radius`: global border radius
- Badge colours (`popular`, `new`): bottom shadow on `.more`
- Card width (`.card { width }`)

**`streamer-vibe.ts` — CSS section** — Vibe button colours are hardcoded:
- `#f472b6` (vote-up hover/checked)
- `#6b7280` (vote-down hover/checked)
- Button dimensions (40px × 40px)

**`streamer-rating.ts` — `ratings` array** — Rating dot colours are in the data array:
```ts
{ value: 'meh',  color: '#323232', glowColor: 'rgba(255,255,255,0.7)' },
{ value: 'ok',   color: '#ffdd66' },
{ value: 'good', color: '#ffa666' },
{ value: 'fire', color: '#fe6969' },
```
These colours must match what Figma defines for each rating level.

**`streamer-modal.ts` — CSS section** — Submit button colour (`#f472b6`) and modal background (`#1a1a1a`, `#242424`).

**`src/index.css`** — Page background (currently white with grid pattern). If Figma defines a different background for the canvas/page, this file reflects it.

### Synchronisation strategy

The bridge between Figma and code is **CSS custom properties**. The component already uses `--background-color`, `--text-color` and `--border-radius` in `:host`. To simplify future synchronisations, it is worth expanding that system to cover all colour and spacing tokens — so a Figma change translates to updating a single block of variables in `:host`, without touching rules for each individual selector.
