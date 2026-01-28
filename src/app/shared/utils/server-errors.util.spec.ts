import { parseServerErrors } from './server-errors.util';

describe('server-errors util', () => {
  it('parses string payload as general error', () => {
    const result = parseServerErrors('boom');
    expect(result.generalErrors).toEqual(['boom']);
  });

  it('prefers the first constraint message when available', () => {
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
    expect(result.generalErrors).toEqual(['min 6']);
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

  it('uses status fallback when no message is available', () => {
    const result = parseServerErrors({ status: 404 });
    expect(result.generalErrors).toEqual(['No se encontro el recurso.']);
  });

});
