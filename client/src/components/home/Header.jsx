'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DropdownUser from '@/dashboard/Topbar/DropdownUser';
import { getToken } from '@/utils/auth';
import { useSelector } from 'react-redux';
import useTranslate from '@/hooks/useTranslation';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslate();
    const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  const classItems = [
    { key: 'class-6', label: 'Class 6' },
    { key: 'class-7', label: 'Class 7' },
    { key: 'class-8', label: 'Class 8' },
    { key: 'class-9', label: 'Class 9' },
    { key: 'ssc', label: 'SSC' },
    { key: 'hsc', label: 'HSC' },
  ];

  const admissionItems = [
    { key: 'medical', label: 'Medical' },
    { key: 'engineering', label: 'Engineering' },
    { key: 'university', label: 'University' },
  ];

  const bcsItems = [
    { key: 'bcs-preliminary', label: 'BCS Preliminary' },
    { key: 'bcs-written', label: 'BCS Written' },
    { key: 'bank-jobs', label: 'Bank Jobs' },
  ];

  const renderSubItems = (items, basePath) => (
    <ul className="pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-300">
      {items.map((item, idx) => (
        <li key={idx}>
          <Link
            href={`/${basePath}`}
            onClick={() => setDrawerOpen(false)}
            className="block py-1"
          >
            {t(item.label)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderDrawerLinks = () => (
    <List className="w-72 p-2 space-y-1 dark:bg-gray-800 text-gray-800 dark:text-white">
      <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'class' ? null : 'class')}>
        <ListItemText primary={t("Class 6–12")} />
        {openSubMenu === 'class' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </ListItem>
      {openSubMenu === 'class' && renderSubItems(classItems, 'study/mcq-question')}

      <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'admission' ? null : 'admission')}>
        <ListItemText primary={t("Admission")} />
        {openSubMenu === 'admission' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </ListItem>
      {openSubMenu === 'admission' && renderSubItems(admissionItems, 'study/mcq-question')}

      <ListItem button onClick={() => setOpenSubMenu(openSubMenu === 'bcs' ? null : 'bcs')}>
        <ListItemText primary={t("Govt. Jobs")} />
        {openSubMenu === 'bcs' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </ListItem>
      {openSubMenu === 'bcs' && renderSubItems(bcsItems, 'study/mcq-question')}

      <ListItem button component={Link} href="/" onClick={() => setDrawerOpen(false)}>
        <ListItemText primary={t("Model Test")} />
        <div className="bg-primary dark:bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full inline-block">
          <Typography variant="caption" className="text-white">
            {t("New")}
          </Typography>
        </div>

      </ListItem>
      <ListItem button component={Link} href="/" onClick={() => setDrawerOpen(false)}>
        <ListItemText primary={t("Bookshelf")} />
      </ListItem>
      <ListItem button component={Link} href="/pacages" onClick={() => setDrawerOpen(false)}>
        <ListItemText primary={t("Packages")} />
      </ListItem>
      <ListItem button component={Link} href="/" onClick={() => setDrawerOpen(false)}>
        <ListItemText primary={t("Mentor Corner")} />
      </ListItem>
    </List>
  );

  const renderDropdown = (items, basePath) => (
    <div className="absolute top-full mt-2 bg-white dark:bg-gray-700 shadow-md rounded z-50 min-w-[180px]">
      {items.map((item) => (
        <Link
          key={item.key}
          href={`/${basePath}`}
          onClick={() => setActiveDropdown('')}
          className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          {t(item.label)}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="bg-white dark:bg-gray-800 fixed top-0 px-0 w-full z-50">
      <div className="flex justify-between items-center py-3 px-5 border border-gray-200 rounded-lg bg-transparent mx-3 mt-2 relative">
        {/* Logo */}
        <Link href="/" passHref>
          <div className="flex items-center gap-1 cursor-pointer">
            <img src="/amar_p_e.png" alt="Logo" className="h-10 w-auto" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav ref={dropdownRef} className="hidden md:flex flex-wrap justify-center text-base gap-4 font-medium items-center relative">
          {[
            { label: "Class 6–12", type: 'class', items: classItems, path: 'study/mcq-question' },
            { label: "Admission", type: 'admission', items: admissionItems, path: 'study/question-bank' },
            { label: "Govt. Jobs", type: 'bcs', items: bcsItems, path: 'study/mcq-question' },
          ].map(({ label, type, items, path }) => (
            <div key={type} className="relative">
              <div
                onClick={() => setActiveDropdown(activeDropdown === type ? '' : type)}
                className="cursor-pointer hover:text-primary transition flex items-center gap-0.5"
              >
                {t(label)} <ArrowDropDownIcon fontSize="small" />
              </div>
              {activeDropdown === type && renderDropdown(items, path)}
            </div>
          ))}

          <Link href="/study/exam" className="flex items-center gap-1 hover:text-primary transition">
            {t("Model Test")}
            <div className="bg-primary dark:bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-full inline-block">
              <Typography variant="caption" className="text-white">
                {t("New")}
              </Typography>
            </div>
          </Link>
          <Link href="/study/book-list" className="hover:text-primary transition">{t("Bookshelf")}</Link>
          <Link href="/pacages" className="hover:text-primary transition">{t("Packages")}</Link>
          <Link href="/" className="hover:text-primary transition">{t("Mentor Corner")}</Link>
        </nav>

        {/* Auth + Hamburger */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownUser />
          ) : (
            <Link href="/signin">
              <button className="bg-primary text-white whitespace-nowrap hover:bg-primaryhover rounded px-4 py-2 text-xs">
                {t("Login / Sign Up")}
              </button>
            </Link>
          )}
          <div className="md:hidden">
            <IconButton onClick={() => setDrawerOpen(true)} className="text-gray-800 dark:text-white">
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="bg-white dark:bg-gray-800 text-black dark:text-white h-full w-72">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <Typography className="font-semibold text-lg text-primary dark:text-white">{t("Menu")}</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} className="text-black dark:text-white">
              <CloseIcon />
            </IconButton>
          </div>
          {renderDrawerLinks()}
        </div>
      </Drawer>

    </header>
  );
}
