import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LegalLayout } from './legal-layout';

@Component({
  selector: 'app-privacidad',
  imports: [LegalLayout],
  template: `
    <app-legal-layout heading="Política de privacidad" updated="17-10-2026">
      <h2>Responsable</h2>
      <p>
        Daniel Pérez Martínez ·
        <a href="mailto:dlperezmartinez@gmail.com">dlperezmartinez&#64;gmail.com</a>
      </p>

      <h2>Qué datos se tratan</h2>
      <ul>
        <li>
          <strong>No hay cuentas ni formularios</strong>: no se piden nombre, email ni otros datos
          identificativos.
        </li>
        <li>
          <strong>Provincia elegida</strong>: se guarda en el almacenamiento local de tu navegador
          (<code>localStorage</code>) para recordarla. No sale de tu dispositivo y puedes borrarla
          desde la configuración del navegador.
        </li>
        <li>
          <strong>Ubicación</strong>: solo se usa si pulsas «Usar mi ubicación». La provincia se
          calcula en tu navegador a partir de una posición aproximada; las coordenadas no se envían
          a ningún servidor.
        </li>
        <li>
          <strong>Búsquedas</strong>: el texto que buscas se envía a la base de datos del servicio
          para obtener los resultados.
        </li>
        <li>
          <strong>Datos técnicos de conexión</strong>: como en cualquier web, los proveedores de
          alojamiento registran la dirección IP, el navegador y la hora de cada petición.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Este sitio no usa cookies propias ni de analítica o publicidad. Usa almacenamiento técnico
        del navegador (la provincia y la caché que permite instalar la web como aplicación).
      </p>

      <h2>Finalidad y base jurídica</h2>
      <p>
        Los datos técnicos se tratan para prestar el servicio y mantener su seguridad, sobre la base
        del interés legítimo (art. 6.1.f del RGPD). No se elaboran perfiles ni se toman decisiones
        automatizadas.
      </p>

      <h2>Proveedores que reciben datos</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (alojamiento y red de distribución de la web): datos
          técnicos de conexión. Empresa de EE. UU.; transferencias amparadas en el Marco de
          Privacidad de Datos UE-EE. UU. y cláusulas contractuales tipo.
        </li>
        <li>
          <strong>Supabase Inc.</strong> (base de datos, alojada en la UE, región Irlanda): texto
          de las búsquedas y datos técnicos de conexión.
        </li>
        <li>
          <strong>Google LLC</strong> (Google Fonts, tipografías de la web): tu navegador descarga
          las fuentes de servidores de Google, que recibe tu dirección IP. Empresa de EE. UU.;
          transferencias amparadas en el Marco de Privacidad de Datos UE-EE. UU.
        </li>
      </ul>

      <h2>Conservación</h2>
      <p>
        Los registros técnicos se conservan el tiempo que fija cada proveedor para su
        funcionamiento y seguridad. Este sitio no guarda por su cuenta ningún registro de tus
        búsquedas asociado a ti.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo al email de arriba. Si crees que no se han atendido, puedes
        reclamar ante la Agencia Española de Protección de Datos (<a
          href="https://www.aepd.es"
          rel="noopener"
          >www.aepd.es</a
        >).
      </p>
    </app-legal-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Privacidad {}
