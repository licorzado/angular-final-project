import { Component, input } from '@angular/core';

@Component({
  selector: 'app-steps',
  template: `
    <ol class="steps" aria-label="Checkout progress">
      @for (label of labels; track label; let i = $index) {
        <li [class.done]="i + 1 < current()" [class.now]="i + 1 === current()"
            [attr.aria-current]="i + 1 === current() ? 'step' : null">
          <span class="n">{{ i + 1 < current() ? '✓' : i + 1 }}</span>
          <span class="t">{{ label }}</span>
        </li>
      }
    </ol>
  `,
  styles: `
    .steps { display: flex; gap: 8px; margin-bottom: 28px; }
    li { display: flex; align-items: center; gap: 10px; color: var(--muted); font-weight: 600; }
    li:not(:last-child)::after { content: ''; width: clamp(20px, 6vw, 56px); height: 2px; margin-left: 6px; background: var(--line); }
    .n { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--line); font-size: 13px; font-weight: 800; }
    .now { color: var(--ink); }
    .now .n { background: var(--ink); border-color: var(--ink); color: #fff; }
    .done { color: var(--ink); }
    .done .n { background: var(--blue); border-color: var(--blue); color: #fff; }
    @media (max-width: 520px) { .t { display: none; } .now .t { display: inline; } }
  `,
})
export class Steps {
  readonly current = input.required<1 | 2 | 3>();
  protected readonly labels = ['Cart', 'Delivery and payment', 'Confirmation'];
}
