import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { NgIf } from './shared/commonDirectives.module';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, SidebarComponent, NgIf],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	isLoading = true;

	constructor(private userService: UserService, public authService: AuthService) {}

	ngOnInit(): void {
		this.userService.getProfile().subscribe({
			next: () => {
				this.isLoading = false;
			},
		});
	}
}
