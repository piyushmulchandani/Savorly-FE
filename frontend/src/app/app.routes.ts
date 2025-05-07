import { Routes } from '@angular/router';
import { HelloComponent } from './components/hello/hello.component';
import { authGuard } from './guards/auth.guard';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { RestaurantViewComponent } from './components/restaurant-view/restaurant-view.component';
import { ReservationsComponent } from './components/reservations/reservations.component';

export const routes: Routes = [
	{ path: 'hello', component: HelloComponent, canActivate: [authGuard] },
	{
		path: 'restaurants',
		component: RestaurantsComponent,
		title: 'All Restaurants | Savorly',
		canActivate: [authGuard],
	},
	{
		path: 'restaurants/:id',
		component: RestaurantViewComponent,
		title: 'Restaurant | Savorly',
		canActivate: [authGuard],
	},

	{
		path: 'reservations',
		component: ReservationsComponent,
		title: 'Reservations | Savorly',
		canActivate: [authGuard],
	},
];
