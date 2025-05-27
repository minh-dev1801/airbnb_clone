import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import ButtonLocale from "../common/button/ButtonLocale";
import { useWindowScroll, useWindowSize } from "react-use";
import { useMemo } from "react";

const SubFooter = () => {
  const t = useTranslations("SubFooter");
  const { scrollY } = useScroll();
  const { y } = useWindowScroll();
  const { height: windowHeight } = useWindowSize();

  const fullHeight =
    typeof document !== "undefined" ? document.documentElement.scrollHeight : 0;

  const isAtBottom = y + windowHeight >= fullHeight - 60;

  const yTransform = useTransform(
    scrollY,
    [0, 300],
    isAtBottom ? [0, 0] : [0, -10]
  );
  const scaleTransform = useTransform(
    scrollY,
    [0, 300],
    isAtBottom ? [1, 1] : [1, 0.98]
  );

  const ySpring = useSpring(yTransform, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });
  const scaleSpring = useSpring(scaleTransform, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <motion.div
      role="contentinfo"
      aria-label="Website footer"
      style={{ y: ySpring, scale: scaleSpring }}
      className={`${
        isAtBottom ? "relative" : "sticky bottom-0 z-50"
      } w-full shadow-2xl dark:shadow-black px-10 justify-between items-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-white py-4 bg-white dark:bg-gray-900 hidden lg:flex`}
    >
      <div>
        <span>© {currentYear} Airbnb, Inc.</span>
        {["privacy", "terms", "sitemap"].map((key) => (
          <Link
            key={key}
            href="https://www.airbnb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 hover:underline"
            aria-label={t(key) + " page"}
          >
            {t(key)}
          </Link>
        ))}
        .
      </div>
      <div className="text-gray-800 dark:text-white flex items-center space-x-3">
        <ButtonLocale />
        {["currency", "support"].map((key) => (
          <button
            key={key}
            type="button"
            className="hover:underline cursor-pointer font-medium px-2 bg-transparent text-inherit border-none"
            aria-label={t(key)}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SubFooter;
