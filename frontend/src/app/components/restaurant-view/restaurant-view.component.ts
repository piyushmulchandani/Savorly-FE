import { Component, OnInit } from '@angular/core';
import { SavorlyRole, SavorlyUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { CommonModule } from '@angular/common';
import { Restaurant, RestaurantStatus } from '../../interfaces/restaurant.interface';
import { RestaurantService } from '../../services/restaurant.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory, ProductSearch } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RejectRestaurantDialogComponent } from '../reject-restaurant-dialog/reject-restaurant-dialog.component';
import { ReservationsComponent } from '../reservations/reservations.component';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { TablesComponent } from '../tables/tables.component';
import { OrdersComponent } from '../orders/orders.component';
import { RestaurantSettingsComponent } from '../restaurant-settings/restaurant-settings.component';

@Component({
	selector: 'app-restaurant-view',
	standalone: true,
	imports: [
		MaterialModule,
		CommonDirectivesModule,
		CommonModule,
		CapitalizePipe,
		ReservationsComponent,
		TablesComponent,
		OrdersComponent,
		RestaurantSettingsComponent,
	],
	templateUrl: './restaurant-view.component.html',
	styleUrl: './restaurant-view.component.css',
})
export class RestaurantViewComponent implements OnInit {
	restaurant: Restaurant | undefined;
	restaurantId: number | undefined;
	statuses = RestaurantStatus;
	loading = true;
	products: Product[] = [];
	productsByCategory: { [category: string]: Product[] } = {};
	loadingProducts = true;
	productCategories = Object.values(ProductCategory);

	constructor(
		private snackBar: MatSnackBar,
		private userService: UserService,
		private restaurantService: RestaurantService,
		private productService: ProductService,
		private router: Router,
		private dialog: MatDialog
	) {
		this.restaurantId = Number(this.router.url.split('/').pop());
	}

	ngOnInit(): void {
		if (this.restaurantId !== undefined && !isNaN(this.restaurantId)) {
			this.loadRestaurantData();
			this.loadProducts();
		} else {
			console.error('Invalid restaurant ID:', this.restaurantId);
			this.loading = false;
		}
	}

	loadRestaurantData(): void {
		this.restaurantService.getRestaurantById(Number(this.restaurantId)).subscribe({
			next: (restaurant: Restaurant | undefined) => {
				if (restaurant) {
					this.restaurant = restaurant;

					if (restaurant.status === 'PRIVATE' && !this.isAdminOrRestaurantAdmin()) {
						this.router.navigate(['/restaurants']);
						this.snackBar.open('This restaurant is private and cannot be accessed', 'Close', { duration: 3000 });
					}
				}
				this.loading = false;
			},
			error: () => {
				this.snackBar.open('Error loading restaurant', 'Close', { duration: 3000 });
				this.loading = false;
			},
		});
	}

	loadProducts(): void {
		if (this.restaurantId === undefined) return;
		this.loadingProducts = true;
		const productSearch: ProductSearch = {
			restaurantId: this.restaurantId,
		};

		this.productService.getProducts(productSearch).subscribe({
			next: response => {
				this.products = response.body || [];
				this.categorizeProducts();
			},
			error: () => {
				this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
				this.loadingProducts = false;
			},
		});
	}

	categorizeProducts(): void {
		this.productsByCategory = {};

		this.products.forEach(product => {
			const category = product.category;
			if (!this.productsByCategory[category]) {
				this.productsByCategory[category] = [];
			}
			this.productsByCategory[category].push(product);
		});

		this.loadingProducts = false;
	}

	hasStatus(status: RestaurantStatus): boolean {
		return this.restaurant?.status === status;
	}

	canViewRestaurant(): boolean {
		if (!this.restaurant) return false;

		if (this.restaurant.status === 'PUBLIC') {
			return true;
		}

		if (this.restaurant.status === 'PRIVATE') {
			return this.isAdminOrRestaurantAdmin();
		}

		if (this.restaurant.status === 'REQUESTED') {
			return this.isAdminOrRestaurantAdmin();
		}

		return false;
	}

	isRestaurantStaff(): boolean {
		if (!this.restaurant) return false;
		if (this.userService.hasRole(SavorlyRole.ADMIN)) return true;

		if (
			(this.userService.hasRole(SavorlyRole.RESTAURANT_ADMIN) || this.userService.hasRole(SavorlyRole.RESTAURANT_WORKER)) &&
			this.userService.userProfile?.restaurant?.id === this.restaurant.id
		) {
			return true;
		}

		return false;
	}

	isAdmin(): boolean {
		return this.userService.hasRole(SavorlyRole.ADMIN);
	}

	isAdminOrRestaurantAdmin(): boolean {
		if (!this.restaurant) return false;

		if (this.userService.hasRole(SavorlyRole.ADMIN)) {
			return true;
		}

		if (this.userService.hasRole(SavorlyRole.RESTAURANT_ADMIN) && this.userService.userProfile?.restaurant?.id === this.restaurant.id) {
			return true;
		}

		return false;
	}

	onImageSelected(event: any) {
		const file: File = event.target.files[0];

		if (file && this.restaurant) {
			if (!this.isValidImageFile(file)) {
				this.snackBar.open('Invalid file type or size', 'Close', { duration: 3000 });
				return;
			}

			this.restaurantService.uploadImage(this.restaurant.id, file).subscribe({
				next: () => {
					this.loadRestaurantData();
				},
				error: () => {
					this.snackBar.open('Failed to upload image', 'Close', { duration: 3000 });
				},
			});
		}
	}

	private isValidImageFile(file: File): boolean {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return false;
		}

		const maxSizeInBytes = 5 * 1024 * 1024;
		if (file.size > maxSizeInBytes) {
			return false;
		}

		return true;
	}

	openNewProductDialog(): void {
		const dialogRef = this.dialog.open(ProductDialogComponent, {
			width: '400px',
			data: {
				restaurantId: this.restaurantId,
				productCategories: this.productCategories,
			},
		});

		dialogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.loadProducts();
			}
		});
	}

	openRemoveProductDialog(productId: number): void {
		if (!this.restaurant) return;

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Remove Product',
				message: `Are you sure you want to remove this product?`,
				confirmButtonText: 'Remove',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.productService.removeProduct(productId).subscribe({
					next: () => {
						this.loadProducts();
					},
					error: err => {
						this.snackBar.open('Failed to delete product', 'Close', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	shouldShowFixedButton(): boolean {
		if (!this.restaurant) return false;

		if (
			this.restaurant.status === RestaurantStatus.PUBLIC &&
			(this.userService.hasRole(SavorlyRole.ADMIN) || this.userService.hasRole(SavorlyRole.USER))
		) {
			return true;
		}

		return false;
	}

	makeReservation(): void {
		if (this.restaurant && this.restaurant.status === 'PUBLIC') {
			const dialogRef = this.dialog.open(ReservationDialogComponent, {
				minWidth: '1000px',
				height: '600px',
				data: {
					restaurantId: this.restaurantId,
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

	approveRestaurant(): void {
		if (!this.restaurant || !this.isAdmin()) return;

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Approve Restaurant',
				message: `Are you sure you want to approve "${this.restaurant.name}"?`,
				confirmButtonText: 'Approve',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (this.restaurant && result) {
				this.restaurantService.acceptRestaurant(this.restaurant?.id).subscribe({
					next: () => {
						this.loadRestaurantData();
					},
					error: err => {
						this.snackBar.open('Failed to approve request', 'Close', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	rejectRestaurant(): void {
		if (!this.restaurant || !this.isAdmin()) return;

		const rejectDialogRef = this.dialog.open(RejectRestaurantDialogComponent, {
			width: '600px',
			data: {
				restaurantName: this.restaurant.name,
			},
		});

		rejectDialogRef.afterClosed().subscribe(result => {
			if (this.restaurant && result && result.confirmed) {
				this.restaurantService.rejectRestaurant(this.restaurant?.id, result.rejectionMessage).subscribe({
					next: () => {
						this.loadRestaurantData();
					},
					error: err => {
						this.snackBar.open('Failed to reject request', 'Close', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	downloadProof(): void {
		if (!this.restaurant || !this.restaurant.ownershipProofUrl) return;

		const filename = this.restaurant.ownershipProofUrl.split('/').pop() || 'ownership_proof.pdf';

		const a = document.createElement('a');
		a.href = this.restaurant.ownershipProofUrl;
		a.download = filename;
		a.target = '_blank';
		a.click();
	}
}
