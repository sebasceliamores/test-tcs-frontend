import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';

import { SearchInput } from './search-input.component';
import { DEBOUNCE_MS } from '../../../../shared/constants/time.constants';

describe('SearchInput', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInput],
    }).compileComponents();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('emits trimmed value after debounce', () => {
    jest.useFakeTimers();

    const fixture = TestBed.createComponent(SearchInput);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.onChangeSearch, 'emit');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '  Hola  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    jest.advanceTimersByTime(DEBOUNCE_MS);

    expect(emitSpy).toHaveBeenCalledWith('Hola');
  });

  it('does not emit the same value twice', () => {
    jest.useFakeTimers();

    const fixture = TestBed.createComponent(SearchInput);
    const component = fixture.componentInstance;
    const emitSpy = jest.spyOn(component.onChangeSearch, 'emit');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Producto';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    jest.advanceTimersByTime(DEBOUNCE_MS);

    input.value = '  Producto  ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    jest.advanceTimersByTime(DEBOUNCE_MS);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
