import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuisineType, Restaurant, RestaurantSearch, RestaurantStatus } from '../../interfaces/restaurant.interface';
import { RestaurantService } from '../../services/restaurant.service';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { UserService } from '../../services/user.service';
import { SavorlyRole } from '../../interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';

@Component({
	selector: 'app-restaurants',
	templateUrl: './restaurants.component.html',
	styleUrls: ['./restaurants.component.css'],
	imports: [MaterialModule, CommonDirectivesModule, RouterModule, FormsModule, CapitalizePipe],
})
export class RestaurantsComponent implements OnInit {
	restaurants: Restaurant[] = [];
	Role = SavorlyRole;
	isLoading = false;
	reservationFilterOpen = false;
	minDate: Date;

	availableTimes = [
		'10:00 AM',
		'10:30 AM',
		'11:00 AM',
		'11:30 AM',
		'12:00 PM',
		'12:30 PM',
		'1:00 PM',
		'1:30 PM',
		'2:00 PM',
		'2:30 PM',
		'3:00 PM',
		'3:30 PM',
		'4:00 PM',
		'4:30 PM',
		'5:00 PM',
		'5:30 PM',
		'6:00 PM',
		'6:30 PM',
		'7:00 PM',
		'7:30 PM',
		'8:00 PM',
		'8:30 PM',
		'9:00 PM',
		'9:30 PM',
		'10:00 PM',
		'10:30 PM',
		'11:00 PM',
		'11:30 PM',
	];

	filters: RestaurantSearch = {
		status: RestaurantStatus.PUBLIC, // Default filter
	};

	statusOptions = Object.values(RestaurantStatus).filter(value => typeof value === 'string');
	cuisineOptions = Object.values(CuisineType).filter(value => typeof value === 'string');
	cityOptions: string[] = [];

	constructor(
		private restaurantService: RestaurantService,
		private snackBar: MatSnackBar,
		private userService: UserService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.minDate = new Date();
	}

	ngOnInit(): void {
		this.loadRestaurants();
	}

	hasRole(role: SavorlyRole): boolean {
		return this.userService.hasRole(role);
	}

	loadRestaurants(): void {
		if (!this.hasRole(this.Role.ADMIN)) {
			this.filters.status = RestaurantStatus.PUBLIC;
		}

		this.isLoading = true;
		this.restaurantService.getRestaurants(this.filters).subscribe({
			next: response => {
				this.restaurants = response.body || [];
				this.cityOptions = [...new Set(this.restaurants.map(r => r.city))].sort();
				this.isLoading = false;
			},
			error: err => {
				this.snackBar.open('Error loading restaurants', 'Close', { duration: 3000 });
				this.isLoading = false;
			},
		});
	}

	onFilterChange(): void {
		this.loadRestaurants();
	}

	resetFilters(): void {
		this.filters = { status: RestaurantStatus.PUBLIC };
		this.loadRestaurants();
	}

	goTo(restaurant: Restaurant) {
		this.router.navigate([`/restaurants/${restaurant.id}`]);
	}

	makeReservation(restaurant: Restaurant): void {
		if (restaurant && restaurant.status === 'PUBLIC') {
			const dialogRef = this.dialog.open(ReservationDialogComponent, {
				width: '1000px',
				height: '600px',
				data: {
					restaurantId: restaurant.id,
				},
			});

			dialogRef.afterClosed().subscribe((result: any) => {
				if (result) {
					this.snackBar.open('Succesfully made reservation', 'Close', { duration: 3000 });
				} else {
					this.snackBar.open('Error making reservation', 'Close', { duration: 3000 });
				}
			});
		} else {
			this.snackBar.open('Reservations are only available for public restaurants', 'Close', { duration: 3000 });
		}
	}
}
