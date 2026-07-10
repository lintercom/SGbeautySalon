import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock3, MapPin, Sparkles } from 'lucide-react';
import { serviceCategories } from '../data/services';
import salonImg from '../pctrs/salon.png';
import recepceImg from '../pctrs/recepce.png';
import logoImg from '../pctrs/logo-removebg-preview.png';

export default function Home() {
  return (
    <div className="pt-20">
      <section className="relative overflow-hidden border-b border-[#A68966]/10 bg-[#FAF9F6] soft-grid">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#E5E1DA]/55 blur-3xl" />
        <div className="page-shell relative grid min-h-[730px] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div className="relative z-10 animate-slide-up lg:py-10">
            <span className="eyebrow mb-7">Beauty Salon · Vizovice</span>
            <h1 className="max-w-2xl text-[3.35rem] leading-[0.98] tracking-[-0.035em] text-[#292724] sm:text-6xl lg:text-[5.3rem]">
              Krása, která
              <span className="mt-2 block italic font-normal text-[#A68966]">vychází zevnitř</span>
            </h1>
            <p className="mt-8 max-w-xl text-base font-light leading-8 text-[#6b6660] sm:text-lg">
              Místo pro váš klid, krásu a sebevědomí. Objevte osobní péči o pleť, vlasy i tělo v příjemném prostředí v srdci Vizovic.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/rezervace" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#3c3c3c] px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-[#A68966] hover:shadow-xl">
                Objednat termín
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link to="/sluzby" className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#A68966]/40 bg-white/70 px-8 py-4 text-xs uppercase tracking-[0.2em] text-[#3c3c3c] backdrop-blur transition-all hover:border-[#A68966] hover:bg-white">
                Prohlédnout služby
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-2 gap-5 border-t border-[#A68966]/20 pt-6 text-sm text-[#6b6660] sm:grid-cols-3">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#A68966]" /> Vizovice</div>
              <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#A68966]" /> Po–Pá</div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1"><Sparkles className="h-4 w-4 text-[#A68966]" /> Osobní péče</div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl animate-fade-in">
            <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-full border border-[#A68966]/30 lg:block" />
            <div className="relative ml-auto aspect-[4/5] w-[92%] overflow-hidden rounded-[2rem_2rem_8rem_2rem] bg-[#E5E1DA] luxury-shadow sm:aspect-[5/4] lg:aspect-[4/5]">
              <img src={salonImg} alt="Interiér SG Beauty Salonu" className="h-full w-full object-cover transition-transform duration-[1600ms] hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302e2b]/30 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-8 left-0 max-w-[310px] rounded-[1.5rem_1.5rem_1.5rem_0] border border-[#A68966]/15 bg-white/95 p-6 shadow-2xl backdrop-blur sm:left-2 sm:max-w-sm sm:p-8">
              <p className="font-serif text-xl italic leading-relaxed text-[#3c3c3c] sm:text-2xl">„Mým cílem není jen zkrášlit, ale pozvednout vaše sebevědomí.“</p>
              <div className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-[#A68966]">
                <span className="h-px w-8 bg-[#A68966]" /> Sabina Goldbachová
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="page-shell">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow mb-5">Rituály krásy</span>
              <h2 className="max-w-xl text-4xl leading-tight md:text-5xl">Péče vybraná přesně pro vás</h2>
            </div>
            <p className="max-w-md leading-7 text-[#77716b]">Od hloubkové kosmetické péče přes oblíbené Head Spa až po úpravu vlasů, řas a obočí.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category, index) => (
              <Link key={category.id} to={`/sluzby/${category.slug}`} className="group relative overflow-hidden rounded-[1.75rem] bg-[#F4F1EC]">
                <div className="aspect-[4/3] overflow-hidden">
                  {category.image ? (
                    <img src={category.image} alt={category.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="grid h-full place-items-center"><Sparkles className="h-12 w-12 text-[#A68966]/50" /></div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b2926]/90 via-[#2b2926]/10 to-transparent" />
                <span className="absolute left-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 text-xs text-white backdrop-blur">{String(index + 1).padStart(2, '0')}</span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                  <h3 className="text-2xl text-white">{category.title}</h3>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#3c3c3c] transition-all group-hover:-rotate-45 group-hover:bg-[#A68966] group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/sluzby" className="inline-flex items-center gap-3 border-b border-[#A68966] pb-1 text-xs uppercase tracking-[0.2em] text-[#3c3c3c] transition-colors hover:text-[#A68966]">
              Celá nabídka a ceník <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#EAE5DE] py-24 md:py-32">
        <div className="page-shell grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[8rem_2rem_2rem_2rem] luxury-shadow">
              <img src={recepceImg} alt="Recepce SG Beauty Salonu" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-7 -right-3 grid h-32 w-32 place-items-center rounded-full bg-[#A68966] p-4 text-center text-[10px] uppercase leading-5 tracking-[0.18em] text-white md:-right-7 md:h-40 md:w-40">
              Krása · Péče · Harmonie
            </div>
          </div>

          <div className="text-center lg:text-left">
            <img src={logoImg} alt="Logo SG Beauty Salon" className="mx-auto mb-5 w-52 lg:mx-0" />
            <span className="eyebrow mb-6">Moje filozofie</span>
            <h2 className="text-4xl leading-tight md:text-5xl">Vaše chvilka klidu uprostřed dne</h2>
            <div className="mt-7 space-y-5 font-light leading-8 text-[#6b6660]">
              <p>V mém salonu se čas na chvíli zastaví. Každé ošetření vybírám s ohledem na vaše přání, potřeby a přirozenou krásu.</p>
              <p>Pracuji s profesionální kosmetikou Thalion a Davines, které spojují sílu přírody s moderními vědeckými poznatky.</p>
            </div>
            <Link to="/o-mne" className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[#A68966]/50 bg-white/40 px-7 py-4 text-xs uppercase tracking-[0.2em] transition hover:bg-white">
              Poznejte mě a salon <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
