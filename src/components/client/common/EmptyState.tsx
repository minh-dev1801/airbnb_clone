import { useTranslations } from "next-intl";
import { FaInfoCircle } from "react-icons/fa";

export default function EmptyState({ title }: { title: string }) {
  const tInfo = useTranslations("Info");
  return (
    <div className="mx-auto container py-12 text-center flex flex-col items-center">
      <div className="text-5xl mb-4 text-rose-500 dark:text-gray-400">
        <FaInfoCircle />
      </div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 ">{tInfo("sorry")}<br />{tInfo("contact")}</p>
    </div>
  );
}
