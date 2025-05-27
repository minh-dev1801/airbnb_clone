import useSWRMutation from 'swr/mutation';
import { AxiosError } from 'axios';
import { handleApiError } from '@/lib/client/services/notificationService';

export default function useApiMutation<T, D>(
  key: string,
  fetcher: (data: D) => Promise<T>
) {
  return useSWRMutation<T, AxiosError, string, D>(
    key,
    async (_key: string, { arg }: { arg: D }) => {
      return fetcher(arg);
    },
    {
      onError: (error: AxiosError) => {
        handleApiError(error);
      },
    }
  );
}
