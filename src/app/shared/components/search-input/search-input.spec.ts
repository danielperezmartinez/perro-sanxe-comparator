import { TestBed } from '@angular/core/testing';
import { SearchInput } from './search-input';

describe('SearchInput', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SearchInput);
    fixture.componentRef.setInput('value', '');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('emits valueChange when the user types', () => {
    const fixture = TestBed.createComponent(SearchInput);
    fixture.componentRef.setInput('value', '');
    fixture.detectChanges();

    const emitted: string[] = [];
    fixture.componentInstance.valueChange.subscribe((value: string) => emitted.push(value));

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'leche';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toEqual(['leche']);
  });
});
