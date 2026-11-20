import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Guitar } from '../guitar';
import { GuitarStore } from '../guitar-store';
import { GuitarArt } from '../guitar-art/guitar-art';

@Component({
  selector: 'app-guitar-card',
  imports: [CurrencyPipe, RouterLink, GuitarArt],
  template: `
    <article class="card">
      <a class="art" [routerLink]="['/guitar', guitar().id]" [style.--tint]="guitar().color">
        <app-guitar-art
          [type]="guitar().type"
          [color]="guitar().color"
          [accent]="guitar().accent"
          [label]="guitar().name" [photo]="guitar().photo" />
        <span class="badge">{{ guitar().type }}</span>
        @if (guitar().stock === 0) {
          <span class="badge sold">Sold out</span>
        } @else if (guitar().stock <= 3) {
          <span class="badge low">{{ guitar().stock }} na lang</span>
        }
      </a>

      <div class="body">
        <p class="brand">{{ guitar().brand }}</p>
        <h2><a [routerLink]="['/guitar', guitar().id]">{{ guitar().name }}</a></h2>
        <div class="buy">
          <strong class="price">{{ guitar().price | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</strong>
          <button
            type="button"
            class="primary"
            [disabled]="guitar().stock === 0 || atLimit()"
            (click)="store.add(guitar().id)">
            @if (guitar().stock === 0) {
              Sold out
            } @else if (atLimit()) {
              Nasa cart na lahat
            } @else {
              Add to cart
            }
          </button>
        </div>
      </div>
    </article>
  `,
  styleUrl: './guitar-card.css',
})
export class GuitarCard {
  protected readonly store = inject(GuitarStore);
  readonly guitar = input.required<Guitar>();

  protected readonly atLimit = computed(
    () => this.store.quantityInCart(this.guitar().id) >= this.guitar().stock,
  );
}
