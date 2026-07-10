import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#302e2b] text-white pt-20 pb-8">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#A68966]/15" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#A68966]/10" />
      <div className="page-shell relative">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <div>
            <span className="eyebrow mb-5">Rezervace</span>
            <h2 className="max-w-2xl text-3xl leading-tight text-white md:text-5xl">Dopřejte si chvíli, která bude jen vaše.</h2>
          </div>
          <Link to="/rezervace" className="group inline-flex items-center gap-3 rounded-full bg-[#A68966] px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#302e2b]">
            Objednat termín
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 inline-block">
              <div className="w-12 h-12 rounded-full border border-[#A68966] flex items-center justify-center text-[#A68966] font-serif text-xl font-medium">
                SG
              </div>
              <div>
                <h2 className="font-serif text-xl leading-tight text-white">Beauty Salon</h2>
                <p className="text-[10px] tracking-widest uppercase text-[#A68966]">Sabina Goldbachová</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Klidné místo ve Vizovicích, kde se profesionální péče potkává s osobním přístupem.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 text-white">Odkazy</h3>
            <ul className="space-y-4">
              <li><Link to="/sluzby" className="text-gray-400 hover:text-[#A68966] transition-colors">Služby</Link></li>
              <li><Link to="/o-mne" className="text-gray-400 hover:text-[#A68966] transition-colors">O mně</Link></li>
              <li><Link to="/kontakt" className="text-gray-400 hover:text-[#A68966] transition-colors">Kontakt</Link></li>
              <li><Link to="/rezervace" className="text-gray-400 hover:text-[#A68966] transition-colors">Rezervace</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 text-white">Kontakt</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="tel:+420720969820" className="flex items-center gap-2 hover:text-[#A68966] transition-colors">
                  <Phone className="h-4 w-4 text-[#A68966]" />
                  +420 720 969 820
                </a>
              </li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A68966]" /><span>Masarykovo náměstí 144<br />763 12, Vizovice</span></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 text-white">Otevírací doba</h3>
            <ul className="space-y-4 text-gray-400">
              <li>Po - Pá: 9:00 - 16:30</li>
              <li className="mt-4"><span className="text-[#A68966]">Pracuji dle předešlých objednávek.</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Link to="/admin" className="hover:text-white transition-colors" title="Admin">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </Link>
            <p>© {new Date().getFullYear()} SG Beauty Salon. Všechna práva vyhrazena.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/gdpr" className="hover:text-gray-300 transition-colors">Ochrana osobních údajů</Link>
            <a href="[DOPLNIT INSTAGRAM]" target="_blank" rel="noreferrer" className="hover:text-[#A68966] transition-colors">Instagram</a>
            <a href="[DOPLNIT FACEBOOK]" target="_blank" rel="noreferrer" className="hover:text-[#A68966] transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
