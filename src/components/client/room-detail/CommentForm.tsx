import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { createComment } from '@/lib/client/services/apiService';
import {
  handleApiError,
  showErrorToast,
  showSuccessToast,
} from '@/lib/client/services/notificationService';
import { AxiosError } from 'axios';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useTranslations } from 'next-intl';
import { CommentType, User as UserType } from '@/lib/client/types/types';
import { createSchemas } from '@/lib/client/validator/validatior';
import { useLocalStorage } from 'react-use';

export default function CommentForm({ id }: { id: number }) {
  const [user] = useLocalStorage<UserType | null>('user', null);

  const userAvatar = useMemo(() => user?.avatar, [user]);
  const userName = useMemo(() => user?.name, [user]);
  const userId = useMemo(() => user?.id, [user]) as number;

  const t = useTranslations('RoomDetail');
  const tValidation = useTranslations('ValidationErrors');
  const commentSchema = createSchemas(tValidation);

  const form = useForm<CommentType>({
    resolver: zodResolver(commentSchema.commentSchema),
    defaultValues: {
      maPhong: id,
      maNguoiBinhLuan: userId,
      ngayBinhLuan: new Date(Date.now()),
      noiDung: '',
      saoBinhLuan: 0,
    },
  });

  const onSubmit = async (data: CommentType) => {
    try {
      const formattedData = {
        maPhong: id,
        maNguoiBinhLuan: userId,
        ngayBinhLuan: new Date(Date.now()).toISOString(),
        noiDung: data.noiDung,
        saoBinhLuan: data.saoBinhLuan,
      };
      const res = await createComment(formattedData);
      if (res) {
        showSuccessToast(t('commentSuccess'));
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof AxiosError && error?.status === 403) {
        showErrorToast(tValidation('needLogin'));
      } else if (error instanceof AxiosError) {
        handleApiError(error);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Avatar className="!h-8 !w-8">
          {userAvatar ? (
            <AvatarImage src={userAvatar} />
          ) : (
            <div className="relative bg-gray-300 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 p-4">
              <User className="text-white h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </Avatar>
        <span className="font-semibold text-sm text-gray-600 dark:text-white">
          {userName || t('comment.defaultUsername')}
        </span>
      </div>

      <div className="mt-3 p-3 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="saoBinhLuan"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <RatingStars
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1 min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noiDung"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={t('comment.placeholder')}
                      className="min-h-20 max-h-60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 mt-1 min-h-[20px]" />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                className="px-5 py-2 rounded-lg bg-rose-600 text-white duration-200 hover:bg-rose-700 cursor-pointer"
              >
                {t('comment.submitButton')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

interface RatingStarsProps {
  value: number;
  onChange: (value: number) => void;
}

const RatingStars = ({ value, onChange }: RatingStarsProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              'h-6 w-6 cursor-pointer',
              starValue <= (hoverValue || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
          />
        );
      })}
    </div>
  );
};
