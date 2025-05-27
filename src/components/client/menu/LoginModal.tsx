import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/client/services/apiService";
import useApiMutation from "@/lib/client/services/useApiMutation";
import { SignIn, User } from "@/lib/client/types/types";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: { token: string; user: User }) => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({
  open,
  onOpenChange,
  onSuccess,
  onSwitchToSignup,
}: LoginModalProps) {
  const t = useTranslations("Header");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { trigger: signInTrigger, isMutating: isSignInPending } =
    useApiMutation("signIn", async (data: SignIn) => {
      const res = await signIn(data);
      return res;
    });

  const onSubmit = async (data: SignIn) => {
    const res = await signInTrigger(data);

    if (res.token && res.user) {
      onSuccess(res);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-describedby="login-description"
        className="sm:max-w-lg rounded-lg py-10"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("Login")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("Welcome back")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("Enter email")}
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
                  <FormLabel>{t("Password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("Enter password")}
                      {...field}
                      className="rounded-lg placeholder:text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSignInPending}
                className="w-full bg-rose-500 hover:bg-rose-600 rounded-lg py-2 cursor-pointer"
              >
                {isSignInPending ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin" />
                    <span>{t("Login")}</span>
                  </div>
                ) : (
                  <span>{t("Login")}</span>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center text-sm space-x-2">
          <span>{t("No account")}</span>
          <button
            type="button"
            className="text-rose-500 hover:underline cursor-pointer"
            onClick={onSwitchToSignup}
          >
            {t("Signup")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
