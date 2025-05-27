import { Button } from '@/components/ui/button';
import { useToggle } from 'react-use';
import UpdateUserDialog from './dialogs/UpdateUserDialog';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

const UpdateUser = () => {
  const [showUpdateUserDialog, setShowUpdateUserDialog] = useToggle(false);
  const t = useTranslations('InfoUser');
  
  const handleOpenDialog = () => {
    setShowUpdateUserDialog();
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        variant="link"
        className="underline font-bold text-sm text-gray-700 dark:text-white cursor-pointer p-0 hover:scale-105 hover:text-rose-500 transition-all duration-300"
      >
        <Pencil />
        {t('editProfile')}
      </Button>

      <UpdateUserDialog
        open={showUpdateUserDialog}
        onOpenChange={setShowUpdateUserDialog}
      />
    </>
  );
};

export default UpdateUser;
