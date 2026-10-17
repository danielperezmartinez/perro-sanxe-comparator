import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Perro Sanxe Comparator',
    loadComponent: () =>
      import('./features/comparador/comparador').then((m) => m.Comparador),
  },
  {
    path: 'aviso-legal',
    title: 'Aviso legal · Perro Sanxe Comparator',
    loadComponent: () => import('./features/legal/aviso-legal').then((m) => m.AvisoLegal),
  },
  {
    path: 'privacidad',
    title: 'Política de privacidad · Perro Sanxe Comparator',
    loadComponent: () => import('./features/legal/privacidad').then((m) => m.Privacidad),
  },
  { path: '**', redirectTo: '' },
];
