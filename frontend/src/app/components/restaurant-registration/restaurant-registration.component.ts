import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CuisineType } from '../../interfaces/restaurant.interface';
import { SavorlyRole } from '../../interfaces/user.interface';
import { RestaurantService } from '../../services/restaurant.service';
import { UserService } from '../../services/user.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
	selector: 'app-restaurant-registration',
	imports: [MaterialModule, CommonDirectivesModule, CapitalizePipe],
	templateUrl: './restaurant-registration.component.html',
	styleUrl: './restaurant-registration.component.css',
})
export class RestaurantRegistrationComponent implements OnInit {
	restaurantForm: FormGroup;
	cuisineTypes = Object.values(CuisineType);
	selectedFile: File | null = null;
	isSubmitting = false;

	constructor(
		private fb: FormBuilder,
		private restaurantService: RestaurantService,
		private userService: UserService,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.restaurantForm = this.fb.group({
			name: ['', Validators.required],
			openTime: ['', Validators.required],
			closeTime: ['', Validators.required],
			cuisineType: ['', Validators.required],
			description: [''],
			address: ['', Validators.required],
			phone: [''],
			city: ['', Validators.required],
			country: ['', Validators.required],
			consentToTerms: [false, Validators.requiredTrue],
		});
	}

	ngOnInit(): void {
		if (!this.userService.hasRole(SavorlyRole.USER) && !this.userService.hasRole(SavorlyRole.ADMIN)) {
			this.router.navigate(['/restaurants']);
			this.snackBar.open('You do not have permission to access this page', 'Close', {
				duration: 5000,
			});
		}
	}

	onFileSelected(event: any): void {
		const file: File = event.target.files[0];

		if (file) {
			if (file.type !== 'application/pdf') {
				this.snackBar.open('Please upload a PDF file only', 'Close', {
					duration: 5000,
				});
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				this.snackBar.open('File size should not exceed 5MB', 'Close', {
					duration: 5000,
				});
				return;
			}

			this.selectedFile = file;
		}
	}

	onSubmit(): void {
		if (!this.selectedFile) {
			this.snackBar.open('Please upload proof of restaurant ownership (PDF)', 'Close', {
				duration: 5000,
			});
			return;
		}

		this.isSubmitting = true;
		const restaurantData = this.restaurantForm.value;

		delete restaurantData.consentToTerms;

		this.restaurantService.createRestaurant(restaurantData, this.selectedFile).subscribe({
			next: () => {
				this.isSubmitting = false;
				this.snackBar.open('Restaurant registration request submitted successfully!', 'Close', {
					duration: 5000,
				});
				this.router.navigate(['/']);
			},
			error: error => {
				this.isSubmitting = false;
				this.snackBar.open('Error submitting restaurant registration: ' + (error.message || 'Unknown error'), 'Close', {
					duration: 5000,
				});
			},
		});
	}
}
