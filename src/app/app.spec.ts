import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { version } from '../../package.json';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Perro Sanxe Comparator');
  });

  it('should render the package version outside the ticket', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const versionLabel = compiled.querySelector<HTMLElement>('[aria-label^="Versión"]');

    expect(versionLabel?.textContent?.trim()).toBe(`v${version}`);
    expect(versionLabel?.closest('.tique-paper')).toBeNull();
  });
});
