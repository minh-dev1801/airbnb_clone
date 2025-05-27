import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { signUp } from '@/lib/client/services/apiService';
import { convertToISODate } from '@/lib/utils';
import useApiMutation from '@/lib/client/services/useApiMutation';
import { SignUp, User } from '@/lib/client/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSchemas } from '@/lib/client/validator/validatior';
import { useCallback } from 'react';
import { DatePickerWithDropdown } from '../common/DatePickerWithDropdown';

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: { user: User }) => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({
  open,
  onOpenChange,
  onSuccess,
  onSwitchToLogin,
}: SignupModalProps) {
  const t = useTranslations('Header');
  const tValidation = useTranslations('ValidationErrors');
  const schemas = createSchemas(tValidation);

  const form = useForm({
    resolver: zodResolver(schemas.signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      birthday: '',
      gender: undefined,
    },
  });

  const { trigger: signUpTrigger, isMutating: isSignUpPending } =
    useApiMutation('signUp', async (data: SignUp) => {
      const res = await signUp(data);
      return res;
    });

  const onSubmit = useCallback(
    async (data: SignUp) => {
      const formattedData = {
        ...data,
        birthday: data.birthday ? convertToISODate(data.birthday) : undefined,
      };

      const res = await signUpTrigger(formattedData);

      if (res.user) {
        onSuccess(res);
      }
    },
    [signUpTrigger, onSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        aria-describedby="signup-desc"
        className="sm:max-w-lg rounded-lg max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('Signup account')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('Create account')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('Enter name')}
                      {...field}
                      className="rounded-lg placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('Enter email')}
                      {...field}
                      className="rounded-lg placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('Enter password')}
                      {...field}
                      className="rounded-lg placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('Enter phone')}
                      {...field}
                      className="rounded-lg placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Birthday')}</FormLabel>
                      <FormControl>
                        <DatePickerWithDropdown
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          minDate={new Date(1900, 0, 1)}
                          maxDate={new Date()}
                          placeholder="DD/MM/YYYY"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Gender')}</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === 'true')
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-lg cursor-pointer w-full">
                            <SelectValue placeholder={t('Select gender')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="dark:bg-gray-800">
                          <SelectItem
                            value="true"
                            className="dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-200"
                          >
                            {t('Male')}
                          </SelectItem>
                          <SelectItem
                            value="false"
                            className="dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-200"
                          >
                            {t('Female')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 rounded-lg py-2 cursor-pointer dark:text-white"
              disabled={isSignUpPending}
            >
              {isSignUpPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin" />
                  <span>{t('Signup')}</span>
                </div>
              ) : (
                <span>{t('Signup')}</span>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm space-x-2">
          <span>{t('Have account')}</span>
          <button
            type="button"
            className="text-rose-500 hover:underline cursor-pointer"
            onClick={onSwitchToLogin}
          >
            {t('Login now')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
