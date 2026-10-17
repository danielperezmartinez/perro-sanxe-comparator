import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Shared shell for the legal pages: a readable ticket-like sheet with links
// back to the comparator and between both legal pages.
@Component({
  selector: 'app-legal-layout',
  imports: [RouterLink],
  template: `
    <main class="tique-paper mx-auto max-w-[680px] px-6 py-8 my-8 text-tique-ink font-mono">
      <a routerLink="/" class="text-xs font-bold text-tique-accent underline underline-offset-2"
        >← Volver al comparador</a
      >
      <h1 class="font-display text-3xl mt-6 mb-2">{{ heading() }}</h1>
      <p class="text-xs text-tique-muted mb-6">Última actualización: {{ updated() }}</p>
      <div class="legal-body text-sm leading-relaxed break-words">
        <ng-content />
      </div>
      <nav
        aria-label="Información legal"
        class="mt-10 pt-4 border-t border-dashed border-tique-border flex gap-4 text-xs"
      >
        <a routerLink="/aviso-legal" class="underline underline-offset-2">Aviso legal</a>
        <a routerLink="/privacidad" class="underline underline-offset-2">Privacidad</a>
      </nav>
    </main>
  `,
  host: { class: 'block min-h-screen bg-tique-counter px-3.5 py-1' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalLayout {
  heading = input.required<string>();
  updated = input.required<string>();
}
