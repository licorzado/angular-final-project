import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ShopStore, FREE_SHIPPING_THRESHOLD } from '../shop-store';
import { ProductArt } from '../product-art/product-art';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, RouterLink, ProductArt, ProductCard],
  template: `
    @if (product(); as p) {
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/">Shop</a>
          <span aria-hidden="true">/</span>
          <a routerLink="/" [queryParams]="{ category: p.category }">{{ p.category }}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ p.name }}</span>
        </nav>

        <article class="detail">
          <div class="stage" [class.photo]="!!p.photo" [style.background]="p.photo ? null : p.tile">
            @if (p.tag) { <span class="tag">{{ p.tag }}</span> }
            <app-product-art [shape]="p.shape" [color]="p.color" [accent]="p.accent" [sole]="p.sole" [label]="p.brand + ' ' + p.name" [photo]="p.photo" />
          </div>

          <div class="info">
            <p class="brand">{{ p.brand }}</p>
            <h1>{{ p.name }}</h1>
            <p class="price">{{ p.price | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</p>
            <p class="desc">{{ p.description }}</p>

            <div class="size-block" [class.err]="sizeError()">
              <div class="size-head">
                <h2 id="size-label">Select size <span>US men's</span></h2>
                @if (size() !== null) {
                  <span class="left" [class.low]="remaining() <= 2">
                    {{ remaining() > 0 ? remaining() + ' left' : 'All in your cart' }}
                  </span>
                }
              </div>
              <div class="sizes" role="radiogroup" aria-labelledby="size-label">
                @for (s of p.sizes; track s.size) {
                  <button type="button" role="radio" [attr.aria-checked]="size() === s.size"
                    [class.on]="size() === s.size" [disabled]="s.stock === 0"
                    [attr.aria-label]="'Size ' + s.size + (s.stock === 0 ? ', sold out' : '')"
                    (click)="pick(s.size)">{{ s.size }}</button>
                }
              </div>
              @if (sizeError()) {
                <p class="error" role="alert">Select a size to continue.</p>
              }
            </div>

            <div class="buy">
              <div class="qty" role="group" aria-label="Quantity">
                <button type="button" (click)="change(-1)" [disabled]="qty() <= 1" aria-label="Decrease quantity">−</button>
                <output aria-live="polite">{{ qty() }}</output>
                <button type="button" (click)="change(1)" [disabled]="size() === null || qty() >= remaining()" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="primary add" (click)="addToCart()">Add to cart</button>
            </div>
            <button type="button" class="secondary now" (click)="buyNow()">Buy it now</button>

            <ul class="perks">
              <li>Free shipping on orders over {{ freeAt | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</li>
              <li>Delivery in 3 to 7 business days</li>
              <li>Returns within 7 days for unworn pairs</li>
            </ul>

            <details class="more" open>
              <summary>Product details</summary>
              <dl>
                @for (s of p.specs; track s.label) {
                  <div><dt>{{ s.label }}</dt><dd>{{ s.value }}</dd></div>
                }
              </dl>
            </details>
          </div>
        </article>

        @if (related().length > 0) {
          <section class="related" aria-labelledby="rel">
            <h2 id="rel">You may also like</h2>
            <div class="grid">
              @for (r of related(); track r.id) {
                <app-product-card [product]="r" />
              }
            </div>
          </section>
        }
      </div>
    } @else {
      <section class="missing wrap">
        <h1>We couldn't find that sneaker</h1>
        <p>It may have been removed, or the link is wrong.</p>
        <a class="primary" routerLink="/">Browse all sneakers</a>
      </section>
    }
  `,
  styleUrl: './details.css',
})
export class Details {
  private readonly store = inject(ShopStore);
  private readonly router = inject(Router);
  private readonly id = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly freeAt = FREE_SHIPPING_THRESHOLD;
  protected readonly qty = signal(1);
  protected readonly size = signal<number | null>(null);
  protected readonly sizeError = signal(false);

  protected readonly product = computed(() => this.store.getById(this.id()));

  protected readonly inCart = computed(() => {
    const s = this.size();
    return s === null ? 0 : this.store.quantityInCart(this.id(), s);
  });
  protected readonly remaining = computed(() => {
    const s = this.size();
    return s === null ? 0 : this.store.stockFor(this.id(), s) - this.inCart();
  });

  protected readonly related = computed(() => {
    const current = this.product();
    if (!current) return [];
    const others = this.store.products().filter((p) => p.id !== current.id);
    const same = others.filter((p) => p.category === current.category);
    const rest = others.filter((p) => p.category !== current.category);
    return [...same, ...rest].slice(0, 4);
  });

  protected pick(size: number): void {
    this.size.set(size);
    this.sizeError.set(false);
    this.qty.set(1);
  }

  protected change(delta: number): void {
    this.qty.update((q) => Math.min(Math.max(1, q + delta), Math.max(1, this.remaining())));
  }

  private ready(): number | null {
    const s = this.size();
    if (s === null) {
      this.sizeError.set(true);
      return null;
    }
    return s;
  }

  protected addToCart(): void {
    const s = this.ready();
    if (s === null) return;
    this.store.add(this.id(), s, this.qty());
    this.qty.set(1);
  }

  protected buyNow(): void {
    const s = this.ready();
    if (s === null) return;
    // If every pair of this size is already in the cart, go straight to checkout.
    if (this.remaining() > 0) this.store.add(this.id(), s, this.qty());
    this.router.navigate(['/checkout']);
  }
}
