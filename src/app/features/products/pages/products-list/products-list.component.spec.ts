import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductsListComponent } from './products-list.component';
import { ProductsService } from '../../services/products.service';
import {
  createProduct,
  createProducts,
} from '../../testing/products.fixtures';
import { PRODUCTS_LIST_TEST_IDS } from '../../testing/products-list.selectors';

describe('ProductsListComponent', () => {
  let productsService: { getProducts: jest.Mock };
  const queryAllByTestId = (fixture: { nativeElement: HTMLElement }, testId: string) =>
    fixture.nativeElement.querySelectorAll(`[data-testid="${testId}"]`);
  const queryByTestId = (fixture: { nativeElement: HTMLElement }, testId: string) =>
    fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);

  beforeEach(async () => {
    productsService = { getProducts: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsService },
      ],
    }).compileComponents();
  });

  it('renders products and shows count', () => {
    productsService.getProducts.mockReturnValue(
      of([createProduct({ id: 'p1' }), createProduct({ id: 'p2' })])
    );

    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    const rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(2);

    const count = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.resultCount
    )?.textContent;
    expect(count).toContain('2');
  });

  it('filters products by search query', () => {
    productsService.getProducts.mockReturnValue(
      of([
        createProduct({ id: 'p1', name: 'Tarjeta Oro' }),
        createProduct({ id: 'p2', name: 'Cuenta Ahorro' }),
      ])
    );

    const fixture = TestBed.createComponent(ProductsListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSearch('tarjeta');
    fixture.detectChanges();

    const rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Tarjeta Oro');
  });

  it('filters products by id and description', () => {
    productsService.getProducts.mockReturnValue(
      of([
        createProduct({
          id: 'abc-1',
          name: 'Cuenta Ahorro',
          description: 'Producto exclusivo',
        }),
        createProduct({ id: 'xyz-2', name: 'Tarjeta Platino' }),
      ])
    );

    const fixture = TestBed.createComponent(ProductsListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onSearch('ABC-1');
    fixture.detectChanges();
    let rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Cuenta Ahorro');

    component.onSearch('exclusivo');
    fixture.detectChanges();
    rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Producto exclusivo');
  });

  it('limits results by page size', () => {
    productsService.getProducts.mockReturnValue(of(createProducts(6)));

    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    const rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(5);

    const count = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.resultCount
    )?.textContent;
    expect(count).toContain('5');
  });

  it('updates results when page size changes', () => {
    productsService.getProducts.mockReturnValue(of(createProducts(12)));

    const fixture = TestBed.createComponent(ProductsListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onPageSizeChange('10');
    fixture.detectChanges();

    const rows = queryAllByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productRow);
    expect(rows.length).toBe(10);
  });

  it('shows empty state when there are no products', () => {
    productsService.getProducts.mockReturnValue(of([]));

    const fixture = TestBed.createComponent(ProductsListComponent);
    fixture.detectChanges();

    const empty = queryByTestId(fixture, PRODUCTS_LIST_TEST_IDS.productsEmpty)
      ?.textContent;
    expect(empty).toContain('No hay productos');
  });

});
