import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface ArticuloResult {
  id: string;
  nombre: string;
  imagen_url: string;
  supermercado: string;
  categoria: string;
  precio: number;
  precio_por_unidad: number;
  provincia: string;
  ultima_actualizacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private platformId = inject(PLATFORM_ID);
  private supabase: SupabaseClient | undefined = isPlatformBrowser(this.platformId)
    ? createClient(environment.supabase.url, environment.supabase.key)
    : undefined;

  async searchArticulos(query: string, signal?: AbortSignal): Promise<ArticuloResult[]> {
    if (!this.supabase || !query || query.trim() === '') {
      return [];
    }

    let request = this.supabase.rpc('search_articulos_laxo', { search_query: query });
    if (signal) {
      // Cancel the in-flight request when a newer search supersedes this one.
      request = request.abortSignal(signal);
    }

    const { data, error } = await request;

    if (error) {
      console.error('Error searching articulos:', error);
      throw error;
    }

    return data as ArticuloResult[];
  }
}
