import { useState, useMemo } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerWithDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePickerWithDropdown({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Pick a date",
}: DatePickerWithDropdownProps) {
  const [date, setDate] = useState<Date | undefined>(() => {
    if (!value) return undefined;
    try {
      return parse(value, "dd/MM/yyyy", new Date());
    } catch {
      return undefined;
    }
  });

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => (currentYear - i).toString()),
    [currentYear]
  );

  const updateDate = (updater: (date: Date) => void) => {
    const baseDate = date ?? new Date();
    const updatedDate = new Date(baseDate);
    updater(updatedDate);
    if (
      (minDate && updatedDate < minDate) ||
      (maxDate && updatedDate > maxDate)
    )
      return;
    setDate(updatedDate);
    onChange?.(format(updatedDate, "dd/MM/yyyy"));
  };

  const selectedMonthIndex = date?.getMonth() ?? new Date().getMonth();
  const selectedYear = date?.getFullYear().toString() ?? currentYear.toString();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal cursor-pointer text-sm",
            "rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            "h-9 px-4",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 space-y-2" align="start">
        <div className="flex gap-2">
          <Select
            onValueChange={(val) =>
              updateDate((d) => d.setMonth(MONTHS.indexOf(val)))
            }
            value={MONTHS[selectedMonthIndex]}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {MONTHS.map((month, index) => (
                <SelectItem
                  key={month}
                  value={month}
                  disabled={
                    selectedYear === currentYear.toString() &&
                    index > new Date().getMonth()
                  }
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(val) =>
              updateDate((d) => d.setFullYear(Number(val)))
            }
            value={selectedYear}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!d) return;
            setDate(d);
            onChange?.(format(d, "dd/MM/yyyy"));
          }}
          month={date}
          initialFocus
          fromDate={minDate}
          toDate={maxDate}
          classNames={{
            caption: "flex justify-center items-center relative",
            caption_label:
              "text-lg font-bold text-rose-500 dark:text-rose-400 cursor-default",
            nav: "flex items-center",
            nav_button:
              "w-6 h-6 rounded-full flex items-center justify-center bg-rose-500 text-white hover:bg-rose-700 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer",
            nav_button_previous: "absolute left-2",
            nav_button_next: "absolute right-2",
            head_cell:
              "text-red-500 dark:text-rose-400 font-bold flex items-center justify-center w-full py-2",
            row: "flex gap-1 mt-1",
            day: "w-10 h-10 rounded-full text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
            day_selected:
              "bg-rose-600 text-white hover:bg-rose-600 hover:text-white dark:bg-rose-700 dark:hover:bg-rose-800",
            day_today:
              "border-rose-400 border-2 font-semibold bg-rose-50 text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-gray-700",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
