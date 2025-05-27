import { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { useTheme } from 'next-themes';
import { useClickAway, useLocalStorage, useToggle } from 'react-use';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu as MenuIcon, Moon, Sun, User, X } from 'lucide-react';
import Link from 'next/link';
import { MouseEvent } from 'react';
import MobileMenu from './MobileMenu';
import { clearUser } from '@/lib/client/store/slices/userSlice';
import { clearSearch } from '@/lib/client/store/slices/searchSlice';
import { showSuccessToast } from '@/lib/client/services/notificationService';
import { User as UserType } from '@/lib/client/types/types';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import ButtonLocale from '../common/button/ButtonLocale';
export default function Menu() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Header');
  const tToast = useTranslations('Toast');
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [visible, setVisible] = useToggle(false);
  const [user, setUser, removeUser] = useLocalStorage<UserType | null>(
    'user',
    null
  );
  const [, setAuthToken, removeAuthToken] = useLocalStorage<string | null>(
    'authToken',
    null
  );

  const userName = useMemo(() => user?.name, [user]);
  const userAvatar = useMemo(() => user?.avatar, [user]);
  const userRole = useMemo(() => user?.role, [user]);

  useClickAway(dropdownRef, () => {
    setDropdownOpen(false);
  });

  const handleSignInSuccess = (data: { token: string; user: UserType }) => {
    setAuthToken(data.token);
    setUser(data.user);
    showSuccessToast(tToast('Login success'));
    setShowLoginModal(false);
  };

  const handleSignUpSuccess = (data: { user: UserType }) => {
    setUser(data.user);
    showSuccessToast(tToast('Signup success'));
    setShowSignupModal(false);
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    dispatch(clearUser());
    dispatch(clearSearch());
    setUser(null);
    setAuthToken(null);
    setDropdownOpen(false);
    showSuccessToast(tToast('Logout success'));
  };

  const handleOpenLoginModal = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowLoginModal(true);
    setDropdownOpen(false);
  };

  const handleOpenSignupModal = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowSignupModal(true);
    setDropdownOpen(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="flex gap-4">
      <ButtonLocale className="hidden lg:flex lg:items-center text-sm text-white" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="text-gray-700 dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent rounded-full transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-white" />
        ) : (
          <Moon className="h-5 w-5 text-white" />
        )}
      </Button>

      <div className="relative" ref={dropdownRef}>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 rounded-full hover:bg-transparent dark:hover:bg-transparent transition-colors px-3 py-1 cursor-pointer p-0"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              aria-controls="user-menu-dropdown"
            >
              <Avatar className="h-8 w-8 flex items-center justify-center">
                {userAvatar && userAvatar.length > 0 ? (
                  <AvatarImage src={userAvatar} />
                ) : (
                  <div className="flex items-center justify-center bg-gray-300 rounded-full bg-gradient-to-br from-rose-300 to-rose-500 p-4">
                    <User className="text-white !h-4 !w-4" />
                  </div>
                )}
              </Avatar>
              <span className="font-medium text-sm text-white capitalize">
                {userName || t('Account')}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                key="dropdown-menu"
                id="user-menu-dropdown"
                role="menu"
                aria-label="User menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
              >
                {userName ? (
                  <>
                    <Link
                      href="/info-user"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {t('Profile')}
                    </Link>
                    {userRole === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                      >
                        {t('Admin Page')}
                      </Link>
                    )}
                    <Link
                      href="/under-dev"
                      className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {t('Settings')}
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <Button
                      variant="ghost"
                      className="w-full inline-block text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                      onClick={handleLogout}
                    >
                      {t('Logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleOpenLoginModal}
                      className="w-full inline-block text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {t('Login')}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleOpenSignupModal}
                      className="w-full inline-block text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm cursor-pointer"
                    >
                      {t('Signup')}
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenu>
      </div>

      <div className="block md:hidden">
        <Button
          variant="ghost"
          onClick={setVisible}
          aria-label="Toggle mobile menu"
          className="hover:bg-transparent dark:hover:bg-transparent transition-colors cursor-pointer"
        >
          {visible ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <MenuIcon className="h-5 w-5 text-white" />
          )}
        </Button>
      </div>

      <MobileMenu visible={visible} setVisible={setVisible} />

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSuccess={handleSignInSuccess}
        onSwitchToSignup={switchToSignup}
      />

      <SignupModal
        open={showSignupModal}
        onOpenChange={setShowSignupModal}
        onSuccess={handleSignUpSuccess}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}
