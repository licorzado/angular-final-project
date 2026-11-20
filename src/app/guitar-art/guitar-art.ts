import { Component, computed, input, signal } from '@angular/core';
import { GuitarType } from '../guitar';

/**
 * Original, generic guitar illustration drawn in SVG so the shop needs no
 * external image files. Body/trim colours come from each product.
 */
@Component({
  selector: 'app-guitar-art',
  template: `
    @if (photo() && !photoFailed()) {
      <img class="photo" [src]="photo()" [alt]="label()" loading="lazy" (error)="photoFailed.set(true)" />
    } @else {
    <svg viewBox="0 0 200 300" role="img" [attr.aria-label]="label()" focusable="false">
      <!-- neck + fretboard -->
      <rect x="93" y="22" width="14" height="150" rx="2" fill="#2a1a10" />
      @for (y of frets; track y) {
        <line x1="93" x2="107" [attr.y1]="y" [attr.y2]="y" stroke="#cfc6b4" stroke-width="1" />
      }
      <!-- headstock -->
      <path d="M92 24 L108 24 L111 4 Q100 -2 89 4 Z" [attr.fill]="isClassical() ? '#2a1a10' : accent()" />
      @for (x of tunerXs(); track $index) {
        <circle [attr.cx]="x" [attr.cy]="$index < 3 ? 9 : 17" r="2.2" fill="#d8d8d8" />
      }

      @switch (kind()) {
        @case ('electric') {
          <path
            d="M100 158 C84 148 66 150 60 170 C57 184 66 192 63 208 C59 232 72 266 100 266 C128 266 141 232 137 208 C134 192 143 184 140 170 C134 150 116 148 100 158 Z"
            [attr.fill]="color()" stroke="#00000040" stroke-width="1.5" />
          <path d="M72 176 C82 168 92 176 100 190 C108 176 118 168 128 176 C122 200 112 214 100 214 C88 214 78 200 72 176 Z"
            [attr.fill]="accent()" opacity="0.28" />
          <rect x="84" y="184" width="32" height="7" rx="2" fill="#151515" />
          <rect x="84" y="203" width="32" height="7" rx="2" fill="#151515" />
          <rect x="82" y="236" width="36" height="6" rx="2" fill="#bdbdbd" />
          <circle cx="122" cy="252" r="4" fill="#d8d8d8" />
          <circle cx="110" cy="256" r="4" fill="#d8d8d8" />
        }
        @case ('bass') {
          <path
            d="M100 160 C82 150 62 154 58 176 C55 192 65 198 62 214 C58 238 72 268 100 268 C128 268 142 238 138 214 C135 198 145 192 142 176 C138 154 118 150 100 160 Z"
            [attr.fill]="color()" stroke="#00000040" stroke-width="1.5" />
          <rect x="82" y="186" width="36" height="8" rx="2" fill="#151515" />
          <rect x="84" y="206" width="32" height="8" rx="2" fill="#151515" />
          <rect x="80" y="240" width="40" height="7" rx="2" fill="#bdbdbd" />
          <circle cx="124" cy="256" r="4" fill="#d8d8d8" />
          <circle cx="112" cy="260" r="4" fill="#d8d8d8" />
        }
        @default {
          <path
            d="M100 142 C72 142 62 166 72 186 C56 200 50 230 62 256 C76 284 124 284 138 256 C150 230 144 200 128 186 C138 166 128 142 100 142 Z"
            [attr.fill]="color()" stroke="#00000040" stroke-width="1.5" />
          <path d="M80 160 C88 154 96 158 100 168 C104 158 112 154 120 160" fill="none"
            [attr.stroke]="accent()" stroke-width="2" opacity="0.5" />
          <circle cx="100" cy="196" r="15" fill="#120b06" />
          <circle cx="100" cy="196" r="18" fill="none" [attr.stroke]="accent()" stroke-width="2" />
          @if (kind() === 'classical') {
            <circle cx="100" cy="196" r="22" fill="none" [attr.stroke]="accent()" stroke-width="1" stroke-dasharray="3 2" />
          } @else {
            <path d="M118 206 Q132 214 128 236 Q114 232 112 218 Z" [attr.fill]="accent()" opacity="0.55" />
          }
          <rect x="82" y="242" width="36" height="7" rx="2" fill="#2a1a10" />
        }
      }

      <!-- strings -->
      @for (s of strings(); track $index) {
        <line [attr.x1]="s.top" [attr.x2]="s.bottom" y1="22" [attr.y2]="stringEnd()"
          stroke="#e9e9e9" [attr.stroke-width]="s.w" opacity="0.85" />
      }
    </svg>
    }
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: 100%; display: block; transform: rotate(-13deg) scale(1.02); filter: drop-shadow(0 10px 10px rgb(0 0 0 / 0.25)); }
  .photo { width: 100%; height: 100%; display: block; object-fit: contain; mix-blend-mode: multiply; }
  `,
})
export class GuitarArt {
  readonly type = input.required<GuitarType>();
  readonly color = input('#c9782f');
  readonly accent = input('#3b2415');
  readonly label = input('Guitar illustration');
  readonly photo = input<string | undefined>();
  protected readonly photoFailed = signal(false);

  protected readonly frets = [44, 64, 82, 98, 112, 125, 137, 148, 158];

  protected readonly kind = computed(() => {
    switch (this.type()) {
      case 'Electric':
        return 'electric';
      case 'Bass':
        return 'bass';
      case 'Classical':
        return 'classical';
      default:
        return 'acoustic';
    }
  });

  protected readonly isClassical = computed(() => this.kind() === 'classical');

  protected readonly tunerXs = computed(() =>
    this.kind() === 'bass' ? [88, 88, 112, 112, 100, 100] : [90, 90, 90, 110, 110, 110],
  );

  protected readonly stringEnd = computed(() => {
    switch (this.kind()) {
      case 'electric':
        return 240;
      case 'bass':
        return 243;
      default:
        return 245;
    }
  });

  protected readonly strings = computed(() => {
    const count = this.kind() === 'bass' ? 4 : 6;
    const thick = this.kind() === 'bass' ? 1.6 : 0.9;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      return {
        top: 95.5 + t * 9,
        bottom: 90 + t * 20,
        w: +(thick + (count - 1 - i) * 0.12).toFixed(2),
      };
    });
  });
}
