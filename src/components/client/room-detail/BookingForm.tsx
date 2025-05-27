import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { showSuccessToast } from '@/lib/client/services/notificationService';
import { createBooking } from '@/lib/client/services/apiService';
import {
  handleApiError,
  showErrorToast,
} from '@/lib/client/services/notificationService';
import { BookingType, Comment, Room } from '@/lib/client/types/types';
import { AxiosError } from 'axios';
import { convertUSDToVND, formatDate } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, FlagIcon, Minus, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { createSchemas } from '@/lib/client/validator/validatior';
import { User as UserType } from '@/lib/client/types/types';
import { useLocalStorage } from 'react-use';

type BookingFormProps = {
  room: Room;
  comments: Comment[];
};

type PriceSummaryProps = {
  price: number;
  nights: number;
  cleaningFee: number;
  total: number;
};

export default function BookingForm({ room, comments }: BookingFormProps) {
  const pricePerNight = room.giaTien;
  const cleaningFee = 8;
  const [user] = useLocalStorage<UserType | null>('user', null);
  const t = useTranslations('RoomDetail');
  const tValidation = useTranslations('ValidationErrors');
  const locale = useLocale();
  const schemas = createSchemas(tValidation);

  const userID = useMemo(() => user?.id, [user]);

  const form = useForm<BookingType>({
    resolver: zodResolver(schemas.bookingSchema),
    defaultValues: {
      id: 0,
      maPhong: room.id,
      ngayDen: new Date(Date.now() + 1000 * 60 * 60 * 24),
      ngayDi: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      soLuongKhach: 1,
      maNguoiDung: 47042,
    },
  });

  const calculateNights = () => {
    const checkIn = form.watch('ngayDen');
    const checkOut = form.watch('ngayDi');
    if (checkIn && checkOut) {
      const diffTime = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateAverageRating = () => {
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.saoBinhLuan,
      0
    );
    const averageRating = (totalRating / comments.length).toFixed(2);
    return averageRating;
  };

  const nights = calculateNights();
  const total = pricePerNight * nights + cleaningFee;

  const onSubmit = async (data: BookingType) => {
    try {
      if (!userID) {
        showErrorToast(t('loginRequired'));
        return;
      }

      const bookingData = {
        ...data,
        ngayDen: data.ngayDen.toISOString(),
        ngayDi: data.ngayDi.toISOString(),
        maNguoiDung: userID,
      };

      await createBooking(bookingData);
      showSuccessToast(t('bookingSuccess'));
    } catch (error) {
      console.log(error);
      handleApiError(error as AxiosError);
    }
  };

  return (
    <div className="space-y-6 sticky w-full lg:h-[350px] top-32 mb-10">
      <div className="p-6 rounded-lg border-2 border-gray-300 space-y-6 shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:border-1">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="font-bold">
              {locale !== 'vi' && '$'}
              {convertUSDToVND(pricePerNight)}
            </span>{' '}
            {t('perNight')}
          </div>
          <div>
            <span className="space-x-2 flex items-center justify-center">
              <Star className="text-rose-600" />
              <span className="text-black font-bold dark:text-white">
                {calculateAverageRating()}
              </span>
              <span className="text-gray-600 hover:text-rose-600 duration-300 dark:text-white">
                ({comments.length}) {t('reviews')}
              </span>
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DatePicker />
            <GuestCounter form={form} />
            <Button
              type="submit"
              className="bg-rose-600 w-full py-3 rounded-lg font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              {t('checkAvailability')}
            </Button>
          </form>
        </Form>

        <p className="text-center text-gray-400 dark:text-white">
          {t('notChargedYet')}
        </p>
        <PriceSummary
          price={pricePerNight}
          nights={nights}
          cleaningFee={cleaningFee}
          total={total}
        />
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <FlagIcon />
        <Link
          href="/under-dev"
          className="underline hover:text-rose-600 dark:text-white"
        >
          {t('reportListing')}
        </Link>
      </div>
    </div>
  );
}

function DatePicker() {
  const form = useFormContext<BookingType>();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const t = useTranslations('RoomDetail');

  return (
    <div className="grid grid-cols-2 gap-2 border-b pb-4 dark:border-gray-500">
      <div>
        <label className="text-sm font-medium">{t('checkIn')}</label>
        <FormField
          control={form.control}
          name="ngayDen"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start items-center rounded-lg border-gray-300 py-3 pl-3 text-left hover:bg-gray-50 cursor-pointer"
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-white" />
                      <span className="text-gray-700 dark:text-white">
                        {field.value
                          ? formatDate(field.value)
                          : t('selectCheckInDate')}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCheckInOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="dark:bg-gray-800 dark:border-gray-700 dark:border-1 rounded-lg"
                      classNames={{
                        // Header (caption)
                        caption: 'flex justify-center items-center relative',
                        caption_label:
                          'text-lg font-bold text-rose-500 dark:text-rose-400 cursor-default',
                        // Navigation buttons (Previous/Next)
                        nav: 'flex items-center',
                        nav_button:
                          'w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer',
                        nav_button_previous: 'absolute left-2',
                        nav_button_next: 'absolute right-2',
                        // Weekday headers (Mon, Tue,...)
                        head_cell:
                          'text-red-500 dark:text-rose-400 font-bold flex items-center justify-center w-full py-2',
                        // Calendar grid
                        row: 'flex gap-1 mt-1',
                        // Normal day
                        day: 'w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                        // Selected day
                        day_selected:
                          'bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-700 dark:hover:bg-rose-800',
                        // Today
                        day_today:
                          'border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-xs text-red-500 mt-1 min-h-[20px]" />
            </FormItem>
          )}
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t('checkOut')}</label>
        <FormField
          control={form.control}
          name="ngayDi"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start items-center rounded-lg border-gray-300 py-3 pl-3 text-left hover:bg-gray-50 cursor-pointer"
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-white" />
                      <span className="text-gray-700 dark:text-white">
                        {field.value
                          ? formatDate(field.value)
                          : t('selectCheckOutDate')}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCheckOutOpen(false);
                      }}
                      disabled={(date) =>
                        date <= form.watch('ngayDen') ||
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="dark:bg-gray-800 dark:border-gray-700 dark:border-1 rounded-lg"
                      classNames={{
                        // Header (caption)
                        caption: 'flex justify-center items-center relative',
                        caption_label:
                          'text-lg font-bold text-rose-500 dark:text-rose-400 cursor-default',
                        // Navigation buttons (Previous/Next)
                        nav: 'flex items-center',
                        nav_button:
                          'w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer',
                        nav_button_previous: 'absolute left-2',
                        nav_button_next: 'absolute right-2',
                        // Weekday headers (Mon, Tue,...)
                        head_cell:
                          'text-red-500 dark:text-rose-400 font-bold flex items-center justify-center w-full py-2',
                        // Calendar grid
                        row: 'flex gap-1 mt-1',
                        // Normal day
                        day: 'w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                        // Selected day
                        day_selected:
                          'bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-700 dark:hover:bg-rose-800',
                        // Today
                        day_today:
                          'border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700',
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="text-xs text-red-500 mt-1 min-h-[20px]" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function GuestCounter({ form }: { form: UseFormReturn<BookingType> }) {
  const maxGuests = 10;
  const t = useTranslations('RoomDetail');

  return (
    <div className="p-3 border-2 border-gray-600 rounded-lg">
      <div className="mb-3 font-bold">{t('guests')}</div>
      <FormField
        control={form.control}
        name="soLuongKhach"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  className="w-9 h-9 bg-rose-600 hover:bg-rose-700 rounded-full dark:text-white cursor-pointer"
                  onClick={() =>
                    field.value > 1 && field.onChange(field.value - 1)
                  }
                >
                  <Minus />
                </Button>
                <span>
                  {field.value} {t('guestCount')}
                </span>
                <Button
                  type="button"
                  className="w-9 h-9 bg-rose-600 hover:bg-rose-700 rounded-full dark:text-white cursor-pointer"
                  onClick={() =>
                    field.value < maxGuests && field.onChange(field.value + 1)
                  }
                >
                  <Plus />
                </Button>
              </div>
            </FormControl>
            <FormMessage className="text-xs text-center text-red-500 mt-1 min-h-[20px]" />
          </FormItem>
        )}
      />
    </div>
  );
}

function PriceSummary({
  price,
  nights,
  cleaningFee,
  total,
}: PriceSummaryProps) {
  const t = useTranslations('RoomDetail');
  const locale = useLocale();

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-base">
          {locale !== 'vi' && '$'}
          {convertUSDToVND(price)} X {nights} {t('nights')}
        </p>
        <p className="font-mono text-lg font-bold">
          {locale !== 'vi' && '$'}
          {convertUSDToVND(price * nights)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-base">{t('cleaningFee')}</p>
        <p className="font-mono text-lg font-bold">
          {locale !== 'vi' && '$'}
          {convertUSDToVND(cleaningFee)}
        </p>
      </div>
      <div className="mb-5 w-full h-px bg-gray-300 dark:bg-gray-500"></div>
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg">{t('totalBeforeTaxes')}</p>
        <p className="font-mono text-lg font-bold">
          {locale !== 'vi' && '$'}
          {convertUSDToVND(total)}
        </p>
      </div>
    </>
  );
}
