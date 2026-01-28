import { Component, computed, input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'product-table-skeleton',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './product-table-skeleton.component.html',
  styleUrl: './product-table-skeleton.component.scss',
})
export class ProductTableSkeletonComponent {
  rows = input(5);
  readonly skeletonRows = computed(() =>
    Array.from({ length: this.rows() }),
  );

  trackByIndex(index: number): number {
    return index;
  }
}
