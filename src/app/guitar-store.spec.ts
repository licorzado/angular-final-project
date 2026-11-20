import { TestBed } from '@angular/core/testing';
import { GuitarStore, SHIPPING_FEE } from './guitar-store';
import { CustomerInfo } from './guitar';

const customer: CustomerInfo = {
  fullName: 'Juan Dela Cruz',
  email: 'juan@example.com',
  phone: '09171234567',
  address: '123 Rizal St.',
  city: 'Manila',
  payment: 'cod',
};

describe('GuitarStore', () => {
  let store: GuitarStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(GuitarStore);
  });

  it('adds items and totals them', () => {
    store.add('yamaha-c40', 2);
    expect(store.count()).toBe(2);
    expect(store.subtotal()).toBe(13000);
    expect(store.shipping()).toBe(SHIPPING_FEE);
  });

  it('does not exceed stock', () => {
    store.add('epiphone-lp-standard', 5); // stock is 2
    expect(store.count()).toBe(2);
    expect(store.add('epiphone-lp-standard', 1)).toBe(0);
  });

  it('refuses sold out items', () => {
    expect(store.add('ibanez-rg421')).toBe(0);
    expect(store.count()).toBe(0);
  });

  it('gives free shipping on big orders', () => {
    store.add('epiphone-lp-standard', 2);
    expect(store.shipping()).toBe(0);
  });

  it('places an order, reduces stock, and clears the cart', () => {
    store.add('squier-affinity-jazz', 2);
    const before = store.getById('squier-affinity-jazz')!.stock;
    const order = store.placeOrder(customer);
    expect(order?.subtotal).toBe(37000);
    expect(order?.total).toBe(37000 + SHIPPING_FEE);
    expect(store.count()).toBe(0);
    expect(store.getById('squier-affinity-jazz')!.stock).toBe(before - 2);
  });

  it('removes a line when quantity goes below 1', () => {
    store.add('yamaha-c40');
    store.setQuantity('yamaha-c40', 0);
    expect(store.count()).toBe(0);
  });
});
