import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order, OrderType, OrderSearch } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'app-orders',
	imports: [MaterialModule, CommonDirectivesModule, CapitalizePipe, FormsModule],
	templateUrl: './orders.component.html',
	styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
	@Input() restaurantId!: number;
	@Input() tableId?: number;
	@Input() tableNumber?: number;

	orders: Order[] = [];
	orderTypes = Object.values(OrderType).filter(value => typeof value === 'string');
	isTable = false;
	isLoading = false;
	private intervalId: any;

	filters: OrderSearch = {
		restaurantId: this.restaurantId,
		completed: false,
	};

	constructor(private orderService: OrderService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.filters = {
			restaurantId: this.restaurantId,
			completed: false,
		};

		if (this.tableId !== undefined && !isNaN(this.tableId)) {
			this.isTable = true;
		}

		if (this.isTable) {
			this.filters.tableId = this.tableId;
			this.filters.completed = undefined;
		}

		this.loadOrders();

		this.intervalId = setInterval(() => {
			this.loadOrders();
		}, 60000);
	}

	ngOnDestroy() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	loadOrders(): void {
		this.isLoading = true;
		this.orderService.getOrders(this.filters).subscribe({
			next: response => {
				if (response.body) {
					this.orders = response.body;
					this.sortOrdersByTime();
					this.isLoading = false;
				}
			},
			error: err => {
				console.error('Error loading orders', err);
				this.snackBar.open('Failed to load orders', 'Close', {
					duration: 3000,
					panelClass: ['error-snackbar'],
				});
			},
		});
	}

	sortOrdersByTime(): void {
		this.orders = this.orders.sort((a, b) => {
			return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime();
		});
	}

	openCreateOrderDialog(): void {
		const dialogRef = this.dialog.open(OrderDialogComponent, {
			minWidth: '80vw',
			data: {
				restaurantId: this.restaurantId,
				tableNumber: this.tableNumber,
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.loadOrders();
			}
		});
	}

	cancelOrder(orderId: number): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '500px',
			data: {
				title: 'Cancel order',
				message: `Are you sure you want to cancel this order?`,
				confirmButtonText: 'Yes',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.orderService.cancelOrder(orderId).subscribe({
					next: () => {
						this.snackBar.open('Order cancelled successfully', 'Close', {
							duration: 3000,
						});
						this.loadOrders();
					},
					error: err => {
						console.error('Error cancelling order', err);
						this.snackBar.open('Failed to cancel order', 'Close', {
							duration: 3000,
							panelClass: ['error-snackbar'],
						});
					},
				});
			}
		});
	}

	confirmOrder(orderId: number): void {
		this.orderService.confirmOrder(orderId).subscribe({
			next: () => {
				this.snackBar.open('Order completed successfully', 'Close', {
					duration: 3000,
				});
				this.loadOrders();
			},
			error: err => {
				console.error('Error completing order', err);
				this.snackBar.open('Failed to complete order', 'Close', {
					duration: 3000,
					panelClass: ['error-snackbar'],
				});
			},
		});
	}

	clearFilters(): void {
		this.filters = {
			restaurantId: this.restaurantId,
			completed: false,
		};

		if (this.isTable) {
			this.filters.tableId = this.tableId;
		}

		this.loadOrders();
	}
}
