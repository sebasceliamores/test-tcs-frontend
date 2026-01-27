import { TestBed } from '@angular/core/testing';
import { jest } from '@jest/globals';
import { DeleteProductModalComponent } from './delete-product-modal.component';

describe('DeleteProductModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProductModalComponent],
    }).compileComponents();
  });

  it('renders product name in the title', () => {
    const fixture = TestBed.createComponent(DeleteProductModalComponent);
    fixture.componentRef.setInput('productName', 'Cuenta Oro');
    fixture.detectChanges();

    const title =
      fixture.nativeElement.querySelector('.modal-title')?.textContent;
    expect(title).toContain('Cuenta Oro');
  });

  it('emits cancel when backdrop is clicked', () => {
    const fixture = TestBed.createComponent(DeleteProductModalComponent);
    const component = fixture.componentInstance;
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector(
      '.modal-backdrop',
    ) as HTMLElement;
    backdrop.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('emits cancel and confirm when buttons are clicked', () => {
    const fixture = TestBed.createComponent(DeleteProductModalComponent);
    const component = fixture.componentInstance;
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    const confirmSpy = jest.spyOn(component.confirm, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('app-button button');
    (buttons[0] as HTMLButtonElement).click();
    (buttons[1] as HTMLButtonElement).click();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledTimes(1);
  });
});
