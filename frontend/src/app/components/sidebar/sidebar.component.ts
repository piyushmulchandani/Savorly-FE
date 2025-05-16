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
export class SidebarComponent {
	isCollapsed = false;
	Role = SavorlyRole;
	restaurantId: number | undefined;

	constructor(private userService: UserService, public authService: AuthService) {
		if (userService.userProfile && userService.userProfile.restaurant) this.restaurantId = userService.userProfile?.restaurant?.id;
	}

	toggleSidebar(): void {
		this.isCollapsed = !this.isCollapsed;
	}

	hasRole(role: SavorlyRole): boolean {
		return this.userService.hasRole(role);
	}
}
