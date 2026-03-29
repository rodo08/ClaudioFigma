const css = `
  :host {
    --background-color: #1a1a1a;
    --text-color: #eee;
    --border-radius: 30px;
    display: block;
    font-family: Poppins, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .card {
    width: min(370px, 100%);
    color: var(--text-color);
    position: relative;
  }

  .card .author {
    background-color: var(--background-color);
    width: 60%;
    height: 70px;
    display: grid;
    grid-template-columns: 50px 1fr;
    align-items: center;
    gap: 20px;
    padding: 10px;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  .card .author img {
    width: 100%;
  }

  .card .author .name {
    font-weight: bold;
  }

  .card .author .platforms {
    display: flex;
    gap: 6px;
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

  .card .image {
    background-color: var(--background-color);
    text-align: center;
    border-top-right-radius: var(--border-radius);
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

  .card .info {
    background-color: var(--background-color);
    padding: 30px;
    text-align: center;
  }

  .card .info .name {
    font-size: 1.7em;
  }

  .card .info .stats {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
  }

  .card .info .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .card .info .stat-value {
    font-size: 1em;
    font-weight: bold;
    color: var(--text-color);
  }

  .card .info .stat-label {
    font-size: 0.65em;
    font-weight: 300;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card .more {
    background-color: var(--background-color);
    padding: 0 30px 30px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  .card::before {
    background-color: transparent;
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 70px;
    content: '';
    border-bottom-left-radius: var(--border-radius);
    box-shadow: -30px 30px 0 var(--background-color);
  }

  .card::after {
    background-color: var(--background-color);
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    width: calc(40% - 10px);
    content: '';
    border-radius: var(--border-radius);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: large;
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
