import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopStore } from '../shop-store';
import { PaymentMethod } from '../product';
import { ProductArt } from '../product-art/product-art';
import { Steps } from '../steps/steps';

type Field = 'fullName' | 'email' | 'phone' | 'address' | 'city';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, ProductArt, Steps],
  template: `
    <div class="wrap">
      <app-steps [current]="2" />
      <h1 class="page-title">Delivery and payment</h1>

      @if (store.lines().length === 0) {
        <section class="empty">
          <h2>Your cart is empty</h2>
          <p>Add a pair to your cart before checking out.</p>
          <a class="primary" routerLink="/">Shop sneakers</a>
        </section>
      } @else {
        <div class="layout">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            @if (submitted && form.invalid) {
              <p class="alert" role="alert">Please fix the highlighted fields to place your order.</p>
            }

            <fieldset>
              <legend>Contact</legend>
              <div class="field">
                <label for="fullName">Full name</label>
                <input id="fullName" type="text" autocomplete="name" formControlName="fullName" [attr.aria-invalid]="show('fullName')" />
                @if (show('fullName')) { <span class="error">Enter your full name.</span> }
              </div>
              <div class="row">
                <div class="field">
                  <label for="email">Email</label>
                  <input id="email" type="email" autocomplete="email" placeholder="you@example.com" formControlName="email" [attr.aria-invalid]="show('email')" />
                  @if (show('email')) { <span class="error">Enter a valid email address.</span> }
                </div>
                <div class="field">
                  <label for="phone">Mobile number</label>
                  <input id="phone" type="tel" autocomplete="tel" placeholder="09171234567" formControlName="phone" [attr.aria-invalid]="show('phone')" />
                  @if (show('phone')) { <span class="error">Enter a PH mobile number, like 09171234567.</span> }
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Delivery address</legend>
              <div class="field">
                <label for="address">Street address</label>
                <textarea id="address" rows="2" autocomplete="street-address" placeholder="House number, street, barangay" formControlName="address" [attr.aria-invalid]="show('address')"></textarea>
                @if (show('address')) { <span class="error">Enter your full street address.</span> }
              </div>
              <div class="field">
                <label for="city">City or municipality</label>
                <input id="city" type="text" autocomplete="address-level2" formControlName="city" [attr.aria-invalid]="show('city')" />
                @if (show('city')) { <span class="error">Enter your city or municipality.</span> }
              </div>
            </fieldset>

            <fieldset>
              <legend>Payment method</legend>
              <div class="methods" role="radiogroup">
                @for (m of methods; track m.value) {
                  <label class="method" [class.selected]="form.controls.payment.value === m.value">
                    <input type="radio" formControlName="payment" [value]="m.value" />
                    <span><strong>{{ m.label }}</strong><small>{{ m.note }}</small></span>
                  </label>
                }
              </div>
              <p class="demo">This is a demo store. No card or account details are collected and no payment is taken.</p>
            </fieldset>

            <button type="submit" class="primary place">
              Place order for {{ store.total() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}
            </button>
          </form>

          <aside class="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul>
              @for (line of store.lines(); track line.product.id + '-' + line.size) {
                <li>
                  <span class="thumb" [class.photo]="!!line.product.photo" [style.background]="line.product.photo ? null : line.product.tile">
                    <app-product-art [shape]="line.product.shape" [color]="line.product.color" [accent]="line.product.accent"
                      [sole]="line.product.sole" [label]="line.product.name" [photo]="line.product.photo" />
                    <span class="q">{{ line.quantity }}</span>
                  </span>
                  <span class="what">
                    <strong>{{ line.product.brand }} {{ line.product.name }}</strong>
                    <small>Size US {{ line.size }}</small>
                  </span>
                  <span class="amt">{{ line.subtotal | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</span>
                </li>
              }
            </ul>
            <dl>
              <div><dt>Subtotal</dt><dd>{{ store.subtotal() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
              <div>
                <dt>Shipping</dt>
                <dd>{{ store.shipping() === 0 ? 'Free' : (store.shipping() | currency: 'PHP' : 'symbol-narrow' : '1.0-0') }}</dd>
              </div>
              <div class="total"><dt>Total</dt><dd>{{ store.total() | currency: 'PHP' : 'symbol-narrow' : '1.0-0' }}</dd></div>
            </dl>
            <a routerLink="/cart" class="edit">Edit cart</a>
          </aside>
        </div>
      }
    </div>
  `,
  styleUrl: './checkout.css',
})
export class Checkout {
  protected readonly store = inject(ShopStore);
  private readonly router = inject(Router);
  protected submitted = false;

  protected readonly methods: { value: PaymentMethod; label: string; note: string }[] = [
    { value: 'cod', label: 'Cash on delivery', note: 'Pay when your order arrives' },
    { value: 'gcash', label: 'GCash', note: "We'll email you a payment link" },
    { value: 'bank', label: 'Bank transfer', note: 'Details are sent by email' },
    { value: 'card', label: 'Credit or debit card', note: "We'll email you a secure link" },
  ];

  protected readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(09|\+639)\d{9}$/)] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    payment: new FormControl<PaymentMethod>('cod', { nonNullable: true }),
  });

  protected show(name: Field): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty || this.submitted);
  }

  protected submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const order = this.store.placeOrder({ ...v, phone: v.phone.replace(/\s+/g, '') });
    if (order) {
      this.router.navigate(['/order', order.id]);
    }
  }
}
