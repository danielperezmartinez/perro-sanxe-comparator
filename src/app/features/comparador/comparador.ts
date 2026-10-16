import {
  Component,
  signal,
  resource,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterLink } from '@angular/router';
import { SupabaseService, ArticuloResult } from '../../core/services/supabase';
import { ProvinceSelect } from '../../shared/components/province-select/province-select';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { ResultRow } from '../../shared/components/result-row/result-row';
import { nearestProvince } from '../../core/geo/nearest-province';
import { version } from '../../../../package.json';

const PROVINCIAS = [
  'NACIONAL',
  'A Coruña',
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Baleares',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ceuta',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Girona',
  'Granada',
  'Guadalajara',
  'Guipúzcoa',
  'Huelva',
  'Huesca',
  'Jaén',
  'La Rioja',
  'Las Palmas',
  'León',
  'Lleida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Murcia',
  'Navarra',
  'Ourense',
  'Palencia',
  'Pontevedra',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza',
];

@Component({
  selector: 'app-comparador',
  imports: [ScrollingModule, RouterLink, DatePipe, ProvinceSelect, SearchInput, ResultRow],
  templateUrl: './comparador.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-tique-counter font-sans',
  },
})
export class Comparador {
  private supabaseService = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);

  searchQuery = signal<string>('');
  selectedProvincia = signal<string>('NACIONAL');
  provincias = PROVINCIAS;
  readonly appVersion = version;

  // Debounced view of searchQuery: the search only fires 300 ms after the user
  // stops typing, so we don't hit Supabase on every keystroke. The raw
  // searchQuery still drives the input value for instant feedback.
  private debouncedQuery = toSignal(toObservable(this.searchQuery).pipe(debounceTime(300)), {
    initialValue: '',
  });

  // Fecha impresa en la cabecera del tique; se fija una vez por render, no se
  // evalúa en la plantilla (ver docs/README.md, regla sobre `new Date()`).
  readonly today = new Date();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('provincia');
      if (stored && PROVINCIAS.includes(stored)) {
        this.selectedProvincia.set(stored);
      }
    }

    // Effect to persist province changes
    effect(() => {
      const prov = this.selectedProvincia();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('provincia', prov);
      }
    });
  }

  // Define resource for fetching data
  searchResults = resource<ArticuloResult[], { query: string; provincia: string }>({
    params: () => ({ query: this.debouncedQuery(), provincia: this.selectedProvincia() }),
    loader: async ({ params, abortSignal }) => {
      const query = params.query.trim();
      if (query.length < 2) return [];

      const results = await this.supabaseService.searchArticulos(query, abortSignal);
      return results
        .filter((r) => r.provincia === params.provincia || r.provincia === 'NACIONAL')
        .sort((a, b) => a.precio_por_unidad - b.precio_por_unidad);
    },
  });

  // Feedback for the "use my location" button, announced via aria-live.
  locationStatus = signal<string>('');

  // Only runs when the user presses the button (never on load). The province
  // is resolved locally from a coarse position, so coordinates are not sent
  // to any third party.
  locateProvince() {
    if (!isPlatformBrowser(this.platformId) || !('geolocation' in navigator)) {
      this.locationStatus.set('Tu navegador no permite obtener la ubicación.');
      return;
    }
    this.locationStatus.set('Buscando tu provincia…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const provincia = nearestProvince(position.coords.latitude, position.coords.longitude);
        if (provincia) {
          this.selectedProvincia.set(provincia);
          this.locationStatus.set(`Provincia aproximada: ${provincia}.`);
        } else {
          this.locationStatus.set('No pareces estar en España; elige la provincia a mano.');
        }
      },
      () => this.locationStatus.set('No se pudo obtener la ubicación; elige la provincia a mano.'),
      { enableHighAccuracy: false, maximumAge: 600_000, timeout: 10_000 },
    );
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
}
