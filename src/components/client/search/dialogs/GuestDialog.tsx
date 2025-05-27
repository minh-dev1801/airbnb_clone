import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
  DialogDescription,
} from "@/components/ui/dialog";
import { SearchType } from "@/lib/client/types/types";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const GuestDialog = ({
  showGuestModal,
  setShowGuestModal,
  form,
}: {
  showGuestModal: boolean;
  setShowGuestModal: (value: boolean) => void;
  form: UseFormReturn<SearchType>;
}) => {
  const t = useTranslations("Search");
  return (
    <Dialog open={showGuestModal} onOpenChange={setShowGuestModal}>
      <DialogContent className="rounded-lg border-0 p-0 shadow-xl sm:max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("Select number of guests")}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white">
            {t("Ensure the accommodation is suitable for the number of guests")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("Adult")}</p>
                    <p className="text-sm text-gray-500">
                      {t("From 13 years old")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 cursor-pointer rounded-full border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      onClick={() =>
                        field.onChange(Math.max(0, field.value - 1))
                      }
                      disabled={field.value <= 0}
                    >
                      <span className="inline text-lg">-</span>
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {field.value}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 cursor-pointer rounded-full border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      onClick={() => field.onChange(field.value + 1)}
                    >
                      <span className="inline text-lg">+</span>
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
