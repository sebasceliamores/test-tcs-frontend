import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';
import { ErrorBannerComponent } from './shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, ErrorBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-tcs-frontend';
}
