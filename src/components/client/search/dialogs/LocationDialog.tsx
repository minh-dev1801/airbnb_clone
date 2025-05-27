import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
  DialogDescription,
} from '@/components/ui/dialog';
import { Position, SearchType } from '@/lib/client/types/types';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useDebounce } from 'react-use';
import { useTranslations } from 'next-intl';
import { normalizeText } from '@/lib/utils';
import { useFilteredPositions } from '../../hooks/useFilteredPositions.search';
import SuggestionsList from '../../common/search/SuggestionsList';

const LocationDialog = ({
  showLocationModal,
  setShowLocationModal,
  form,
  showSuggestions,
  setShowSuggestions,
  positions,
}: {
  showLocationModal: boolean;
  setShowLocationModal: (value: boolean) => void;
  form: UseFormReturn<SearchType>;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  positions: Position[];
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const t = useTranslations('Search');

  const filteredPositions = useFilteredPositions({
    positions,
    searchTerm,
    maxResults: 10,
    searchFields: ['tenViTri', 'tinhThanh'],
  });

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setIsLoading(true);
  };

  const handlePositionSelect = (position: Position) => {
    form.setValue('location', position.tinhThanh);
    setShowSuggestions(false);
    setShowLocationModal(false);
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

  return (
    <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
      <DialogContent className="rounded-lg max-w-xl max-h-[80vh] overflow-y-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('Where are you going?')}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white">
            {t('Please select the location you want to go')}
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="m-0">
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="location-input"
                      placeholder={t('Search location')}
                      onClick={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleInputChange(e.target.value);
                      }}
                      onBlur={() => {
                        setShowSuggestions(false);
                      }}
                      className="w-full rounded-lg border-gray-300 py-5 pl-10 text-base focus-visible:ring-0 focus-visible:outline-none"
                    />
                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
                    {field.value && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full"
                        onClick={handleClearInput}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 top-full left-0 w-full max-h-[34vh] overflow-x-hidden overflow-y-auto bg-white shadow-2xl dark:bg-gray-800"
              >
                <SuggestionsList
                  positions={positions}
                  filteredPositions={filteredPositions}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onSelect={handlePositionSelect}
                  emptyStateMessage={{
                    noData: t('No data'),
                    loading: t('Loading'),
                    noResults: t('No results'),
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
