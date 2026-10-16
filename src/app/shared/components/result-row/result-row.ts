import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArticuloResult } from '../../../core/services/supabase';

@Component({
  selector: 'app-result-row',
  imports: [CurrencyPipe, DatePipe],
  template: `
    @if (isBest()) {
      <div class="absolute top-2 -right-1.5 w-[92px] rotate-[-6deg] pointer-events-none">
        <svg viewBox="0 0 100 42" width="92" height="39" aria-hidden="true">
          <path
            d="M8,21 C7,9 29,4 50,5 C74,6 95,11 92,22 C90,34 67,38 47,37 C24,36 9,33 8,21 Z"
            fill="none"
            stroke="#a02f5e"
            stroke-width="2.5"
          />
        </svg>
        <span
          class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-tique-accent tracking-wide font-mono"
        >
          MENOR €/REF.
        </span>
        <span class="sr-only">Menor precio de referencia de esta búsqueda</span>
      </div>
    }

    <h3 class="text-[13px] font-bold text-tique-ink font-mono uppercase">{{ item().nombre }}</h3>
    <div class="text-[10px] text-tique-muted font-mono mt-0.5">
      {{ item().supermercado }} · {{ item().categoria }}
    </div>
    <div class="flex justify-between items-baseline mt-2">
      <span class="text-[10px] text-tique-muted font-mono">
        ACTUALIZADO: {{ item().ultima_actualizacion | date: 'shortDate' : '' : 'es-ES' }}
      </span>
      <div class="text-right">
        <div class="text-[19px] font-bold text-tique-ink font-mono">
          {{ item().precio | currency: 'EUR' : 'symbol' : '1.2-2' : 'es-ES' }}
        </div>
        <div
          class="text-[9px] font-bold text-white font-mono px-1.5 py-0.5 mt-0.5 inline-block"
          [class.bg-tique-pill-best]="isBest()"
          [class.bg-tique-pill]="!isBest()"
        >
          {{ item().precio_por_unidad | currency: 'EUR' : 'symbol' : '1.2-2' : 'es-ES' }} / ref.<span
            class="sr-only"
          >
            (precio por kg, litro o unidad según el producto)</span
          >
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'relative block px-5 py-3',
    '[class.border-b]': '!last()',
    '[class.border-dashed]': '!last()',
    '[class.border-tique-border]': '!last()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultRow {
  item = input.required<ArticuloResult>();
  last = input<boolean>(false);
  isBest = input<boolean>(false);
}
