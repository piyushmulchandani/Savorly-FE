import { NgModule } from '@angular/core';

/* 
 * Angular Material Components Cheat Sheet for Restaurant App:
 * 
 * Core components marked with ★ are particularly useful for restaurant apps
 */

// ★ Buttons: <button mat-button>, <button mat-raised-button>
import { MatButtonModule } from '@angular/material/button';

// ★ Input fields: <mat-form-field><input matInput>
import { MatInputModule } from '@angular/material/input';

// ★ Cards: <mat-card> for menu items
import { MatCardModule } from '@angular/material/card';

// ★ Icons: <mat-icon> for various UI elements
import { MatIconModule } from '@angular/material/icon';

// ★ Toolbar: <mat-toolbar> for navigation
import { MatToolbarModule } from '@angular/material/toolbar';

// ★ Menus: <mat-menu> for dropdowns
import { MatMenuModule } from '@angular/material/menu';

// ★ Dialogs: For forms (add menu, reservations)
import { MatDialogModule } from '@angular/material/dialog';

// ★ Snackbar: For notifications
import { MatSnackBarModule } from '@angular/material/snack-bar';

// ★ Data tables: For reservations/orders
import { MatTableModule } from '@angular/material/table';

// ★ Pagination: For tables
import { MatPaginatorModule } from '@angular/material/paginator';

// ★ Sorting: For tables
import { MatSortModule } from '@angular/material/sort';

// ★ Dividers: <mat-divider>
import { MatDividerModule } from '@angular/material/divider';

// ★ Expansion panels: <mat-expansion-panel>
import { MatExpansionModule } from '@angular/material/expansion';

// ★ Chips: <mat-chip> for tags (dietary info)
import { MatChipsModule } from '@angular/material/chips';

// ★ Datepicker: For reservation dates <input matDatepicker>
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// ★ Select: <mat-select> for dropdowns
import { MatSelectModule } from '@angular/material/select';

// ★ Checkbox: <mat-checkbox> for options
import { MatCheckboxModule } from '@angular/material/checkbox';

// ★ Radio buttons: <mat-radio-group>
import { MatRadioModule } from '@angular/material/radio';

// ★ Slide toggle: <mat-slide-toggle>
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// ★ Progress spinner: <mat-spinner>
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ★ Progress bar: <mat-progress-bar>
import { MatProgressBarModule } from '@angular/material/progress-bar';

// ★ Tabs: <mat-tab-group>
import { MatTabsModule } from '@angular/material/tabs';

// ★ List: <mat-list> for menus
import { MatListModule } from '@angular/material/list';

// ★ Grid list: <mat-grid-list> for table layout
import { MatGridListModule } from '@angular/material/grid-list';

// ★ Badges: <mat-badge> for notifications
import { MatBadgeModule } from '@angular/material/badge';

// ★ Tooltip: <mat-tooltip>
import { MatTooltipModule } from '@angular/material/tooltip';

// ★ Stepper: <mat-horizontal-stepper> for multi-step forms
import { MatStepperModule } from '@angular/material/stepper';

import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  exports: [
    // Core components
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatSidenavModule,
    
    // Restaurant-specific additions
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    MatGridListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatStepperModule
  ]
})
export class MaterialModule { }