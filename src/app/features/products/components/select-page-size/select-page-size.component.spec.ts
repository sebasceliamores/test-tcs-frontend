import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';

import { SelectPageSize } from './select-page-size.component';
import { EPageSize } from '../../enums/products-list.enum';
import { PAGE_SIZES_LIST } from '../../constants/products-list.constants';

describe('SelectPageSize', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPageSize],
    }).compileComponents();
  });

  it('renders available page size options', () => {
    const fixture = TestBed.createComponent(SelectPageSize);
    fixture.detectChanges();

    const options = Array.from(
      fixture.nativeElement.querySelectorAll('option')
    ).map((option) => Number((option as HTMLOptionElement).value));

    expect(options).toEqual(PAGE_SIZES_LIST);
  });

  it('emits and updates state when page size changes', () => {
    const fixture = TestBed.createComponent(SelectPageSize);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.onChangePageSize, 'emit');
    fixture.detectChanges();

    component.onPageSizeChange(String(EPageSize.PAGE_SIZE_10));
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(EPageSize.PAGE_SIZE_10);
    expect(component.pageSize()).toBe(EPageSize.PAGE_SIZE_10);
  });

  it('ignores invalid page size values', () => {
    const fixture = TestBed.createComponent(SelectPageSize);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.onChangePageSize, 'emit');
    fixture.detectChanges();

    component.onPageSizeChange('99');
    fixture.detectChanges();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.pageSize()).toBe(EPageSize.PAGE_SIZE_5);
  });
});
