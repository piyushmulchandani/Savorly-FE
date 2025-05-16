import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Structural Directives
export { NgIf } from '@angular/common';
export { NgFor } from '@angular/common';
export { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

// Pipes
export { DatePipe } from '@angular/common';

// Form Directives
export { NgModel } from '@angular/forms';

@NgModule({
	imports: [CommonModule, ReactiveFormsModule],
	exports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, CommonModule, CurrencyPipe, ReactiveFormsModule],
})
export class CommonDirectivesModule {}
