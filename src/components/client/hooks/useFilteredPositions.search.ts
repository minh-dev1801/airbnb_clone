import { useMemo } from "react";
import { Position } from "@/lib/client/types/types";
import { normalizeText } from "@/lib/utils";

interface UseFilteredPositionsOptions {
  positions: Position[];
  searchTerm: string;
  maxResults?: number;
  searchFields?: (keyof Position)[];
}

export const useFilteredPositions = ({
  positions,
  searchTerm,
  maxResults = 10,
  searchFields = ["tenViTri", "tinhThanh"],
}: UseFilteredPositionsOptions): Position[] => {
  return useMemo(() => {
    if (!searchTerm) {
      return positions.slice(0, maxResults);
    }

    return positions
      .filter((position) => {
        return searchFields.some((field) => {
          const fieldValue = position[field];
          if (typeof fieldValue === "string") {
            return normalizeText(fieldValue).includes(searchTerm);
          }
          return false;
        });
      })
      .slice(0, maxResults);
  }, [positions, searchTerm, maxResults, searchFields]);
};
