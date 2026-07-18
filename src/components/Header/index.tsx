"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import menuData from "./menuData";
import { useAuth } from "@/ContextApi/AuthContext";
import AuthModal from "../AuthModal/authModal";
import { User, LogIn, LogOut } from 'lucide-react';

// TypeScript interfaces
interface SubmenuItem {
  title: string;
  path: string;
}

interface MenuItem {
  id?: number;
  title: string;
  path?: string;
  submenu?: SubmenuItem[];
}

const Header = (): JSX.Element => {
  const { isAuthenticated, logout, isLoading, } = useAuth();

  // const { isLogout, isLoading } = logout();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const pathUrl = usePathname();
  const { theme, setTheme } = useTheme();
  // const { logout, setlogout } = logout();


  const headerRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const togglerRef = useRef<HTMLButtonElement>(null);

  // Contact information
  const contactEmail = "info@mahandipurbalaji.com"; // Replace with your actual email
  const contactPhone = "+91 8559833140"; // Replace with your actual phone number

  // State management
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [sticky, setSticky] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);







  // Navbar toggle with memoization to prevent unnecessary re-renders
  const navbarToggleHandler = useCallback((): void => {
    setNavbarOpen(prev => !prev);
    // When opening the menu, we should close any open submenus
    setOpenIndex(-1);
  }, []);

  // Memoized submenu handler
  const handleSubmenu = useCallback((index: number): void => {
    setOpenIndex(prev => (prev === index ? -1 : index));
  }, []);

  const handleLogout = () => {
    logout(); // Directly calling logout from context
  };

  // Sticky navbar handler with throttling to improve performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleStickyNavbar = (): void => {
      // Clear previous timeout to prevent multiple executions
      clearTimeout(timeoutId);

      // Set a small timeout to throttle the scroll event
      timeoutId = setTimeout(() => {
        setSticky(window.scrollY >= 80);
      }, 10);
    };

    window.addEventListener("scroll", handleStickyNavbar);

    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
      clearTimeout(timeoutId);
    };
  }, []);

  // const logout = () => {

  // };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        navbarRef.current &&
        togglerRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        !togglerRef.current.contains(event.target as Node)
      ) {
        setNavbarOpen(false);
        setOpenIndex(-1);
      }
    };

    // Close mobile menu on ESC key press for accessibility
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setNavbarOpen(false);
        setOpenIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [navbarOpen]);




  return (
    <header
      ref={headerRef}
      className={`fixed left-0 top-0 lg:top-0 z-[999] w-full transition-all duration-300 ${sticky
        ? "bg-white dark:bg-dark/95 shadow-lg border-b border-stroke/80 dark:border-dark-3/20 lg:top-0"
        : "bg-white dark:bg-dark/95"
        }`}
      role="banner"
    >
      {/* Top Bar for Contact Information */}
      <div className="hidden lg:block w-full bg-white-100 dark:bg-dark-2/90 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center space-x-6 text-sm">
            {/* Email */}
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              aria-label="Email us"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{contactEmail}</span>
            </a>

            <a
              href={`tel:${contactPhone}`}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              aria-label="Call us"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{contactPhone}</span>
            </a>


            {/* Profile + Logout */}
            {isAuthenticated && (
              <>
                {/* Profile Icon */}
                <Link href='/profile'>  <div className="flex items-center gap-2">
                  <User className="text-orange-500" size={20} />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Profile</span>
                </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setNavbarOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 rounded-full"
                >
                  <LogOut className="mr-2" size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Main Navigation Bar */}
      <div className="container mx-auto px-2">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="w-60  lg:w-40 max-w-full">
            <Link
              href="/"
              className={`block transition-all duration-300 ${sticky ? "py-2" : "py-4"}`}
              aria-label="Company Logo"
            >
              <Image
                src="/images/logo/Logo.png"
                alt="logo"
                width={190}
                height={70}
                className="w-full dark:hidden transition-opacity hover:opacity-90"
                priority
              />
              <Image
                src="/images/logo/Logo.png"
                alt="logo"
                width={190}
                height={70}
                className="hidden w-full dark:block transition-opacity hover:opacity-90"
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={togglerRef}
            onClick={navbarToggleHandler}
            aria-label={navbarOpen ? "Close menu" : "Open menu"}
            aria-expanded={navbarOpen}
            aria-controls="navbarCollapse"
            className={`${navbarOpen
              ? "lg:hidden relative z-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              : "absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-white focus:ring-2 lg:hidden"
              }`}
          >
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${navbarOpen
                ? "translate-y-1.5 rotate-45 bg-orange-500"
                : "bg-dark dark:bg-white"
                } ${!sticky && pathUrl === "/" ? "bg-black" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded my-1.5 transition-all duration-300 ${navbarOpen
                ? "opacity-0"
                : "bg-dark dark:bg-white"
                } ${!sticky && pathUrl === "/" ? "bg-black" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded transition-all duration-300 ${navbarOpen
                ? "-translate-y-1.5 -rotate-45 bg-orange-500"
                : "bg-dark dark:bg-white"
                } ${!sticky && pathUrl === "/" ? "bg-black" : ""}`}
            />
          </button>

          {/* Main Navigation */}
          <div className="flex-1 flex justify-center">
            <nav
              ref={navbarRef}
              id="navbarCollapse"
              aria-label="Main Navigation"
              className={`lg:flex lg:static ${navbarOpen
                ? "fixed inset-0 z-40 bg-white dark:bg-dark-2 overflow-y-auto pt-20 px-6"
                : "hidden"
                }`}
            >
              <ul className="flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-8 xl:space-x-10">
                {/* Mobile-only contact info at the top of the mobile menu */}
                {navbarOpen && (
                  <li className="lg:hidden border-b border-gray-200 dark:border-dark-3/20 pb-5 mb-4">
                    <div className="flex flex-col space-y-4">
                      {/* Email */}
                      <a
                        href={`mailto:${contactEmail}`}
                        className="flex items-center !text-2xl !font-bold text-dark dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300"
                        aria-label="Email us"
                      >
                        <svg
                          className="w-7 h-7 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>{contactEmail}</span>
                      </a>

                      {/* Phone */}
                      <a
                        href={`tel:${contactPhone}`}
                        className="flex items-center !text-2xl !font-semibold text-dark dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300"
                        aria-label="Call us"
                      >
                        <svg
                          className="w-7 h-7 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>{contactPhone}</span>
                      </a>

                      {isAuthenticated && (
                        <div className="lg:hidden flex flex-col space-y-4 mt-2">
                          {/* Profile Link */}
                          <a
                            href="/profile"
                            className="flex items-center px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-3 text-sm font-medium text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-dark-4 transition-all"
                          >
                            <User className="text-orange-500 mr-3" size={20} />
                            Profile
                          </a>

                          {/* Logout Button */}
                          <button
                            onClick={() => {
                              logout();
                              setNavbarOpen(false);
                            }}
                            className="flex items-center justify-center px-4 py-3 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-all"
                          >
                            <LogOut className="mr-2" size={18} />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </li>

                )}

                {menuData.map((menuItem, index) =>
                  menuItem.path ? (
                    <li key={`menu-item-${index}`} className="group relative">
                      <Link
                        onClick={() => setNavbarOpen(false)}
                        scroll={false}
                        href={menuItem.path}
                        className={`text-xl relative font-semibold transition-colors duration-200 ${pathUrl === menuItem.path
                          ? "text-orange-500 dark:text-orange-400"
                          : sticky || pathUrl !== "/" || navbarOpen
                            ? "text-dark hover:text-orange-500 dark:text-white dark:hover:text-orange-400"
                            : "text-dark hover:text-orange-500 dark:text-white dark:hover:text-orange-400"
                          }`}
                        aria-current={pathUrl === menuItem.path ? "page" : undefined}
                      >
                        {menuItem.title}
                        <span
                          className={`absolute left-0 bottom-0 h-0.5 bg-orange-500 transition-all duration-300 ${pathUrl === menuItem.path ? "w-full" : "w-0 group-hover:w-full"
                            }`}
                          aria-hidden="true"
                        ></span>
                      </Link>
                    </li>
                  ) : (
                    <li className="group relative" key={`menu-item-${index}`}>
                      <button
                        onClick={() => handleSubmenu(index)}
                        className={`flex items-center text-xl font-semibold transition-colors duration-200 ${openIndex === index
                          ? "text-orange-500 dark:text-orange-400"
                          : sticky || pathUrl !== "/" || navbarOpen
                            ? "text-dark hover:text-orange-500 dark:text-white dark:hover:text-orange-400"
                            : "text-dark hover:text-orange-300"
                          }`}
                        aria-expanded={openIndex === index}
                        aria-controls={`submenu-${index}`}
                      >
                        {menuItem.title}
                        <span className="ml-1 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true">
                          <svg
                            className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </button>

                      <div
                        id={`submenu-${index}`}
                        className={`lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:min-w-[200px] rounded-md overflow-hidden transition-all duration-300 ${openIndex === index
                          ? "opacity-100 visible mt-2 lg:transform lg:translate-y-0"
                          : "opacity-0 invisible h-0 lg:h-auto lg:transform lg:-translate-y-2"
                          }`}
                        role="menu"
                      >
                        <div className="bg-white dark:bg-dark-2 shadow-lg rounded-md p-4 lg:p-5 mt-2 lg:mt-2 border border-stroke/10 dark:border-dark-3/20">
                          {menuItem?.submenu?.map((submenuItem, i) => (
                            <Link
                              href={submenuItem.path ?? ""}
                              key={`submenu-item-${i}`}
                              onClick={() => {
                                setOpenIndex(-1);
                                setNavbarOpen(false);
                              }}
                              className={`text-lg block px-5 py-3 font-medium rounded-md transition-colors duration-200 ${pathUrl === submenuItem.path
                                ? "text-orange-500 bg-orange-50 dark:bg-dark-3/30 dark:text-orange-400"
                                : "text-gray-700 hover:text-orange-500 hover:bg-orange-50 dark:text-dark-6 dark:hover:text-orange-400 dark:hover:bg-dark-3/30"
                                }`}
                              role="menuitem"
                              aria-current={pathUrl === submenuItem.path ? "page" : undefined}
                            >
                              {submenuItem.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                )}
                <div className="lg:hidden space-y-4 border-t border-gray-200 dark:border-dark-3/20 pt-5 mt-5">
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setNavbarOpen(false)
                      }}
                      className="w-full flex items-center justify-center px-6 py-3 text-lg font-medium text-orange border border-orange-500 bg-white-500 hover:bg-orange-600 hover:text-white transition-all duration-300 rounded-full"
                    >
                      <LogIn className="mr-2" size={24} />
                      Login/Register
                    </button>
                  )}
                </div>
              </ul>


            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="hidden items-center lg:flex space-x-6">
            {/* Theme Toggler */}
            <button
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-dark-3/30 text-dark dark:text-white`}
            >
              {/* Dark Mode Icon */}
              <svg
                viewBox="0 0 24 24"
                className="hidden h-5 w-5 fill-current dark:block"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4-2.28 5.39 5.39 0 0 1-1.14-3.27 5.39 5.39 0 0 1 1.66-3.91c.04-.04.08-.07.12-.1A9.004 9.004 0 0 0 12 3z" />
              </svg>

              {/* Light Mode Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current dark:hidden"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 6a6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>

            {/* {
              !isAuthenticated ?


                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="relative px-6 py-3 text-base font-medium text-orange border  border-orange-500 bg-white-500 hover:bg-orange-600 hover:text-white transition-all duration-300 rounded-full overflow-hidden group focus:ring-2 focus:ring-orange-300 focus:outline-none"
                >
                  Login/Register
                </button>
                :
           
                <Link
                  href="/contact"
                  className="relative px-6 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 rounded-full overflow-hidden group focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  aria-label="Contact us"
                >

                  <span className="relative z-10">Get in touch</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></span>
                  <span className="absolute top-0 left-0 w-20 h-full bg-white/20 transform -skew-x-30 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000" aria-hidden="true"></span>
                </Link>
            } */}

            {!isAuthenticated ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden lg:flex px-6 py-3 text-base font-medium text-orange border border-orange-500 bg-white-500 hover:bg-orange-600 hover:text-white transition-all duration-300 rounded-full overflow-hidden group focus:ring-2 focus:ring-orange-300 focus:outline-none"
              >
                Login/Register
              </button>
            ) : (
              <Link
                href="/contact"
                className="hidden lg:flex relative px-6 py-3 text-base font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 rounded-full overflow-hidden group focus:ring-2 focus:ring-orange-300 focus:outline-none"
                aria-label="Contact us"
              >
                <span className="relative z-10">Get in touch</span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></span>
                <span className="absolute top-0 left-0 w-20 h-full bg-white/20 transform -skew-x-30 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000" aria-hidden="true"></span>
              </Link>
            )}

            {/* Mobile Buttons */}


          </div>
        </div>
      </div>
      <AuthModal
        mt={3}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;