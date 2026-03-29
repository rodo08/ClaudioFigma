import './index.css';
import './components/streamer-card';
import { StreamerCard } from './components/streamer-card';

import logo   from './assets/logorod.svg';
import img1   from './assets/img1.webp';
import img2   from './assets/img2.webp';
import img3   from './assets/img3.webp';

import { sheet as figmaSheet } from './components/streamer-card/stylesFigma';
import { sheet as neonSheet  } from './components/streamer-card/stylesNeon';
import { sheet as oceanSheet } from './components/streamer-card/stylesOcean';

const streamers = [
  {
    name: 'Zara Nyx', channel: 'STREAMER',
    avatar: img1, badge: 'popular',
    twitch: '85K', youtube: '234K', instagram: '112K', tiktok: '891K',
    sheet: figmaSheet,
  },
  {
    name: 'Nova Ray', channel: 'INFLUENCER',
    avatar: img2, badge: 'new',
    twitch: '42K', youtube: '158K', instagram: '220K', tiktok: '1.2M',
    sheet: neonSheet,
  },
  {
    name: 'Axel Cruz', channel: 'PRO-GAMER',
    avatar: img3, badge: 'popular',
    twitch: '320K', youtube: '780K', instagram: '445K', tiktok: '2.1M',
    sheet: oceanSheet,
  },
];

const root = document.querySelector('#root')!;

const card = document.createElement('streamer-card') as StreamerCard;
card.addEventListener('vote-submitted', (e) => {
  const { vibe, rating } = (e as CustomEvent).detail;
  console.log('Vote submitted:', { vibe, rating });
});
root.appendChild(card);

const nav = document.createElement('nav');
nav.className = 'streamer-nav';

// — bloque título + subtítulo
const navHeader = document.createElement('div');
navHeader.className = 'nav-header';

const navTitle = document.createElement('p');
navTitle.className = 'nav-title';
navTitle.textContent = 'Claudio+Figma';
navHeader.appendChild(navTitle);

const navSubtitle = document.createElement('p');
navSubtitle.className = 'nav-subtitle';
navSubtitle.textContent = 'bidirectional flow';
navHeader.appendChild(navSubtitle);

nav.appendChild(navHeader);

// — bloque descripción
const navDesc = document.createElement('div');
navDesc.className = 'nav-desc';
navDesc.textContent = 'Web Components nativos con flujo bidireccional Figma ↔ código. Tokens de diseño como CSS custom properties, temas intercambiables con CSSStyleSheet constructable y Shadow DOM — orquestado desde Claude Code. Selecciona un perfil para explorar.';
nav.appendChild(navDesc);

// — bloque botones
const navButtons = document.createElement('div');
navButtons.className = 'nav-buttons';

function loadStreamer(index: number) {
  const s = streamers[index];
  card.setSheet(s.sheet);
  card.setAttribute('name',      s.name);
  card.setAttribute('channel',   s.channel);
  card.setAttribute('logo',      logo);
  card.setAttribute('avatar',    s.avatar);
  card.setAttribute('badge',     s.badge);
  card.setAttribute('twitch',    s.twitch);
  card.setAttribute('youtube',   s.youtube);
  card.setAttribute('instagram', s.instagram);
  card.setAttribute('tiktok',    s.tiktok);
  navButtons.querySelectorAll('.streamer-btn').forEach((b, i) =>
    b.classList.toggle('active', i === index)
  );
}

streamers.forEach((s, i) => {
  const btn = document.createElement('button');
  btn.className = 'streamer-btn';
  btn.textContent = s.channel;
  btn.addEventListener('click', () => loadStreamer(i));
  navButtons.appendChild(btn);
});

nav.appendChild(navButtons);

const navFooter = document.createElement('p');
navFooter.className = 'nav-footer';
navFooter.innerHTML = 'made with ❤️ <a href="https://www.rodrigodev.cl" target="_blank" rel="noopener noreferrer">rodrigodev.cl</a>';
nav.appendChild(navFooter);

root.appendChild(nav);
loadStreamer(0);
