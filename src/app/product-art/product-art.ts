import { Component, computed, input, signal } from '@angular/core';
import { Shape } from '../product';

let nextId = 0;

/**
 * Shows the product photo (public/products/) exactly as it is, with its original
 * colours. If a product has no photo, or the photo fails to load, a generic
 * sneaker illustration drawn in SVG is shown instead.
 */
@Component({
  selector: 'app-product-art',
  template: `
    @if (photo() && !photoFailed()) {
      <img class="photo" [src]="photo()" [alt]="label()" loading="lazy" (error)="photoFailed.set(true)" />
    } @else {
      <svg viewBox="0 0 300 170" role="img" [attr.aria-label]="label()" focusable="false">
        <defs>
          <linearGradient [attr.id]="gid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fff" stop-opacity="0.38" />
            <stop offset="0.55" stop-color="#fff" stop-opacity="0" />
            <stop offset="1" stop-color="#000" stop-opacity="0.16" />
          </linearGradient>
        </defs>
        <ellipse cx="160" [attr.cy]="shadowY()" rx="124" ry="6" fill="#000" opacity="0.16" />

        <!-- upper -->
        <path [attr.d]="upper()" [attr.fill]="color()" stroke="#0000003a" stroke-width="1.4" stroke-linejoin="round" />
        <path [attr.d]="upper()" [attr.fill]="'url(#' + gid + ')'" />
        <!-- heel counter + toe cap -->
        <path [attr.d]="heel()" [attr.fill]="accent()" opacity="0.5" />
        <path d="M240 102 Q290 112 290 124 L290 126 L232 126 Q244 114 240 102 Z" [attr.fill]="accent()" opacity="0.34" />
        <!-- tongue + collar -->
        <path [attr.d]="tongue()" [attr.fill]="accent()" opacity="0.9" stroke="#0000002e" stroke-width="1" />
        <path [attr.d]="collar()" fill="#000" opacity="0.28" />
        <!-- laces -->
        @for (l of laces(); track $index) {
          <line [attr.x1]="l[0]" [attr.y1]="l[1]" [attr.x2]="l[2]" [attr.y2]="l[3]"
            [attr.stroke]="accent()" stroke-width="3.4" stroke-linecap="round" />
          <line [attr.x1]="l[0]" [attr.y1]="l[1]" [attr.x2]="l[2]" [attr.y2]="l[3]"
            stroke="#000" stroke-opacity="0.18" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0 3 1.2 20" />
        }
        <!-- side stripe + stitching -->
        <path d="M58 114 Q128 100 214 108" fill="none" [attr.stroke]="accent()" stroke-width="8" stroke-linecap="round" />
        <path d="M40 74 Q46 60 70 56" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="1.2" stroke-dasharray="3 3" />

        <!-- sole -->
        <path [attr.d]="solePath()" [attr.fill]="sole()" stroke="#0000003a" stroke-width="1.4" stroke-linejoin="round" />
        <path [attr.d]="soleLine()" fill="none" stroke="#0000002a" stroke-width="1.4" />
        <path [attr.d]="outsole()" fill="#000" opacity="0.16" />
      </svg>
    }
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: 100%; display: block; overflow: visible; }
    .photo { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: cover; }
  `,
})
export class ProductArt {
  readonly shape = input<Shape>('low');
  readonly color = input('#f6f4ef');
  readonly accent = input('#c9c5bb');
  readonly sole = input('#ffffff');
  readonly label = input('Sneaker illustration');
  readonly photo = input<string | undefined>();
  protected readonly photoFailed = signal(false);
  protected readonly gid = `sh${nextId++}`;

  private readonly thick = computed(() => (this.shape() === 'runner' ? 24 : 15));
  private readonly bottom = computed(() => 126 + this.thick());

  protected readonly shadowY = computed(() => this.bottom() + 5);

  protected readonly upper = computed(() =>
    this.shape() === 'high'
      ? 'M32 120 L32 40 Q32 26 46 24 L84 20 Q100 20 106 34 L109 66 Q154 76 200 88 Q238 96 266 104 Q288 112 288 122 L288 126 L32 126 Z'
      : 'M32 120 L32 84 Q32 74 42 72 L72 68 Q88 66 98 74 L106 80 Q150 84 196 92 Q238 98 268 106 Q290 112 290 122 L290 126 L32 126 Z',
  );
  protected readonly heel = computed(() =>
    this.shape() === 'high'
      ? 'M32 126 L32 72 Q50 80 56 126 Z'
      : 'M32 126 L32 90 Q46 94 52 126 Z',
  );
  protected readonly tongue = computed(() =>
    this.shape() === 'high'
      ? 'M84 20 Q92 6 110 8 L126 54 L108 62 Z'
      : 'M72 68 Q80 52 98 50 L116 74 L100 80 Z',
  );
  protected readonly collar = computed(() =>
    this.shape() === 'high'
      ? 'M46 24 Q62 12 86 12 L84 20 Q64 20 46 24 Z'
      : 'M42 72 Q56 62 74 64 L72 68 Q58 68 42 72 Z',
  );

  protected readonly laces = computed(() => {
    const out: number[][] = [];
    const low = this.shape() !== 'high';
    for (let i = 0; i < 4; i++) {
      const x = 118 + i * 19;
      const y = low ? 82 + (x - 106) * 0.133 : 69 + (x - 108) * 0.235;
      out.push([x - 4, y - 6, x + 6, y + 8]);
    }
    if (this.shape() === 'high') {
      for (const y of [36, 48, 60]) out.push([98, y - 2, 112, y + 5]);
    }
    return out;
  });

  protected readonly solePath = computed(() => {
    const b = this.bottom();
    return `M30 124 L290 124 Q296 ${b - 5} 280 ${b} L46 ${b} Q30 ${b - 2} 30 124 Z`;
  });
  protected readonly soleLine = computed(() => `M36 ${126 + this.thick() * 0.45} L286 ${126 + this.thick() * 0.45}`);
  protected readonly outsole = computed(() => {
    const b = this.bottom();
    return `M44 ${b - 4} L280 ${b - 4} Q290 ${b - 4} 280 ${b} L46 ${b} Q40 ${b - 1} 44 ${b - 4} Z`;
  });
}
