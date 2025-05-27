import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDate } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useClickAway, useDebounce } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSearch } from '@/lib/client/store/slices/searchSlice';
import {
  showErrorToast,
  showSuccessToast,
} from '@/lib/client/services/notificationService';
import { RootState } from '@/lib/client/store/store';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchemas } from '@/lib/client/validator/validatior';
import { Position, SearchType } from '@/lib/client/types/types';
import { slugify } from 'transliteration';
import { useFilteredPositions } from '../../hooks/useFilteredPositions.search';
import { normalizeText } from '@/lib/utils';
import SuggestionsList from '../../common/search/SuggestionsList';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [openCheckIn, setOpenCheckIn] = useState<boolean>(false);
  const [openCheckOut, setOpenCheckOut] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const positions = useSelector(
    (state: RootState) => state.position
  ) as Position[];
  const t = useTranslations('Search');
  const tValidation = useTranslations('ValidationErrors');
  const schemas = createSchemas(tValidation);

  const filteredPositions = useFilteredPositions({
    positions,
    searchTerm,
    maxResults: 10,
    searchFields: ['tenViTri', 'tinhThanh'],
  });

  useClickAway(suggestionsRef, () => setShowSuggestions(false));

  const form = useForm<SearchType>({
    resolver: zodResolver(schemas.searchSchema),
    defaultValues: {
      location: '',
      checkIn: undefined,
      checkOut: undefined,
      guests: 0,
    },
  });

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setIsLoading(true);
  };

  const handlePositionSelect = (position: Position) => {
    form.setValue('location', position.tenViTri);
    setShowSuggestions(false);
  };

  const handleClearInput = () => {
    form.setValue('location', '');
    setSearchValue('');
  };

  useDebounce(
    () => {
      setSearchTerm(normalizeText(searchValue));
      setIsLoading(false);
    },
    500,
    [searchValue]
  );

  const onSubmitForm = async (data: SearchType) => {
    const listSearchs = {
      location: data.location,
      guests: data.guests,
      checkIn: data.checkIn.toISOString(),
      checkOut: data.checkOut.toISOString(),
    };

    dispatch(setSearch(listSearchs));

    const selectedPosition = positions.find(
      (pos) => pos.tenViTri === data.location
    );

    if (!selectedPosition || !selectedPosition.tinhThanh) {
      showErrorToast(t('Search failed'));
      return;
    }

    showSuccessToast(t('Searching'));

    const slug = slugify(selectedPosition.tinhThanh);
    router.push(`/rooms/${slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:text-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold dark:text-white">
                {t('Search accommodation')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">
                      {t('Location')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="relative">
                          <Input
                            placeholder={t('Search location')}
                            {...field}
                            onClick={(
                              e: React.MouseEvent<HTMLInputElement>
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowSuggestions(true);
                            }}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange(e.target.value);
                            }}
                            onBlur={() => {
                              setShowSuggestions(false);
                            }}
                            className="w-full rounded-xl border-gray-300 py-5 pl-10 text-base shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-300 placeholder:text-sm placeholder:text-gray-700"
                          />
                          <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400 w-4 h-4 dark:text-gray-300" />
                          {field.value && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Clear location input"
                              className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                              onClick={handleClearInput}
                              type="button"
                            >
                              <X className="dark:text-gray-300" />
                            </Button>
                          )}
                        </div>
                        <AnimatePresence>
                          {showSuggestions && (
                            <motion.div
                              ref={suggestionsRef}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute z-20 top-full left-0 w-full max-h-[34vh] overflow-x-hidden overflow-y-auto bg-white shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                              <SuggestionsList
                                positions={positions}
                                filteredPositions={filteredPositions}
                                isLoading={isLoading}
                                searchTerm={searchTerm}
                                onSelect={handlePositionSelect}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">
                      {t('Check-in date')}
                    </FormLabel>
                    <FormControl>
                      <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full cursor-pointer justify-start rounded-lg border-gray-300 py-5 pl-10 text-left hover:bg-gray-50 relative dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                            aria-label="Select check-in date"
                          >
                            <CalendarIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                            <span className="ml-6 text-gray-700 dark:text-gray-300">
                              {field.value
                                ? formatDate(field.value)
                                : t('Add date')}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[325px] rounded-lg border border-gray-200 p-0 shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date: Date | undefined) => {
                              field.onChange(date);
                              setOpenCheckIn(false);
                            }}
                            disabled={(date: Date) =>
                              date <=
                              (field.value ||
                                new Date(new Date().setHours(0, 0, 0, 0)))
                            }
                            initialFocus
                            classNames={{
                              caption:
                                'flex justify-center items-center relative',
                              caption_label:
                                'text-lg font-bold text-rose-500 dark:text-rose-400 cursor-default',
                              nav: 'flex items-center',
                              nav_button:
                                'w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer',
                              nav_button_previous: 'absolute left-2',
                              nav_button_next: 'absolute right-2',
                              head_cell:
                                'text-red-500 dark:text-rose-400 font-bold flex items-center justify-center w-full py-2',
                              row: 'flex gap-1 mt-1',
                              day: 'w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                              day_selected:
                                'bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-700 dark:hover:bg-rose-800',
                              day_today:
                                'border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">
                      {t('Check-out date')}
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={openCheckOut}
                        onOpenChange={setOpenCheckOut}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full cursor-pointer justify-start rounded-lg border-gray-300 py-5 pl-10 text-left hover:bg-gray-50 relative dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                          >
                            <CalendarIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                            <span className="ml-6 text-gray-700 dark:text-gray-300">
                              {field.value
                                ? formatDate(field.value)
                                : t('Add date')}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[325px] rounded-lg border border-gray-200 p-0 shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date: Date | undefined) => {
                              field.onChange(date);
                              setOpenCheckOut(false);
                            }}
                            disabled={(date: Date) => {
                              if (form.watch('checkIn'))
                                return date <= form.watch('checkIn');
                              return (
                                date <=
                                (field.value ||
                                  new Date(new Date().setHours(0, 0, 0, 0)))
                              );
                            }}
                            initialFocus
                            classNames={{
                              caption:
                                'flex justify-center items-center relative',
                              caption_label:
                                'text-lg font-bold text-rose-500 dark:text-rose-400 cursor-default',
                              nav: 'flex items-center',
                              nav_button:
                                'w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer',
                              nav_button_previous: 'absolute left-2',
                              nav_button_next: 'absolute right-2',
                              head_cell:
                                'text-red-500 dark:text-rose-400 font-bold flex items-center justify-center w-full py-2',
                              row: 'flex gap-1 mt-1',
                              day: 'w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                              day_selected:
                                'bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-700 dark:hover:bg-rose-800',
                              day_today:
                                'border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700',
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-white">
                      {t('Number of guests')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t('Add guests')}
                          value={
                            field.value > 0
                              ? `${field.value} ${t('Guests')}`
                              : ''
                          }
                          readOnly
                          className="w-full rounded-lg border-gray-300 py-5 pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-300 placeholder:text-sm placeholder:text-gray-700"
                        />
                        <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
                        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Decrease number of guests"
                            className="h-8 w-8 cursor-pointer rounded-full border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();
                              field.onChange(Math.max(0, field.value - 1));
                            }}
                            disabled={field.value <= 0}
                            type="button"
                          >
                            -
                          </Button>
                          <span className="w-6 text-center dark:text-white">
                            {field.value}
                          </span>
                          <Button
                            variant="outline"
                            aria-label="Increase number of guests"
                            className="h-8 w-8 cursor-pointer rounded-full border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();
                              field.onChange(field.value + 1);
                            }}
                            type="button"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-lg bg-rose-500 py-5 text-lg font-medium text-white shadow-md hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                size="lg"
                aria-label="Submit search form"
              >
                <Search className="mr-2 h-5 w-5" />
                {t('Search')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
