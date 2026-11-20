import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { OrderConfirmation } from './order/order';

export const routes: Routes = [
  { path: '', component: Home, title: 'Solemate | Sneakers' },
  { path: 'product/:id', component: Details, title: 'Sneaker details' },
  { path: 'cart', component: Cart, title: 'Your cart' },
  { path: 'checkout', component: Checkout, title: 'Checkout' },
  { path: 'order/:id', component: OrderConfirmation, title: 'Order confirmed' },
  { path: '**', redirectTo: '' },
];
