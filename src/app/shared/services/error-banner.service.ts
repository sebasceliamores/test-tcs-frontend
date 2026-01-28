import { Injectable, signal } from '@angular/core';
import { ERROR_BANNER_DEBOUNCE_MS } from '../constants/time.constants';

export type BannerMessage = {
  message: string;
  type: 'error';
};

@Injectable({ providedIn: 'root' })
export class ErrorBannerService {
  readonly banner = signal<BannerMessage | null>(null);
  private hideTimeoutId: number | null = null;

  show(message: string): void {
    this.banner.set({ message, type: 'error' });
    if (this.hideTimeoutId) {
      window.clearTimeout(this.hideTimeoutId);
    }
    this.hideTimeoutId = window.setTimeout(() => {
      this.banner.set(null);
      this.hideTimeoutId = null;
    }, ERROR_BANNER_DEBOUNCE_MS);
  }

  clear(): void {
    if (this.hideTimeoutId) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    this.banner.set(null);
  }
}
