import { sheet } from './styles/stylesFigma';
import { platformIcons } from '../platform-icons';
import { StreamerVibe } from '../streamer-vibe/streamer-vibe';
import { StreamerRating } from '../streamer-rating/streamer-rating';
import { StreamerModal } from '../streamer-modal/streamer-modal';

const platforms = ['twitch', 'youtube', 'instagram', 'tiktok'] as const;

export class StreamerCard extends HTMLElement {
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

    // Mount modal in body so it's not constrained by the card's stacking context
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

  private renderPlatformIcons() {
    return platforms
      .filter(p => this.getAttribute(p))
      .map(p => platformIcons[p])
      .join('');
  }

  render() {
    const name    = this.attr('name');
    const channel = this.attr('channel') || name;
    const logo    = this.attr('logo');
    const avatar  = this.attr('avatar');

    this.shadow.innerHTML = `
      <article class="card">
        <div class="author">
          <div>
            ${logo ? `<a href="https://www.rodrigodev.cl" target="_blank" rel="noopener noreferrer"><img src="${logo}" alt="${name}" width="40" height="40"></a>` : ''}
          </div>
          <div>
            <div class="name">${channel}</div>
            <div class="platforms">${this.renderPlatformIcons()}</div>
          </div>
        </div>

        <div class="image">
          ${avatar ? `<img src="${avatar}" alt="${name}">` : ''}
        </div>

        <div class="info">
          <div class="name">${name}</div>
          <div class="stats">${this.renderStats()}</div>
        </div>

        <div class="more">
          <streamer-vibe></streamer-vibe>
          <streamer-rating></streamer-rating>
        </div>
      </article>
    `;

  }
}

if (!customElements.get('streamer-card')) {
  customElements.define('streamer-card', StreamerCard);
} else {
  const Registered = customElements.get('streamer-card') as typeof StreamerCard;
  for (const key of Object.getOwnPropertyNames(StreamerCard.prototype)) {
    if (key !== 'constructor') {
      Object.defineProperty(
        Registered.prototype,
        key,
        Object.getOwnPropertyDescriptor(StreamerCard.prototype, key)!,
      );
    }
  }
  document.querySelectorAll<StreamerCard>('streamer-card').forEach(el => el.render());
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
