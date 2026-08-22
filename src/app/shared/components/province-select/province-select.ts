import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-province-select',
  template: `
    <div
      class="flex items-center gap-3 bg-white/5 border border-linear-border px-3 py-1.5 rounded-md shadow-[0_1.2px_0_rgba(0,0,0,0.03)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-linear-text-tertiary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <select
        [value]="selected()"
        (change)="provinciaChange.emit($any($event.target).value)"
        class="bg-transparent text-sm font-medium text-linear-text-secondary focus:outline-none appearance-none cursor-pointer"
        aria-label="Seleccionar Provincia"
      >
        @for (prov of provincias(); track prov) {
          <option [value]="prov" class="bg-linear-panel text-linear-text">{{ prov }}</option>
        }
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinceSelect {
  provincias = input.required<string[]>();
  selected = input.required<string>();
  provinciaChange = output<string>();
}
