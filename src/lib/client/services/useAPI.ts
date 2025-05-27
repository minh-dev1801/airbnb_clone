import useSWR from 'swr';
import { handleApiError, showSuccessToast } from './notificationService';
import { AxiosError } from 'axios';
import { UseApiOptions, ApiError } from '../types/types';

export default function useApi<T>(
  key: string,
  fetcher: () => Promise<T>,
  customOptions?: UseApiOptions<T, ApiError>
) {
  const defaultOptions = {
    revalidateOnFocus: false,
    onError: (error: AxiosError | Error) => handleApiError(error),
    onSuccess: (data: T) => {
      if (
        data &&
        typeof data === 'object' &&
        'messageKey' in data &&
        typeof data.messageKey === 'string' &&
        customOptions &&
        typeof customOptions === 'object' &&
        'translate' in customOptions
      ) {
        const { translate } = customOptions;

        if (translate && typeof translate === 'function') {
          const message = translate(data.messageKey);

          showSuccessToast(message);
        }
      }
    },
  };

  const options = { ...defaultOptions, ...customOptions };

  return useSWR<T, AxiosError | Error>(
    key === '' ? null : key,
    fetcher,
    options
  );
}
