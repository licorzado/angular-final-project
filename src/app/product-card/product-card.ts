import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product';
import { ShopStore } from '../shop-store';
import { ProductArt } from '../product-art/product-art';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, ProductArt],
  template: `
    <article class="card" [class.sold]="stock() === 0">
      <a class="tile" [class.photo]="!!product().photo" [routerLink]="['/product', product().id]"
         [style.background]="product().photo ? null : product().tile"
         [attr.aria-label]="product().brand + ' ' + product().name">
        <app-product-art
          [shape]="product().shape"
          [color]="product().color"
          [accent]="product().accent"
          [sole]="product().sole"
          [label]="product().name"
          [photo]="product().photo" />
        @if (product().tag) {
          <span class="tag">{{ product().tag }}</span>
        }
        @if (stock() === 0) {
          <span class="flag">Sold out</span>
        } @else if (stock() <= 8) {
          <span class="flag">Low stock</span>
        }
        <span class="peek">Choose size</span>
      </a>

      <div class="info">
        <div class="line">
          <h3><a [routerLink]="['/product', product().id]"><span class="brand">{{ product().brand }}</span> {{ product().name }}</a></h3>
          <strong class="price">{{ product().price | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</strong>
        </div>
        <p class="meta">
          {{ meta() }}
        </p>
      </div>
    </article>
  `,
  styleUrl: './product-card.css',
})
export class ProductCard {
  private readonly store = inject(ShopStore);
  readonly product = input.required<Product>();

  protected readonly stock = computed(() => this.store.totalStock(this.product()));
  protected readonly meta = computed(() => {
    const r = this.range();
    return r ? `${this.product().category}, sizes ${r}` : `${this.product().category}, no sizes left`;
  });
  private readonly range = computed(() => {
    const open = this.product().sizes.filter((s) => s.stock > 0);
    if (open.length === 0) return '';
    return open.length === 1
      ? `${open[0].size}`
      : `${open[0].size} to ${open[open.length - 1].size}`;
  });
}
