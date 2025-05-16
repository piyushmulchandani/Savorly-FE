import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take, switchMap } from 'rxjs';
import { Table } from '../../interfaces/table.interface';
import { SavorlyRole } from '../../interfaces/user.interface';
import { TableService } from '../../services/table.service';
import { UserService } from '../../services/user.service';
import { OrdersComponent } from '../orders/orders.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';

@Component({
	selector: 'app-table-view',
	imports: [MaterialModule, CommonDirectivesModule, OrdersComponent],
	templateUrl: './table-view.component.html',
	styleUrl: './table-view.component.css',
})
export class TableViewComponent implements OnInit {
	restaurantId: number;
	tableId: number;
	table: Table | null = null;
	loading = true;
	authorized = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private tableService: TableService,
		private userService: UserService,
		private snackBar: MatSnackBar
	) {
		this.restaurantId = 0;
		this.tableId = 0;
	}

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.restaurantId = +params['restaurantId'];
			this.tableId = +params['tableId'];

			this.checkAuthorization();
		});
	}

	checkAuthorization(): void {
		if (this.userService.hasRole(SavorlyRole.ADMIN)) {
			this.authorized = true;
			this.loadTableData();
			return;
		}

		if (
			(this.userService.hasRole(SavorlyRole.RESTAURANT_ADMIN) || this.userService.hasRole(SavorlyRole.RESTAURANT_WORKER)) &&
			this.userService.userProfile?.restaurant?.id === this.restaurantId
		) {
			this.authorized = true;
			this.loadTableData();
			return;
		}

		if (!this.authorized) this.router.navigate(['/restaurants']);
	}

	loadTableData(): void {
		this.loading = true;

		this.tableService.getTableById(this.tableId).subscribe({
			next: (table: Table | undefined) => {
				if (table) {
					this.table = table;
				}
				this.loading = false;
			},
			error: () => {
				this.loading = false;
				this.snackBar.open('Error loading table data', 'Close', { duration: 3000 });
			},
		});
	}

	occupyTable(): void {
		if (!this.table) return;

		this.tableService
			.occupyTable(this.table.id)
			.pipe(
				take(1),
				switchMap(() => {
					this.snackBar.open('Table occupied successfully', 'Close', { duration: 3000 });
					return this.tableService.getTables({ restaurantId: this.restaurantId });
				})
			)
			.subscribe({
				next: response => {
					const tables = response.body || [];
					this.table = tables.find(t => t.id === this.tableId) || null;
				},
				error: () => {
					this.snackBar.open('Error occupying table', 'Close', { duration: 3000 });
				},
			});
	}

	completeTableService(): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '500px',
			data: {
				title: 'Comlete Table Service',
				message: `Are you sure you want to finish this table's service?`,
				confirmButtonText: 'Confirm',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && this.table) {
				this.tableService.completeTableService(this.table.id).subscribe({
					next: () => {
						this.loadTableData();
					},
					error: () => {
						this.snackBar.open('Error completing table service', 'Close', { duration: 3000 });
					},
				});
			}
		});
	}

	goBack(): void {
		const URL = '/restaurants/' + this.restaurantId;
		this.router.navigate([URL]);
	}

	openOrderDialog(): void {
		if (!this.table) return;

		const dialogRef = this.dialog.open(OrderDialogComponent, {
			minWidth: '80vw',
			data: {
				restaurantId: this.restaurantId,
				tableNumber: this.table.tableNumber,
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.loadTableData();
			}
		});
	}
}
