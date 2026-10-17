import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LegalLayout } from './legal-layout';

@Component({
  selector: 'app-aviso-legal',
  imports: [LegalLayout, RouterLink],
  template: `
    <app-legal-layout heading="Aviso legal" updated="17-10-2026">
      <h2>Titular</h2>
      <p>
        Este sitio web es un proyecto personal de <strong>Daniel Pérez Martínez</strong>.
        Contacto: <a href="mailto:dlperezmartinez@gmail.com">dlperezmartinez&#64;gmail.com</a>.
      </p>
      <p>
        Es un proyecto sin ánimo de lucro: no hay publicidad, no se vende nada y no se obtienen
        ingresos de él.
      </p>

      <h2>Objeto</h2>
      <p>
        Perro Sanxe Comparator es una herramienta informativa y gratuita para comparar precios de
        supermercados en España. No hace falta registrarse y no permite comprar.
      </p>

      <h2>Exactitud de los precios</h2>
      <p>
        Los precios se obtienen automáticamente de la información que publican los supermercados y
        se actualizan una vez al día. Son orientativos: pueden no coincidir con el precio en tienda
        o en el momento de la compra, ni con las promociones vigentes. El precio de referencia se
        expresa por kilo, por litro o por unidad según el producto. Consulta siempre el precio
        final en el supermercado.
      </p>

      <h2>Marcas</h2>
      <p>
        Los nombres de supermercados y productos son marcas de sus respectivos titulares. Este
        sitio no está afiliado a ninguno de ellos ni cuenta con su patrocinio. Si representas a
        alguno y quieres que se retire o corrija información, escribe al contacto de arriba.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        El titular no se hace responsable de las decisiones tomadas a partir de la información
        mostrada ni de interrupciones del servicio.
      </p>

      <h2>Datos personales</h2>
      <p>
        Consulta la <a routerLink="/privacidad">política de privacidad</a>.
      </p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvisoLegal {}
