import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchDialog from "./dialogs/SearchMobileDialog";
import { SkeletonCard } from "../common/SkeletonCard";

const SearchPanelMobile = ({ isLoading }: { isLoading: boolean }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="w-sm mx-auto">
      {isLoading ? (
        <SkeletonCard height="h-12" shape="rounded-2xl" />
      ) : (
        <>
          <Button
            variant="ghost"
            aria-label="Open search dialog"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDialog(true);
            }}
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">Start searching</span>
          </Button>

          <SearchDialog open={showDialog} onOpenChange={setShowDialog} />
        </>
      )}
    </div>
  );
};

export default SearchPanelMobile;
