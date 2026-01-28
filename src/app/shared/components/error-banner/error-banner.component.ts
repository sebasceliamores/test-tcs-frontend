import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { ErrorBannerService } from '../../services/error-banner.service';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [NgIf],
  templateUrl: './error-banner.component.html',
  styleUrl: './error-banner.component.scss',
})
export class ErrorBannerComponent {
  private readonly errorBanner = inject(ErrorBannerService);
  readonly banner = computed(() => this.errorBanner.banner());
}
