import { Component, OnInit } from '@angular/core';
import { SavorlyRole, SavorlyUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { CommonModule } from '@angular/common';
import { catchError, of, finalize } from 'rxjs';
import { Restaurant, RestaurantModification, RestaurantStatus } from '../../interfaces/restaurant.interface';
import { RestaurantService } from '../../services/restaurant.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { ProductService } from '../../services/product.service';
import { Product, ProductCategory, ProductSearch } from '../../interfaces/product.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RejectRestaurantDialogComponent } from '../reject-restaurant-dialog/reject-restaurant-dialog.component';

@Component({
	selector: 'app-restaurant-view',
	standalone: true,
	imports: [MaterialModule, CommonDirectivesModule, CommonModule, CapitalizePipe],
	templateUrl: './restaurant-view.component.html',
	styleUrl: './restaurant-view.component.css',
})
export class RestaurantViewComponent implements OnInit {
	currentUser: SavorlyUser | undefined;
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
		private dialog: MatDialog,
		private domSanitizer: DomSanitizer
	) {
		this.restaurantId = Number(this.router.url.split('/').pop());
	}

	ngOnInit(): void {
		// Get current user
		this.currentUser = this.userService.userProfile;

		// Load restaurant information
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

					// Redirect if restaurant is PRIVATE and user has no appropriate permissions
					if (restaurant.status === 'PRIVATE' && !this.isAdminOrRestaurantAdmin()) {
						this.router.navigate(['/restaurants']);
						this.snackBar.open('This restaurant is private and cannot be accessed', 'Close', { duration: 3000 });
					}
				}
				this.loading = false;
			},
			error: err => {
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
			error: err => {
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

	// Check if user can view the restaurant based on its status
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
		if (!this.currentUser || !this.restaurant) return false;
		if (this.currentUser.role === SavorlyRole.ADMIN) return true;

		if (
			(this.currentUser.role === SavorlyRole.RESTAURANT_ADMIN || this.currentUser.role === SavorlyRole.RESTAURANT_WORKER) &&
			this.currentUser.restaurant?.id === this.restaurant.id
		) {
			return true;
		}

		return false;
	}

	isAdmin(): boolean {
		if (!this.currentUser) return false;
		return this.currentUser.role === SavorlyRole.ADMIN;
	}

	isAdminOrRestaurantAdmin(): boolean {
		if (!this.currentUser || !this.restaurant) return false;

		if (this.currentUser.role === SavorlyRole.ADMIN) {
			return true;
		}

		if (this.currentUser.role === SavorlyRole.RESTAURANT_ADMIN && this.currentUser.restaurant?.id === this.restaurant.id) {
			return true;
		}

		return false;
	}

	canAccessSettings(): boolean {
		if (!this.currentUser || !this.restaurant) return false;
		return this.isAdminOrRestaurantAdmin();
	}

	canManageProducts(): boolean {
		if (!this.currentUser || !this.restaurant) return false;
		return this.isAdminOrRestaurantAdmin();
	}

	makeReservation(): void {
		// Only allow reservations for public restaurants
		if (this.restaurant && this.restaurant.status === 'PUBLIC') {
			this.router.navigate(['/reservation', this.restaurantId]);
		} else {
			this.snackBar.open('Reservations are only available for public restaurants', 'Close', { duration: 3000 });
		}
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
				confirmButtonColor: 'warn',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				//TODO remove product
			}
		});
	}

	approveRestaurant(): void {
		if (!this.restaurant || !this.isAdmin()) return;

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Approve Restaurant',
				message: `Are you sure you want to approve "${this.restaurant.name}"?`,
				confirmButtonText: 'Approve',
				confirmButtonColor: 'primary',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (this.restaurant && result) {
				this.restaurantService.acceptRestaurant(this.restaurant?.id);
			}
		});
	}

	rejectRestaurant(): void {
		if (!this.restaurant || !this.isAdmin()) return;

		// Open a dialog to get rejection reason
		const rejectDialogRef = this.dialog.open(RejectRestaurantDialogComponent, {
			width: '400px',
			data: {
				restaurantName: this.restaurant.name,
			},
		});

		rejectDialogRef.afterClosed().subscribe(result => {
			if (this.restaurant && result && result.confirmed) {
				this.restaurantService.acceptRestaurant(this.restaurant?.id);
			}
		});
	}

	downloadProof(): void {
		if (!this.restaurant || !this.restaurant.ownershipProofUrl) return;

		// Extract the filename from the URL (or set a default)
		const filename = this.restaurant.ownershipProofUrl.split('/').pop() || 'ownership_proof.pdf';

		// Create a temporary anchor element to trigger download
		const a = document.createElement('a');
		a.href = this.restaurant.ownershipProofUrl;
		a.download = filename;
		a.target = '_blank'; // (Optional) Open in new tab if download fails
		a.click();
	}
}
