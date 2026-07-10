export default function GDPR() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 pt-36">
      <div className="page-shell max-w-4xl rounded-[2rem] border border-[#A68966]/15 bg-white p-8 luxury-shadow md:p-14">
        <span className="eyebrow mb-5">Právní informace</span>
        <h1 className="mb-10 text-4xl text-[#3c3c3c] md:text-5xl">Zásady ochrany osobních údajů</h1>
        
        <div className="prose prose-stone max-w-none space-y-6 text-[#6b7280]">
          <div className="bg-[#E5E1DA] border-l-4 border-[#A68966] p-4 mb-8">
            <p className="text-sm text-[#3c3c3c] font-medium m-0">
              Upozornění: Toto je zástupný text. Před spuštěním webu je nutné doplnit skutečné identifikační údaje a text nechat zkontrolovat právním poradcem.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-serif text-[#3c3c3c] mb-4">1. Základní ustanovení</h2>
            <p>
              Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen: „GDPR”) je SG Beauty Salon, Sabina Goldbachová, IČ: [DOPLNIT IČ] se sídlem [DOPLNIT ADRESU] (dále jen: „správce“).
            </p>
            <p>Kontaktní údaje správce jsou:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Adresa: [DOPLNIT ADRESU]</li>
              <li>E-mail: [DOPLNIT E-MAIL]</li>
              <li>Telefon: [DOPLNIT TELEFON]</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#3c3c3c] mb-4">2. Zdroje a kategorie zpracovávaných osobních údajů</h2>
            <p>
              Správce zpracovává osobní údaje, které jste mu poskytl/a, nebo osobní údaje, které správce získal na základě plnění Vaší objednávky. 
              Správce zpracovává Vaše identifikační a kontaktní údaje a údaje nezbytné pro plnění smlouvy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#3c3c3c] mb-4">3. Zákonný důvod a účel zpracování osobních údajů</h2>
            <p>Zákonným důvodem zpracování osobních údajů je:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>plnění smlouvy mezi Vámi a správcem podle čl. 6 odst. 1 písm. b) GDPR,</li>
              <li>oprávněný zájem správce na poskytování přímého marketingu podle čl. 6 odst. 1 písm. f) GDPR,</li>
              <li>Váš souhlas se zpracováním pro účely poskytování přímého marketingu podle čl. 6 odst. 1 písm. a) GDPR.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#3c3c3c] mb-4">4. Doba uchovávání údajů</h2>
            <p>Správce uchovává osobní údaje:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>po dobu nezbytnou k výkonu práv a povinností vyplývajících ze smluvního vztahu mezi Vámi a správcem a uplatňování nároků z těchto smluvních vztahů,</li>
              <li>po dobu, než je odvolán souhlas se zpracováním osobních údajů pro účely marketingu, nejdéle však [DOPLNIT POČET] let.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-[#3c3c3c] mb-4">5. Vaše práva</h2>
            <p>Za podmínek stanovených v GDPR máte:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>právo na přístup ke svým osobním údajům,</li>
              <li>právo opravu osobních údajů,</li>
              <li>právo na výmaz osobních údajů,</li>
              <li>právo vznést námitku proti zpracování,</li>
              <li>právo na přenositelnost údajů,</li>
              <li>právo odvolat souhlas se zpracováním písemně nebo elektronicky na adresu nebo email správce.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
