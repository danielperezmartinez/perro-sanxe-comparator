import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-province-select',
  template: `
    <div class="flex items-center gap-2">
      <span class="text-[10px] font-bold text-tique-ink whitespace-nowrap">TIENDA:</span>
      <div class="relative flex-grow">
        <select
          [value]="selected()"
          (change)="provinciaChange.emit($any($event.target).value)"
          class="w-full min-h-[40px] bg-white border-2 border-tique-ink pl-2.5 pr-7 text-xs font-bold text-tique-ink font-mono appearance-none cursor-pointer"
          aria-label="Seleccionar Provincia"
        >
          @for (prov of provincias(); track prov) {
            <option [value]="prov">{{ prov }}</option>
          }
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 text-tique-ink absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="3"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinceSelect {
  provincias = input.required<string[]>();
  selected = input.required<string>();
  provinciaChange = output<string>();
}
