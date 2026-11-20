import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShopStore, FREE_SHIPPING_THRESHOLD } from '../shop-store';
import { ProductArt } from '../product-art/product-art';
import { Steps } from '../steps/steps';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, ProductArt, Steps],
  template: `
    <div class="wrap">
      <app-steps [current]="1" />
      <h1 class="page-title">Your cart</h1>

      @if (store.lines().length === 0) {
        <section class="empty">
          <h2>Your cart is empty</h2>
          <p>Pick a pair, choose your size, and it will show up here.</p>
          <a class="primary" routerLink="/">Shop sneakers</a>
        </section>
      } @else {
        <div class="layout">
          <section aria-label="Items in your cart">
            <div class="ship" [class.free]="toFree() === 0">
              @if (toFree() > 0) {
                <p>Add <strong>{{ toFree() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</strong> more to get free shipping.</p>
              } @else {
                <p><strong>You've got free shipping.</strong></p>
              }
              <div class="bar" role="progressbar" aria-label="Progress to free shipping"
                aria-valuemin="0" aria-valuemax="100" [attr.aria-valuenow]="progress()">
                <span [style.width.%]="progress()"></span>
              </div>
            </div>

            <ul class="lines">
              @for (line of store.lines(); track line.product.id + '-' + line.size) {
                <li class="line">
                  <a class="thumb" [routerLink]="['/product', line.product.id]" [class.photo]="!!line.product.photo" [style.background]="line.product.photo ? null : line.product.tile"
                     [attr.aria-label]="'View ' + line.product.name">
                    <app-product-art [shape]="line.product.shape" [color]="line.product.color" [accent]="line.product.accent"
                      [sole]="line.product.sole" [label]="line.product.name" [photo]="line.product.photo" />
                  </a>

                  <div class="meta">
                    <p class="brand">{{ line.product.brand }}</p>
                    <a class="name" [routerLink]="['/product', line.product.id]">{{ line.product.name }}</a>
                    <p class="size">Size US {{ line.size }}</p>
                    <button type="button" class="link" (click)="store.remove(line.product.id, line.size)">Remove</button>
                  </div>

                  <div class="qty" role="group" [attr.aria-label]="'Quantity for ' + line.product.name + ' size ' + line.size">
                    <button type="button" (click)="store.setQuantity(line.product.id, line.size, line.quantity - 1)"
                      [attr.aria-label]="line.quantity === 1 ? 'Remove item' : 'Decrease quantity'">−</button>
                    <output>{{ line.quantity }}</output>
                    <button type="button" (click)="store.setQuantity(line.product.id, line.size, line.quantity + 1)"
                      [disabled]="line.quantity >= store.stockFor(line.product.id, line.size)" aria-label="Increase quantity">+</button>
                  </div>

                  <strong class="sub">{{ line.subtotal | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</strong>
                </li>
              }
            </ul>
            <a class="back" routerLink="/">Continue shopping</a>
          </section>

          <aside class="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{{ store.subtotal() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
              <div>
                <dt>Shipping</dt>
                <dd>{{ store.shipping() === 0 ? 'Free' : (store.shipping() | currency: 'PHP' : 'symbol-narrow' : '1.0-0') }}</dd>
              </div>
              <div class="total"><dt>Total</dt><dd>{{ store.total() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
            </dl>
            <a class="primary" routerLink="/checkout">Checkout</a>
            <button type="button" class="link clear" (click)="store.clear()">Empty cart</button>
          </aside>
        </div>
      }
    </div>
  `,
  styleUrl: './cart.css',
})
export class Cart {
  protected readonly store = inject(ShopStore);
  protected readonly toFree = computed(() => Math.max(0, FREE_SHIPPING_THRESHOLD - this.store.subtotal()));
  protected readonly progress = computed(() =>
    Math.min(100, Math.round((this.store.subtotal() / FREE_SHIPPING_THRESHOLD) * 100)),
  );
}
