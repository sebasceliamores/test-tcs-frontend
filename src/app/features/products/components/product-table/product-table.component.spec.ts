import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { jest } from '@jest/globals';

import { ProductTable } from './product-table.component';
import { createProduct } from '../../testing/products.fixtures';
import { PRODUCTS_LIST_TEST_IDS } from '../../testing/products-list.selectors';
import { Product } from '../../models/product.model';

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

  it('uses fallback logo key when id is empty', () => {
    const product = createProduct({
      id: '',
      name: 'Producto Uno',
      date_release: '2030-02-02',
    });

    const fixture = TestBed.createComponent(ProductTable);
    const component = fixture.componentInstance;

    expect(component.getLogoKey(product)).toBe('Producto Uno-2030-02-02');
  });

  it('uses index fallback in trackById when id is undefined', () => {
    const product = { ...createProduct(), id: undefined } as unknown as Product;
    const fixture = TestBed.createComponent(ProductTable);
    const component = fixture.componentInstance;

    expect(component.trackById(4, product)).toBe('4');
  });

  it('opens and closes delete modal', () => {
    const product = createProduct({ id: 'p1' });
    const fixture = TestBed.createComponent(ProductTable);
    const component = fixture.componentInstance;

    component.toggleMenu(product);
    component.openDeleteModal(product);

    expect(component.openMenuId()).toBeNull();
    expect(component.deleteTarget()).toEqual(product);

    component.closeDeleteModal();
    expect(component.deleteTarget()).toBeNull();
  });

  it('emits deleteRequested on confirm and clears target', () => {
    const product = createProduct({ id: 'p1' });
    const fixture = TestBed.createComponent(ProductTable);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.deleteRequested, 'emit');

    component.openDeleteModal(product);
    component.confirmDelete();

    expect(emitSpy).toHaveBeenCalledWith(product);
    expect(component.deleteTarget()).toBeNull();
  });

  it('does not emit deleteRequested when no target is set', () => {
    const fixture = TestBed.createComponent(ProductTable);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.deleteRequested, 'emit');

    component.confirmDelete();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
