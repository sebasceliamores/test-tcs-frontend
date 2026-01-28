import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';
import { ProductTable } from '../../components/product-table/product-table.component';
import { SearchInput } from '../../components/search-input/search-input.component';
import { SelectPageSize } from '../../components/select-page-size/select-page-size.component';
import { EPageSize } from '../../enums/products-list.enum';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [AppButtonComponent, SearchInput, ProductTable, SelectPageSize],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly reload$ = new Subject<void>();

  readonly searchQuery = signal('');
  readonly pageSize = signal(EPageSize.PAGE_SIZE_5);

  private readonly productsState$ = this.reload$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.productsService.getProducts().pipe(
        map((products) => ({ products, error: '' as string, loading: false })),
        catchError(() =>
          of({
            products: [] as Product[],
            error: '',
            loading: false,
          }),
        ),
        startWith({
          products: [] as Product[],
          error: '' as string,
          loading: true,
        }),
      ),
    ),
  );

  private readonly productsState = toSignal(this.productsState$, {
    initialValue: {
      products: [] as Product[],
      error: '' as string,
      loading: true,
    },
  });

  readonly isLoading = computed(() => this.productsState().loading);

  readonly productsView = computed(() => {
    const state = this.productsState();
    const query = this.searchQuery().trim().toLowerCase();
    const size = this.pageSize();
    const filtered = query
      ? state.products.filter((product) => this.matchesQuery(product, query))
      : state.products;
    const visible = filtered.slice(0, size);
    return {
      products: visible,
      total: filtered.length,
      shown: visible.length,
      pageSize: size,
      error: state.error,
      loading: state.loading,
    };
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  onPageSizeChange(value: EPageSize): void {
    this.pageSize.set(value);
  }

  onAdd(): void {
    this.router.navigateByUrl('/products/new');
  }

  onDelete(product: Product): void {
    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.reload$.next();
      },
    });
  }

  private matchesQuery(product: Product, query: string): boolean {
    return (
      product.id.toLowerCase().includes(query) ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }
}
