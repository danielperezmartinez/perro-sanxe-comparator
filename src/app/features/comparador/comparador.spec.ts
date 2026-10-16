import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Comparador } from './comparador';
import { version } from '../../../../package.json';

describe('Comparador', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparador],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Comparador);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(Comparador);
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
      const fixture = TestBed.createComponent(Comparador);
      await fixture.whenStable();
      expect(getCurrentPosition).not.toHaveBeenCalled();
    });

    it('resolves the province locally after pressing the button', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const fixture = TestBed.createComponent(Comparador);
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

  it('links to the legal notice and the privacy policy', async () => {
    const fixture = TestBed.createComponent(Comparador);
    await fixture.whenStable();
    const hrefs = [...fixture.nativeElement.querySelectorAll('nav a')].map((a: HTMLAnchorElement) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual(['/aviso-legal', '/privacidad']);
  });

  it('should render the package version outside the ticket', async () => {
    const fixture = TestBed.createComponent(Comparador);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const versionLabel = compiled.querySelector<HTMLElement>('[aria-label^="Versión"]');

    expect(versionLabel?.textContent?.trim()).toBe(`v${version}`);
    expect(versionLabel?.closest('.tique-paper')).toBeNull();
  });
});
