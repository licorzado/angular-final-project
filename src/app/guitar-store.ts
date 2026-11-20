import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import {
  CartItemView,
  CartLine,
  CustomerInfo,
  Guitar,
  Order,
} from './guitar';

const CART_KEY = 'strumline-cart-v1';

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 500;

@Injectable({ providedIn: 'root' })
export class GuitarStore {
  private readonly _guitars = signal<Guitar[]>([
    {
      id: 'yamaha-fg800',
      name: 'FG800',
      brand: 'Yamaha',
      type: 'Acoustic',
      price: 15500,
      stock: 8,
      description:
        'Sikat na entry-level dreadnought. Solid spruce top na malakas at malinaw ang tunog.',
      specs: [
        { label: 'Top', value: 'Solid Sitka spruce' },
        { label: 'Back & sides', value: 'Nato / Okume' },
        { label: 'Fretboard', value: 'Rosewood' },
        { label: 'Strings', value: '6 (steel)' },
      ],
      color: '#c9782f',
      accent: '#3b2415',
      photo: 'guitars/yamaha-fg800.jpg',
    },
    {
      id: 'fender-cd60s',
      name: 'CD-60S',
      brand: 'Fender',
      type: 'Acoustic',
      price: 14900,
      stock: 6,
      description:
        'Solid spruce top na may mahogany back at sides. Komportable ang neck, swak sa nagsisimula.',
      specs: [
        { label: 'Top', value: 'Solid spruce' },
        { label: 'Back & sides', value: 'Mahogany' },
        { label: 'Fretboard', value: 'Walnut' },
        { label: 'Strings', value: '6 (steel)' },
      ],
      color: '#d39a4e',
      accent: '#2f1d10',
      photo: 'guitars/fender-cd60s.jpg',
    },
    {
      id: 'taylor-gs-mini',
      name: 'GS Mini',
      brand: 'Taylor',
      type: 'Acoustic',
      price: 48000,
      stock: 3,
      description:
        'Compact na body pero malaki ang tunog. Paborito sa biyahe at songwriting.',
      specs: [
        { label: 'Top', value: 'Solid Sitka spruce' },
        { label: 'Back & sides', value: 'Layered sapele' },
        { label: 'Scale', value: '23.5"' },
        { label: 'Strings', value: '6 (steel)' },
      ],
      color: '#e2b46c',
      accent: '#5a3a1c',
      photo: 'guitars/taylor-gs-mini.jpg',
    },
    {
      id: 'yamaha-apx600',
      name: 'APX600',
      brand: 'Yamaha',
      type: 'Acoustic',
      price: 17500,
      stock: 5,
      description:
        'Thinline cutaway na may built-in pickup, plug-and-play para sa stage.',
      specs: [
        { label: 'Body', value: 'Thinline cutaway' },
        { label: 'Pickup', value: 'Piezo + preamp' },
        { label: 'Strings', value: '6 (steel)' },
        { label: 'Finish', value: 'Gloss' },
      ],
      color: '#1d1f2b',
      accent: '#8a8fa8',
      photo: 'guitars/yamaha-apx600.jpg',
    },
    {
      id: 'fender-player-strat',
      name: 'Player II Stratocaster',
      brand: 'Fender',
      type: 'Electric',
      price: 62000,
      stock: 4,
      description:
        'Ang klasikong Strat: tatlong single-coil, maliwanag at maraming gamit na tono.',
      specs: [
        { label: 'Body', value: 'Alder' },
        { label: 'Pickups', value: '3 × single-coil' },
        { label: 'Neck', value: 'Maple' },
        { label: 'Bridge', value: 'Tremolo' },
      ],
      color: '#b3202a',
      accent: '#f3ecdc',
      photo: 'guitars/fender-player-strat.jpg',
    },
    {
      id: 'squier-cv60s-tele',
      name: 'Classic Vibe \'60s Telecaster',
      brand: 'Squier',
      type: 'Electric',
      price: 32000,
      stock: 6,
      description:
        'Vintage-style na Tele na twangy at punchy, mas abot-kaya kaysa sa Fender.',
      specs: [
        { label: 'Body', value: 'Pine' },
        { label: 'Pickups', value: '2 × single-coil' },
        { label: 'Neck', value: 'Maple, 21 frets' },
        { label: 'Bridge', value: 'Hardtail' },
      ],
      color: '#2f8f9d',
      accent: '#f3ecdc',
      photo: 'guitars/squier-cv60s-tele.jpg',
    },
    {
      id: 'epiphone-lp-standard',
      name: 'Les Paul Standard 50s',
      brand: 'Epiphone',
      type: 'Electric',
      price: 38000,
      stock: 2,
      description:
        'Mahogany body na may maple top at dalawang humbucker. Makapal ang sustain.',
      specs: [
        { label: 'Body', value: 'Mahogany + maple top' },
        { label: 'Pickups', value: '2 × humbucker' },
        { label: 'Neck', value: 'Set neck, 22 frets' },
        { label: 'Bridge', value: 'Tune-o-matic' },
      ],
      color: '#a5461a',
      accent: '#e5c76b',
      photo: 'guitars/epiphone-lp-standard.jpg',
    },
    {
      id: 'ibanez-rg421',
      name: 'RG421',
      brand: 'Ibanez',
      type: 'Electric',
      price: 27000,
      stock: 0,
      description:
        'Mabilis na neck at HH pickups para sa rock at metal. Naubos muna ang stock.',
      specs: [
        { label: 'Pickups', value: '2 × humbucker' },
        { label: 'Neck', value: 'Wizard, 24 frets' },
        { label: 'Bridge', value: 'Fixed' },
        { label: 'Style', value: 'Superstrat' },
      ],
      color: '#232323',
      accent: '#c9a24a',
      photo: 'guitars/ibanez-rg421.jpg',
    },
    {
      id: 'yamaha-c40',
      name: 'C40',
      brand: 'Yamaha',
      type: 'Classical',
      price: 6500,
      stock: 15,
      description:
        'Pinakasikat na unang classical guitar: nylon strings na mabait sa daliri.',
      specs: [
        { label: 'Top', value: 'Spruce' },
        { label: 'Back & sides', value: 'Meranti' },
        { label: 'Strings', value: '6 (nylon)' },
        { label: 'Size', value: 'Full (4/4)' },
      ],
      color: '#d9a35a',
      accent: '#4a2e17',
      photo: 'guitars/yamaha-c40.jpg',
    },
    {
      id: 'cordoba-c5',
      name: 'C5',
      brand: 'Cordoba',
      type: 'Classical',
      price: 19500,
      stock: 4,
      description:
        'Cedar top na may mainit at mayamang tunog para sa classical at flamenco.',
      specs: [
        { label: 'Top', value: 'Solid cedar' },
        { label: 'Back & sides', value: 'Mahogany' },
        { label: 'Strings', value: '6 (nylon)' },
        { label: 'Size', value: 'Full (4/4)' },
      ],
      color: '#b8652b',
      accent: '#2c1a0e',
      photo: 'guitars/cordoba-c5.jpg',
    },
    {
      id: 'fender-player-p-bass',
      name: 'Player Precision Bass',
      brand: 'Fender',
      type: 'Bass',
      price: 58000,
      stock: 3,
      description:
        'Klasikong P-Bass: makapal at solid ang low-end, pang-banda talaga.',
      specs: [
        { label: 'Body', value: 'Alder' },
        { label: 'Pickup', value: 'Split-coil' },
        { label: 'Strings', value: '4' },
        { label: 'Scale', value: '34"' },
      ],
      color: '#2b4a8f',
      accent: '#f3ecdc',
      photo: 'guitars/fender-player-p-bass.jpg',
    },
    {
      id: 'squier-affinity-jazz',
      name: 'Affinity Jazz Bass',
      brand: 'Squier',
      type: 'Bass',
      price: 18500,
      stock: 7,
      description:
        'Manipis na neck at malinaw na tono. Magandang unang bass.',
      specs: [
        { label: 'Body', value: 'Poplar' },
        { label: 'Pickups', value: '2 × single-coil' },
        { label: 'Strings', value: '4' },
        { label: 'Scale', value: '34"' },
      ],
      color: '#17171a',
      accent: '#9ba3b5',
      photo: 'guitars/squier-affinity-jazz.jpg',
    },
  ]);

  private readonly _cart = signal<CartLine[]>([]);
  private readonly _notice = signal<string | null>(null);
  private readonly _lastOrder = signal<Order | null>(null);
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;

  readonly guitars = this._guitars.asReadonly();
  readonly notice = this._notice.asReadonly();
  readonly lastOrder = this._lastOrder.asReadonly();

  readonly lines = computed<CartItemView[]>(() => {
    const guitars = this._guitars();
    const views: CartItemView[] = [];
    for (const line of this._cart()) {
      const guitar = guitars.find((g) => g.id === line.id);
      if (guitar) {
        views.push({
          guitar,
          quantity: line.quantity,
          subtotal: guitar.price * line.quantity,
        });
      }
    }
    return views;
  });

  readonly count = computed(() =>
    this.lines().reduce((sum, l) => sum + l.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.lines().reduce((sum, l) => sum + l.subtotal, 0),
  );
  readonly shipping = computed(() =>
    this.subtotal() === 0 || this.subtotal() >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE,
  );
  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    // localStorage only exists in the browser; load after first render so SSR
    // markup and hydration stay in sync.
    afterNextRender(() => this.loadCart());
  }

  getById(id: string): Guitar | undefined {
    return this._guitars().find((g) => g.id === id);
  }

  quantityInCart(id: string): number {
    return this._cart().find((l) => l.id === id)?.quantity ?? 0;
  }

  /** Adds up to the available stock. Returns how many were actually added. */
  add(id: string, quantity = 1): number {
    const guitar = this.getById(id);
    if (!guitar || quantity < 1) return 0;

    const inCart = this.quantityInCart(id);
    const room = guitar.stock - inCart;
    if (room <= 0) {
      this.flash(`Naabot mo na ang available stock ng ${guitar.name}.`);
      return 0;
    }

    const added = Math.min(quantity, room);
    this._cart.update((cart) =>
      inCart === 0
        ? [...cart, { id, quantity: added }]
        : cart.map((l) => (l.id === id ? { ...l, quantity: l.quantity + added } : l)),
    );
    this.saveCart();
    this.flash(
      added < quantity
        ? `Naidagdag ang ${added} lang (stock limit) — ${guitar.name}`
        : `Naidagdag sa cart: ${guitar.name}`,
    );
    return added;
  }

  setQuantity(id: string, quantity: number): void {
    const guitar = this.getById(id);
    if (!guitar) return;
    const q = Math.floor(quantity);
    if (!Number.isFinite(q) || q < 1) {
      this.remove(id);
      return;
    }
    const clamped = Math.min(q, guitar.stock);
    this._cart.update((cart) =>
      cart.map((l) => (l.id === id ? { ...l, quantity: clamped } : l)),
    );
    this.saveCart();
  }

  remove(id: string): void {
    this._cart.update((cart) => cart.filter((l) => l.id !== id));
    this.saveCart();
  }

  clear(): void {
    this._cart.set([]);
    this.saveCart();
  }

  /** Creates the order, reduces stock, and empties the cart. */
  placeOrder(customer: CustomerInfo): Order | null {
    const items = this.lines();
    if (items.length === 0) return null;

    const order: Order = {
      id: this.newOrderId(),
      placedAt: new Date().toISOString(),
      customer,
      items,
      subtotal: this.subtotal(),
      shipping: this.shipping(),
      total: this.total(),
    };

    this._guitars.update((guitars) =>
      guitars.map((g) => {
        const bought = items.find((i) => i.guitar.id === g.id);
        return bought ? { ...g, stock: Math.max(0, g.stock - bought.quantity) } : g;
      }),
    );
    this._lastOrder.set(order);
    this.clear();
    return order;
  }

  dismissNotice(): void {
    clearTimeout(this.noticeTimer);
    this._notice.set(null);
  }

  private flash(message: string): void {
    clearTimeout(this.noticeTimer);
    this._notice.set(message);
    this.noticeTimer = setTimeout(() => this._notice.set(null), 2800);
  }

  private newOrderId(): string {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 1296)
      .toString(36)
      .toUpperCase()
      .padStart(2, '0');
    return `SG-${stamp}${rand}`;
  }

  private loadCart(): void {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const valid: CartLine[] = [];
      for (const entry of parsed) {
        const guitar = this.getById(entry?.id);
        const qty = Math.floor(Number(entry?.quantity));
        if (guitar && qty >= 1 && guitar.stock > 0) {
          valid.push({ id: guitar.id, quantity: Math.min(qty, guitar.stock) });
        }
      }
      this._cart.set(valid);
    } catch {
      /* storage unavailable or corrupted — start with an empty cart */
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(this._cart()));
    } catch {
      /* ignore (SSR, private mode, quota) */
    }
  }
}
