import { Injectable, afterNextRender, computed, signal } from '@angular/core';
import { CartItemView, CartLine, CustomerInfo, Order, Product } from './product';

const CART_KEY = 'solemate-cart-v1';

export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FEE = 250;

// Sample catalog. Prices are placeholders — replace with your real ones.
// Sizes are US men's sizes. A stock of 0 means that size is sold out.
function sizes(...stocks: number[]) {
  return [6, 7, 8, 9, 10, 11, 12].map((size, i) => ({ size, stock: stocks[i] ?? 0 }));
}

@Injectable({ providedIn: 'root' })
export class ShopStore {
  private readonly _products = signal<Product[]>([
    {
      id: "nike-air-force-1",
      name: "Air Force 1 '07",
      brand: "Nike",
      category: "Lifestyle",
      price: 5895,
      description:
        "The all-white icon. Smooth leather, a cushioned Air heel and a clean cupsole that goes with everything.",
      specs: [
        { label: "Upper", value: "Leather" },
        { label: "Cushioning", value: "Air-Sole unit" },
        { label: "Outsole", value: "Rubber cupsole" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(2, 4, 6, 5, 6, 3, 1),
      color: "#f6f4ef",
      accent: "#c9c5bb",
      sole: "#ffffff",
      tile: "#dfe7f5",
      shape: "low",
      tag: "Bestseller",
      photo: "products/nike-air-force-1.jpg",
    },
    {
      id: "adidas-samba-og",
      name: "Samba OG",
      brand: "Adidas",
      category: "Lifestyle",
      price: 5800,
      description:
        "A terrace classic back on the street. Leather upper, suede toe overlay and a gum rubber sole.",
      specs: [
        { label: "Upper", value: "Leather and suede" },
        { label: "Outsole", value: "Gum rubber" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(0, 3, 5, 4, 5, 2, 0),
      color: "#1f1f1f",
      accent: "#f6f4ef",
      sole: "#c8a275",
      tile: "#e9dcc3",
      shape: "low",
      tag: "Bestseller",
      photo: "products/adidas-samba-og.jpg",
    },
    {
      id: "new-balance-574",
      name: "574",
      brand: "New Balance",
      category: "Lifestyle",
      price: 4995,
      description:
        "An everyday classic in suede and mesh. Soft midsole cushioning for long days on your feet.",
      specs: [
        { label: "Upper", value: "Suede and mesh" },
        { label: "Midsole", value: "ENCAP" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "Slightly wide" },
      ],
      sizes: sizes(3, 5, 6, 6, 4, 2, 2),
      color: "#8b8f94",
      accent: "#2b4a8f",
      sole: "#efece4",
      tile: "#dde3d3",
      shape: "runner",
      photo: "products/new-balance-574.jpg",
    },
    {
      id: "vans-old-skool",
      name: "Old Skool",
      brand: "Vans",
      category: "Skate",
      price: 3995,
      description:
        "Built for the skatepark. Durable canvas and suede panels with the side stripe and waffle outsole.",
      specs: [
        { label: "Upper", value: "Canvas and suede" },
        { label: "Outsole", value: "Waffle rubber" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(4, 6, 7, 8, 6, 4, 2),
      color: "#1c1c1f",
      accent: "#f6f4ef",
      sole: "#efece4",
      tile: "#f4d9d1",
      shape: "low",
      photo: "products/vans-old-skool.jpg",
    },
    {
      id: "converse-chuck-taylor",
      name: "Chuck Taylor All Star",
      brand: "Converse",
      category: "Skate",
      price: 3295,
      description:
        "The world's best-known canvas shoe. Light, simple and easy to wear every day.",
      specs: [
        { label: "Upper", value: "Canvas" },
        { label: "Toe", value: "Rubber toe cap" },
        { label: "Cut", value: "High-top" },
        { label: "Fit", value: "Slightly roomy" },
      ],
      sizes: sizes(5, 6, 8, 8, 7, 5, 3),
      color: "#c62b2b",
      accent: "#f6f4ef",
      sole: "#f6f4ef",
      tile: "#ffe1d6",
      shape: "high",
      photo: "products/converse-chuck-taylor.jpg",
    },
    {
      id: "nike-pegasus-41",
      name: "Pegasus 41",
      brand: "Nike",
      category: "Running",
      price: 6895,
      description:
        "A dependable daily trainer. Responsive foam and a breathable mesh upper for mile after mile.",
      specs: [
        { label: "Upper", value: "Engineered mesh" },
        { label: "Midsole", value: "ReactX foam" },
        { label: "Use", value: "Daily running" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(2, 0, 0, 0, 0, 0, 0),
      color: "#2f7fd1",
      accent: "#e8ff3d",
      sole: "#f6f4ef",
      tile: "#dfe9ff",
      shape: "runner",
      tag: "New",
      photo: "products/nike-pegasus-41.jpg",
    },
    {
      id: "adidas-ultraboost-light",
      name: "Ultraboost Light",
      brand: "Adidas",
      category: "Running",
      price: 9500,
      description:
        "Lighter than ever with a springy, energy-returning midsole and a sock-like knit upper.",
      specs: [
        { label: "Upper", value: "Primeknit" },
        { label: "Midsole", value: "Light BOOST" },
        { label: "Use", value: "Road running" },
        { label: "Fit", value: "Snug, true to size" },
      ],
      sizes: sizes(1, 3, 4, 5, 4, 3, 1),
      color: "#e8e6e1",
      accent: "#ff6a1f",
      sole: "#f6f4ef",
      tile: "#e6efe9",
      shape: "runner",
      tag: "New",
      photo: "products/adidas-ultraboost-light.jpg",
    },
    {
      id: "asics-gel-1130",
      name: "Gel-1130",
      brand: "ASICS",
      category: "Lifestyle",
      price: 5990,
      description:
        "Early-2000s running style with GEL cushioning in the heel and a mesh and overlay upper.",
      specs: [
        { label: "Upper", value: "Mesh and synthetic" },
        { label: "Cushioning", value: "GEL technology" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(2, 3, 5, 5, 3, 2, 1),
      color: "#d9dde2",
      accent: "#7b8794",
      sole: "#f1f1ef",
      tile: "#e4e2f0",
      shape: "runner",
      photo: "products/asics-gel-1130.jpg",
    },
    {
      id: "puma-suede-classic",
      name: "Suede Classic XXI",
      brand: "Puma",
      category: "Lifestyle",
      price: 4295,
      description:
        "A street icon since the late 60s. Soft suede upper with the signature Formstrip.",
      specs: [
        { label: "Upper", value: "Suede" },
        { label: "Outsole", value: "Rubber" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(3, 4, 5, 5, 4, 3, 2),
      color: "#2b4a8f",
      accent: "#f6f4ef",
      sole: "#f6f4ef",
      tile: "#f6e9b8",
      shape: "low",
      photo: "products/puma-suede-classic.jpg",
    },
    {
      id: "air-jordan-1-low",
      name: "Air Jordan 1 Low",
      brand: "Jordan",
      category: "Basketball",
      price: 6495,
      description:
        "The court legend in a low cut. Leather and synthetic upper with an Air-Sole heel unit.",
      specs: [
        { label: "Upper", value: "Leather and synthetic" },
        { label: "Cushioning", value: "Air-Sole unit" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(2, 3, 4, 4, 3, 2, 1),
      color: "#b3202a",
      accent: "#1c1c1f",
      sole: "#f6f4ef",
      tile: "#ffd9d2",
      shape: "low",
      tag: "Bestseller",
      photo: "products/air-jordan-1-low.jpg",
    },
    {
      id: "nike-dunk-low",
      name: "Dunk Low",
      brand: "Nike",
      category: "Skate",
      price: 5495,
      description:
        "Born on the court, adopted by skaters. Leather upper and a cushioned foam midsole.",
      specs: [
        { label: "Upper", value: "Leather" },
        { label: "Midsole", value: "Foam" },
        { label: "Outsole", value: "Rubber, pivot circle" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(0, 2, 4, 3, 4, 2, 0),
      color: "#2f8f6a",
      accent: "#f6f4ef",
      sole: "#f6f4ef",
      tile: "#d8efe4",
      shape: "low",
      tag: "New",
      photo: "products/nike-dunk-low.jpg",
    },
    {
      id: "adidas-superstar",
      name: "Superstar",
      brand: "Adidas",
      category: "Lifestyle",
      price: 5200,
      description:
        "The shell-toe original. Leather upper, rubber shell toe and serrated three stripes.",
      specs: [
        { label: "Upper", value: "Leather" },
        { label: "Toe", value: "Rubber shell toe" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(3, 5, 6, 7, 5, 3, 2),
      color: "#f6f4ef",
      accent: "#1c1c1f",
      sole: "#ffffff",
      tile: "#ece6f7",
      shape: "low",
      photo: "products/adidas-superstar.jpg",
    },
    {
      id: "reebok-club-c-85",
      name: "Club C 85",
      brand: "Reebok",
      category: "Lifestyle",
      price: 4995,
      description:
        "A clean tennis-court classic. Soft leather upper and a low-profile rubber outsole.",
      specs: [
        { label: "Upper", value: "Leather" },
        { label: "Outsole", value: "Rubber" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(2, 4, 5, 5, 4, 3, 1),
      color: "#f1efe8",
      accent: "#2f7a4d",
      sole: "#e9e3d3",
      tile: "#dff0e6",
      shape: "low",
      photo: "products/reebok-club-c-85.jpg",
    },
    {
      id: "new-balance-550",
      name: "550",
      brand: "New Balance",
      category: "Basketball",
      price: 6995,
      description:
        "80s basketball style, re-released. Leather upper on a stacked cupsole with retro colour blocking.",
      specs: [
        { label: "Upper", value: "Leather" },
        { label: "Outsole", value: "Rubber cupsole" },
        { label: "Cut", value: "Low-top" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(1, 3, 4, 4, 3, 2, 0),
      color: "#f6f4ef",
      accent: "#2b6a3f",
      sole: "#f6f4ef",
      tile: "#e3f0d8",
      shape: "low",
      photo: "products/new-balance-550.jpg",
    },
    {
      id: "hoka-clifton-9",
      name: "Clifton 9",
      brand: "Hoka",
      category: "Running",
      price: 9995,
      description:
        "Plush, lightweight cushioning with a rocker shape that keeps your stride smooth.",
      specs: [
        { label: "Upper", value: "Engineered mesh" },
        { label: "Midsole", value: "Compression-molded EVA" },
        { label: "Use", value: "Road running" },
        { label: "Fit", value: "True to size" },
      ],
      sizes: sizes(1, 2, 3, 4, 3, 2, 1),
      color: "#1d5fd1",
      accent: "#ffe14a",
      sole: "#f6f4ef",
      tile: "#fff1c4",
      shape: "runner",
      tag: "New",
      photo: "products/hoka-clifton-9.jpg",
    },
  ]);

  private readonly _cart = signal<CartLine[]>([]);
  private readonly _notice = signal<string | null>(null);
  private readonly _lastOrder = signal<Order | null>(null);
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;

  readonly products = this._products.asReadonly();
  readonly notice = this._notice.asReadonly();
  readonly lastOrder = this._lastOrder.asReadonly();

  readonly lines = computed<CartItemView[]>(() => {
    const products = this._products();
    const views: CartItemView[] = [];
    for (const line of this._cart()) {
      const product = products.find((p) => p.id === line.id);
      if (product) {
        views.push({
          product,
          size: line.size,
          quantity: line.quantity,
          subtotal: product.price * line.quantity,
        });
      }
    }
    return views;
  });

  readonly count = computed(() => this.lines().reduce((n, l) => n + l.quantity, 0));
  readonly subtotal = computed(() => this.lines().reduce((n, l) => n + l.subtotal, 0));
  readonly shipping = computed(() =>
    this.subtotal() === 0 || this.subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE,
  );
  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    // localStorage only exists in the browser; load after first render so SSR
    // markup and hydration stay in sync.
    afterNextRender(() => this.loadCart());
  }

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  stockFor(id: string, size: number): number {
    return this.getById(id)?.sizes.find((s) => s.size === size)?.stock ?? 0;
  }

  totalStock(product: Product): number {
    return product.sizes.reduce((n, s) => n + s.stock, 0);
  }

  quantityInCart(id: string, size: number): number {
    return this._cart().find((l) => l.id === id && l.size === size)?.quantity ?? 0;
  }

  /** Adds up to the available stock for that size. Returns how many were added. */
  add(id: string, size: number, quantity = 1): number {
    const product = this.getById(id);
    if (!product || quantity < 1) return 0;

    const inCart = this.quantityInCart(id, size);
    const room = this.stockFor(id, size) - inCart;
    if (room <= 0) {
      this.flash(`No more stock in size ${size}: ${product.name}.`);
      return 0;
    }

    const added = Math.min(quantity, room);
    this._cart.update((cart) =>
      inCart === 0
        ? [...cart, { id, size, quantity: added }]
        : cart.map((l) =>
            l.id === id && l.size === size ? { ...l, quantity: l.quantity + added } : l,
          ),
    );
    this.saveCart();
    this.flash(
      added < quantity
        ? `Only ${added} added (stock limit): ${product.name}, size ${size}`
        : `Added to cart: ${product.name}, size ${size}`,
    );
    return added;
  }

  setQuantity(id: string, size: number, quantity: number): void {
    const q = Math.floor(quantity);
    if (!Number.isFinite(q) || q < 1) {
      this.remove(id, size);
      return;
    }
    const clamped = Math.min(q, this.stockFor(id, size));
    if (clamped < 1) {
      this.remove(id, size);
      return;
    }
    this._cart.update((cart) =>
      cart.map((l) => (l.id === id && l.size === size ? { ...l, quantity: clamped } : l)),
    );
    this.saveCart();
  }

  remove(id: string, size: number): void {
    this._cart.update((cart) => cart.filter((l) => !(l.id === id && l.size === size)));
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

    this._products.update((products) =>
      products.map((p) => ({
        ...p,
        sizes: p.sizes.map((s) => {
          const bought = items.find((i) => i.product.id === p.id && i.size === s.size);
          return bought ? { ...s, stock: Math.max(0, s.stock - bought.quantity) } : s;
        }),
      })),
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
    return `SM-${stamp}${rand}`;
  }

  private loadCart(): void {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const valid: CartLine[] = [];
      for (const entry of parsed) {
        const id = String(entry?.id);
        const size = Number(entry?.size);
        const qty = Math.floor(Number(entry?.quantity));
        const stock = this.stockFor(id, size);
        if (stock > 0 && qty >= 1) {
          valid.push({ id, size, quantity: Math.min(qty, stock) });
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
