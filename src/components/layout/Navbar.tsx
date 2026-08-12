import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Domů', path: '/' },
  { name: 'Služby', path: '/sluzby' },
  { name: 'O mně', path: '/o-mne' },
  { name: 'Kontakt', path: '/kontakt' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(path);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-all duration-300',
        isScrolled
          ? 'border-[#243128]/10 bg-[#F7F3EC]/94 shadow-[0_12px_40px_rgba(36,49,40,0.06)] backdrop-blur-xl'
          : 'border-[#243128]/8 bg-[#F7F3EC]/90 backdrop-blur-md',
      )}
    >
      <div className="page-shell flex h-full items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" aria-label="SG Beauty Salon – domů">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#A77E4A] font-serif text-xl font-semibold text-[#A77E4A] transition-colors group-hover:bg-[#A77E4A] group-hover:text-white">
            SG
          </span>
          <span className="leading-none">
            <span className="block font-serif text-xl font-semibold tracking-[-0.01em] text-[#243128]">Beauty Salon</span>
            <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.26em] text-[#8E683A] sm:block">Sabina Goldbachová</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hlavní navigace">
          <div className="flex items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.19em]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={cn(
                  'relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#A77E4A] after:transition-transform hover:text-[#A77E4A] hover:after:scale-x-100',
                  isActive(link.path) ? 'text-[#A77E4A] after:scale-x-100' : 'text-[#243128]',
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            to="/rezervace"
            className="corner-hover group inline-flex h-11 items-center gap-3 bg-[#243128] px-5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#A77E4A]"
          >
            Objednat se
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center text-[#243128] md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-t border-[#243128]/10 bg-[#F7F3EC] shadow-[0_24px_60px_rgba(36,49,40,0.12)] md:hidden">
          <nav className="page-shell flex flex-col py-7" aria-label="Mobilní navigace">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between border-b border-[#243128]/10 py-4 font-serif text-3xl',
                  isActive(link.path) ? 'text-[#A77E4A]' : 'text-[#243128]',
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/rezervace"
              className="corner-hover mt-6 inline-flex min-h-14 items-center justify-center gap-3 bg-[#243128] px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Objednat termín <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
