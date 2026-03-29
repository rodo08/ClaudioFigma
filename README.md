# Streamer Card — Web Component

A streamer/influencer profile card built as a native Web Component with Shadow DOM, Constructable Stylesheets, and custom events. No framework, no dependencies.

## Stack

- **Web Components** — Custom Elements + Shadow DOM
- **Constructable Stylesheets** — `new CSSStyleSheet()` / `adoptedStyleSheets`
- **TypeScript**
- **Rspack** — bundler with HMR

---

## Contexto: de Figma al código sin design system

### La casuística

Un caso habitual en el trabajo diario: un concept de Figma sin design system definido que debe maquetarse para web. Sin tokens, sin nomenclatura sistemática, sin variables exportables — solo frames, estilos locales y criterio de diseñador.

### Primera iteración: Claude como maquetador directo

En la iteración inicial se intentó que Claude Code generara el HTML/CSS directamente desde la descripción del diseño en Figma. El resultado fue un **consumo altísimo de tokens con una precisión muy baja**: Claude interpretaba el diseño de forma aproximada, proponiéndose correcciones sucesivas que acumulaban más tokens sin converger al diseño original.

### Solución: maquetación híbrida

El enfoque que funcionó fue un flujo híbrido donde el rol de cada parte se asigna según la naturaleza de la tarea:

```
Claude propone
  ↓
Developer evalúa la precisión y prolijidad del resultado
  ↓
  ├── Alta precisión → se acepta
  ├── Ajuste puntual → developer corrige manualmente
  └── Tarea clara y acotada → se delega a Claude Code
```

- **Claude Code** se usa para tareas bien delimitadas: cambiar un valor concreto, refactorizar un patrón, generar estructura repetitiva.
- **El developer ajusta manualmente** cuando la tarea requiere criterio visual fino que Claude no puede inferir solo desde el código.

Este flujo híbrido fue el que permitió montar el diseño original de Figma con fidelidad, sin sobreconsumo de tokens y manteniendo el control sobre las decisiones visuales.

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

## Flujo bidireccional Claude Code ↔ Figma

Este proyecto está diseñado para integrarse con Figma mediante el MCP `claude-talk-to-figma-mcp`.

### Flujo recomendado: Figma → Código primero

El punto de partida correcto es **traer el diseño de Figma al código**, no al revés. Esto garantiza que el código refleje fielmente las decisiones de diseño y que las sincronizaciones futuras sean predecibles.

```
Figma (diseño fuente de verdad)
  ↓  leer variables, colores, tipografía, espaciado
Claude Code
  ↓  traducir tokens al CSS de los componentes
Código (reflejo del diseño)
  ↓  cambios de código → sincronizar de vuelta a Figma
Figma (actualizado)
```

1. **Figma → Código**: Claude lee el diseño en Figma (variables, estilos, nodos) y actualiza los estilos del Web Component para que coincidan.
2. **Código → Figma**: Cuando se hace un ajuste en el código, se le indica a Claude el archivo, las líneas afectadas y qué cambió — Claude actualiza el nodo correspondiente en Figma sin releer todo el árbol.

> El flujo inverso (Código → Figma como punto de partida) genera divergencia: el diseño en Figma queda desactualizado y la sincronización posterior es más costosa.

### Caso de uso: enviar estructura de código a Figma

Cuando un componente existe en código pero **no tiene representación en Figma**, se puede generar su estructura directamente desde el código usando las herramientas MCP. El caso documentado es `<streamer-modal>`:

**Estructura enviada (ejecutada con MCP):**
```
Frame "streamer-modal" (340×auto, #1a1a1a, radius 30px)   — auto-layout VERTICAL, gap 20, padding 32
├── Text  "Confirm your vote"        — 19px Bold, #ffffff
├── Text  "for Jane Doe"             — 13px, #888888
├── Frame "modal-summary"            — #242424, radius 16px, padding 16/20, auto-layout VERTICAL, gap 10
│   ├── Frame "summary-row-vibe"     — auto-layout HORIZONTAL, SPACE_BETWEEN, fill transparente
│   │   ├── Text "VIBE"              — 10px, #888
│   │   └── Text "❤️ Love it"        — 13px Bold, #fff
│   └── Frame "summary-row-rating"  — auto-layout HORIZONTAL, SPACE_BETWEEN, fill transparente
│       ├── Text "RATING"            — 10px, #888
│       └── Text "Fire 🔥"           — 13px Bold, #fff
└── Frame "modal-buttons"            — auto-layout HORIZONTAL, gap 10, fill transparente
    ├── Frame "btn-submit"           — #f472b6, radius 30px, auto-layout centrado → Text "Submit" 14px 600
    └── Frame "btn-cancel"           — #313131, radius 30px, auto-layout centrado → Text "Cancel" 14px 600
```

**Qué se excluye al trasladar código → Figma:**
- Overlay con `backdrop-filter: blur` — efectos no estructurales
- `box-shadow` y transiciones — estados interactivos
- El estado `:host([open])` — lógica de visibilidad

**Fricciones conocidas:**
- El auto-layout de Figma requiere configurarse **después** de crear los hijos. El resultado es un frame estático, no un componente interactivo.
- Las filas intermedias (summary-row, modal-buttons) necesitan `fill transparente` (alpha 0) para no tapar el fondo del contenedor padre.
- Los botones requieren su propio auto-layout centrado para que el texto quede centrado dentro; sin él el texto aparece en la esquina superior izquierda.
- `SPACE_BETWEEN` en auto-layout horizontal es el equivalente a `justify-content: space-between` de CSS — necesario para separar label y valor en cada fila del summary.

### Optimización del flujo

Aprendizajes para reducir fricciones y consumo de tokens en el ciclo de sincronización.

#### Prompts al generar diseño en Figma (Claude → Figma)

Generar nodos, variables y estilos en Figma consume tokens de forma excesiva si el prompt es genérico. Para mitigarlo:

- Describir el componente con **estructura jerárquica clara** antes de pedir su creación: qué nodos, qué propiedades, qué variables.
- **Separar la creación de variables de la creación de frames** en prompts distintos cuando el diseño es complejo.
- Evitar "crea un diseño bonito" — ser específico: dimensiones, colores hex, tipografía, espaciado.

#### Sincronizar cambios de código hacia Figma (Código → Figma)

Al notificar a Claude de un cambio en el código para que lo refleje en Figma, indicar siempre:

- **Archivo** donde se hizo el cambio (ej. `src/components/streamer-card/stylesFigma.ts`)
- **Línea(s)** afectadas (ej. línea 147)
- **Qué cambió** (ej. `border-radius: 8px` → `30px`)

Esto evita que Claude tenga que releer archivos completos para detectar diferencias, reduciendo el uso de tokens y acelerando la sincronización.

---

## Lecciones de interacción con Claude

Patrones de comunicación que generaron confusión durante el desarrollo conjunto y cómo evitarlos.

### 1. Instrucciones de arquitectura sin contexto suficiente

**Qué pasó:** "No uses ningún template CSS, solo mantén el uso del `index.css`" se interpretó como eliminar Shadow DOM y mover todo el CSS a `index.css`.

**Lo que se quería:** Solo cambiar la fuente del CSS de la card de `styles.ts` a `stylesFigma.ts`.

**Lección:** Cuando la instrucción afecta a la arquitectura del proyecto, especificar qué archivo o patrón concreto debe cambiar, no solo el resultado deseado.

---

### 2. Propiedad CSS incorrecta por sinónimo coloquial

**Qué pasó:** "Darle algo más de padding, prueba con 12px" → se aplicó `padding` al contenedor `.author` en lugar del `gap` entre iconos.

**Lo que se quería:** Aumentar el `gap` de los iconos de plataformas a `12px`.

**Lección:** Cuando se trate de un ajuste de CSS puntual, usar el nombre exacto de la propiedad (`gap`, `padding`, `margin`) y el selector o elemento al que aplica.

---

### 3. Ubicación de un ajuste sin selector de referencia

**Qué pasó:** "Padding-top de 5px" se aplicó a `.author` porque era el elemento del que se estaba hablando en contexto.

**Lo que se quería:** `padding-top: 5px` en el primer `div` hijo dentro de `.author`.

**Lección:** Para ajustes de CSS en elementos anidados, indicar el selector exacto o describirlo en relación al DOM: "en el div que contiene el logo", "en el primer hijo de .author".

---

## Conclusiones

El flujo Code → Figma falla cuando el cambio en código no tiene un nodo Figma unívoco al que apuntar. La sincronización solo es predecible cuando el cambio afecta a una **variable con nombre coincidente** o a un **nodo identificable por archivo y línea**.

---

## Evaluación: llevar el diseño de Figma al código

Para sincronizar el diseño de Figma con este Web Component manteniendo toda su funcionalidad, los cambios se concentran exclusivamente en la **capa visual**. La lógica (Custom Events, atributos, Shadow DOM, flujo de interacción) no se toca.

### Qué no cambia

| Archivo | Razón |
|---|---|
| `streamer-card.ts` — lógica de eventos | La orquestación `vibe-change`, `rating-change`, `vote-submitted` es independiente del diseño |
| `streamer-vibe.ts` — estructura HTML y eventos | Los `<input type="radio">` y el evento `vibe-change` son lógica pura |
| `streamer-rating.ts` — estructura y eventos | El array `ratings` (valores) y el evento `rating-change` no son visuales |
| `streamer-modal.ts` — estructura y eventos | `show()`, `hide()`, `vote-submit`, `vote-cancel` no dependen del estilo |
| `index.ts` — bootstrap | La instanciación programática del componente no cambia |

### Qué cambia

**`src/components/streamer-card/styles.ts`** — Es el archivo principal a actualizar. Todos los valores hardcodeados (`#1a1a1a`, `#eee`, `30px`, `370px`, `#ff623f`, `#00a6ed`) deben reemplazarse con los tokens de Figma:

- `--background-color`: color de fondo de la card
- `--text-color`: color de texto principal
- `--border-radius`: radio de borde global
- Colores de badge (`popular`, `new`): sombra inferior de `.more`
- Ancho de la card (`.card { width }`)

**`streamer-vibe.ts` — sección CSS** — Los colores de los botones de vibe están hardcodeados:
- `#f472b6` (vote-up hover/checked)
- `#6b7280` (vote-down hover/checked)
- Dimensiones de los botones (40px × 40px)

**`streamer-rating.ts` — array `ratings`** — Los colores de los puntos de rating están en el array de datos:
```ts
{ value: 'meh',  color: '#323232', glowColor: 'rgba(255,255,255,0.7)' },
{ value: 'ok',   color: '#ffdd66' },
{ value: 'good', color: '#ffa666' },
{ value: 'fire', color: '#fe6969' },
```
Estos colores deben coincidir con los que Figma define para cada nivel de rating.

**`streamer-modal.ts` — sección CSS** — Color del botón submit (`#f472b6`) y fondo del modal (`#1a1a1a`, `#242424`).

**`src/index.css`** — Fondo de página (actualmente blanco con patrón de grilla). Si Figma define un fondo diferente para el canvas/página, este archivo lo refleja.

### Estrategia de sincronización

El puente entre Figma y el código son las **CSS custom properties**. El componente ya usa `--background-color`, `--text-color` y `--border-radius` en `:host`. Para simplificar futuras sincronizaciones, conviene expandir ese sistema para cubrir todos los tokens de color y espaciado — así un cambio en Figma se traduce en actualizar un solo bloque de variables en `:host`, sin tocar las reglas de cada selector.
