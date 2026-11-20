import { TestBed } from '@angular/core/testing';
import { ShopStore, SHIPPING_FEE } from './shop-store';
import { CustomerInfo } from './product';

const customer: CustomerInfo = {
  fullName: 'Juan Dela Cruz',
  email: 'juan@example.com',
  phone: '09171234567',
  address: '123 Rizal St.',
  city: 'Manila',
  payment: 'cod',
};

describe('ShopStore', () => {
  let store: ShopStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(ShopStore);
  });

  it('adds items and totals them', () => {
    store.add('vans-old-skool', 9, 2);
    expect(store.count()).toBe(2);
    expect(store.subtotal()).toBe(7990);
    expect(store.shipping()).toBe(SHIPPING_FEE);
  });

  it('keeps different sizes as separate lines', () => {
    store.add('vans-old-skool', 8);
    store.add('vans-old-skool', 9);
    expect(store.lines().length).toBe(2);
  });

  it('does not exceed stock for a size', () => {
    store.add('nike-pegasus-41', 6, 5); // size 6 stock is 2
    expect(store.count()).toBe(2);
    expect(store.add('nike-pegasus-41', 6, 1)).toBe(0);
  });

  it('refuses sold out sizes', () => {
    expect(store.add('nike-pegasus-41', 9)).toBe(0);
    expect(store.count()).toBe(0);
  });

  it('gives free shipping on big orders', () => {
    store.add('nike-air-force-1', 8, 2);
    expect(store.subtotal()).toBe(11790);
    expect(store.shipping()).toBe(0);
  });

  it('places an order, reduces stock, and clears the cart', () => {
    store.add('vans-old-skool', 9, 2);
    const before = store.stockFor('vans-old-skool', 9);
    const order = store.placeOrder(customer);
    expect(order?.total).toBe(7990 + SHIPPING_FEE);
    expect(store.count()).toBe(0);
    expect(store.stockFor('vans-old-skool', 9)).toBe(before - 2);
  });

  it('removes a line when quantity goes below 1', () => {
    store.add('vans-old-skool', 9);
    store.setQuantity('vans-old-skool', 9, 0);
    expect(store.count()).toBe(0);
  });
});
