import { Position } from '@/lib/client/types/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { highlightText } from './highlightText';

interface SuggestionItemProps {
  position: Position;
  onSelect: () => void;
  searchTerm: string;
  isValidUrl: (url: string) => boolean;
}

const SuggestionItem = ({
  position,
  onSelect,
  searchTerm,
  isValidUrl,
}: SuggestionItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="flex cursor-pointer items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={onSelect}
      role="link"
      tabIndex={0}
    >
      <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-lg">
        <Image
          src={
            isValidUrl(position.hinhAnh) ? position.hinhAnh : '/placeholder.svg'
          }
          alt={position.tenViTri}
          fill
          className="object-cover"
        />
      </div>
      <div className="truncate max-w-[calc(100%-4rem)]">
        <p className="font-medium text-gray-900 truncate dark:text-white">
          {highlightText(position.tenViTri, searchTerm) ?? position.tenViTri}
        </p>
        <p className="text-sm text-gray-500 truncate dark:text-gray-300">
          {highlightText(position.tinhThanh, searchTerm) ?? position.tinhThanh}
        </p>
      </div>
    </motion.div>
  );
};

export default SuggestionItem;
