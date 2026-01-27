import { AbstractControl } from '@angular/forms';

export type ServerErrorResult = {
  fieldErrors: Map<string, string[]>;
  generalErrors: string[];
};

export const parseServerErrors = (error: unknown): ServerErrorResult => {
  const fieldErrors = new Map<string, string[]>();
  const generalErrors: string[] = [];
  const payload = extractErrorBody(error);

  if (typeof payload === 'string') {
    generalErrors.push(payload);
    return { fieldErrors, generalErrors };
  }

  if (!payload || typeof payload !== 'object') {
    return { fieldErrors, generalErrors };
  }

  const body = payload as {
    message?: unknown;
    errors?: Array<{
      property?: unknown;
      constraints?: Record<string, unknown>;
    }>;
  };

  if (typeof body.message === 'string') {
    generalErrors.push(body.message);
  }

  const errors = Array.isArray(body.errors) ? body.errors : [];
  errors.forEach((item) => {
    const property = typeof item.property === 'string' ? item.property : '';
    const constraints =
      item.constraints && typeof item.constraints === 'object'
        ? item.constraints
        : null;
    const messages = constraints
      ? Object.values(constraints).filter(
          (value): value is string => typeof value === 'string',
        )
      : [];
    if (messages.length === 0) {
      return;
    }
    if (property) {
      const existing = fieldErrors.get(property) ?? [];
      fieldErrors.set(property, [...existing, ...messages]);
      return;
    }
    generalErrors.push(...messages);
  });

  return { fieldErrors, generalErrors };
};

export const applyServerFieldErrors = (
  controls: Record<string, AbstractControl>,
  fieldErrors: Map<string, string[]>,
): void => {
  fieldErrors.forEach((messages, key) => {
    const control = controls[key];
    if (!control) return;
    const current = control.errors ?? {};
    const payload = messages.length === 1 ? messages[0] : messages;
    control.setErrors({ ...current, server: payload });
  });
};

export const clearServerErrors = (
  controls: Record<string, AbstractControl>,
): void => {
  Object.values(controls).forEach((control) => {
    const errors = control.errors ?? null;
    if (!errors || !('server' in errors)) return;
    const { server, ...rest } = errors as Record<string, unknown>;
    control.setErrors(Object.keys(rest).length > 0 ? rest : null);
  });
};

const extractErrorBody = (error: unknown): unknown => {
  if (!error || typeof error !== 'object') {
    return error;
  }
  if ('error' in error) {
    return (error as { error?: unknown }).error ?? error;
  }
  return error;
};
