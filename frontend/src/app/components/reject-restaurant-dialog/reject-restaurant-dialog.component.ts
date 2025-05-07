import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';

@Component({
	selector: 'app-reject-restaurant-dialog',
	standalone: true,
	imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
	template: `
		<h2 mat-dialog-title>Reject Restaurant</h2>
		<form [formGroup]="rejectionForm" (ngSubmit)="onSubmit()">
			<mat-dialog-content>
				<p>Are you sure you want to reject "{{ data.restaurantName }}"?</p>
				<p>Please provide a reason for rejection:</p>
				<mat-form-field appearance="outline" class="full-width">
					<mat-label>Rejection Reason</mat-label>
					<textarea
						matInput
						formControlName="rejectionMessage"
						rows="4"
						placeholder="Explain why this restaurant is being rejected..."></textarea>
					<mat-error *ngIf="rejectionForm.get('rejectionMessage')?.hasError('required')"> Rejection reason is required </mat-error>
				</mat-form-field>
			</mat-dialog-content>
			<mat-dialog-actions align="end">
				<button mat-button mat-dialog-close>Cancel</button>
				<button mat-raised-button type="submit" [disabled]="rejectionForm.invalid">Reject</button>
			</mat-dialog-actions>
		</form>
	`,
	styles: [
		`
			.full-width {
				width: 100%;
			}
		`,
	],
})
export class RejectRestaurantDialogComponent implements OnInit {
	rejectionForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { restaurantName: string },
		private dialogRef: MatDialogRef<RejectRestaurantDialogComponent>,
		private fb: FormBuilder
	) {
		this.rejectionForm = this.fb.group({
			rejectionMessage: ['', Validators.required],
		});
	}

	ngOnInit(): void {}

	onSubmit(): void {
		if (this.rejectionForm.valid) {
			this.dialogRef.close({
				confirmed: true,
				rejectionMessage: this.rejectionForm.get('rejectionMessage')?.value,
			});
		}
	}
}
