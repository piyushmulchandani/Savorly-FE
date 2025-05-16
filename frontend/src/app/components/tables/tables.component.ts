import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Table, TableSearch } from '../../interfaces/table.interface';
import { TableService } from '../../services/table.service';
import { UserService } from '../../services/user.service';
import { SavorlyRole } from '../../interfaces/user.interface';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-tables',
	imports: [MaterialModule, CommonDirectivesModule, FormsModule],
	templateUrl: './tables.component.html',
	styleUrl: './tables.component.css',
})
export class TablesComponent {
	@Input() restaurantId!: number;
	tables: Table[] = [];
	filterForm!: FormGroup;
	isAdmin = false;
	isLoading = false;

	filters: TableSearch = {
		restaurantId: this.restaurantId,
	};

	constructor(
		private snackBar: MatSnackBar,
		private tableService: TableService,
		private dialog: MatDialog,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.isAdmin =
			this.userService.hasRole(SavorlyRole.ADMIN) ||
			(this.userService.hasRole(SavorlyRole.ADMIN) && this.userService.userProfile?.restaurant?.id === this.restaurantId);

		this.filters.restaurantId = this.restaurantId;

		this.loadTables();
	}

	loadTables(): void {
		this.isLoading = true;
		this.tableService.getTables(this.filters).subscribe({
			next: response => {
				if (response.body) {
					this.tables = response.body.sort((a: { tableNumber: number }, b: { tableNumber: number }) => a.tableNumber - b.tableNumber);
					this.isLoading = false;
				}
			},
			error: err => console.error('Error loading tables', err),
		});
	}

	openCreateTableDialog(): void {
		const dialogRef = this.dialog.open(TableDialogComponent, {
			width: '350px',
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.createTable(result.minPeople, result.maxPeople);
			}
		});
	}

	createTable(minPeople: number, maxPeople: number): void {
		this.tableService
			.addTable({
				restaurantId: this.restaurantId,
				minPeople,
				maxPeople,
			})
			.subscribe(() => {
				this.loadTables();
			});
	}

	removeTable(): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '350px',
			data: {
				title: 'Remove Table',
				message: `Are you sure you want to remove a table?`,
				confirmButtonText: 'Remove',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.tableService.removeTable(this.restaurantId).subscribe({
					next: () => {
						this.loadTables();
					},
					error: err => {
						this.snackBar.open('Failed to remove table', 'Close', {
							duration: 3000,
						});
					},
				});
			}
		});
	}

	viewTable(tableId: number): void {
		const URL = '/restaurants/' + this.restaurantId + '/tables/' + tableId;
		this.router.navigate([URL]);
	}

	getStatusClass(occupied: boolean): string {
		return occupied ? 'occupied' : 'free';
	}

	clearFilters(): void {
		this.filterForm.reset({
			tableNumber: '',
			occupied: null,
			numPeople: '',
		});
		this.loadTables();
	}
}
