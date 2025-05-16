import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-table-dialog',
	imports: [MaterialModule, CommonDirectivesModule],
	templateUrl: './table-dialog.component.html',
	styleUrls: ['./table-dialog.component.scss'],
})
export class TableDialogComponent {
	tableForm: FormGroup;

	constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TableDialogComponent>) {
		this.tableForm = this.fb.group(
			{
				minPeople: [1, [Validators.required, Validators.min(1)]],
				maxPeople: [2, [Validators.required, Validators.min(1)]],
			},
			{ validators: this.capacityValidator }
		);
	}

	capacityValidator(form: FormGroup) {
		const minPeople = form.get('minPeople')?.value;
		const maxPeople = form.get('maxPeople')?.value;

		if (minPeople && maxPeople && minPeople > maxPeople) {
			return { invalidCapacity: true };
		}

		return null;
	}

	onSubmit(): void {
		if (this.tableForm.valid) {
			this.dialogRef.close(this.tableForm.value);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}
