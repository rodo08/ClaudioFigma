const css = `
  :host {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: Poppins, sans-serif;
  }

  .label {
    font-size: 10px;
    font-weight: 300;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  ul {
    margin: 0;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 13px;
    list-style: none;
    border-radius: 20px;
    width: max-content;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    width: 15px;
  }

  input[type="radio"] {
    display: none;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    cursor: pointer;
  }

  .rating-label {
    font-size: 10px;
    font-weight: 300;
    color: #888;
    white-space: nowrap;
    transition: color 0.2s;
  }

  .rating-dot {
    background-color: var(--color);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    display: block;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  input[type="radio"]:checked + label .rating-dot {
    box-shadow: 0 0 8px 3px var(--glow-color, var(--color)), 0 0 16px 4px var(--glow-color, var(--color));
    transform: scale(1.2);
  }

  input[type="radio"]:checked + label .rating-label {
    color: #eee;
  }

  label:hover .rating-dot {
    transform: scale(1.1);
    box-shadow: 0 0 6px 2px var(--glow-color, var(--color));
  }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const ratings = [
  { value: 'meh', label: 'Meh', color: '#323232', glowColor: 'rgba(255,255,255,0.7)' },
  { value: 'ok', label: 'Ok', color: '#ffdd66' },
  { value: 'good', label: 'Good', color: '#ffa666' },
  { value: 'fire', label: 'Fire', color: '#fe6969' },
];

export class StreamerRating extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.render();
    this.shadow.addEventListener('change', this.handleChange);
  }

  disconnectedCallback() {
    this.shadow.removeEventListener('change', this.handleChange);
  }

  reset() {
    this.shadow.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
  }

  private handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('rating-change', {
        detail: { value: input.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    const items = ratings
      .map(({ value, label, color, glowColor }) => {
        const glow = glowColor ? `--glow-color: ${glowColor};` : '';
        return `
        <li>
          <input type="radio" name="rating" id="rate-${value}" value="${value}">
          <label for="rate-${value}">
            <span class="rating-label">${label}</span>
            <span class="rating-dot" style="--color: ${color}; ${glow}"></span>
          </label>
        </li>
      `;
      })
      .join('');

    this.shadow.innerHTML = `
      <span class="label">Rate the content</span>
      <ul>${items}</ul>
    `;

    this.shadow.adoptedStyleSheets = [sheet];
  }
}

if (!customElements.get('streamer-rating')) {
  customElements.define('streamer-rating', StreamerRating);
} else {
  const Registered = customElements.get('streamer-rating') as typeof StreamerRating;
  for (const key of Object.getOwnPropertyNames(StreamerRating.prototype)) {
    if (key !== 'constructor') {
      Object.defineProperty(
        Registered.prototype,
        key,
        Object.getOwnPropertyDescriptor(StreamerRating.prototype, key)!,
      );
    }
  }
  document.querySelectorAll<StreamerRating>('streamer-rating').forEach((el) => el.render());
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
