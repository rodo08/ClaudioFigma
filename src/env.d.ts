/// <reference types="@rspack/core/module" />

interface ImportMeta {
  readonly webpackHot?: { accept(): void };
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
