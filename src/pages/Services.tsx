import { useParams, Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Info } from 'lucide-react';
import { services, serviceCategories } from '../data/services';
import { cn } from '../lib/utils';

export default function Services() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 pt-36">
      <div className="page-shell max-w-6xl">
        <div className="mb-16 text-center animate-fade-in">
          <span className="eyebrow mb-5">Nabídka salonu</span>
          <h1 className="mb-6 text-5xl text-[#302e2b] md:text-7xl">Služby & ceník</h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-8 text-[#6b6660]">
            Vyberte si z mojí nabídky profesionálních ošetření. Každá služba je navržena tak, aby Vám přinesla maximální relaxaci a viditelné výsledky.
          </p>
        </div>

        {/* Categories Nav */}
        <div className="mb-20 flex flex-wrap justify-center gap-2.5">
          <Link
            to="/sluzby"
            className={cn(
              "rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-300",
              !categorySlug 
                ? "bg-[#3c3c3c] text-white border border-[#3c3c3c] shadow-md" 
                : "bg-white text-[#6b6660] hover:border-[#A68966] hover:text-[#A68966] border border-[#E5E1DA]"
            )}
          >
            Všechny služby
          </Link>
          {serviceCategories.map((category) => (
            <Link
              key={category.id}
              to={`/sluzby/${category.slug}`}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-300",
                categorySlug === category.slug
                  ? "bg-[#3c3c3c] text-white border border-[#3c3c3c] shadow-md" 
                  : "bg-white text-[#6b6660] hover:border-[#A68966] hover:text-[#A68966] border border-[#E5E1DA]"
              )}
            >
              {category.title}
            </Link>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-24">
          {serviceCategories
            .filter(cat => !categorySlug || cat.slug === categorySlug)
            .map(category => {
              const categoryServices = services.filter(s => s.categoryId === category.id);
              if (categoryServices.length === 0) return null;

              return (
                <div key={category.id} className="animate-slide-up">
                  <div className="mb-8 flex items-center gap-5">
                    <h2 className="whitespace-nowrap text-3xl text-[#3c3c3c] md:text-4xl">{category.title}</h2>
                    <span className="h-px w-full bg-[#A68966]/20" />
                  </div>
                  <div className="grid gap-5">
                    {categoryServices.map((service) => (
                      <div 
                        key={service.id} 
                        className="group rounded-[1.5rem] border border-[#A68966]/15 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A68966]/35 hover:shadow-[0_20px_50px_rgba(60,60,60,0.08)] md:p-8"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1">
                            <h3 className="mb-3 text-2xl text-[#3c3c3c] transition-colors group-hover:text-[#A68966]">{service.name}</h3>
                            <p className="mb-5 text-sm leading-7 text-[#6b6660] md:text-base">
                              {service.shortDescription || service.fullDescription}
                            </p>
                            
                            {service.includes && (
                              <div className="mb-4">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#A68966] mb-2 block">Obsahuje:</span>
                                <ul className="text-sm text-[#6b7280] space-y-1">
                                  {service.includes.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <span className="w-1 h-1  bg-[#A68966]" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {service.notes && (
                              <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F4F1EC] p-4 text-sm text-[#6b6660]">
                                <Info className="w-4 h-4 text-[#A68966] mt-0.5 shrink-0" />
                                <span>{service.notes}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-4 min-w-[200px]">
                            <div className="flex flex-col gap-2 rounded-2xl border border-[#A68966]/15 bg-[#FAF9F6] p-5">
                              <div className="flex items-center gap-2 text-[#3c3c3c]">
                                <Clock className="w-4 h-4 text-[#A68966]" />
                                <span className="font-medium">{service.displayDuration}</span>
                              </div>
                              <div className="text-xl font-serif text-[#3c3c3c]">
                                {service.displayPrice}
                              </div>
                              {service.packagePriceCZK && (
                                <div className="text-sm text-[#A68966] font-medium">
                                  Balíček: {service.packagePriceCZK} Kč
                                </div>
                              )}
                            </div>
                            
                            {service.isBookable && (
                              <Link 
                                to={`/rezervace?sluzba=${service.id}`}
                                className="group/button flex w-full items-center justify-center gap-2 rounded-full bg-[#3c3c3c] px-6 py-3.5 text-center text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#A68966]"
                              >
                                Vybrat <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
