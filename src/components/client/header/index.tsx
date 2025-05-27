import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { navItems } from "@/lib/client/types/dataTypes";
import { useLocale, useTranslations } from "next-intl";
import { useWindowScroll, useDebounce } from "react-use";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getTranslatedItems } from "@/lib/utils";
import Menu from "../menu/index";

const Header = () => {
  const { y } = useWindowScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Header");
  const locale = useLocale();

  useDebounce(
    () => {
      setIsScrolled(y >= 100);
    },
    100,
    [Math.floor(y / 10)]
  );

  const translatedNavItems = getTranslatedItems(navItems, t, "label");

  return (
    <motion.nav
      layout
      initial={{ y: "-102%", opacity: 0 }}
      animate={{
        y: isScrolled ? "-102%" : "0%",
        opacity: isScrolled ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 10, mass: 0.8 }}
      className="fixed z-50 w-full bg-transparent"
    >
      <div className="container mx-auto max-w-screen-xl flex items-center justify-between py-6 px-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={t("Airbnb Home")}
        >
          <div className="relative w-7 h-7 md:w-8 md:h-8">
            <Image src="/airbnb-1.svg" alt="Airbnb Logo" fill sizes="32px" />
          </div>
          <span className="text-custom-rose text-xl md:text-2xl font-extrabold tracking-tight">
            airbnb
          </span>
        </Link>

        <div className="hidden md:flex">
          <ul className="flex space-x-6 font-semibold">
            {translatedNavItems.map((item) => {
              const isActive = pathname === `/${locale}${item.href}`;
              return (
                <li key={item.key}>
                  <Link
                    href={`/${locale}${item.href}`}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-rose-600"
                        : "hover:text-rose-600 text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <Menu />
      </div>
    </motion.nav>
  );
};

export default Header;
