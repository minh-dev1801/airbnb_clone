import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useToggle } from "react-use";

export const useLanguageChange = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, toggleOpen] = useToggle(false);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) {
      toggleOpen(false);
      return;
    }
    const path = pathname.split("/").slice(2).join("/");
    router.replace(`/${newLocale}/${path}`);
    router.refresh();
    toggleOpen(false);
  };

  return { handleLanguageChange, open, toggleOpen, locale };
};