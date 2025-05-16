import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuisineType, Restaurant, RestaurantModification, RestaurantStatus } from '../../interfaces/restaurant.interface';
import { SavorlyRole, SavorlyUser } from '../../interfaces/user.interface';
import { RestaurantService } from '../../services/restaurant.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { Router } from '@angular/router';

@Component({
	selector: 'app-restaurant-settings',
	imports: [MaterialModule, CommonDirectivesModule, FormsModule, CapitalizePipe],
	templateUrl: './restaurant-settings.component.html',
	styleUrl: './restaurant-settings.component.css',
})
export class RestaurantSettingsComponent implements OnInit {
	@Input() restaurant!: Restaurant;

	workers: SavorlyUser[] = [];
	restaurantForm: FormGroup;
	newWorkerUsername: string = '';
	cuisineTypes = CuisineType;
	isRejected = false;

	constructor(
		private userService: UserService,
		private restaurantService: RestaurantService,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private router: Router
	) {
		this.restaurantForm = this.formBuilder.group({
			isPublic: [false],
			openTime: [''],
			closeTime: [''],
			cuisineType: [''],
			description: [''],
			address: [''],
			phone: [''],
			city: [''],
			country: [''],
		});
	}

	ngOnInit() {
		if (this.restaurant.status === RestaurantStatus.REJECTED) this.isRejected = true;
		this.loadWorkers();
		this.initializeForm();
	}

	initializeForm() {
		if (this.restaurant) {
			this.restaurantForm.patchValue({
				isPublic: this.restaurant.status === RestaurantStatus.PUBLIC,
				openTime: this.restaurant.openTime,
				closeTime: this.restaurant.closeTime,
				cuisineType: this.restaurant.cuisineType,
				description: this.restaurant.description || '',
				address: this.restaurant.address,
				phone: this.restaurant.phone || '',
				city: this.restaurant.city,
				country: this.restaurant.country,
			});
		}
	}

	loadWorkers() {
		if (this.restaurant) {
			this.userService
				.getUsers({
					restaurantId: this.restaurant.id,
				})
				.subscribe({
					next: response => {
						this.workers = response.body || [];
					},
					error: () => {
						this.snackBar.open('Failed to load workers', 'Close', { duration: 3000 });
					},
				});
		}
	}

	isAdmin(user: SavorlyUser) {
		return user.role === SavorlyRole.RESTAURANT_ADMIN;
	}

	addWorker() {
		if (this.newWorkerUsername && this.restaurant) {
			const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: '350px',
				data: {
					title: 'Add Worker',
					message: `Are you sure you want to add "${this.newWorkerUsername}" as a worker?`,
					confirmButtonText: 'Add',
				},
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.userService.addWorker(this.newWorkerUsername, this.restaurant.id).subscribe({
						next: () => {
							this.snackBar.open('Worker added successfully', 'Close', { duration: 3000 });
							this.loadWorkers();
							this.newWorkerUsername = '';
						},
						error: () => {
							this.snackBar.open('Failed to add worker', 'Close', { duration: 3000 });
						},
					});
				}
			});
		}
	}

	removeWorker(username: string) {
		if (this.restaurant) {
			const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: '350px',
				data: {
					title: 'Remove Worker',
					message: `Are you sure you want to remove this worker?`,
					confirmButtonText: 'Remove',
				},
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.userService.removeWorker(username, this.restaurant.id).subscribe({
						next: () => {
							this.snackBar.open('Worker removed successfully', 'Close', { duration: 3000 });
							this.loadWorkers();
						},
						error: () => {
							this.snackBar.open('Failed to remove worker', 'Close', { duration: 3000 });
						},
					});
				}
			});
		}
	}

	saveRestaurantChanges() {
		if (this.restaurant) {
			const modifications: RestaurantModification = {};

			if (!this.isRejected) {
				const isPublic = this.restaurantForm.get('isPublic')?.value;
				modifications.status = isPublic ? RestaurantStatus.PUBLIC : RestaurantStatus.PRIVATE;
			} else {
				modifications.status = RestaurantStatus.REQUESTED;
			}

			Object.keys(this.restaurantForm.controls)
				.filter(key => key !== 'isPublic')
				.forEach(key => {
					const control = this.restaurantForm.get(key);
					if (control && control.dirty) {
						(modifications as any)[key] = control.value;
					}
				});

			this.restaurantService.updateRestaurant(this.restaurant.id, modifications).subscribe({
				next: () => {
					this.snackBar.open('Restaurant updated successfully', 'Close', { duration: 3000 });
					this.initializeForm();
					if (this.isRejected) this.reloadCurrentRoute();
				},
				error: () => {
					this.snackBar.open('Failed to update restaurant', 'Close', { duration: 3000 });
				},
			});
		}
	}

	reloadCurrentRoute() {
		let currentUrl = this.router.url;
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			this.router.navigate([currentUrl]);
		});
	}

	deleteRestaurant() {
		if (this.restaurant) {
			const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: '350px',
				data: {
					title: 'Delete Restaurant',
					message: `Are you sure you want to delete your restaurant?`,
					confirmButtonText: 'Delete',
				},
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.restaurantService.deleteRestaurant(this.restaurant.id).subscribe({
						next: () => {
							this.snackBar.open('Restaurant deleted successfully', 'Close', { duration: 3000 });
						},
						error: () => {
							this.snackBar.open('Failed to delete restaurant', 'Close', { duration: 3000 });
						},
					});
				}
			});
		}
	}
}
