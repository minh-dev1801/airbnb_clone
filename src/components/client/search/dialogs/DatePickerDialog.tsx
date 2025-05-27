import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
  DialogDescription,
} from "@/components/ui/dialog";
import { SearchType } from "@/lib/client/types/types";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface DatePickerDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  form: UseFormReturn<SearchType>;
  fieldName: "checkIn" | "checkOut";
  title: string;
  description: string;
  autoClose?: boolean;
  disabledDate?: (date: Date) => boolean;
}

export const DatePickerDialog = ({
  open,
  onOpenChange,
  form,
  fieldName,
  title,
  description,
  autoClose = false,
  disabledDate,
}: DatePickerDialogProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const t = useTranslations("Search");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg border-0 p-6 shadow-xl md:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-white">
            {description}
          </DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer justify-start rounded-lg border-gray-300 py-3 pl-3 text-left hover:bg-gray-50"
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-white" />
                      <span className="text-gray-700 dark:text-white">
                        {field.value
                          ? formatDate(field.value)
                          : t("Not selected date")}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full rounded-lg border border-gray-200 p-0 shadow-lg"
                    align="center"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        if (autoClose) {
                          setIsPopoverOpen(false);
                          onOpenChange(false);
                        }
                      }}
                      disabled={
                        disabledDate ||
                        ((date) =>
                          date <=
                          (form.watch("checkIn") ||
                            new Date(new Date().setHours(0, 0, 0, 0))))
                      }
                      initialFocus
                      className="dark:bg-gray-800 dark:border-gray-700 dark:border-1 rounded-lg"
                      classNames={{
                        caption:
                          "flex justify-center items-center relative dark:text-white",
                        caption_label:
                          "text-lg font-bold text-rose-500 cursor-default",
                        nav: "flex items-center justify-center",
                        nav_button:
                          "w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 cursor-pointer",
                        nav_button_previous: "absolute left-2",
                        nav_button_next: "absolute right-2",
                        head_cell:
                          "text-red-500 font-bold flex items-center justify-center w-full py-2 ",
                        row: "flex gap-1 mt-1",
                        day: "w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                        day_selected:
                          "bg-rose-600 text-white hover:bg-rose-600 hover:text-white",
                        day_today:
                          "border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:bg-gray-700 dark:text-white",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};
