import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { MESSAGE_ERRORS } from '../../constants/form.constants';

@Component({
  selector: 'app-form-errors',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormErrorsComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  @Input() submitted = false;
  @Input() showAll = true;

  private readonly messages = MESSAGE_ERRORS;

  get shouldShow(): boolean {
    const c = this.control;
    if (!c) return false;

    return c.invalid && (c.touched || c.dirty || this.submitted);
  }

  get errorMessages(): string[] {
    const errors = this.control?.errors ?? null;
    if (!errors) return [];

    const list = Object.keys(errors).flatMap((key) => {
      const message = this.resolveMessage(this.messages[key], errors[key]);
      if (!message) return [];
      return Array.isArray(message) ? message : [message];
    });

    return this.showAll ? list : list.slice(0, 1);
  }

  private resolveMessage(
    message:
      | string
      | ((error: unknown) => string | string[] | null)
      | undefined,
    error: unknown,
  ): string | string[] | null {
    if (!message) return null;
    return typeof message === 'function' ? message(error) : message;
  }
}
