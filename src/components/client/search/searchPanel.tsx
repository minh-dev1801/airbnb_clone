import { useState } from 'react';
import { Search, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import {
  showErrorToast,
  showSuccessToast,
} from '@/lib/client/services/notificationService';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '@/lib/client/store/slices/searchSlice';
import { RootState } from '@/lib/client/store/store';
import { useTranslations } from 'next-intl';
import { createSchemas } from '@/lib/client/validator/validatior';
import { SearchType } from '@/lib/client/types/types';
import LocationDialog from './dialogs/LocationDialog';
import { CheckInDialog } from './dialogs/CheckInDialog';
import { CheckOutDialog } from './dialogs/CheckOutDialog';
import { GuestDialog } from './dialogs/GuestDialog';
import { SkeletonCard } from '../common/SkeletonCard';

export default function SearchPanel({ isLoading }: { isLoading: boolean }) {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const positions = useSelector((state: RootState) => state.position);
  const t = useTranslations('Search');
  const tValidation = useTranslations('ValidationErrors');
  const schemas = createSchemas(tValidation);

  const form = useForm<SearchType>({
    resolver: zodResolver(schemas.searchSchema),
    defaultValues: {
      location: '',
      checkIn: undefined,
      checkOut: undefined,
      guests: 0,
    },
  });

  const handleSearch = async (data: SearchType) => {
    const listSearchs = {
      location: data.location,
      guests: data.guests,
      checkIn: data.checkIn.toISOString(),
      checkOut: data.checkOut.toISOString(),
    };

    dispatch(setSearch(listSearchs));

    const selectedPosition = positions.find(
      (pos) => pos.tinhThanh === data.location
    );

    if (!selectedPosition || !selectedPosition.tinhThanh) {
      showErrorToast(t('Search failed!'));
      return;
    }

    showSuccessToast(t('Searching'));

    router.push(`/rooms/${selectedPosition.slug}`);
  };

  const handleInvalid = () => {
    const errors = form.formState.errors;
    const errorMessages = [];

    if (errors.location) errorMessages.push(errors.location.message);
    if (errors.checkIn) errorMessages.push(errors.checkIn.message);
    if (errors.checkOut) errorMessages.push(errors.checkOut.message);
    if (errors.guests) errorMessages.push(errors.guests.message);

    if (errorMessages.length > 0) {
      errorMessages.forEach((msg) => {
        showErrorToast(msg || t('Unknown error'));
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="container mx-auto lg:max-w-5xl">
          <SkeletonCard height="h-12" shape="rounded-2xl" />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch, handleInvalid)}
            className="container mx-auto mt-8 flex items-center gap-2 rounded-full border border-gray-400 bg-white px-4 py-2 shadow-md transition-shadow md:mt-0 lg:max-w-5xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-black"
          >
            <Button
              type="button"
              variant="ghost"
              className={cn(
                'h-full flex-1 rounded-full px-4 py-2 text-left transition-all hover:bg-gray-100 hover:shadow-md dark:hover:bg-gray-700 cursor-pointer',
                (form.watch('location') ||
                  form.watch('checkIn') ||
                  form.watch('checkOut')) &&
                  'font-medium'
              )}
              onClick={() => setShowLocationModal(true)}
            >
              <div className="ml-2 flex w-full flex-col">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {t('Location')}
                </span>
                <div className="flex items-center gap-2">
                  <Search className="text-gray-500 dark:text-gray-400" />
                  <span className="truncate text-sm text-gray-800 dark:text-gray-200">
                    {form.watch('location') || t('Where are you going?')}
                  </span>
                </div>
              </div>
            </Button>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

            <Button
              type="button"
              variant="ghost"
              className="h-full flex-1 rounded-full px-4 py-2 text-left transition-all hover:bg-gray-100 hover:shadow-md dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setShowCheckInModal(true)}
            >
              <div className="ml-2 flex w-full flex-col">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {t('Check in')}
                </span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {form.watch('checkIn')
                      ? formatDate(form.watch('checkIn'))
                      : t('Add date')}
                  </span>
                </div>
              </div>
            </Button>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

            <Button
              type="button"
              variant="ghost"
              className="h-full flex-1 rounded-full px-4 py-2 text-left transition-all hover:bg-gray-100 hover:shadow-md dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setShowCheckOutModal(true)}
            >
              <div className="ml-2 flex w-full flex-col">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {t('Check out')}
                </span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {form.watch('checkOut')
                      ? formatDate(form.watch('checkOut'))
                      : t('Add date')}
                  </span>
                </div>
              </div>
            </Button>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

            <Button
              type="button"
              variant="ghost"
              className="h-full flex-1 rounded-full px-4 py-2 text-left transition-all hover:bg-gray-100 hover:shadow-md dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setShowGuestModal(true)}
            >
              <div className="ml-2 flex w-full flex-col">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {t('Guests')}
                </span>
                <div className="flex items-center gap-2">
                  <User className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {form.watch('guests') > 0
                      ? `${form.watch('guests')} ${t('Guests')}`
                      : t('Add guests')}
                  </span>
                </div>
              </div>
            </Button>

            <Button
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-full bg-rose-600 py-6 text-white hover:bg-rose-700 hover:shadow-md dark:bg-rose-700 dark:hover:bg-rose-800"
            >
              <Search className="text-white" />
              <span className="font-medium">{t('Search')}</span>
            </Button>

            <LocationDialog
              showLocationModal={showLocationModal}
              setShowLocationModal={setShowLocationModal}
              form={form}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              positions={positions}
            />

            <CheckInDialog
              showCheckInModal={showCheckInModal}
              setShowCheckInModal={setShowCheckInModal}
              form={form}
            />

            <CheckOutDialog
              showCheckOutModal={showCheckOutModal}
              setShowCheckOutModal={setShowCheckOutModal}
              form={form}
            />

            <GuestDialog
              showGuestModal={showGuestModal}
              setShowGuestModal={setShowGuestModal}
              form={form}
            />
          </form>
        </Form>
      )}
    </>
  );
}
