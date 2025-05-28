'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchDialog from './dialogs/SearchMobileDialog';
import { SkeletonCard } from '../common/SkeletonCard';
import { useTranslations } from 'next-intl';

const SearchPanelMobile = ({ isLoading }: { isLoading: boolean }) => {
  const [showDialog, setShowDialog] = useState(false);
  const t = useTranslations('SearchPanelMobile');

  return (
    <div className="w-[20rem] sm:w-lg mx-auto mt-0 sm:mt-10 lg:mt-0">
      {isLoading ? (
        <SkeletonCard height="h-12" shape="rounded-2xl" />
      ) : (
        <>
          <Button
            variant="ghost"
            aria-label="Open search dialog"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDialog(true);
            }}
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">{t('startSearching')}</span>
          </Button>

          <SearchDialog open={showDialog} onOpenChange={setShowDialog} />
        </>
      )}
    </div>
  );
};

export default SearchPanelMobile;
