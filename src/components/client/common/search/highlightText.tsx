import { normalizeText } from '@/lib/utils';
import { ReactNode } from 'react';

export const highlightText = (
  text: string,
  query: string,
  className: string = 'bg-yellow-200 dark:bg-yellow-900'
): ReactNode => {
  const normalizedText = normalizeText(text);

  if (!query || !normalizedText.includes(query)) {
    return null;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = normalizedText.split(regex);

  let index = 0;

  return parts.map((part, i) => {
    const originalPart = text.slice(index, index + part.length);
    index += part.length;

    return part === query ? (
      <span key={i} className={className}>
        {originalPart}
      </span>
    ) : (
      originalPart
    );
  });
};
