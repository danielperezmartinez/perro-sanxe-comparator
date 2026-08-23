import { Component, signal, resource, inject, ChangeDetectionStrategy, PLATFORM_ID, effect } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SupabaseService, ArticuloResult } from './core/services/supabase';
import { ProvinceSelect } from './shared/components/province-select/province-select';
import { SearchInput } from './shared/components/search-input/search-input';
import { ResultRow } from './shared/components/result-row/result-row';

const PROVINCIAS = [
  'NACIONAL', 'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

@Component({
  selector: 'app-root',
  imports: [ScrollingModule, DatePipe, ProvinceSelect, SearchInput, ResultRow],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-tique-counter font-sans',
  },
})
export class App {
  private supabaseService = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);

  searchQuery = signal<string>('');
  selectedProvincia = signal<string>('NACIONAL');
  provincias = PROVINCIAS;

  // Fecha impresa en la cabecera del tique; se fija una vez por render, no se
  // evalúa en la plantilla (ver docs/README.md, regla sobre `new Date()`).
  readonly today = new Date();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('provincia');
      if (stored && PROVINCIAS.includes(stored)) {
        this.selectedProvincia.set(stored);
      } else {
        this.initGeolocation();
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
    params: () => ({ query: this.searchQuery(), provincia: this.selectedProvincia() }),
    loader: async ({ params }) => {
      const { query, provincia } = params;
      if (!query || query.length < 2) return [];

      const results = await this.supabaseService.searchArticulos(query);
      return results
        .filter(r => r.provincia === provincia || r.provincia === 'NACIONAL')
        .sort((a, b) => a.precio_por_unidad - b.precio_por_unidad);
    }
  });

  private async initGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`, {
               headers: { 'User-Agent': 'perro-sanxe-comparator' }
            });
            const data = await res.json();
            let province = data.address?.province || data.address?.county || data.address?.state;

            if (province) {
              // Map Nominatim output to our PROVINCIAS array
              const match = PROVINCIAS.find(p => province.toLowerCase().includes(p.toLowerCase()));
              if (match) {
                this.selectedProvincia.set(match);
              }
            }
          } catch (e) {
            console.error('Error in reverse geocoding', e);
          }
        },
        (error) => {
          console.warn('Geolocation denied or failed', error);
        }
      );
    }
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }
}
