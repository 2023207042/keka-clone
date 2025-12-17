import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RNImage } from './RNImage';
import { RNLabel } from './RNLabel';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SidebarMenu } from './ui/SidePanel';
import { NAV_ITEMS } from '@/config/GlobalVariableConfig';
import logoImage from '../assets/logo.png';

export function RNNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const handleMouseEnter = (idx: number) => setDropdownOpen(idx);
  const handleMouseLeave = () => setDropdownOpen(null);
  const handleDropdownClick = (idx: number) => setDropdownOpen(dropdownOpen === idx ? null : idx);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-[var(--color-primary-600)] border-b border-white/10 shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-3 flex-1">
            <Link className="font-semibold flex items-center gap-3 text-white transition-transform duration-300 hover:scale-105" to="/">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-lg hover:shadow-xl transition-all duration-300">
                <RNImage src={logoImage} alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="hidden lg:block text-lg font-bold"></span>
              <RNLabel label="appName" variant="p1Bold" color="white" />
            </Link>
            
            <div className="lg:flex md:hidden ml-8">
              <nav className="hidden md:flex items-center justify-center">
                {NAV_ITEMS.map((item: any, idx: number) => (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => item.children && handleMouseEnter(idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.children ? (
                      <>
                        <button
                          className="uppercase font-bold text-xs tracking-wide px-5 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center gap-1 hover:scale-105"
                          onClick={() => handleDropdownClick(idx)}
                        >
                          <RNLabel variant="p4Bold" label={item.label} color="white" />
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        {dropdownOpen === idx && (
                          <div className="absolute left-0 top-full min-w-48 mt-2 bg-white border border-gray-100 py-2 rounded-2xl shadow-2xl z-50">
                            {item.children.map((child: any) => (
                              <Link
                                key={child.label}
                                to={child.href}
                                className="block px-5 py-2.5 mx-2 text-gray-700 hover:bg-[var(--color-primary-50)] rounded-xl transition-all duration-300 text-sm font-medium hover:translate-x-1"
                                onClick={() => setDropdownOpen(null)}
                              >
                                <RNLabel variant="p4Bold" label={child.label} />
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className="uppercase font-bold text-xs tracking-wide px-5 py-4 text-white hover:bg-white/10 rounded-xl transition-all duration-300 block hover:scale-105"
                      >
                        <RNLabel variant="p4Bold" label={item.label} color="white" />
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <ThemeSwitcher />
            </div>

            <button
              className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:scale-110"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <SidebarMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
