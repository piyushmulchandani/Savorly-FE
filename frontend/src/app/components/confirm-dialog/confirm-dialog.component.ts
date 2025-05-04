import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';

@Component({
	selector: 'app-confirm-dialog',
	standalone: true,
	imports: [CommonModule, MaterialModule],
	template: `
		<h2 mat-dialog-title>{{ data.title }}</h2>
		<mat-dialog-content>
			<p>{{ data.message }}</p>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button mat-dialog-close>Cancel</button>
			<button mat-raised-button [color]="data.confirmButtonColor" [mat-dialog-close]="true">
				{{ data.confirmButtonText || 'Confirm' }}
			</button>
		</mat-dialog-actions>
	`,
})
export class ConfirmDialogComponent {
	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: {
			title: string;
			message: string;
			confirmButtonText?: string;
			confirmButtonColor?: 'primary' | 'accent' | 'warn';
		}
	) {}
}
