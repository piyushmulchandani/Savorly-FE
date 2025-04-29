import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/services/auth.service';
import { appConfig } from './app/app.config';

async function initializeApp() {
  const authService = new AuthService();

  const isInitialized = await authService.init();

  if (isInitialized) {
    const updatedAppConfig = {
      ...appConfig,
      providers: [
        ...(appConfig.providers || []),
        { provide: AuthService, useValue: authService }, 
      ],
    };

    bootstrapApplication(AppComponent, updatedAppConfig).catch((err) => console.error(err));
  } else {
    console.error('Application bootstrap failed: AuthService initialization failed');
  }
}

initializeApp();
