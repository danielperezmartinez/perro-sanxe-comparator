import { TestBed } from '@angular/core/testing';
import { ProvinceSelect } from './province-select';

describe('ProvinceSelect', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinceSelect],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProvinceSelect);
    fixture.componentRef.setInput('provincias', ['NACIONAL', 'Madrid']);
    fixture.componentRef.setInput('selected', 'NACIONAL');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits provinciaChange when the selection changes', () => {
    const fixture = TestBed.createComponent(ProvinceSelect);
    fixture.componentRef.setInput('provincias', ['NACIONAL', 'Madrid']);
    fixture.componentRef.setInput('selected', 'NACIONAL');
    fixture.detectChanges();

    const emitted: string[] = [];
    fixture.componentInstance.provinciaChange.subscribe((value: string) => emitted.push(value));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Madrid';
    select.dispatchEvent(new Event('change'));

    expect(emitted).toEqual(['Madrid']);
  });
});
