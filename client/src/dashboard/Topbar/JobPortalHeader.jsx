// components/Header/JobPortalHeader.jsx
// Mixed-style modern Job Portal Header with Glass Floating Search Modal (Apple-like)
// Requires: react, next, react-icons, @mui/material, @mui/icons-material, react-redux, tailwindcss

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch, FaTimes } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';

import DropdownUser from '@/dashboard/Topbar/DropdownUser';
import NotificationDropdown from '@/dashboard/Topbar/NotificationDropdown';
import LoginModal from '@/components/SignIn/LoginModal';
import useTranslate from '@/hooks/useTranslation';
import { getToken } from '@/utils/auth';
import { setSearchInput } from '@/Redux/Search/SearchSlice';

export default function JobPortalHeader() {
  const dispatch = useDispatch();
  const { t } = useTranslate();

  const userInfo = useSelector((state) => state.userInfo?.userInfo);
  const searchInput = useSelector((state) => state.search?.searchInput || '');

  const [token, setToken] = useState(getToken());
  const [searchText, setSearchText] = useState(searchInput || '');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keep searchText in sync with redux
  useEffect(() => setSearchText(searchInput || ''), [searchInput]);

  // Token updates (if you emit auth:token-changed)
  useEffect(() => {
    const updateToken = () => setToken(getToken());
    window.addEventListener('auth:token-changed', updateToken);
    return () => window.removeEventListener('auth:token-changed', updateToken);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search modal on ESC and focus management
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isSearchModalOpen) {
          setIsSearchModalOpen(false);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (isSearchModalOpen) {
      // focus the input on open
      setTimeout(() => inputRef.current?.focus(), 80);
      // prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isSearchModalOpen]);

  const handleSearchInput = (e) => {
    const v = e.target.value;
    setSearchText(v);
    dispatch(setSearchInput(v));
  };

  const clearSearchInput = () => {
    setSearchText('');
    dispatch(setSearchInput(''));
  };

  // Close modal when clicking outside modal content
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsSearchModalOpen(false);
    }
  };

  // Sample nav data
  const jobCategories = [
    { key: 'it', label: 'IT & Software' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'design', label: 'Design' },
    { key: 'finance', label: 'Finance' },
    { key: 'sales', label: 'Sales' },
  ];

  const companyMenus = [
    { key: 'top', label: 'Top Companies' },
    { key: 'remote', label: 'Remote' },
    { key: 'startup', label: 'Startups' },
  ];

  const careerResources = [
    { key: 'cv', label: 'CV Templates' },
    { key: 'interview', label: 'Interview Tips' },
    { key: 'guides', label: 'Career Guides' },
  ];

  const renderSubItems = (items, basePath) => (
    <ul className="pl-4 space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.key}>
          <Link
            href={`/${basePath}/${item.key}`}
            onClick={() => setDrawerOpen(false)}
            className="block py-1 hover:text-primary transition"
          >
            {t(item.label)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderDropdown = (items, basePath) => (
    <div className="absolute top-full left-0 mt-2 bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-100 dark:border-gray-700 rounded-2xl p-3 z-50 min-w-[260px]">
      {items.map((item) => (
        <Link
          key={item.key}
          href={`/${basePath}/${item.key}`}
          onClick={() => setActiveDropdown('')}
          className="block px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition"
        >
          {t(item.label)}
        </Link>
      ))}
    </div>
  );



  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      {/* GLASS HEADER */}
      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border-b shadow-lg sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-3 px-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <Image
              src="/amar_p_e.png"
              alt="logo"
              width={120}
              height={36}
              className="opacity-95 hover:opacity-100 transition"
            />
          </Link>

          {/* NAV (LinkedIn-like) */}
          <nav ref={dropdownRef} className="hidden md:flex items-center gap-6 text-sm font-medium">
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'jobs' ? '' : 'jobs')}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                {t('Jobs')} <ArrowDropDownIcon fontSize="small" />
              </button>
              {activeDropdown === 'jobs' && renderDropdown(jobCategories, 'jobs')}
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'companies' ? '' : 'companies')}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                {t('Companies')} <ArrowDropDownIcon fontSize="small" />
              </button>
              {activeDropdown === 'companies' && renderDropdown(companyMenus, 'companies')}
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'career' ? '' : 'career')}
                className="flex items-center gap-1 hover:text-primary transition"
              >
                {t('Career Resources')} <ArrowDropDownIcon fontSize="small" />
              </button>
              {activeDropdown === 'career' && renderDropdown(careerResources, 'career')}
            </div>

            <Link href="/premium" className="hover:text-primary">{t('Premium')}</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Small Search Icon (replaces big search bar) */}
            <button
              aria-label="Open search"
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FaSearch className="text-lg text-gray-700 dark:text-gray-200" />
            </button>

            {/* Notifications / User */}
            {userInfo?.id ? (
              <>
                <NotificationDropdown />
                <DropdownUser />
              </>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm shadow hover:bg-primaryhover transition"
              >
                {t('Sign In')}
              </button>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL - GLASS FLOATING */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={handleOverlayClick}
        >
          {/* backdrop blur */}
          <div className="absolute top-0 inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

          {/* Modal card */}
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl mx-auto mt-20 md:mt-0 bg-white/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-4 md:p-6 backdrop-blur-md transform transition-all duration-200"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FaSearch className="text-xl text-gray-600 dark:text-gray-300" />
                <input
                  ref={inputRef}
                  value={searchText}
                  onChange={handleSearchInput}
                  placeholder={t('Search jobs, companies, skills…')}
                  className="w-full bg-transparent outline-none placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 text-lg md:text-xl"
                />
                {searchText && (
                  <button onClick={clearSearchInput} aria-label="Clear search" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <FaTimes className="text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsSearchModalOpen(false)}
                aria-label="Close search"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Optional: quick suggestions + filters */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('Popular searches')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Frontend Developer', 'Remote', 'Product Manager', 'UX Designer'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSearchText(s);
                        dispatch(setSearchInput(s));
                        // (optional) automatically submit/search
                      }}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm hover:scale-95 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('Filters')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'Full-time', 'Part-time', 'Contract'].map((f) => (
                    <button key={f} className="px-3 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 border text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* (Optional) Search Result Placeholder */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {searchText ? (
                <div>{t('Showing results for')} <strong className="text-gray-900 dark:text-white">{searchText}</strong></div>
              ) : (
                <div className="text-sm text-gray-500">{t('Type to search jobs, companies, or skills')}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-72 h-full bg-white dark:bg-gray-800 p-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-lg">{t('Menu')}</h3>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <List>
            {/* JOBS */}
            <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'jobs' ? null : 'jobs')}>
              <ListItemText primary={t('Job Categories')} />
              {openSubMenu === 'jobs' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </ListItem>
            {openSubMenu === 'jobs' && renderSubItems(jobCategories, 'jobs')}

            {/* COMPANIES */}
            <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'companies' ? null : 'companies')}>
              <ListItemText primary={t('Companies')} />
              {openSubMenu === 'companies' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </ListItem>
            {openSubMenu === 'companies' && renderSubItems(companyMenus, 'companies')}

            {/* RESOURCES */}
            <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'career' ? null : 'career')}>
              <ListItemText primary={t('Career Resources')} />
              {openSubMenu === 'career' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </ListItem>
            {openSubMenu === 'career' && renderSubItems(careerResources, 'career')}

            <ListItem button component={Link} href="/premium" onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={t('Premium')} />
            </ListItem>


            <div className="mt-4 px-2">
              {userInfo?.id ? (
                // <DropdownUser />
                <span className="flex items-center gap-2"> a</span>
              ) : (
                <button
                  onClick={() => { setLoginModalOpen(true); setDrawerOpen(false); }}
                  className="w-full bg-primary text-white py-2 rounded-md"
                >
                  {t('Sign In / Register')}
                </button>
              )}
            </div>
          </List>
        </div>
      </Drawer>
    </>
  );
}
