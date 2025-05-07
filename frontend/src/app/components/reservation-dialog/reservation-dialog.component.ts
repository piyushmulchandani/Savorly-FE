import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationService } from '../../services/reservation.service';
import { ReservationCreation } from '../../interfaces/reservation.interface';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';

@Component({
	selector: 'app-reservation-dialog',
	imports: [MaterialModule, CommonDirectivesModule],
	templateUrl: './reservation-dialog.component.html',
	styleUrls: ['./reservation-dialog.component.css'],
})
export class ReservationDialogComponent implements OnInit {
	reservationForm: FormGroup;
	username: string | undefined;
	availableTimes: string[] = [];
	selectedTime: string | null = null;
	loading = false;
	today = new Date();

	constructor(
		private fb: FormBuilder,
		private reservationService: ReservationService,
		private userService: UserService,
		private snackBar: MatSnackBar,
		public dialogRef: MatDialogRef<ReservationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { restaurantId: number }
	) {
		this.reservationForm = this.fb.group({
			date: [new Date(), Validators.required],
			people: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
			time: ['', Validators.required],
		});
	}

	ngOnInit(): void {
		this.userService.getProfile().subscribe({
			next: response => {
				this.username = response.username;
			},
		});
	}

	onFilterChange(): void {
		this.availableTimes = [];
	}

	checkAvailability(): void {
		if (this.reservationForm.get('date')?.invalid || this.reservationForm.get('people')?.invalid) return;

		this.loading = true;
		const date = this.formatDate(this.reservationForm.value.date);
		const people = this.reservationForm.value.people;

		this.reservationService.getAvailableTimes(this.data.restaurantId, date, people).subscribe({
			next: times => {
				this.availableTimes = times;
				this.loading = false;
			},
			error: () => {
				this.snackBar.open('Error loading available times', 'Close', { duration: 3000 });
				this.loading = false;
			},
		});
	}

	selectTime(time: string): void {
		this.selectedTime = time;
		this.reservationForm.patchValue({ time });
	}

	isTimeSelected(time: string): boolean {
		return this.selectedTime === time;
	}

	submitReservation(): void {
		if (this.reservationForm.invalid || !this.username) return;

		this.loading = true;

		const reservationData: ReservationCreation = {
			restaurantId: this.data.restaurantId,
			username: this.username,
			date: this.reservationForm.value.date,
			time: this.reservationForm.value.time,
			numPeople: this.reservationForm.value.people,
		};

		this.reservationService.createReservation(reservationData).subscribe({
			next: () => {
				this.snackBar.open('Reservation created!', 'Close', { duration: 3000 });
				this.dialogRef.close(true);
			},
			error: () => {
				this.snackBar.open('Error creating reservation', 'Close', { duration: 3000 });
				this.loading = false;
			},
		});
	}

	private formatDate(date: Date): string {
		return date.toISOString().split('T')[0];
	}
}
