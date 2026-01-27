import { Component, effect, OnDestroy, output, signal } from '@angular/core';
import { DEBOUNCE_MS } from '../../../../shared/constants/time.constants';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInput implements OnDestroy {
  readonly searchQuery = signal('');
  onChangeSearch = output<string>();
  private lastEmitted = '';
  private debounceId: any = null;

  private stop = effect(() => {
    const value = (this.searchQuery() ?? '').trim();
    if (this.debounceId) clearTimeout(this.debounceId);

    this.debounceId = setTimeout(() => {
      if (value !== this.lastEmitted) {
        this.lastEmitted = value;
        this.onChangeSearch.emit(value);
      }
    }, DEBOUNCE_MS);
  });

  ngOnDestroy(): void {
    if (this.debounceId) clearTimeout(this.debounceId);
    this.stop.destroy();
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
  }
}
