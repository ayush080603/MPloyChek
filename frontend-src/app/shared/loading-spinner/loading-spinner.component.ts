import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="global-loader" *ngIf="loading$ | async">
      <div class="loader-bar"></div>
    </div>
  `,
  styles: [`
    .global-loader { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; }
    .loader-bar {
      height: 3px; background: linear-gradient(90deg, #f97316, #facc15, #f97316);
      background-size: 200% 100%; animation: slide 1.2s ease-in-out infinite;
    }
    @keyframes slide { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class LoadingSpinnerComponent {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) {}
}
