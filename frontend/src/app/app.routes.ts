import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';
import { authGuard } from './guards/auth.guard';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';

export const routes: Routes = [
  { path: 'hello', component: HelloComponent, canActivate: [authGuard] },
  { 
    path: 'restaurants', 
    component: RestaurantsComponent, 
    title: 'All Restaurants | Savorly', 
    canActivate: [authGuard] }
];
