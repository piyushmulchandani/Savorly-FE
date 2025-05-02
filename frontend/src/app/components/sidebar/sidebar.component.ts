import { Component, OnInit } from '@angular/core';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { MaterialModule } from '../../shared/material.module';
import { SavorlyRole } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-sidebar',
	imports: [CommonDirectivesModule, MaterialModule, RouterModule],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
	isCollapsed = false;
	Role = SavorlyRole;

	constructor(private userService: UserService, public authService: AuthService) {}

	ngOnInit(): void {
		this.userService.getProfile().subscribe();
	}

	toggleSidebar(): void {
		this.isCollapsed = !this.isCollapsed;
	}

	hasRole(role: SavorlyRole): boolean {
		return this.userService.hasRole(role);
	}
}
