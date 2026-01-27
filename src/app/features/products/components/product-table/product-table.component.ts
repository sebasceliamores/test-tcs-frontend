import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { Product } from '../../models/product.model';
import { PRODUCTS_LIST_LABELS } from '../../constants/products-list.constants';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';

@Component({
  selector: 'product-table',
  imports: [NgForOf, NgIf, RouterLink, DeleteProductModalComponent],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTable {
  productList = input<Product[]>([]);
  errorMessage = input<string | null>(null);
  deleteRequested = output<Product>();

  readonly openMenuId = signal<string | null>(null);
  readonly logoErrors = signal<Record<string, boolean>>({});
  readonly deleteTarget = signal<Product | null>(null);
  readonly LABELS = PRODUCTS_LIST_LABELS;

  getLogoKey(product: Product): string {
    return product.id || `${product.name}-${product.date_release}`;
  }

  hasLogoError(product: Product): boolean {
    return Boolean(this.logoErrors()[this.getLogoKey(product)]);
  }

  onLogoError(product: Product): void {
    const key = this.getLogoKey(product);
    this.logoErrors.update((state) => ({ ...state, [key]: true }));
  }

  trackById(index: number, product: Product): string {
    return product.id ?? String(index);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part.charAt(0).toUpperCase()).join('');
  }

  toggleMenu(product: Product): void {
    const key = product.id;
    this.openMenuId.update((current) => (current === key ? null : key));
  }

  openDeleteModal(product: Product): void {
    this.openMenuId.set(null);
    this.deleteTarget.set(product);
  }

  closeDeleteModal(): void {
    this.deleteTarget.set(null);
  }

  confirmDelete(): void {
    const product = this.deleteTarget();
    if (!product) return;
    this.deleteRequested.emit(product);
    this.deleteTarget.set(null);
  }
}
