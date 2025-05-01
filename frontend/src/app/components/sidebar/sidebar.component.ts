import { Component, OnInit } from '@angular/core';
import { CommonDirectivesModule } from '../../shared/commonDirectives.module';
import { MaterialModule } from '../../shared/material.module';
import { SavorlyRole, SavorlyUser } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonDirectivesModule, MaterialModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {
  isCollapsed = false;
  userProfile?: SavorlyUser;
  Role = SavorlyRole;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(profile => {
      this.userProfile = profile;
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  hasRole(role: SavorlyRole): boolean {
    return this.userService.hasRole(role);
  }

  hasAnyRole(roles: SavorlyRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}
