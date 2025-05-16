import { Component, OnInit } from '@angular/core';
import { CommonDirectivesModule, DatePipe } from '../../shared/commonDirectives.module';
import { MaterialModule } from '../../shared/material.module';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SavorlyUser, UserSearch, SavorlyRole } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
	selector: 'app-users',
	imports: [CommonDirectivesModule, MaterialModule, CapitalizePipe],
	templateUrl: './users.component.html',
	styleUrl: './users.component.css',
	providers: [DatePipe],
})
export class UsersComponent implements OnInit {
	displayedColumns: string[] = ['username', 'role', 'restaurant', 'lastLogonDate'];
	dataSource = new MatTableDataSource<SavorlyUser>([]);
	userRoles = SavorlyRole;
	filterForm: FormGroup;
	isLoading = false;

	constructor(
		private userService: UserService,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private datePipe: DatePipe
	) {
		this.filterForm = this.formBuilder.group({
			username: [''],
			role: [''],
		});
	}

	ngOnInit(): void {
		this.loadUsers();

		this.filterForm.valueChanges.subscribe(() => {
			this.loadUsers();
		});
	}

	loadUsers(): void {
		this.isLoading = true;

		const searchParams: UserSearch = {
			username: this.filterForm.get('username')?.value || undefined,
			role: this.filterForm.get('role')?.value || undefined,
		};

		this.userService.getUsers(searchParams).subscribe({
			next: response => {
				this.dataSource.data = response.body || [];
				this.isLoading = false;
			},
			error: error => {
				this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
				this.isLoading = false;
			},
		});
	}

	formatDate(date: Date | undefined): string {
		if (!date) return 'N/A';
		return this.datePipe.transform(date, 'MMM d, y, h:mm a') || 'N/A';
	}

	getRestaurantName(user: SavorlyUser): string {
		return user.restaurant ? user.restaurant.name : 'N/A';
	}

	clearFilters(): void {
		this.filterForm.reset();
		this.loadUsers();
	}
}
