import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-[75vh] place-items-center bg-[#FAF9F6] px-4 pb-24 pt-36 text-center soft-grid">
      <div>
        <span className="font-serif text-8xl italic text-[#A68966]/35 md:text-9xl">404</span>
        <h1 className="mt-2 text-4xl md:text-5xl">Tahle stránka tu není</h1>
        <p className="mx-auto mt-5 max-w-md leading-7 text-[#6b6660]">Možná byla přesunuta, nebo se do adresy vloudila malá chyba.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#3c3c3c] px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-[#A68966]">
          <ArrowLeft className="h-4 w-4" /> Zpět na úvod
        </Link>
      </div>
    </div>
  );
}
