// Figma-sourced styles — collection: "Card Variables", Mode 1
// Tokens: color/card-bg, color/card-border, color/text-primary, color/text-secondary,
//         color/accent, color/accent-hover, spacing/card-padding, spacing/card-radius, spacing/card-gap

const css = `
  :host {
    --card-bg:        #1a1a1a;
    --card-border:    #e2e8f0;
    --text-primary:   #ffffff;
    --text-secondary: #718096;
    --accent:         #6366f1;
    --accent-hover:   #4f46e5;
    --card-padding:   24px;
    --card-radius:    30px;
    --card-gap:       30px;

    display: block;
    font-family: Poppins, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  /* ── card ── */

  .card {
    width: min(370px, 100%);
    color: var(--text-primary);
    position: relative;
  }

  /* ── author ── */

  .card .author {
    background-color: var(--card-bg);
    width: 60%;
    height: 70px;
    display: grid;
    grid-template-columns: 50px 1fr;
    align-items: center;
    gap: var(--card-gap);
    padding: 10px;
    border-top-left-radius: var(--card-radius);
    border-top-right-radius: var(--card-radius);
  }

  .card .author > div:first-child {
    padding-top: 5px;
  }

  .card .author img {
    width: 100%;
  }

  .card .author .name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .card .author .platforms {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    align-items: center;
  }

  .card .author .platforms svg {
    width: 13px;
    height: 13px;
  }

  .card .author .platforms svg[aria-label="YouTube"] {
    width: 19px;
  }

  /* ── image ── */

  .card .image {
    background-color: var(--card-bg);
    text-align: center;
    border-top-right-radius: var(--card-radius);
    position: relative;
    z-index: 1;
  }

  .card .image img {
    width: 90%;
    transition: 0.5s;
    cursor: pointer;
  }

  .card .image img:hover {
    transform: rotate(25deg) scale(1.1) translate(10px, -20px);
  }

  /* ── info ── */

  .card .info {
    background-color: var(--card-bg);
    padding: var(--card-padding);
    text-align: center;
  }

  .card .info .name {
    font-size: 27px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .card .info .stats {
    display: flex;
    justify-content: center;
    gap: var(--card-gap);
    margin-top: 12px;
  }

  .card .info .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .card .info .stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .card .info .stat-label {
    font-size: 10px;
    font-weight: 300;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── more ── */

  .card .more {
    background-color: var(--card-bg);
    padding: 0 var(--card-padding) var(--card-padding);
    display: flex;
    justify-content: space-between;
    align-items: end;
    border-bottom-left-radius: var(--card-radius);
    border-bottom-right-radius: var(--card-radius);
  }

  .card .more streamer-vibe,
  .card .more streamer-rating {
    flex: none;
  }

  /* ── corner trick ── */

  .card::before {
    background-color: transparent;
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 70px;
    content: '';
    border-bottom-left-radius: var(--card-radius);
    box-shadow: -30px 30px 0 var(--card-bg);
  }

  /* ── badge ── */

  .card::after {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    width: calc(40% - 10px);
    content: '';
    border-radius: var(--card-radius);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
    color: var(--text-primary);
  }

  :host([badge="popular"]) .card::after {
    content: '⭐ Popular';
  }

  :host([badge="popular"]) .card .more {
    box-shadow: 0 10px 0 #ff623f;
  }

  :host([badge="new"]) .card::after {
    content: '🐣 New';
  }

  :host([badge="new"]) .card .more {
    box-shadow: 0 10px 0 #00a6ed;
  }
`;

export const sheet = new CSSStyleSheet();
sheet.replaceSync(css);
