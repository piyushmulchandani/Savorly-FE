import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { MatInputModule } from '@angular/material/input';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';

import { MatDialogModule } from '@angular/material/dialog';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatSortModule } from '@angular/material/sort';

import { MatDividerModule } from '@angular/material/divider';

import { MatExpansionModule } from '@angular/material/expansion';

import { MatChipsModule } from '@angular/material/chips';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatRadioModule } from '@angular/material/radio';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTabsModule } from '@angular/material/tabs';

import { MatListModule } from '@angular/material/list';

import { MatGridListModule } from '@angular/material/grid-list';

import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
	exports: [
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
		MatDatepickerModule,
		MatNativeDateModule,
		MatSelectModule,
		MatCheckboxModule,
		MatRadioModule,
		MatSlideToggleModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatListModule,
		MatGridListModule,
	],
})
export class MaterialModule {}
