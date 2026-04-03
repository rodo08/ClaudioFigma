const css = `
  :host {
    display: none;
    font-family: Poppins, sans-serif;
  }

  :host([open]) {
    display: block;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .modal {
    background-color: #1a1a1a;
    color: #eee;
    border-radius: 30px;
    padding: 32px;
    width: min(340px, 90vw);
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #2e2e2e;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
  }

  .modal-title {
    margin: 0;
    font-size: 1.2em;
    font-weight: 700;
  }

  .modal-subtitle {
    margin: -12px 0 0;
    font-size: 0.85em;
    color: #888;
  }

  .modal-summary {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #242424;
    border-radius: 16px;
    padding: 16px 20px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-label {
    color: #888;
    text-transform: uppercase;
    font-size: 0.75em;
    letter-spacing: 0.05em;
  }

  .summary-value {
    font-weight: 700;
    font-size: 0.9em;
  }

  .modal-buttons {
    display: flex;
    gap: 10px;
  }

  button {
    flex: 1;
    padding: 12px;
    border-radius: 30px;
    font-family: Poppins, sans-serif;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #454545;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .btn-submit {
    background-color: #f472b6;
    color: #fff;
    border-color: #f472b6;
  }

  .btn-submit:hover {
    background-color: #ec4899;
    box-shadow: 0 0 12px 2px #f472b6;
  }

  .btn-cancel {
    background-color: #313131;
    color: #eee;
  }

  .btn-cancel:hover {
    background-color: #3e3e3e;
  }
`;

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

const vibeLabels: Record<string, string> = {
  up: '❤️ Love it',
  down: '💀 Nope',
};

const ratingLabels: Record<string, string> = {
  meh: 'Meh',
  ok: 'Ok',
  good: 'Good',
  fire: 'Fire 🔥',
};

export class StreamerModal extends HTMLElement {
  private shadow: ShadowRoot;
  private _vibe = '';
  private _rating = '';
  private _streamerName = '';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.render();
    this.shadow.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.shadow.removeEventListener('click', this.handleClick);
  }

  show(vibe: string, rating: string, streamerName: string) {
    this._vibe = vibe;
    this._rating = rating;
    this._streamerName = streamerName;
    this.render();
    this.setAttribute('open', '');
  }

  hide() {
    this.removeAttribute('open');
  }

  private handleClick = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.closest('.btn-submit')) {
      this.dispatchEvent(new CustomEvent('vote-submit', {
        detail: { vibe: this._vibe, rating: this._rating },
        bubbles: true,
        composed: true,
      }));
      this.hide();
    }

    if (target.closest('.btn-cancel')) {
      this.dispatchEvent(new CustomEvent('vote-cancel', {
        bubbles: true,
        composed: true,
      }));
      this.hide();
    }
  };

  render() {
    this.shadow.innerHTML = `
      <div class="overlay">
        <div class="modal">
          <h3 class="modal-title">Confirm your vote</h3>
          <p class="modal-subtitle">for <strong>${this._streamerName || 'this streamer'}</strong></p>
          <div class="modal-summary">
            <div class="summary-item">
              <span class="summary-label">Vibe</span>
              <span class="summary-value">${vibeLabels[this._vibe] ?? '—'}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Rating</span>
              <span class="summary-value">${ratingLabels[this._rating] ?? '—'}</span>
            </div>
          </div>
          <div class="modal-buttons">
            <button class="btn-submit">Submit</button>
            <button class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    this.shadow.adoptedStyleSheets = [sheet];
  }
}

if (!customElements.get('streamer-modal')) {
  customElements.define('streamer-modal', StreamerModal);
} else {
  const Registered = customElements.get('streamer-modal') as typeof StreamerModal;
  for (const key of Object.getOwnPropertyNames(StreamerModal.prototype)) {
    if (key !== 'constructor') {
      Object.defineProperty(
        Registered.prototype,
        key,
        Object.getOwnPropertyDescriptor(StreamerModal.prototype, key)!,
      );
    }
  }
  document.querySelectorAll<StreamerModal>('streamer-modal').forEach(el => el.render());
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
