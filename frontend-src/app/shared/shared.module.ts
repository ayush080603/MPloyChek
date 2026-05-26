import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';



@NgModule({
  declarations: [
    NavbarComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
