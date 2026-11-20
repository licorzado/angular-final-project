import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ShopStore, FREE_SHIPPING_THRESHOLD } from './shop-store';
import { CATEGORIES } from './product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CurrencyPipe],
  template: `
    <div class="promo">
      Free shipping on orders over {{ freeAt | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}. Pay with GCash or cash on delivery.
    </div>

    <header class="topbar">
      <div class="wrap bar">
        <a class="brand" routerLink="/" aria-label="Solemate home">
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#2438ff" />
            <path d="M6 21c0-3 1-5 3-6l3-1 3 3c3 1 6 2 9 2 2 0 3 1 3 3H6z" fill="#fff" />
          </svg>
          <span>Solemate</span>
        </a>

        <nav aria-label="Main">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Shop</a>
          <a class="cart" routerLink="/cart" routerLinkActive="active" [attr.aria-label]="'Cart, ' + store.count() + ' items'">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            <span>Cart</span>
            @if (store.count() > 0) {
              <span class="count">{{ store.count() }}</span>
            }
          </a>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="wrap cols">
        <div class="about">
          <p class="logo">Solemate</p>
          <p>Everyday sneakers from the brands you know. This is a demo store, so no real payments are processed.</p>
        </div>
        <div>
          <h2>Shop by category</h2>
          <ul>
            <li><a routerLink="/">All sneakers</a></li>
            @for (c of categories; track c) {
              <li><a routerLink="/" [queryParams]="{ category: c }">{{ c }}</a></li>
            }
          </ul>
        </div>
        <div>
          <h2>Delivery and returns</h2>
          <ul class="plain">
            <li>Delivery in 3 to 7 business days</li>
            <li>Free shipping over {{ freeAt | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</li>
            <li>Returns within 7 days for unworn pairs</li>
          </ul>
        </div>
      </div>
      <p class="legal wrap">&copy; 2026 Solemate. Brand names belong to their owners.</p>
    </footer>

    @if (store.notice(); as message) {
      <div class="toast" role="status" aria-live="polite">
        <span>{{ message }}</span>
        <a routerLink="/cart" (click)="store.dismissNotice()">View cart</a>
        <button type="button" (click)="store.dismissNotice()" aria-label="Dismiss">&times;</button>
      </div>
    }
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly store = inject(ShopStore);
  protected readonly categories = CATEGORIES;
  protected readonly freeAt = FREE_SHIPPING_THRESHOLD;
}
