import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'hello', component: HelloComponent, canActivate: [authGuard] }
];
