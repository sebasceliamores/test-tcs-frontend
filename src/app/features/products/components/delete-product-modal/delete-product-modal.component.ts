import { Component, input, output } from '@angular/core';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-delete-product-modal',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './delete-product-modal.component.html',
  styleUrl: './delete-product-modal.component.scss',
})
export class DeleteProductModalComponent {
  productName = input<string>('');
  cancel = output<void>();
  confirm = output<void>();
}
