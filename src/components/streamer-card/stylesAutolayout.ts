// Figma source: streamer-card-autolayout
// Frame: 370x700 · bg #121212 · radius 24 · VERTICAL gap 16 · padding 24/20/0/20

const css = `
  :host {
    --card-bg:        #121212;
    --text-primary:   #ffffff;
    --text-secondary: #888888;
    --divider-color:  #d9d9d9;
    --vibe-border:    #454545;
    --brand-primary:  #FF4500;

    display: block;
    font-family: Poppins, sans-serif;
  }

  * { box-sizing: border-box; }

  /* ── card ── */

  .card {
    width: 370px;
    height: 690px;
    background-color: var(--card-bg);
    border-radius: 24px;
    padding: 24px 20px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    box-shadow: 0 10px 0 0 var(--brand-primary);
  }

  /* ── header · 330x40 · HORIZONTAL space-between · radius 12 ── */

  .header {
    width: 330px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* logoMain · 40x40 */
  .logo-main {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .logo-main img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    display: block;
  }

  /* brand · 105x40 · VERTICAL gap 2 */
  .brand {
    width: 105px;
    height: 40px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
  }

  .brand-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 24px;
    white-space: nowrap;
  }

  .brand-icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    height: 14px;
    overflow: hidden;
  }

  .brand-icons svg {
    height: 14px;
    width: auto;
    flex-shrink: 0;
  }

  /* badge · 155x40 · bg #fff · radius 12 */
  .badge {
    position: relative;
    width: 155px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 12px;
    flex-shrink: 0;
    overflow: visible;
  }

  /* dark pill inside badge · 99x29 · bg #121212 · radius 7 */
  .badge-pill {
    position: absolute;
    left: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 99px;
    height: 29px;
    background-color: #121212;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-text {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    line-height: 21px;
  }

  /* star icon · overflows badge top/bottom · pinned to right */
  .badge-star {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-35%);
    width: 50px;
    height: 49px;
    pointer-events: none;
  }

  /* ── mainImage · 325x341 ── */

  .main-image {
    width: 325px;
    height: 341px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-image img {
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.5s;
    display: block;
  }

  .main-image img:hover {
    transform: rotate(25deg) scale(1.1) translate(10px, -20px);
  }

  /* ── nameNstats · 321px · VERTICAL center · gap 10 ── */

  .name-stats {
    width: 321px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  /* Jane Doe · Poppins 600 27px · #fff */
  .streamer-name {
    font-size: 27px;
    font-weight: 600;
    background: linear-gradient(90deg, #f472b6, #a855f7, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 31.64px;
  }

  /* stats group · centered · gap 29px */
  .stats {
    display: flex;
    justify-content: center;
    gap: 29px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* stat value · Poppins 700 16px · #fff */
  .stat-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 24px;
  }

  /* stat label · Poppins 300 10px · #888 */
  .stat-label {
    font-size: 10px;
    font-weight: 300;
    color: var(--text-secondary);
    text-transform: uppercase;
    line-height: 15px;
  }

  /* divider · 321x0.5px · #d9d9d9 */
  .divider {
    width: 100%;
    height: 1px;
    background-color: var(--divider-color);
    opacity: 0.5;
  }

  /* ── selections · 330x103 · HORIZONTAL space-between · padding 20 top/bottom ── */

  .selections {
    width: 330px;
    height: 103px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  /* override flex:1 that streamer-vibe and streamer-rating set on :host */
  .selections streamer-vibe,
  .selections streamer-rating {
    flex: none;
  }

  /* ── footer · 330px · HORIZONTAL center · padding 8/0/20 ── */

  .footer {
    width: 330px;
    padding: 8px 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    font-family: Inter, sans-serif;
    font-size: 10px;
    font-weight: 300;
    color: var(--text-secondary);
    line-height: 12.1px;
  }

  .footer a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 400;
  }

  .footer a:hover {
    background: linear-gradient(90deg, #f472b6, #a855f7, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const sheet = new CSSStyleSheet();
sheet.replaceSync(css);
