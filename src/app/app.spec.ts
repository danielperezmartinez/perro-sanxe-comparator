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

  describe('location', () => {
    let getCurrentPosition: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      getCurrentPosition = vi.fn((ok: PositionCallback) =>
        ok({ coords: { latitude: 39.47, longitude: -0.38 } } as GeolocationPosition),
      );
      vi.stubGlobal('navigator', { ...navigator, geolocation: { getCurrentPosition } });
      localStorage.clear();
    });

    afterEach(() => vi.unstubAllGlobals());

    it('does not ask for the location on load', async () => {
      const fixture = TestBed.createComponent(App);
      await fixture.whenStable();
      expect(getCurrentPosition).not.toHaveBeenCalled();
    });

    it('resolves the province locally after pressing the button', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const fixture = TestBed.createComponent(App);
      await fixture.whenStable();

      const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLElement) =>
        b.textContent?.includes('Usar mi ubicación'),
      ) as HTMLButtonElement;
      button.click();
      await fixture.whenStable();

      expect(getCurrentPosition).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.selectedProvincia()).toBe('Valencia');
      expect(fetchSpy).not.toHaveBeenCalled();
    });
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
