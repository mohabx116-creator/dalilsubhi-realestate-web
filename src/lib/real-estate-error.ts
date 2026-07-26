type ErrorLike = {
  message?: unknown;
  details?: unknown;
};

function readErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as ErrorLike;
  const details = candidate.details;

  if (details && typeof details === 'object' && 'message' in details && typeof (details as { message?: unknown }).message === 'string') {
    return (details as { message: string }).message;
  }

  if (typeof candidate.message === 'string') {
    return candidate.message;
  }

  return undefined;
}

function normalizeStructuredErrorMessage(message: string) {
  if (!message.startsWith('[')) {
    return message;
  }

  try {
    const parsed = JSON.parse(message);
    if (!Array.isArray(parsed)) {
      return message;
    }

    const parts = parsed
      .map((entry: any) => {
        if (typeof entry?.message === 'string' && entry.message.trim()) {
          return entry.message.trim();
        }

        if (Array.isArray(entry?.path) && entry.path.length > 0) {
          return entry.path.join('.');
        }

        return '';
      })
      .filter(Boolean);

    return parts.join('، ');
  } catch {
    return message;
  }
}

export function getRealEstateUserFacingErrorMessage(error: unknown, fallback: string) {
  const rawMessage = readErrorMessage(error);

  if (!rawMessage) {
    return fallback;
  }

  const normalizedMessage = normalizeStructuredErrorMessage(rawMessage).trim();
  if (!normalizedMessage) {
    return fallback;
  }

  const hasArabic = /[\u0600-\u06FF]/.test(normalizedMessage);
  const hasLatin = /[A-Za-z]/.test(normalizedMessage);

  if (hasLatin && !hasArabic) {
    return fallback;
  }

  return normalizedMessage;
}
