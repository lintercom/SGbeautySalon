# SG Beauty Salon

Web salonu Sabiny Goldbachové ve Vizovicích. Obsahuje katalog služeb, kontaktní informace, online rezervace a administrační přehled.

## Lokální spuštění

Požadavky: Node.js 22+

```bash
npm install
npm run dev
```

Web poběží na `http://localhost:3000`.

## Supabase

Vytvořte `.env.local` podle `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Databázové tabulky, RLS pravidla, rezervační funkce a auditní události jsou definované v `supabase/migrations/`.

Rezervační systém používá:

- `bookings` – rezervace zákazníků,
- `business_hours` – otevírací doba,
- `blocked_periods` – dovolené a blokované termíny,
- `booking_events` – auditní historie změn,
- `get_available_slots()` – bezpečný výpočet volných časů,
- `create_booking()` – validovaný a atomický zápis rezervace.

Přímý anonymní přístup k osobním údajům je zakázaný. Veřejný web může volat pouze dvě omezené databázové funkce.

## Administrace

Administrátor se přihlašuje na `/#/admin` přes Supabase Auth. Přístup k datům je řízený pomocí `app_metadata.role = admin` a RLS.

## Kontroly

```bash
npm run lint
npm run build
```

Push do větve `main` automaticky nasadí statickou část na GitHub Pages.
