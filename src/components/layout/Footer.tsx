import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, MapPin, Phone } from 'lucide-react';

const footerLinks = [
  { label: 'Služby a ceník', to: '/sluzby' },
  { label: 'O mně a salonu', to: '/o-mne' },
  { label: 'Kontakt a cesta', to: '/kontakt' },
  { label: 'Online rezervace', to: '/rezervace' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#182019] text-white">
      <div className="page-shell relative py-20 md:py-24">
        <div className="grid gap-10 border-b border-white/12 pb-16 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="mb-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D5B78F]">
              <span className="h-px w-8 bg-current" /> Rezervace
            </span>
            <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
              Vaše chvíle klidu začíná tady.
            </h2>
          </div>
          <Link
            to="/rezervace"
            className="corner-hover group inline-flex min-h-14 items-center justify-center gap-4 bg-[#D5B78F] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#182019] hover:bg-white"
          >
            Objednat termín
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr]">
          <div>
            <Link to="/" className="group inline-flex items-center gap-3" aria-label="SG Beauty Salon – domů">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#D5B78F] font-serif text-xl font-semibold text-[#D5B78F] transition-colors group-hover:bg-[#D5B78F] group-hover:text-[#182019]">
                SG
              </span>
              <span className="leading-none">
                <span className="block font-serif text-2xl font-semibold text-white">Beauty Salon</span>
                <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.24em] text-[#D5B78F]">Sabina Goldbachová</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/55">
              Klidné místo ve Vizovicích, kde se profesionální péče potkává s osobním přístupem.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D5B78F]">Prozkoumat</p>
            <ul className="space-y-3 text-sm text-white/58">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D5B78F]">Kontakt</p>
            <ul className="space-y-5 text-sm leading-6 text-white/58">
              <li>
                <a href="tel:+420720969820" className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-[#D5B78F]" />
                  +420 720 969 820
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D5B78F]" />
                <span>Masarykovo náměstí 144<br />763 12 Vizovice</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D5B78F]">Otevírací doba</p>
            <div className="flex items-start gap-3 text-sm leading-6 text-white/58">
              <Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#D5B78F]" />
              <div>
                <p>Po–Pá: 9:00–16:30</p>
                <p className="mt-2 text-[#D5B78F]">Dle předchozí objednávky</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/12 pt-7 text-[10px] text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link to="/admin" className="transition-colors hover:text-white" title="Administrace" aria-label="Administrace">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </Link>
            <p>© {new Date().getFullYear()} SG Beauty Salon. Všechna práva vyhrazena.</p>
          </div>
          <Link to="/gdpr" className="transition-colors hover:text-white">Ochrana osobních údajů</Link>
        </div>
      </div>
    </footer>
  );
}
