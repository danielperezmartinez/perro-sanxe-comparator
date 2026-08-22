import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Los tests de componentes no pasan por app.config.ts (que registra este
// locale para el bootstrap real), así que se registra aquí para el runner.
registerLocaleData(localeEs, 'es-ES');
