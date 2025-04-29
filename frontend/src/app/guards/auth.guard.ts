import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  await authService.init();
  
  if (!authService.isAuthenticated()) {
    authService.login();
    return false;
  }
  return true;
};
