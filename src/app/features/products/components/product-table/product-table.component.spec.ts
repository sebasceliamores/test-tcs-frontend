import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductTable } from './product-table.component';
import { createProduct } from '../../testing/products.fixtures';
import { PRODUCTS_LIST_TEST_IDS } from '../../testing/products-list.selectors';

describe('ProductTable', () => {
  const queryByTestId = (fixture: { nativeElement: HTMLElement }, testId: string) =>
    fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTable],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows initials when logo fails to load', () => {
    const product = createProduct({
      id: 'p1',
      name: 'Juan Carlos Zamora',
      logo: 'bad-url',
    });

    const fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('productList', [product]);
    fixture.detectChanges();

    fixture.componentInstance.onLogoError(product);
    fixture.detectChanges();

    const initials = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.logoInitials
    )?.textContent;
    expect(initials).toContain('JC');
  });

  it('shows initials when logo is empty', () => {
    const product = createProduct({ id: 'p1', name: 'Maria Lopez', logo: '' });

    const fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('productList', [product]);
    fixture.detectChanges();

    const initials = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.logoInitials
    )?.textContent;
    expect(initials).toContain('ML');
  });

  it('toggles the contextual menu for edit', () => {
    const product = createProduct({ id: 'p1' });

    const fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('productList', [product]);
    fixture.detectChanges();

    fixture.componentInstance.toggleMenu(product);
    fixture.detectChanges();

    const menuItem = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.menuEdit
    )?.textContent;
    expect(menuItem).toContain('Editar');
  });

  it('closes the contextual menu when toggled twice', () => {
    const product = createProduct({ id: 'p1' });

    const fixture = TestBed.createComponent(ProductTable);
    fixture.componentRef.setInput('productList', [product]);
    fixture.detectChanges();

    fixture.componentInstance.toggleMenu(product);
    fixture.detectChanges();
    fixture.componentInstance.toggleMenu(product);
    fixture.detectChanges();

    const menuItem = queryByTestId(
      fixture,
      PRODUCTS_LIST_TEST_IDS.menuEdit
    );
    expect(menuItem).toBeNull();
  });
});
