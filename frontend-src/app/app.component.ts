import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-loading-spinner></app-loading-spinner>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
