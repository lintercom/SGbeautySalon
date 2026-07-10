import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import sabinaImg from '../pctrs/sabina.jpg';

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF9F6] pb-28 pt-36">
      <div className="page-shell max-w-6xl">
        <div className="mb-16 text-center animate-fade-in">
          <span className="eyebrow mb-5">O mně & salonu</span>
          <h1 className="mb-6 text-5xl text-[#302e2b] md:text-7xl">Sabina Goldbachová</h1>
          <p className="mx-auto max-w-xl text-lg font-light leading-8 text-[#6b6660]">Věřím, že skutečná krása vzniká ve chvíli, kdy se cítíte dobře sama se sebou.</p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="relative lg:sticky lg:top-28">
            <div className="aspect-[3/4] overflow-hidden rounded-[7rem_2rem_2rem_2rem] bg-[#E5E1DA] luxury-shadow">
              <img src={sabinaImg} alt="Sabina Goldbachová" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-6 -right-4 flex items-center gap-2 rounded-full bg-[#A68966] px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white"><Sparkles className="h-4 w-4" /> Péče s citem</div>
          </div>

          <div className="space-y-6 text-[#6b6660] leading-8">
          <p className="font-serif text-2xl leading-9 text-[#3c3c3c] md:text-3xl md:leading-10">
            Jmenuji se Sabina Goldbachová. V mém salonu pracuji s luxusní francouzskou kosmetikou Thalion, která je skutečným klenotem v profesionální péči o pleť. Značka Thalion využívá sílu moře a bohatství mořských řas, které jsou mimořádně bohaté na minerály, vitamíny a stopové prvky.
          </p>
          <p>
            Díky nejmodernějším technologiím a šetrnému zpracování si produkty zachovávají svou výjimečnou čistotu a účinnost. Ošetření s Thalionem nabízí nejen viditelné výsledky v podobě zdravé, zářivé a mladistvé pleti, ale také neobyčejný zážitek plný relaxace a luxusu.
          </p>
          <p>
            Právě proto jsem si tuto značku vybrala – abych vám mohla dopřát to nejlepší, co profesionální kosmetická péče nabízí.
          </p>
          <p>
            Kromě kosmetické péče nabízím také jedinečný Head Spa ritual s profesionální vlasovou kosmetikou Davines. Tato italská značka je proslulá svou filozofií udržitelnosti, krásy a harmonie – kombinuje přírodní ingredience s nejmodernější vědou a přináší tak vlasům i pokožce hlavy dokonalou rovnováhu.
          </p>
          <p>
            Head Spa s Davines je víc než jen ošetření vlasů – je to hluboký relaxační zážitek, který uvolní mysl, povzbudí smysly a navrátí zdraví a vitalitu pokožce i vlasům. Dopřejte si chvíli, kdy se zastaví čas a vy se necháte hýčkat rituálem, který propojuje péči, krásu a odpočinek.
          </p>
          
          <div className="pt-4">
             <Link 
              to="/rezervace" 
              className="group inline-flex items-center gap-3 rounded-full bg-[#3c3c3c] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-[#A68966]"
            >
              Objednat se <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
