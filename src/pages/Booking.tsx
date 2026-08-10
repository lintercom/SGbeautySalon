import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceCategories, services, type Service } from '../data/services';
import { CalendarIcon, Clock, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay, isWeekend } from 'date-fns';
import { cs } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

type Step = 'category' | 'service' | 'datetime' | 'details' | 'summary' | 'success';

function BookingStepHeader({
  stepNumber,
  title,
  onBack,
}: {
  stepNumber: number;
  title: string;
  onBack?: () => void;
}) {
  return (
    <div className="mb-8 flex items-center gap-4 border-b border-[#A77E4A]/15 pb-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Zpět na předchozí krok"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[999px] border border-[#A77E4A]/35 text-[#A77E4A] transition-all duration-300 hover:border-[#A77E4A] hover:bg-[#A77E4A] hover:text-white hover:shadow-[0_8px_22px_rgba(167,126,74,0.18)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
        </button>
      )}
      <div>
        <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A77E4A]">
          Krok {stepNumber} z 5
        </span>
        <h2 className="font-serif text-[1.75rem] font-medium leading-none tracking-[-0.02em] text-[#243128] sm:text-[2rem]">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('sluzba');

  const [step, setStep] = useState<Step>('category');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Details form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (preselectedServiceId) {
      const s = services.find(s => s.id === preselectedServiceId);
      if (s) {
        setCategoryId(s.categoryId);
        setService(s);
        setStep('datetime');
      }
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (!date || !service) return;

    let isCurrent = true;
    const loadAvailableTimes = async () => {
      setIsLoadingTimes(true);
      setAvailabilityError('');
      setAvailableTimes([]);

      const totalDuration = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
      const { data, error } = await supabase.rpc('get_available_slots', {
        p_booking_date: format(date, 'yyyy-MM-dd'),
        p_service_id: service.id,
        p_duration_minutes: totalDuration,
      });

      if (!isCurrent) return;
      if (error) {
        console.error('Nepodařilo se načíst termíny:', error);
        setAvailabilityError('Termíny se nyní nepodařilo načíst. Zkuste to prosím znovu.');
      } else {
        setAvailableTimes((data || []).map((row: { slot: string }) => row.slot));
      }
      setIsLoadingTimes(false);
    };

    loadAvailableTimes();
    return () => { isCurrent = false; };
  }, [date, service]);

  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i)).filter(d => !isWeekend(d));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !service || !date || !time) return;
    
    setIsBooking(true);
    try {
      const totalDuration = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
      const { error } = await supabase.rpc('create_booking', {
        p_service_id: service.id,
        p_service_name: service.name,
        p_duration_minutes: totalDuration,
        p_booking_date: format(date, 'yyyy-MM-dd'),
        p_start_time: time,
        p_customer_name: name,
        p_customer_email: email,
        p_customer_phone: phone,
        p_customer_note: note || null,
      });

      if (!error) {
        setStep('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Rezervaci se nepodařilo vytvořit: ' + error.message);
      }
    } catch (error) {
      alert('Došlo k chybě při komunikaci se serverem.');
    } finally {
      setIsBooking(false);
    }
  };


  const renderProgress = () => {
    const steps: { id: Step; label: string }[] = [
      { id: 'category', label: 'Kategorie' },
      { id: 'service', label: 'Služba' },
      { id: 'datetime', label: 'Termín' },
      { id: 'details', label: 'Údaje' },
      { id: 'summary', label: 'Souhrn' }
    ];

    const currentIndex = steps.findIndex(s => s.id === step);
    if (step === 'success') return null;

    return (
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#E5E1DA] -z-10" />
        {steps.map((s, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={s.id} className="flex flex-col items-center bg-[#FAF9F6] px-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                isCompleted ? "bg-[#A68966] border-[#A68966] text-white" : 
                isCurrent ? "border-[#A68966] text-[#A68966] bg-white" : 
                "border-[#E5E1DA] text-[#9ca3af] bg-white"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium hidden sm:block absolute top-10",
                isCurrent ? "text-[#3c3c3c]" : "text-[#9ca3af]"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 pt-36">
      <div className="page-shell max-w-4xl">
        <div className="text-center mb-12">
          <span className="eyebrow mb-5">Online rezervace</span>
          <h1 className="mb-4 text-4xl text-[#302e2b] md:text-6xl">Vyberte si svůj termín</h1>
          <p className="text-sm text-[#6b6660] md:text-base">Pár jednoduchých kroků k vaší chvíli klidu.</p>
        </div>

        {renderProgress()}

        <div className="min-h-[420px] rounded-[2rem] border border-[#A68966]/15 bg-white p-6 luxury-shadow md:p-10">
          
          {step === 'category' && (
            <div className="animate-fade-in">
              <BookingStepHeader stepNumber={1} title="Vyberte kategorii služeb" />
              <div className="grid gap-4">
                {serviceCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoryId(cat.id);
                      setStep('service');
                    }}
                    className="group flex items-center justify-between rounded-2xl border border-[#E5E1DA] p-5 text-left transition-all hover:border-[#A68966] hover:bg-[#FAF9F6] hover:shadow-md"
                  >
                    <span className="font-medium text-[#3c3c3c] group-hover:text-[#A68966] transition-colors">{cat.title}</span>
                    <ChevronRight className="w-5 h-5 text-[#9ca3af] group-hover:text-[#A68966]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'service' && (
            <div className="animate-fade-in">
              <BookingStepHeader stepNumber={2} title="Vyberte službu" onBack={() => setStep('category')} />
              <div className="grid gap-4">
                {services.filter(s => s.categoryId === categoryId).map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setService(s);
                      setStep('datetime');
                    }}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#E5E1DA] p-5 text-left transition-all hover:border-[#A68966] hover:bg-[#FAF9F6] hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div>
                      <span className="block font-medium text-[#3c3c3c] group-hover:text-[#A68966] transition-colors mb-1">{s.name}</span>
                      <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.displayDuration}</span>
                      </div>
                    </div>
                    <div className="whitespace-nowrap font-sans text-sm font-semibold tabular-nums tracking-[-0.01em] text-[#243128]">
                      {s.displayPrice}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'datetime' && (
            <div className="animate-fade-in">
              <BookingStepHeader stepNumber={3} title="Vyberte datum a čas" onBack={() => setStep('service')} />
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-[#6b7280] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Dostupné dny
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {availableDates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDate(d);
                          setTime(null);
                        }}
                        className={cn(
                          "rounded-xl border p-3 text-center text-sm transition-all",
                          date && isSameDay(d, date) 
                            ? "border-[#A68966] bg-[#A68966] text-white shadow-sm" 
                            : "border-[#E5E1DA] text-[#3c3c3c] hover:border-[#A68966] bg-white"
                        )}
                      >
                        <div className="font-medium">{format(d, 'd. MMMM', { locale: cs })}</div>
                        <div className="text-xs opacity-80">{format(d, 'EEEE', { locale: cs })}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#6b7280] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Čas
                  </h3>
                  {date ? (
                    isLoadingTimes ? (
                      <div className="p-6 text-center text-[#9ca3af] text-sm bg-[#E5E1DA] border border-[#E5E1DA]">
                        Načítání dostupných časů...
                      </div>
                    ) : availabilityError ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                        {availabilityError}
                      </div>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {availableTimes.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => setTime(t)}
                            className={cn(
                              "rounded-xl border p-3 text-center text-sm font-medium transition-all",
                              time === t
                                ? "border-[#A68966] bg-[#A68966] text-white shadow-sm" 
                                : "border-[#E5E1DA] text-[#3c3c3c] hover:border-[#A68966] bg-white"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-red-500 text-sm bg-[#E5E1DA] border border-[#E5E1DA]">
                        V tento den již nejsou žádné volné termíny. Zkuste prosím vybrat jiný den.
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center text-[#9ca3af] text-sm bg-[#E5E1DA] border border-[#E5E1DA]">
                      Nejprve vyberte datum.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E1DA] flex justify-end">
                <button
                  disabled={!date || !time}
                  onClick={() => setStep('details')}
                  className="rounded-full bg-[#3c3c3c] px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#A68966] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Pokračovat
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="animate-fade-in">
              <BookingStepHeader stepNumber={4} title="Vaše údaje" onBack={() => setStep('datetime')} />

              <form onSubmit={(e) => { e.preventDefault(); setStep('summary'); }} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#3c3c3c] mb-1">Jméno a příjmení *</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 outline-none transition-shadow focus:border-[#A68966] focus:ring-1 focus:ring-[#A68966]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3c3c3c] mb-1">Telefon *</label>
                    <input 
                      required
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 outline-none transition-shadow focus:border-[#A68966] focus:ring-1 focus:ring-[#A68966]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#3c3c3c] mb-1">E-mail *</label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 outline-none transition-shadow focus:border-[#A68966] focus:ring-1 focus:ring-[#A68966]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3c3c3c] mb-1">Poznámka (nepovinné)</label>
                  <textarea 
                    rows={3}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 outline-none transition-shadow focus:border-[#A68966] focus:ring-1 focus:ring-[#A68966]"
                    placeholder="Máte nějaké alergie nebo speciální požadavky?"
                  />
                </div>

                <div className="pt-4 border-t border-[#E5E1DA] flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-[#3c3c3c] px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#A68966]"
                  >
                    Zkontrolovat
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'summary' && (
            <div className="animate-fade-in">
              <BookingStepHeader stepNumber={5} title="Souhrn rezervace" onBack={() => setStep('details')} />

              <div className="mb-8 rounded-2xl border border-[#A68966]/15 bg-[#F4F1EC] p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#9ca3af] mb-4">Vybraná služba</h3>
                    <p className="font-serif text-xl text-[#3c3c3c] mb-2">{service?.name}</p>
                    <div className="flex gap-4 text-sm text-[#6b7280]">
                      <span>{service?.displayDuration}</span>
                      <span className="font-sans font-semibold tabular-nums tracking-[-0.01em] text-[#A68966]">{service?.displayPrice}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[#9ca3af] mb-4">Termín</h3>
                    <p className="font-serif text-xl text-[#3c3c3c] mb-2">
                      {date ? format(date, 'd. MMMM yyyy', { locale: cs }) : ''}
                    </p>
                    <p className="text-[#A68966] font-medium text-lg">{time}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest text-[#9ca3af] mb-4">Vaše údaje</h3>
                <div className="text-sm text-[#3c3c3c] space-y-1">
                  <p><strong>Jméno:</strong> {name}</p>
                  <p><strong>Telefon:</strong> {phone}</p>
                  <p><strong>E-mail:</strong> {email}</p>
                  {note && <p><strong>Poznámka:</strong> {note}</p>}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="flex items-start gap-3 cursor-pointer mb-8">
                  <input 
                    type="checkbox" 
                    required
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#A68966] border-[#E5E1DA] rounded focus:ring-[#A68966]"
                  />
                  <span className="text-sm text-[#6b7280]">
                    Souhlasím se zpracováním osobních údajů za účelem vyřízení rezervace a komunikace ohledně termínu podle <a href="/gdpr" target="_blank" className="text-[#A68966] underline">podmínek GDPR</a>. *
                  </span>
                </label>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!consent || isBooking}
                    className="w-full rounded-full bg-[#3c3c3c] px-10 py-4 text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#A68966] disabled:opacity-50 md:w-auto"
                  >
                    {isBooking ? 'Zpracovávám...' : 'Odeslat závaznou rezervaci'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-fade-in text-center py-12">
              <div className="w-20 h-20 bg-[#E5E1DA] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#A68966]" />
              </div>
              <h2 className="text-3xl font-serif text-[#3c3c3c] mb-4">Děkujeme za rezervaci</h2>
              <p className="text-[#6b7280] text-lg max-w-md mx-auto mb-8">
                Váš termín {date ? format(date, 'd. M. yyyy', { locale: cs }) : ''} v {time} jsme zaznamenali. 
                V nejbližší době vás budeme kontaktovat pro potvrzení.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="rounded-full border border-[#3c3c3c] bg-transparent px-8 py-3 text-xs uppercase tracking-[0.2em] text-[#3c3c3c] transition-all duration-300 hover:bg-[#3c3c3c] hover:text-white"
              >
                Zpět na úvod
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
