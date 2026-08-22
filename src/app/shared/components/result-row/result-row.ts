import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ArticuloResult } from '../../../core/services/supabase';

@Component({
  selector: 'app-result-row',
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="h-20 w-20 flex-shrink-0 bg-white/5 rounded-md border border-linear-border overflow-hidden">
      <img
        [src]="item().imagen_url || 'https://placehold.co/100x100?text=Sin+Imagen'"
        [alt]="item().nombre"
        class="w-full h-full object-cover mix-blend-luminosity opacity-80"
        loading="lazy"
      />
    </div>

    <div class="flex-grow flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border border-[#23252a] text-linear-text-secondary"
          >
            {{ item().supermercado }}
          </span>
          <span class="text-xs text-linear-text-tertiary">{{ item().categoria }}</span>
        </div>
        <h3 class="text-lg font-medium text-linear-text">{{ item().nombre }}</h3>
      </div>
    </div>

    <div class="flex flex-col items-end justify-center md:min-w-[140px] text-right">
      <div class="text-2xl font-bold text-linear-text mb-1">
        {{ item().precio | currency: 'EUR' : 'symbol' : '1.2-2' : 'es-ES' }}
      </div>
      <div
        class="text-xs text-linear-success font-medium bg-linear-success/10 px-2 py-1 rounded-full border border-linear-success/20"
      >
        {{ item().precio_por_unidad | currency: 'EUR' : 'symbol' : '1.2-2' : 'es-ES' }} / ud
      </div>
      <div class="text-[10px] text-linear-text-muted mt-2">
        Actualizado: {{ item().ultima_actualizacion | date: 'shortDate' }}
      </div>
    </div>
  `,
  host: {
    class: 'flex flex-col md:flex-row gap-4 p-6 hover:bg-white/[0.03] transition-colors',
    '[class.border-b]': '!last()',
    '[class.border-linear-border-subtle]': '!last()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultRow {
  item = input.required<ArticuloResult>();
  last = input<boolean>(false);
}
