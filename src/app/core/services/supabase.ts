import { Injectable } from '@angular/core';
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
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key);
  }

  async searchArticulos(query: string): Promise<ArticuloResult[]> {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const { data, error } = await this.supabase
      .rpc('search_articulos_laxo', { search_query: query });

    if (error) {
      console.error('Error searching articulos:', error);
      throw error;
    }

    return data as ArticuloResult[];
  }
}
