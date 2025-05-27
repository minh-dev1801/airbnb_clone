import { SearchType } from "@/lib/client/types/types";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { DatePickerDialog } from "./DatePickerDialog";

export const CheckOutDialog = ({
  showCheckOutModal,
  setShowCheckOutModal,
  form,
}: {
  showCheckOutModal: boolean;
  setShowCheckOutModal: (value: boolean) => void;
  form: UseFormReturn<SearchType>;
}) => {
  const t = useTranslations("Search");
  return (
    <DatePickerDialog
      open={showCheckOutModal}
      onOpenChange={setShowCheckOutModal}
      form={form}
      fieldName="checkOut"
      title={t("Check out date")}
      description={t("Please select the date you want to check out")}
      autoClose={true}
      disabledDate={(date) =>
        date <=
        (form.watch("checkIn") || new Date(new Date().setHours(0, 0, 0, 0)))
      }
    />
  );
};
