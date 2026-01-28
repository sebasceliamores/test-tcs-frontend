export type ServerErrorResult = {
  generalErrors: string[];
};

export const parseServerErrors = (error: unknown): ServerErrorResult => {
  const payload = getPayload(error);
  const status =
    typeof (error as { status?: unknown })?.status === 'number'
      ? (error as { status: number }).status
      : undefined;

  const message =
    firstConstraintMessage(payload?.errors) ??
    cleanMessage(payload?.message) ??
    cleanMessage((error as { message?: unknown })?.message) ??
    statusMessageFromCode(status) ??
    'Ocurrio un error inesperado.';

  return { generalErrors: [message] };
};

const getPayload = (
  error: unknown,
): { message?: unknown; errors?: unknown } => {
  if (!error || typeof error !== 'object') {
    return { message: error };
  }
  const payload = 'error' in error ? error.error : error;
  return (payload ?? {}) as { message?: unknown; errors?: unknown };
};

const firstConstraintMessage = (errors: unknown): string | null => {
  if (!Array.isArray(errors)) {
    return null;
  }
  for (const item of errors) {
    const constraints =
      item && typeof item === 'object' && 'constraints' in item
        ? (item as { constraints?: unknown }).constraints
        : null;
    if (!constraints || typeof constraints !== 'object') {
      continue;
    }
    const message = Object.values(constraints).find(isString);
    if (message) {
      return message;
    }
  }
  return null;
};

const cleanMessage = (value: unknown): string | null => {
  if (!isString(value)) {
    return null;
  }
  return value.startsWith('Http failure response') ? null : value;
};

const statusMessageFromCode = (status?: number): string | null => {
  if (status === 0) return 'No hay conexion con el servidor.';
  if (status === 404) return 'No se encontro el recurso.';
  if (status === 400) return 'Solicitud invalida.';
  if (status === 409) return 'Conflicto en la solicitud.';
  if (typeof status === 'number' && status >= 500) {
    return 'Error interno del servidor.';
  }
  return null;
};

const isString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
