import Link from "next/link";
import SubFooter from "./subFooter";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");
  const aboutLinks = t.raw("aboutLinks");
  const communityLinks = t.raw("communityLinks");
  const hostLinks = t.raw("hostLinks");
  const supportLinks = t.raw("supportLinks");

  return (
    <>
      <footer
        className="border-t bg-gray-100 dark:bg-gray-900 dark:border-gray-700"
        role="contentinfo"
      >
        <div className="container mx-auto py-6 px-4 md:px-0">
          <nav
            aria-label="Footer links"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            <div className="space-y-3">
              <h2
                id="footer-about"
                className="font-bold uppercase text-sm text-gray-800 dark:text-gray-100"
              >
                {t("about")}
              </h2>
              <ul
                className="text-sm space-y-3 text-gray-600 dark:text-gray-400"
                aria-labelledby="footer-about"
                role="list"
              >
                {aboutLinks.map((text: string, idx: number) => (
                  <li key={idx}>
                    <Link
                      href="https://www.airbnb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:underline text-sm"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2
                id="footer-community"
                className="font-bold uppercase text-sm text-gray-800 dark:text-gray-100"
              >
                {t("community")}
              </h2>
              <ul
                className="text-sm space-y-3 text-gray-600 dark:text-gray-400"
                aria-labelledby="footer-community"
                role="list"
              >
                {communityLinks.map((text: string, idx: number) => (
                  <li key={idx}>
                    <Link
                      href="https://www.airbnb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:underline text-sm"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2
                id="footer-host"
                className="font-bold uppercase text-sm text-gray-800 dark:text-gray-100"
              >
                {t("host")}
              </h2>
              <ul
                className="text-sm space-y-3 text-gray-600 dark:text-gray-400"
                aria-labelledby="footer-host"
                role="list"
              >
                {hostLinks.map((text: string, idx: number) => (
                  <li key={idx}>
                    <Link
                      href="https://www.airbnb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:underline text-sm"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h2
                id="footer-support"
                className="font-bold uppercase text-sm text-gray-800 dark:text-gray-100"
              >
                {t("support")}
              </h2>
              <ul
                className="text-sm space-y-3 text-gray-600 dark:text-gray-400"
                aria-labelledby="footer-support"
                role="list"
              >
                {supportLinks.map((text: string, idx: number) => (
                  <li key={idx}>
                    <Link
                      href="https://www.airbnb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer hover:underline text-sm"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </footer>
      <SubFooter />
    </>
  );
};

export default Footer;
