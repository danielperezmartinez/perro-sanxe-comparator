import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  template: `
    <div class="relative max-w-2xl mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-linear-text-tertiary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        [value]="value()"
        (input)="valueChange.emit($any($event.target).value)"
        placeholder="Buscar un artículo (ej. leche entera, aceite...)"
        class="linear-input pl-12 py-4 text-lg bg-[#191a1b] border-linear-border-subtle shadow-[0_0_12px_rgba(0,0,0,0.2)_inset]"
        aria-label="Buscar artículo"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput {
  value = input.required<string>();
  valueChange = output<string>();
}
