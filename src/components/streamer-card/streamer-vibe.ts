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
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .buttons {
    display: flex;
    gap: 5px;
  }

  input[type="radio"] {
    display: none;
  }

  label {
    color: #eee;
    background-color: #313131;
    border: 1px solid #454545;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .vote-up:hover,
  input#vibe-up:checked + .vote-up {
    background-color: #f472b6;
    border-color: #f472b6;
    box-shadow: 0 0 8px 2px #f472b6, 0 0 4px 1px rgba(255, 255, 255, 0.2);
  }

  .vote-down:hover,
  input#vibe-down:checked + .vote-down {
    background-color: #6b7280;
    border-color: #6b7280;
    box-shadow: 0 0 8px 2px #6b7280, 0 0 4px 1px rgba(255, 255, 255, 0.2);
  }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

export class StreamerVibe extends HTMLElement {
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
    this.shadow.querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach(input => { input.checked = false; });
  }

  private handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('vibe-change', {
      detail: { value: input.value },
      bubbles: true,
      composed: true,
    }));
  };

  render() {
    this.shadow.innerHTML = `
      <span class="label">Vibe?</span>
      <div class="buttons">
        <input type="radio" name="vibe" id="vibe-up" value="up">
        <label for="vibe-up" class="vote-up" title="Love it">❤️</label>
        <input type="radio" name="vibe" id="vibe-down" value="down">
        <label for="vibe-down" class="vote-down" title="Nope">💀</label>
      </div>
    `;

    this.shadow.adoptedStyleSheets = [sheet];
  }
}

if (!customElements.get('streamer-vibe')) {
  customElements.define('streamer-vibe', StreamerVibe);
} else {
  const Registered = customElements.get('streamer-vibe') as typeof StreamerVibe;
  for (const key of Object.getOwnPropertyNames(StreamerVibe.prototype)) {
    if (key !== 'constructor') {
      Object.defineProperty(
        Registered.prototype,
        key,
        Object.getOwnPropertyDescriptor(StreamerVibe.prototype, key)!,
      );
    }
  }
  document.querySelectorAll<StreamerVibe>('streamer-vibe').forEach(el => el.render());
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
