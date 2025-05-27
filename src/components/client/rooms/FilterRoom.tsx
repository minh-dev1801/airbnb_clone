import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FilterRoom() {
  const t = useTranslations("FilterRoom");

  const filters = [
    "Accommodation type",
    "Price",
    "Book now",
    "Room and bedroom",
    "Other filters",
  ];

  const buttonClass =
    "rounded-lg border text-md px-6 py-2 text-black border-gray-300 duration-300 cursor-pointer hover:bg-rose-100 hover:text-rose-600 hover:border-transparent dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white";

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {filters.map((filter) => (
        <Link
          key={filter}
          href="/under-dev"
          className={buttonClass}
          aria-label={t(filter)}
        >
          {t(filter)}
        </Link>
      ))}
    </div>
  );
}
