import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Domů', path: '/' },
    { name: 'Služby', path: '/sluzby' },
    { name: 'O mně', path: '/o-mne' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-[#FAF9F6]/92 backdrop-blur-xl border-b border-[#A68966]/15 h-[72px] shadow-[0_8px_30px_rgba(60,60,60,0.04)]' : 'bg-[#FAF9F6]/95 border-b border-[#A68966]/10 h-24'
      )}
    >
      <div className="h-full page-shell flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="SG Beauty Salon – domů">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#A68966]/50 font-serif text-lg text-[#A68966] transition-all duration-300 group-hover:bg-[#A68966] group-hover:text-white">
            SG
          </span>
          <span className="hidden sm:block leading-none">
            <span className="block font-serif text-lg tracking-wide text-[#2f2b27]">Beauty Salon</span>
            <span className="mt-1 block text-[8px] uppercase tracking-[0.28em] text-[#A68966]">Sabina Goldbachová</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'transition-colors duration-200 pb-1 border-b',
                isActive(link.path)
                  ? 'text-[#A68966] border-[#A68966]' 
                  : 'text-[#3c3c3c] border-transparent hover:text-[#A68966]'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/rezervace"
            className="group inline-flex items-center gap-2 rounded-full bg-[#3c3c3c] px-6 py-3.5 text-[10px] text-white transition-all duration-300 hover:bg-[#A68966] hover:shadow-lg"
          >
            Objednat se
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-[#3c3c3c]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAF9F6]/98 backdrop-blur-xl shadow-xl border-t border-[#A68966]/10 animate-fade-in">
          <nav className="flex flex-col px-6 py-7 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-lg uppercase tracking-wider',
                  isActive(link.path) ? 'text-[#A68966] font-medium' : 'text-[#3c3c3c]'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/rezervace"
              className="rounded-full bg-[#3c3c3c] text-white text-center px-6 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#A68966] mt-2 transition-all duration-300"
            >
              Objednat se
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
