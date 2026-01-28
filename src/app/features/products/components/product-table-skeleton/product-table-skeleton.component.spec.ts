import { TestBed } from '@angular/core/testing';

import { ProductTableSkeletonComponent } from './product-table-skeleton.component';

describe('ProductTableSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableSkeletonComponent],
    }).compileComponents();
  });

  it('renders the configured number of skeleton rows', () => {
    const fixture = TestBed.createComponent(ProductTableSkeletonComponent);
    fixture.componentRef.setInput('rows', 3);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll(
      '[data-testid="products-skeleton"]',
    );
    expect(rows.length).toBe(3);
  });
});
