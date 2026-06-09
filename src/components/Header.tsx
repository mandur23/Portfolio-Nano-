import React, { useEffect, useState } from 'react';
import { useEasterEggs } from '../context/EasterEggContext';

const navItems = [
  { href: '#about', label: '소개' },
  { href: '#projects', label: '프로젝트' },
  { href: '#skills', label: '기술' },
  { href: '#contact', label: '연락' },
];

export default function Header() {
  const { handleLogoClick } = useEasterEggs();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a
          href="#about"
          className="header__logo"
          onClick={(event) => handleLogoClick(event)}
        >
          <span className="header__logo-dot" />
          portfolio
        </a>
        <nav className="header__nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="header__link">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
