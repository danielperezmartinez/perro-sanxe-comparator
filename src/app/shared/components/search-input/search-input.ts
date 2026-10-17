import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  template: `
    <label for="tique-search" class="block text-[11px] font-bold text-tique-ink mb-1.5">
      ¿QUÉ ANDAS BUSCANDO?
    </label>
    <div class="flex items-center gap-2 min-h-[48px] bg-[#fffdf6] border-2 border-dashed border-tique-ink px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-tique-ink flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        id="tique-search"
        type="text"
        [value]="value()"
        (input)="valueChange.emit($any($event.target).value)"
        placeholder="leche entera, aceite, pan..."
        class="flex-grow bg-transparent text-sm text-tique-ink font-mono placeholder:text-tique-muted focus:outline-none"
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
