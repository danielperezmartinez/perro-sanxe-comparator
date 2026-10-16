import { TestBed } from '@angular/core/testing';
import { ArticuloResult } from '../../../core/services/supabase';
import { ResultRow } from './result-row';

const ITEM: ArticuloResult = {
  id: '1',
  nombre: 'Leche entera',
  imagen_url: '',
  supermercado: 'Mercadona',
  categoria: 'Lácteos',
  precio: 1.25,
  precio_por_unidad: 1.25,
  provincia: 'NACIONAL',
  ultima_actualizacion: '2026-08-01',
};

describe('ResultRow', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultRow],
    }).compileComponents();
  });

  it('should create and render the item name', () => {
    const fixture = TestBed.createComponent(ResultRow);
    fixture.componentRef.setInput('item', ITEM);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Leche entera');
  });

  it('only applies the separator border when it is not the last row', () => {
    const fixture = TestBed.createComponent(ResultRow);
    fixture.componentRef.setInput('item', ITEM);
    fixture.componentRef.setInput('last', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('border-b')).toBe(false);
  });

  it('shows the lowest reference price stamp only when isBest is true', () => {
    const fixture = TestBed.createComponent(ResultRow);
    fixture.componentRef.setInput('item', ITEM);
    fixture.componentRef.setInput('isBest', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('MENOR €/REF.');

    fixture.componentRef.setInput('isBest', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('MENOR €/REF.');
  });
});
