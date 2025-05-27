import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";
import { useLanguageChange } from "../../hooks/useLanguageChange";
import { cn, getLanguages } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ButtonLocale({ className }: { className?: string }) {
  const { handleLanguageChange, open, toggleOpen, locale } =
    useLanguageChange();
  const languages = useMemo(() => getLanguages(), []);
  const tLocale = useTranslations("SubFooter");

  return (
    <Popover open={open} onOpenChange={toggleOpen}>
      <PopoverTrigger
        className={cn(
          "flex space-x-2 hover:underline cursor-pointer",
          className
        )}
      >
        <Globe className="h-5 w-5" />
        <span>{tLocale("language")}</span>
      </PopoverTrigger>
      <PopoverContent className="w-48 py-2 px-0 dark:bg-gray-800">
        {languages.map((language) => (
          <div
            key={language.locale}
            className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleLanguageChange(language.locale)}
          >
            <span>{language.name}</span>
            {locale === language.locale && (
              <Check className="h-4 w-4 text-rose-600" />
            )}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
