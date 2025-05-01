import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Structural Directives
export { NgIf } from '@angular/common';          // *ngIf
export { NgFor } from '@angular/common';         // *ngFor
export { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common'; // *ngSwitch

// Pipes
export { DatePipe } from '@angular/common';      // {{ date | date }}
export { CurrencyPipe } from '@angular/common';  // {{ price | currency }}

// Form Directives
export { NgModel } from '@angular/forms';        // [(ngModel)]

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    // Structural Directives
    NgIf,
    NgFor,
    NgSwitch, NgSwitchCase, NgSwitchDefault,
    
    // Pipes
    DatePipe,
    CurrencyPipe,
    
    // Forms
    ReactiveFormsModule
  ]
})
export class CommonDirectivesModule { }