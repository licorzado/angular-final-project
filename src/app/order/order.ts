import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ShopStore } from '../shop-store';
import { ProductArt } from '../product-art/product-art';
import { Steps } from '../steps/steps';

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on delivery',
  gcash: 'GCash',
  bank: 'Bank transfer',
  card: 'Credit or debit card',
};

const DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-order',
  imports: [CurrencyPipe, DatePipe, RouterLink, ProductArt, Steps],
  template: `
    <div class="wrap">
      <app-steps [current]="3" />

      @if (order(); as o) {
        <section class="done">
          <h1>Thanks, {{ firstName() }}. Your order is confirmed.</h1>
          <p class="lead">
            We've sent a confirmation to <strong>{{ o.customer.email }}</strong>.
            Estimated delivery: <strong>{{ eta().from | date: 'MMM d' }} to {{ eta().to | date: 'MMM d' }}</strong>.
          </p>

          <div class="grid">
            <section class="box">
              <h2>Order {{ o.id }}</h2>
              <ul>
                @for (line of o.items; track line.product.id + '-' + line.size) {
                  <li>
                    <span class="thumb" [class.photo]="!!line.product.photo" [style.background]="line.product.photo ? null : line.product.tile">
                      <app-product-art [shape]="line.product.shape" [color]="line.product.color" [accent]="line.product.accent"
                        [sole]="line.product.sole" [label]="line.product.name" [photo]="line.product.photo" />
                    </span>
                    <span class="what">
                      <strong>{{ line.product.brand }} {{ line.product.name }}</strong>
                      <small>Size US {{ line.size }}, quantity {{ line.quantity }}</small>
                    </span>
                    <span class="amt">{{ line.subtotal | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</span>
                  </li>
                }
              </ul>
              <dl>
                <div><dt>Subtotal</dt><dd>{{ o.subtotal | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
                <div><dt>Shipping</dt><dd>{{ o.shipping === 0 ? 'Free' : (o.shipping | currency: 'PHP' : 'symbol-narrow' : '1.0-0') }}</dd></div>
                <div class="total"><dt>Total</dt><dd>{{ o.total | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
              </dl>
            </section>

            <section class="box">
              <h2>Delivery details</h2>
              <p class="addr">
                <strong>{{ o.customer.fullName }}</strong><br />
                {{ o.customer.address }}<br />
                {{ o.customer.city }}<br />
                {{ o.customer.phone }}
              </p>
              <h2 class="second">Payment</h2>
              <p>{{ payment() }}</p>
              <h2 class="second">Placed</h2>
              <p>{{ o.placedAt | date: 'MMM d, y, h:mm a' }}</p>
            </section>
          </div>

          <a class="primary" routerLink="/">Continue shopping</a>
        </section>
      } @else {
        <section class="done">
          <h1>We can't find that order</h1>
          <p class="lead">Order details are only kept until you leave or refresh this page in this demo.</p>
          <a class="primary" routerLink="/">Back to the shop</a>
        </section>
      }
    </div>
  `,
  styleUrl: './order.css',
})
export class OrderConfirmation {
  private readonly store = inject(ShopStore);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');

  protected readonly order = computed(() => {
    const o = this.store.lastOrder();
    return o && o.id === this.id ? o : null;
  });
  protected readonly firstName = computed(() => this.order()?.customer.fullName.trim().split(/\s+/)[0] ?? '');
  protected readonly payment = computed(() => PAYMENT_LABELS[this.order()?.customer.payment ?? ''] ?? '');
  protected readonly eta = computed(() => {
    const placed = new Date(this.order()?.placedAt ?? Date.now()).getTime();
    return { from: new Date(placed + 3 * DAY), to: new Date(placed + 7 * DAY) };
  });
}
