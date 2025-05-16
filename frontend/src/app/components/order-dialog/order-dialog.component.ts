import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderType, OrderCreation } from '../../interfaces/order.interface';
import { Product, ProductCategory, ProductSearch } from '../../interfaces/product.interface';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { TableService } from '../../services/table.service';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
	selector: 'app-order-dialog',
	imports: [MaterialModule, CommonDirectivesModule, CapitalizePipe],
	templateUrl: './order-dialog.component.html',
	styleUrl: './order-dialog.component.css',
})
export class OrderDialogComponent implements OnInit {
	orderForm!: FormGroup;
	availableProducts: Product[] = [];
	selectedProducts: Product[] = [];
	orderTypes = Object.values(OrderType).filter(value => typeof value === 'string');
	tableNumbers: number[] = [];
	isLoadingTables = false;
	isLoadingProducts = false;
	categories = Object.values(ProductCategory).filter(value => typeof value === 'string');
	filteredProducts: Product[] = [];
	selectedCategory: string = '';

	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<OrderDialogComponent>,
		private orderService: OrderService,
		private productService: ProductService,
		private tableService: TableService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: { restaurantId: number; tableNumber?: number }
	) {}

	ngOnInit(): void {
		this.orderForm = this.fb.group({
			tableNumber: [this.data.tableNumber || '', [Validators.required]],
			type: [OrderType.RESTAURANT, [Validators.required]],
			productIds: this.fb.array([], [Validators.required, Validators.minLength(1)]),
		});

		if (this.data.tableNumber) {
			this.orderForm.get('tableNumber')?.disable();
		} else {
			this.loadTableNumbers();
		}

		this.loadProducts();
	}

	get productIdsFormArray(): FormArray {
		return this.orderForm.get('productIds') as FormArray;
	}

	loadTableNumbers(): void {
		this.isLoadingTables = true;
		this.tableService.getTables({ restaurantId: this.data.restaurantId, occupied: true }).subscribe({
			next: response => {
				if (response.body) {
					this.tableNumbers = response.body.map(table => table.tableNumber);
				}
				this.isLoadingTables = false;
			},
			error: err => {
				console.error('Error loading tables', err);
				this.isLoadingTables = false;
				this.snackBar.open('Failed to load tables', 'Close', {
					duration: 3000,
					panelClass: ['error-snackbar'],
				});
			},
		});
	}

	loadProducts(): void {
		this.isLoadingProducts = true;
		const request: ProductSearch = {
			restaurantId: this.data.restaurantId,
		};

		this.productService.getProducts(request).subscribe({
			next: response => {
				if (response.body) {
					this.availableProducts = response.body;
					this.filteredProducts = [...this.availableProducts];
				}
				this.isLoadingProducts = false;
			},
			error: err => {
				console.error('Error loading products', err);
				this.isLoadingProducts = false;
				this.snackBar.open('Failed to load products', 'Close', {
					duration: 3000,
					panelClass: ['error-snackbar'],
				});
			},
		});
	}

	filterByCategory(category: string): void {
		this.selectedCategory = category;

		if (category === '') {
			this.filteredProducts = [...this.availableProducts];
		} else {
			this.filteredProducts = this.availableProducts.filter(product => product.category === category);
		}
	}

	toggleProduct(product: Product): void {
		const index = this.selectedProducts.findIndex(p => p.id === product.id);

		if (index === -1) {
			this.selectedProducts.push(product);
			this.productIdsFormArray.push(this.fb.control(product.id));
		}
	}

	isProductSelected(product: Product): boolean {
		return this.selectedProducts.some(p => p.id === product.id);
	}

	getTotalPrice(): number {
		return this.selectedProducts.reduce((sum, product) => sum + product.price, 0);
	}

	getProductCount(product: Product): number {
		return this.productIdsFormArray.controls.filter(control => control.value === product.id).length;
	}

	addAnotherProduct(product: Product): void {
		this.selectedProducts.push(product);
		this.productIdsFormArray.push(this.fb.control(product.id));
	}

	removeOneProduct(product: Product): void {
		const index = this.selectedProducts.findIndex(p => p.id === product.id);

		if (index !== -1) {
			this.selectedProducts.splice(index, 1);
			const formArrayIndex = this.productIdsFormArray.controls.findIndex(control => control.value === product.id);

			if (formArrayIndex !== -1) {
				this.productIdsFormArray.removeAt(formArrayIndex);
			}
		}
	}

	onSubmit(): void {
		if (this.orderForm.valid) {
			const formValue = this.orderForm.getRawValue();

			const order: OrderCreation = {
				restaurantId: this.data.restaurantId,
				tableNumber: formValue.tableNumber,
				type: formValue.type,
				productIds: formValue.productIds,
			};

			this.orderService.createOrder(order).subscribe({
				next: () => {
					this.snackBar.open('Order created successfully', 'Close', {
						duration: 3000,
					});
					this.dialogRef.close(true);
				},
				error: err => {
					console.error('Error creating order', err);
					this.snackBar.open('Failed to create order', 'Close', {
						duration: 3000,
						panelClass: ['error-snackbar'],
					});
				},
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
