import { Component, effect, OnDestroy, output, signal } from '@angular/core';
import { DEBOUNCE_MS } from '../../../../shared/constants/time.constants';
import { EPageSize } from '../../enums/products-list.enum';
import { PAGE_SIZES_LIST } from '../../constants/products-list.constants';
import { NgFor } from '@angular/common';

@Component({
  selector: 'select-page-size',
  imports: [NgFor],
  templateUrl: './select-page-size.component.html',
  styleUrl: './select-page-size.component.scss',
})
export class SelectPageSize {
  readonly pageSize = signal(EPageSize.PAGE_SIZE_5);
  readonly PAGE_SIZES_LIST = PAGE_SIZES_LIST;
  onChangePageSize = output<EPageSize>();

  onPageSizeChange(value: string): void {
    const nextValue = Number.parseInt(value, 10);
    if (PAGE_SIZES_LIST.includes(nextValue as EPageSize)) {
      this.onChangePageSize.emit(nextValue);
      this.pageSize.set(nextValue);
    }
  }
}
