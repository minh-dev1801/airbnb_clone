import { useDebounce, useWindowScroll, useToggle } from 'react-use';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useMemo } from 'react';

const BackToTop = () => {
  const { y: scrollY } = useWindowScroll();
  const [isVisible, toggleIsVisible] = useToggle(false);
  const [isScrolling, toggleIsScrolling] = useToggle(false);

  const scrollYThreshold = useMemo(() => Math.floor(scrollY / 10), [scrollY]);

  useDebounce(
    () => {
      toggleIsVisible(scrollY >= 300);
    },
    100,
    [scrollYThreshold]
  );

  const scrollToTop = () => {
    if (isScrolling) return;
    toggleIsScrolling(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      toggleIsScrolling(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-30 sm:bottom-40 right-6 z-100">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full sm:w-16 sm:h-16 w-12 h-12 bg-rose-600 shadow-lg hover:bg-rose-700 transition-transform transform hover:scale-110 cursor-pointer"
        >
          <ArrowUp className="!h-6 !w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default BackToTop;
