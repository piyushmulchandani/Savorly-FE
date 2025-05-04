import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategory, ProductCreation } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { MaterialModule } from '../../shared/material.module';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
	selector: 'app-product-dialog',
	imports: [MaterialModule, ReactiveFormsModule, FormsModule, CommonModule, CapitalizePipe],
	templateUrl: './product-dialog.component.html',
	styleUrl: './product-dialog.component.css',
})
export class ProductDialogComponent {
	productForm: FormGroup;
	isSubmitting = false;

	constructor(
		private fb: FormBuilder,
		private productService: ProductService,
		public dialogRef: MatDialogRef<ProductDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { restaurantId: number; productCategories: ProductCategory[] }
	) {
		this.productForm = this.fb.group({
			name: ['', Validators.required],
			category: ['', Validators.required],
			price: ['', [Validators.required, Validators.min(0.01)]],
		});
	}

	onSubmit(): void {
		if (this.productForm.valid) {
			this.isSubmitting = true;
			const productData: ProductCreation = {
				restaurantId: this.data.restaurantId,
				name: this.productForm.get('name')?.value,
				category: this.productForm.get('category')?.value,
				price: this.productForm.get('price')?.value,
			};

			this.productService.createProduct(productData).subscribe({
				next: response => {
					this.dialogRef.close(response);
				},
				error: error => {
					console.error('Error creating product:', error);
					this.isSubmitting = false;
				},
			});
		}
	}
}
