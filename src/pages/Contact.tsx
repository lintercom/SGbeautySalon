import { MapPin, Phone, Clock } from 'lucide-react';
import recepceImg from '../pctrs/recepce.png';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 pt-36">
      <div className="page-shell max-w-6xl">
        <div className="mb-16 text-center animate-fade-in">
          <span className="eyebrow mb-5">Napište nebo zavolejte</span>
          <h1 className="mb-6 text-5xl text-[#302e2b] md:text-7xl">Těším se na vás</h1>
          <p className="mx-auto max-w-xl text-lg font-light leading-8 text-[#6b6660]">Salon najdete přímo na Masarykově náměstí ve Vizovicích. Termín si můžete pohodlně rezervovat online.</p>
        </div>

        <div className="mb-20 grid items-stretch gap-8 md:grid-cols-2">
          <div className="space-y-8 animate-slide-up md:order-2">
            <div className="h-full space-y-8 rounded-[2rem] border border-[#A68966]/15 bg-white p-8 luxury-shadow md:p-10">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#A68966] shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-lg text-[#3c3c3c] mb-1">Adresa salonu</h3>
                  <p className="text-[#6b7280]">
                    Beauty Salon SG<br/>
                    Masarykovo náměstí 144<br/>
                    763 12, Vizovice
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#A68966] shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-lg text-[#3c3c3c] mb-1">Telefon</h3>
                  <p className="text-[#6b7280]">
                    Sabina Goldbachová<br/>
                    <a href="tel:+420720969820" className="hover:text-[#A68966] transition-colors">
                      +420 720 969 820
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#A68966] shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-lg text-[#3c3c3c] mb-1">Otevírací doba</h3>
                  <p className="text-[#6b7280] mb-2">Po - Pá: 9:00 - 16:30</p>
                  <p className="text-sm font-medium text-[#A68966]">Pracuji dle předešlých objednávek.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[480px] overflow-hidden rounded-[7rem_2rem_2rem_2rem] bg-[#E5E1DA] luxury-shadow md:order-1">
             <img src={recepceImg} alt="Recepce" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#302e2b]/25 to-transparent" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#A68966]/15 bg-white p-7 luxury-shadow animate-slide-up md:p-12">
          <span className="eyebrow mb-4">Cesta k salonu</span>
          <h2 className="mb-8 text-4xl text-[#3c3c3c]">Kde mě najdete</h2>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="space-y-4 text-[#6b7280] leading-relaxed">
              <p>
                Salon se nachází na adrese Masarykovo náměstí 144, 763 12 Vizovice. Najdete mě ve stejné budově jako pekařství Střelná.
              </p>
              <p>
                Pokud přijíždíte ze Zlína, budova se nachází po pravé straně, při příjezdu od Vsetína pak po levé straně. Do budovy vstoupíte stejným vchodem jako do pekařství. Salon se nachází v prvním patře, ve stejné chodbě, ihned po vstupu do budovy první dveře po levé straně. Dveře jsou označené, takže se snadno zorientujete.
              </p>
              <p>
                Na oknech salonu najdete kulaté logo, podle kterého mě nepřehlédnete.
              </p>
              <p className="font-medium text-[#3c3c3c]">
                Přímo před salonem je k dispozici několik parkovacích míst, kde lze parkovat zdarma.
              </p>
            </div>
            <div className="w-full h-full min-h-[340px] lg:min-h-[100%] rounded-[1.5rem] overflow-hidden border border-[#E5E1DA]">
              <iframe 
                src="https://maps.google.com/maps?q=Masarykovo+n%C3%A1m%C4%9Bst%C3%AD+144,+763+12+Vizovice&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '300px' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
