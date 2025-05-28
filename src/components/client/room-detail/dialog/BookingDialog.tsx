import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  isLoading?: boolean;
}

const BookingDialog = ({
  open,
  onOpenChange,
  onConfirm,
  checkInDate,
  checkOutDate,
  guestCount,
  isLoading = false,
}: BookingDialogProps) => {
  const t = useTranslations('RoomDetail');

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg py-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('confirmBooking')}
          </DialogTitle>
          <DialogDescription className="text-center dark:text-gray-200">
            <span className="block mb-2">
              <strong>{t('bookingPeriod')}:</strong> {formatDate(checkInDate)} -{' '}
              {formatDate(checkOutDate)}
            </span>
            <span className="block">
              <strong>{t('guestTitle')}:</strong> {guestCount} {" "}
              {t('guest')}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 cursor-pointer"
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 cursor-pointer dark:text-white"
            disabled={isLoading}
          >
            {isLoading ? t('processing') : t('confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
