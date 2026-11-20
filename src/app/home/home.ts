import { Component, computed, inject, signal, viewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ShopStore } from '../shop-store';
import { CATEGORIES, Category } from '../product';
import { ProductCard } from '../product-card/product-card';
import { ProductArt } from '../product-art/product-art';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink, ProductCard, ProductArt],
  template: `
    <section class="hero wrap">
      <div class="copy">
        <h1>Find the pair you'll wear everywhere.</h1>
        <p class="lead">
          Classics and new releases from Nike, Adidas, New Balance, Vans and more.
          Pick your size, pay your way, and we deliver to your door.
        </p>
        <div class="cta">
          <button type="button" class="primary" (click)="scrollToShop()">Shop sneakers</button>
          <a class="secondary" routerLink="/" [queryParams]="{ category: 'Running' }" (click)="scrollToShop()">Running shoes</a>
        </div>
        <ul class="facts">
          <li><strong>{{ store.products().length }}</strong> styles</li>
          <li><strong>Free</strong> shipping over {{ freeAt | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</li>
          <li><strong>7-day</strong> returns</li>
        </ul>
      </div>

      @if (featured(); as f) {
        <a class="feature" [class.photo]="!!f.photo" [routerLink]="['/product', f.id]" [attr.aria-label]="'View ' + f.brand + ' ' + f.name">
          <app-product-art [shape]="f.shape" [color]="f.color" [accent]="f.accent" [sole]="f.sole" [label]="f.name" [photo]="f.photo" />
          <span class="sticker">
            <small>{{ f.brand }}</small>
            {{ f.name }}
            <b>{{ f.price | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</b>
          </span>
        </a>
      }
    </section>

    <section class="shop wrap" #shop id="shop" aria-labelledby="shop-title">
      <div class="head">
        <h2 id="shop-title">{{ category() ?? 'All sneakers' }}</h2>
        <p class="count" aria-live="polite">{{ visible().length }} {{ visible().length === 1 ? 'style' : 'styles' }}</p>
      </div>

      <div class="controls">
        <nav class="cats" aria-label="Categories">
          <a routerLink="/" [queryParams]="{ category: null }" [class.on]="!category()">All <span>{{ store.products().length }}</span></a>
          @for (c of categories; track c) {
            <a routerLink="/" [queryParams]="{ category: c }" [class.on]="category() === c">{{ c }} <span>{{ counts()[c] }}</span></a>
          }
        </nav>

        <div class="fields">
          <label class="field search">
            <span class="sr">Search sneakers</span>
            <input type="search" placeholder="Search by name or brand" [value]="query()"
              (input)="query.set($any($event.target).value)" />
          </label>
          <label class="field">
            <span class="sr">Filter by size</span>
            <select [value]="size()" (change)="size.set($any($event.target).value)">
              <option value="">All sizes</option>
              @for (s of allSizes; track s) {
                <option [value]="s">US {{ s }}</option>
              }
            </select>
          </label>
          <label class="field">
            <span class="sr">Sort</span>
            <select [value]="sort()" (change)="sort.set($any($event.target).value)">
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="name">Name, A to Z</option>
            </select>
          </label>
        </div>
      </div>

      @if (visible().length > 0) {
        <div class="grid">
          @for (p of visible(); track p.id) {
            <app-product-card [product]="p" />
          }
        </div>
      } @else {
        <div class="empty">
          <h3>No sneakers match your filters</h3>
          <p>Try a different size or search, or clear your filters to see everything.</p>
          <a class="primary" routerLink="/" [queryParams]="{ category: null }" (click)="clear()">Clear filters</a>
        </div>
      }
    </section>
  `,
  styleUrl: './home.css',
})
export class Home {
  protected readonly store = inject(ShopStore);
  private readonly shopEl = viewChild<ElementRef<HTMLElement>>('shop');

  protected readonly categories = CATEGORIES;
  protected readonly allSizes = [6, 7, 8, 9, 10, 11, 12];
  protected readonly freeAt = 10000;

  protected readonly query = signal('');
  protected readonly size = signal('');
  protected readonly sort = signal<SortKey>('featured');

  protected readonly category = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map((q) => {
        const c = q.get('category');
        return CATEGORIES.includes(c as Category) ? (c as Category) : null;
      }),
    ),
    { initialValue: null },
  );

  protected readonly featured = computed(() => this.store.getById('adidas-ultraboost-light'));

  protected readonly counts = computed(() => {
    const out: Record<string, number> = {};
    for (const c of CATEGORIES) out[c] = 0;
    for (const p of this.store.products()) out[p.category]++;
    return out;
  });

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const c = this.category();
    const size = Number(this.size());

    let list = this.store.products().filter(
      (p) =>
        (!c || p.category === c) &&
        (!q || `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q)) &&
        (!size || p.sizes.some((s) => s.size === size && s.stock > 0)),
    );

    switch (this.sort()) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list = [...list].sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
        break;
    }
    return list;
  });

  protected scrollToShop(): void {
    // wait a tick so a query-param navigation can finish first
    setTimeout(() => this.shopEl()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  protected clear(): void {
    this.query.set('');
    this.size.set('');
    this.sort.set('featured');
  }
}
