import { useMemo } from "react";
import { Position } from "@/lib/client/types/types";
import { useTranslations } from "next-intl";
import SuggestionItem from "./SuggestionItem";
import { isValidUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SuggestionsListProps {
  positions: Position[];
  filteredPositions: Position[];
  isLoading: boolean;
  searchTerm: string;
  onSelect: (position: Position) => void;
  emptyStateMessage?: {
    noData?: string;
    loading?: string;
    noResults?: string;
  };
}

const SuggestionsList = ({
  positions,
  filteredPositions,
  isLoading,
  searchTerm,
  onSelect,
  emptyStateMessage,
}: SuggestionsListProps) => {
  const t = useTranslations("Search");

  const content = useMemo(() => {
    if (positions.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-white">
          {emptyStateMessage?.noData || t("No data")}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-2 p-4 text-center text-sm text-gray-500 dark:text-white">
          <Loader2 className="animate-spin" />
          {emptyStateMessage?.loading || t("Loading")}
        </div>
      );
    }

    if (filteredPositions.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-white">
          {emptyStateMessage?.noResults || t("No results")}
        </div>
      );
    }

    return filteredPositions.map((position) => (
      <SuggestionItem
        key={position.id || position.tenViTri}
        position={position}
        onSelect={() => onSelect(position)}
        searchTerm={searchTerm}
        isValidUrl={isValidUrl}
      />
    ));
  }, [
    positions.length,
    isLoading,
    filteredPositions,
    searchTerm,
    onSelect,
    emptyStateMessage,
    t,
  ]);

  return <>{content}</>;
};

export default SuggestionsList;
