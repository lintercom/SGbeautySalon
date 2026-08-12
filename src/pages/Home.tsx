import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { serviceCategories } from '../data/services';
import SignatureOrbitDivider from '../components/SignatureOrbitDivider';
import salonImg from '../pctrs/salon.png';
import recepceImg from '../pctrs/recepce.png';

const categoryCardLayout = [
  'lg:col-span-4',
  'lg:col-span-2',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3',
];

export default function Home() {
  return (
    <div className="pt-[72px]">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F7F3EC_0%,#F7F3EC_72%,#FAF8F3_88%,#FCFAF6_100%)]">
        <div className="pointer-events-none absolute inset-0 soft-upholstery [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[#D9DED6]/65 blur-3xl" />

        <div className="page-shell relative grid min-h-[calc(100vh-72px)] items-center gap-14 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:py-20">
          <div className="relative z-10 animate-slide-up">
            <h1 className="max-w-[780px] text-[3.65rem] font-medium leading-[0.88] tracking-[-0.045em] text-[#243128] sm:text-7xl lg:text-[6.35rem]">
              Krása, která
              <span className="block italic text-[#A77E4A]">vychází zevnitř</span>
            </h1>
            <p className="text-pretty mt-8 max-w-lg text-base leading-8 text-[#6B665F] sm:text-lg">
              Osobní rituály pro pleť, vlasy a vaše sebevědomí. Bez spěchu, s respektem k tomu, co potřebujete právě vy.
            </p>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Link
                to="/rezervace"
                className="corner-hover group inline-flex min-h-14 items-center justify-center gap-4 bg-[#243128] px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#A77E4A]"
              >
                Rezervovat návštěvu
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/sluzby"
                className="group inline-flex items-center gap-3 border-b border-[#A77E4A]/50 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#243128] transition-colors hover:border-[#A77E4A] hover:text-[#A77E4A]"
              >
                Prohlédnout služby
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] animate-fade-in lg:mr-0">
            <div className="relative ml-auto aspect-[4/5] w-[92%] overflow-hidden rounded-bl-[1.25rem] rounded-br-[1.25rem] rounded-tl-[4.5rem] rounded-tr-[1.25rem] bg-[#DED8CC] shadow-[0_32px_100px_rgba(36,49,40,0.18)] sm:aspect-[5/4] sm:rounded-bl-[2rem] sm:rounded-br-[2rem] sm:rounded-tl-[7.5rem] sm:rounded-tr-[2rem] lg:aspect-[4/5]">
              <img
                src={salonImg}
                alt="Interiér SG Beauty Salonu ve Vizovicích"
                className="h-full w-full object-cover object-center transition-transform duration-[1600ms] hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182019]/35 via-transparent to-transparent" />
              <span className="absolute bottom-7 right-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90">
                SG Beauty Salon
              </span>
            </div>
            <div className="absolute -bottom-7 left-0 max-w-[290px] border-l-2 border-[#A77E4A] bg-[#F7F3EC] p-6 shadow-[0_18px_55px_rgba(36,49,40,0.13)] sm:max-w-[360px] sm:p-8">
              <p className="font-serif text-2xl italic leading-[1.15] text-[#243128] sm:text-[1.8rem]">
                „Mým cílem není jen zkrášlit, ale pozvednout vaše sebevědomí.“
              </p>
              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A77E4A]">
                Sabina Goldbachová
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FCFAF6] py-24 md:py-32">
        <div className="page-shell">
          <div className="mb-14 grid gap-7 md:grid-cols-[1fr_0.72fr] md:items-end">
            <div>
              <span className="eyebrow mb-5">Rituály krásy</span>
              <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.03em] md:text-7xl">
                Vyberte si péči, na kterou se budete těšit.
              </h2>
            </div>
            <div className="md:pb-2 md:pl-12">
              <p className="text-pretty leading-7 text-[#6B665F]">
                Od hloubkové kosmetické péče přes oblíbené Head Spa až po úpravu vlasů, řas a obočí. Každou návštěvu přizpůsobím vám.
              </p>
              <Link
                to="/sluzby"
                className="group mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#243128] transition-colors hover:text-[#A77E4A]"
              >
                Celá nabídka a ceník
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
            {serviceCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/sluzby/${category.slug}`}
                className={`group relative min-h-[340px] overflow-hidden rounded-[0.875rem] bg-[#E8E1D5] ${categoryCardLayout[index]}`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="grid h-full place-items-center"><Sparkles className="h-10 w-10 text-[#A77E4A]/50" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172019]/90 via-[#172019]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                  <h3 className="max-w-[15rem] text-3xl font-medium leading-none text-white sm:text-4xl">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SignatureOrbitDivider side="left" />

      <section className="relative overflow-hidden bg-[#243128] py-20 md:py-28">
        <div className="page-shell relative">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-10 xl:gap-16">
            <div className="relative min-h-[520px] overflow-hidden rounded-bl-[1.5rem] rounded-br-[1.5rem] rounded-tl-[7rem] rounded-tr-[1.5rem] shadow-[0_32px_90px_rgba(9,14,11,0.3)] sm:min-h-[650px] lg:min-h-[720px]">
              <img
                src={recepceImg}
                alt="Sabina Goldbachová v recepci SG Beauty Salonu"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182019]/45 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex overflow-hidden rounded-bl-[1.5rem] rounded-br-[5rem] rounded-tl-[1.5rem] rounded-tr-[1.5rem] bg-[#F7F3EC] p-8 shadow-[0_32px_90px_rgba(9,14,11,0.28)] sm:p-12 lg:p-12 xl:p-16">
              <div className="flex h-full w-full flex-col">
                <div>
              <span className="mb-7 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A77E4A]">
                <span className="h-px w-8 bg-current" /> Moje filozofie
              </span>
              <h2 className="relative max-w-lg text-5xl font-medium leading-[0.92] tracking-[-0.035em] text-[#243128] md:text-6xl xl:text-7xl">
                Nechte na chvíli svět za dveřmi.
              </h2>
              <div className="text-pretty mt-12 space-y-5 leading-8 text-[#6B665F]">
                <p>
                  V mém salonu se čas na chvíli zastaví. Každé ošetření vybírám podle vašich přání, potřeb a přirozené krásy.
                </p>
                <p>
                  Pracuji s profesionální kosmetikou Thalion a Davines, které spojují sílu přírody s moderními poznatky.
                </p>
              </div>
                </div>

              <Link
                to="/o-mne"
                className="corner-hover group mt-10 inline-flex w-fit items-center gap-4 bg-[#243128] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#A77E4A] lg:mt-auto"
              >
                Poznejte mě a salon
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
