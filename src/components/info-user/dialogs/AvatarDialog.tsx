import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Form } from '@/components/ui/form';
import { AvatarForm } from '@/lib/client/types/types';
import useApiMutation from '@/lib/client/services/useApiMutation';
import { updateAvatar } from '@/lib/client/services/apiService';
import { Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/client/store/slices/userSlice';

interface AvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvatarDialog = ({ open, onOpenChange }: AvatarDialogProps) => {
  const t = useTranslations('InfoUser');
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useDispatch();

  const form = useForm<AvatarForm>({
    defaultValues: {
      avatar: undefined,
    },
  });

  const { trigger, isMutating } = useApiMutation(
    'updateAvatar',
    async (data: File) => {
      const res = await updateAvatar(data);
      return res;
    }
  );

  const onSubmit = async (data: AvatarForm) => {
    if (data.avatar && data.avatar[0]) {
      const file = data.avatar[0];

      if (file.size > 5 * 1024 * 1024) {
        form.setError('avatar', {
          message: 'File size must be less than 5MB',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        form.setError('avatar', {
          message: 'Please select a valid image file',
        });
        return;
      }

      try {
        const userData = await trigger(file);
        dispatch(setUser(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        onOpenChange(false);
        form.reset();
        setPreview(null);
      } catch (error) {
        console.error('Upload failed:', error);
        form.setError('avatar', {
          message: 'Upload failed. Please try again.',
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.clearErrors('avatar');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-title"
        aria-describedby="avatar-description"
        className="sm:max-w-lg rounded-lg py-10"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('updateAvatar')}
          </DialogTitle>
          <DialogDescription className="text-center dark:text-gray-300">
            {t('chooseImage')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('avatarImage')}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleFileChange(e);
                      }}
                      className="rounded-lg cursor-pointer hover:scale-101 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {preview && (
              <div className="flex justify-center mt-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={preview}
                    alt={t('avatarPreview')}
                    className="object-cover rounded-full"
                    fill
                    sizes="128px"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={!form.watch('avatar')?.length || isMutating}
                className="w-full bg-rose-500 hover:bg-rose-600 rounded-lg py-2 cursor-pointer dark:text-white"
              >
                {isMutating ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" />
                    <span>{t('upload')}</span>
                  </div>
                ) : (
                  <span>{t('upload')}</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarDialog;
