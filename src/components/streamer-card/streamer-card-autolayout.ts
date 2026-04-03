import { sheet } from './stylesAutolayout';
import { platformIcons } from './platform-icons';
import { StreamerVibe } from './streamer-vibe/streamer-vibe';
import { StreamerRating } from './streamer-rating/streamer-rating';
import { StreamerModal } from './streamer-modal';

const platforms = ['twitch', 'youtube', 'instagram', 'tiktok'] as const;

// Figma: Group 8 (2024:41) — badge star icon · #FFE236
const starSvg = `<svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M29.2723 10.1177C27.7842 9.41416 26.2131 8.90157 24.5964 8.59215C23.3811 8.35168 22.1496 8.20125 20.9121 8.14211C20.4858 7.05908 19.9757 6.0109 19.3866 5.00705C18.6039 3.56042 17.6429 2.21761 16.5261 1.01005C16.1769 0.682375 15.7159 0.5 15.237 0.5C14.7581 0.5 14.2972 0.682375 13.9479 1.01005C12.8315 2.22909 11.8707 3.58193 11.0875 5.03756C10.5262 6.05436 10.0319 7.1067 9.60765 8.18787C8.43772 8.25062 7.27463 8.40621 6.12934 8.65317C4.51293 8.95443 2.93987 9.45402 1.44583 10.1406C1.03383 10.3798 0.726747 10.765 0.58546 11.2199C0.444173 11.6749 0.479003 12.1663 0.683044 12.5968C1.48402 14.0317 2.46024 15.3615 3.58926 16.5556C4.39585 17.4162 5.25704 18.2239 6.16748 18.9737C5.82217 20.1842 5.57976 21.4218 5.44283 22.6732C5.23989 24.3018 5.23989 25.9493 5.44283 27.5779C5.53224 28.0501 5.79803 28.4706 6.18622 28.7539C6.5744 29.0373 7.05588 29.1623 7.53287 29.1035C9.14354 28.7897 10.709 28.2773 12.1935 27.5779C13.2445 27.0769 14.2635 26.5114 15.2446 25.8845C16.2237 26.5149 17.2429 27.0806 18.2958 27.5779C19.7802 28.2773 21.3457 28.7897 22.9564 29.1035C23.4334 29.1623 23.9149 29.0373 24.3031 28.7539C24.6913 28.4706 24.957 28.0501 25.0465 27.5779C25.2494 25.9493 25.2494 24.3018 25.0465 22.6732C24.9215 21.4755 24.7021 20.2895 24.3905 19.1262C25.3889 18.3432 26.3155 17.4727 27.1594 16.5251C28.2875 15.3285 29.266 13.9991 30.0732 12.5663C30.2756 12.1327 30.3054 11.6384 30.1566 11.1837C30.0079 10.729 29.6917 10.3479 29.2723 10.1177Z" fill="#FFE236" stroke="#231F20" stroke-miterlimit="10"/>
  <path d="M16.5184 4.01538C17.2509 5.03861 17.8843 6.12922 18.4101 7.27248" stroke="white" stroke-miterlimit="10" stroke-linecap="round"/>
</svg>`;

export class StreamerCardAutolayout extends HTMLElement {
  static observedAttributes = [
    'name', 'channel', 'logo', 'avatar', 'badge',
    'twitch', 'youtube', 'instagram', 'tiktok',
  ];

  private shadow: ShadowRoot;
  private modal!: StreamerModal;
  private vibeValue = '';
  private ratingValue = '';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.adoptedStyleSheets = [sheet];
  }

  setSheet(s: CSSStyleSheet) {
    this.shadow.adoptedStyleSheets = [s];
  }

  connectedCallback() {
    this.render();

    this.modal = document.createElement('streamer-modal') as StreamerModal;
    document.body.appendChild(this.modal);

    this.addEventListener('vibe-change', this.handleVibeChange);
    this.addEventListener('rating-change', this.handleRatingChange);
    this.modal.addEventListener('vote-cancel', this.handleCancel);
    this.modal.addEventListener('vote-submit', this.handleSubmit);
  }

  disconnectedCallback() {
    this.modal.remove();
    this.removeEventListener('vibe-change', this.handleVibeChange);
    this.removeEventListener('rating-change', this.handleRatingChange);
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private handleVibeChange = (e: Event) => {
    this.vibeValue = (e as CustomEvent).detail.value;
    this.checkBothSelected();
  };

  private handleRatingChange = (e: Event) => {
    this.ratingValue = (e as CustomEvent).detail.value;
    this.checkBothSelected();
  };

  private checkBothSelected() {
    if (this.vibeValue && this.ratingValue) {
      this.modal.show(this.vibeValue, this.ratingValue, this.attr('name'));
    }
  }

  private handleCancel = () => {
    this.vibeValue = '';
    this.ratingValue = '';
    this.shadow.querySelector<StreamerVibe>('streamer-vibe')?.reset();
    this.shadow.querySelector<StreamerRating>('streamer-rating')?.reset();
  };

  private handleSubmit = (e: Event) => {
    const { vibe, rating } = (e as CustomEvent).detail;
    this.dispatchEvent(new CustomEvent('vote-submitted', {
      detail: { vibe, rating },
      bubbles: true,
    }));
    this.vibeValue = '';
    this.ratingValue = '';
  };

  private attr(name: string) {
    return this.getAttribute(name) ?? '';
  }

  // stats · Poppins 700 16px value + Poppins 300 10px label · gap 29px
  private renderStats() {
    return platforms
      .filter(p => this.getAttribute(p))
      .map(p => `
        <div class="stat">
          <span class="stat-value">${this.attr(p)}</span>
          <span class="stat-label">${p}</span>
        </div>
      `).join('');
  }

  // brand-icons · platform SVGs at 14px height
  private renderBrandIcons() {
    return platforms
      .filter(p => this.getAttribute(p))
      .map(p => platformIcons[p])
      .join('');
  }

  // badge · white pill 155x40 · dark inner pill 99x29 · star overflows
  private renderBadge() {
    const badge = this.attr('badge');
    if (!badge) return '';
    const label = badge.charAt(0).toUpperCase() + badge.slice(1);
    return `
      <div class="badge">
        <div class="badge-pill">
          <span class="badge-text">${label}</span>
        </div>
        <div class="badge-star">${starSvg}</div>
      </div>
    `;
  }

  render() {
    const name    = this.attr('name');
    const channel = this.attr('channel') || name;
    const logo    = this.attr('logo');
    const avatar  = this.attr('avatar');

    this.shadow.innerHTML = `
      <article class="card">

        <!-- header · 330x40 · HORIZONTAL space-between -->
        <div class="header">
          <div class="logo-main">
            ${logo ? `<img src="${logo}" alt="${channel}" width="40" height="40">` : ''}
          </div>
          <div class="brand">
            <span class="brand-name">${channel}</span>
            <div class="brand-icons">${this.renderBrandIcons()}</div>
          </div>
          ${this.renderBadge()}
        </div>

        <!-- mainImage · 325x341 · 88% width centered -->
        <div class="main-image">
          ${avatar ? `<img src="${avatar}" alt="${name}">` : ''}
        </div>

        <!-- nameNstats · 321px · VERTICAL center · gap 10 -->
        <div class="name-stats">
          <span class="streamer-name">${name}</span>
          <div class="stats">${this.renderStats()}</div>
          <div class="divider"></div>
        </div>

        <!-- selections · 330x103 · HORIZONTAL space-between -->
        <div class="selections">
          <streamer-vibe></streamer-vibe>
          <streamer-rating></streamer-rating>
        </div>

        <!-- footer · centered -->
        <div class="footer">
          made with ❤️ by <a href="https://www.rodrigodev.cl" target="_blank" rel="noopener noreferrer">rodrigodev.cl</a>
        </div>

      </article>
    `;
  }
}

if (!customElements.get('streamer-card-autolayout')) {
  customElements.define('streamer-card-autolayout', StreamerCardAutolayout);
} else {
  const Registered = customElements.get('streamer-card-autolayout') as typeof StreamerCardAutolayout;
  for (const key of Object.getOwnPropertyNames(StreamerCardAutolayout.prototype)) {
    if (key !== 'constructor') {
      Object.defineProperty(
        Registered.prototype,
        key,
        Object.getOwnPropertyDescriptor(StreamerCardAutolayout.prototype, key)!,
      );
    }
  }
  document.querySelectorAll<StreamerCardAutolayout>('streamer-card-autolayout').forEach(el => el.render());
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
