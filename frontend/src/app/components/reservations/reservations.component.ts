import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation, ReservationSearch } from '../../interfaces/reservation.interface';
import { ReservationService } from '../../services/reservation.service';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-reservations',
	imports: [MaterialModule, CommonDirectivesModule, FormsModule],
	templateUrl: './reservations.component.html',
	styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
	@Input() restaurantId?: number;
	isRestaurant = false;

	displayedColumns: string[] = ['time', 'people', 'name', 'table', 'actions'];
	reservations = new MatTableDataSource<Reservation>([]);
	@ViewChild(MatPaginator) paginator!: MatPaginator;

	usernameFilter = '';
	dateFilter?: Date;

	constructor(
		private reservationService: ReservationService,
		private userService: UserService,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		if (this.restaurantId !== undefined && !isNaN(this.restaurantId)) {
			this.isRestaurant = true;
		} else {
			if (this.userService.userProfile) this.usernameFilter = this.userService.userProfile?.username;
		}
		this.setDisplayedColumns();
		this.loadReservations();
	}

	ngAfterViewInit() {
		this.reservations.paginator = this.paginator;
	}

	setDisplayedColumns(): void {
		this.displayedColumns = ['time', 'people'];

		if (this.isRestaurant) {
			this.displayedColumns.push('user', 'table');
		} else {
			this.displayedColumns.push('restaurant', 'actions');
		}
	}

	loadReservations(): void {
		const request: ReservationSearch = {
			restaurantId: this.restaurantId,
			username: this.usernameFilter,
		};

		if (this.dateFilter) {
			const year = this.dateFilter.getFullYear();
			const month = String(this.dateFilter.getMonth() + 1).padStart(2, '0');
			const day = String(this.dateFilter.getDate()).padStart(2, '0');
			request.date = `${year}-${month}-${day}`;
		}

		this.reservationService.getReservations(request).subscribe({
			next: response => {
				if (response.body) {
					this.reservations.data = response.body;
					this.sortReservationsByTime();
				}
			},
			error: err => console.error('Error loading reservations', err),
		});
	}

	sortReservationsByTime(): void {
		this.reservations.data = this.reservations.data.sort((a, b) => {
			return new Date(a.reservationTime).getTime() - new Date(b.reservationTime).getTime();
		});
	}

	resetFilters(): void {
		this.dateFilter = undefined;
		this.usernameFilter = '';
		this.loadReservations();
	}

	onDateChange(event: MatDatepickerInputEvent<Date>) {
		this.dateFilter = event.value || undefined;
		this.loadReservations();
	}

	cancelReservation(reservationId: number): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Cancel Reservation',
				message: `Are you sure you want to cancel your reservation?`,
				confirmButtonText: 'Yes',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.reservationService.cancelReservation(reservationId).subscribe({
					next: () => {
						this.loadReservations();
					},
					error: err => {
						this.snackBar.open('Failed to cancel reservation', 'Close', {
							duration: 3000,
						});
					},
				});
			}
		});
	}
}
