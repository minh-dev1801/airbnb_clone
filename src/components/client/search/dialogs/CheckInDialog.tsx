import { DatePickerDialog } from "./DatePickerDialog";
import { SearchType } from "@/lib/client/types/types";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

export const CheckInDialog = ({
  showCheckInModal,
  setShowCheckInModal,
  form,
}: {
  showCheckInModal: boolean;
  setShowCheckInModal: (value: boolean) => void;
  form: UseFormReturn<SearchType>;
}) => {
  const t = useTranslations("Search");
  return (
    <DatePickerDialog
      open={showCheckInModal}
      onOpenChange={setShowCheckInModal}
      form={form}
      fieldName="checkIn"
      title={t("Check in date")}
      description={t("Please select the date you want to check in")}
      autoClose={true}
      disabledDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
    />
  );
};
