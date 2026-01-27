import { FormControl, Validators } from '@angular/forms';

import {
  applyServerFieldErrors,
  clearServerErrors,
  parseServerErrors,
} from './server-errors.util';

describe('server-errors util', () => {
  it('parses string payload as general error', () => {
    const result = parseServerErrors('boom');
    expect(result.generalErrors).toEqual(['boom']);
    expect(result.fieldErrors.size).toBe(0);
  });

  it('parses message and field constraints', () => {
    const payload = {
      message: 'Invalid body',
      errors: [
        {
          property: 'name',
          constraints: { minLength: 'min 6' },
        },
        {
          constraints: { required: 'required' },
        },
      ],
    };

    const result = parseServerErrors(payload);
    expect(result.generalErrors).toEqual(['Invalid body', 'required']);
    expect(result.fieldErrors.get('name')).toEqual(['min 6']);
  });

  it('reads nested error payload', () => {
    const payload = {
      error: {
        message: 'Nested error',
      },
    };

    const result = parseServerErrors(payload);
    expect(result.generalErrors).toEqual(['Nested error']);
  });

  it('applies server errors to controls', () => {
    const name = new FormControl('', Validators.required);
    const controls = { name };
    const errors = new Map<string, string[]>();
    errors.set('name', ['server error']);

    applyServerFieldErrors(controls, errors);

    expect(name.errors?.['server']).toBe('server error');
  });

  it('clears only server errors from controls', () => {
    const name = new FormControl('', Validators.required);
    name.setErrors({ server: 'server error', required: true });

    clearServerErrors({ name });
    expect(name.errors).toEqual({ required: true });
  });

  it('clears server errors and leaves null when no other errors', () => {
    const name = new FormControl('');
    name.setErrors({ server: 'server error' });

    clearServerErrors({ name });
    expect(name.errors).toBeNull();
  });
});
