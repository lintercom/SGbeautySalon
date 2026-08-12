import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../data/services';
import { format, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Search, Trash2, LogOut } from 'lucide-react';
import { supabase, type BookingRow } from '../lib/supabase';

type BookingStatus = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

type AdminBooking = {
  id: string;
  serviceId: string;
  date: string;
  startAt: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string | null;
  status: Exclude<BookingStatus, 'all'>;
};

export default function Admin() {
  const navigate = useNavigate();
  const adminEmail = import.meta.env.VITE_SUPABASE_ADMIN_EMAIL || 'slavik-petr@seznam.cz';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New states for filtering and tabs
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('confirmed');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const isAdmin = data.session?.user.app_metadata?.role === 'admin';
      setIsLoggedIn(isAdmin);
      if (isAdmin) fetchBookings();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const isAdmin = session?.user.app_metadata?.role === 'admin';
      setIsLoggedIn(isAdmin);
      if (isAdmin) fetchBookings();
      else setBookings([]);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchBookings())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (username.trim().toLowerCase() !== 'admin') {
        setError('Neplatné uživatelské jméno nebo heslo.');
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      });

      if (signInError || data.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Neplatné uživatelské jméno nebo heslo.');
        return;
      }

      setIsLoggedIn(true);
      await fetchBookings();
    } catch {
      setError('Server není dostupný. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .order('start_at', { ascending: true });

      if (fetchError) throw fetchError;

      setBookings(((data || []) as BookingRow[]).map(row => ({
        id: row.id,
        serviceId: row.service_id,
        date: format(new Date(row.start_at), 'yyyy-MM-dd'),
        startAt: row.start_at,
        startTime: format(new Date(row.start_at), 'HH:mm'),
        endTime: format(new Date(row.end_at), 'HH:mm'),
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        customerNote: row.customer_note,
        status: row.status,
      })));
      setError('');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Přihlášení proběhlo, ale rezervace se nepodařilo načíst.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setBookings([]);
    navigate('/');
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (updateError) throw updateError;
      fetchBookings();
    } catch {
      setError('Stav rezervace se nepodařilo změnit.');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Opravdu chcete tuto rezervaci vymazat?')) return;
    
    try {
      const { error: deleteError } = await supabase.from('bookings').delete().eq('id', id);
      if (deleteError) throw deleteError;
      fetchBookings();
    } catch {
      setError('Rezervaci se nepodařilo vymazat.');
    }
  };

  const deleteContact = async (email: string) => {
    if (!window.confirm('Opravdu chcete vymazat tento kontakt a všechny jeho rezervace?')) return;
    
    try {
      const { error: deleteError } = await supabase.from('bookings').delete().eq('customer_email', email);
      if (deleteError) throw deleteError;
      fetchBookings();
    } catch {
      setError('Kontakt se nepodařilo vymazat.');
    }
  };

  const getServiceName = (id: string) => {
    const service = services.find(s => s.id === id);
    return service ? service.name : id;
  };

  const statusLabels: Record<string, string> = {
    pending: 'Čeká na potvrzení',
    confirmed: 'Potvrzeno',
    cancelled: 'Zrušeno',
    completed: 'Proběhlo',
    no_show: 'Nedorazil/a',
  };

  const filteredBookings = useMemo(() => {
    const matchingBookings = bookings.filter(b => {
      const matchesSearch = 
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerPhone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return matchingBookings.sort((a, b) => {
      const difference = new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      return statusFilter === 'completed' ? -difference : difference;
    });
  }, [bookings, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => bookings.reduce<Record<string, number>>((counts, booking) => {
    counts[booking.status] = (counts[booking.status] || 0) + 1;
    return counts;
  }, {}), [bookings]);

  const contacts = useMemo(() => {
    const map = new Map();
    bookings.forEach(b => {
      const key = b.customerEmail.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { 
          name: b.customerName, 
          email: b.customerEmail, 
          phone: b.customerPhone, 
          count: 1, 
          lastVisit: b.date 
        });
      } else {
        const existing = map.get(key);
        existing.count++;
        if (new Date(b.date) > new Date(existing.lastVisit)) {
          existing.lastVisit = b.date;
        }
      }
    });
    return Array.from(map.values())
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
      )
      .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
  }, [bookings, searchTerm]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 pb-20 pt-36 soft-upholstery">
        <div className="w-full max-w-md rounded-[2rem] border border-[#A68966]/15 bg-white p-8 luxury-shadow md:p-10">
          <span className="eyebrow mb-4">Administrace</span>
          <h1 className="mb-8 text-3xl text-[#3c3c3c]">Přihlášení do salonu</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Uživatelské jméno</label>
              <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 focus:outline-none focus:border-[#A68966] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Heslo</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-3.5 focus:outline-none focus:border-[#A68966] transition-colors"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#3c3c3c] py-3.5 text-sm uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#A68966] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Přihlašuji…' : 'Přihlásit se'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell max-w-6xl pb-24 pt-36">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-[#3c3c3c]">Správa salonu</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-[#A68966] transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Odhlásit se</span>
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-[#E5E1DA]">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-2 text-sm uppercase tracking-widest font-medium transition-colors ${
            activeTab === 'bookings' ? 'text-[#A68966] border-b-2 border-[#A68966]' : 'text-gray-500 hover:text-[#3c3c3c]'
          }`}
        >
          Rezervace
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 px-2 text-sm uppercase tracking-widest font-medium transition-colors ${
            activeTab === 'contacts' ? 'text-[#A68966] border-b-2 border-[#A68966]' : 'text-gray-500 hover:text-[#3c3c3c]'
          }`}
        >
          Kontakty
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Hledat podle jména, e-mailu nebo telefonu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E1DA] focus:outline-none focus:border-[#A68966] transition-colors"
          />
        </div>
        
        {activeTab === 'bookings' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus)}
            className="w-full md:w-auto px-4 py-2 border border-[#E5E1DA] focus:outline-none focus:border-[#A68966] transition-colors bg-white"
          >
            <option value="all">Všechny stavy</option>
            <option value="pending">Čekající</option>
            <option value="confirmed">Potvrzené ({statusCounts.confirmed || 0})</option>
            <option value="cancelled">Zrušené</option>
            <option value="completed">Proběhlé ({statusCounts.completed || 0})</option>
            <option value="no_show">Nedorazili</option>
          </select>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-500">Načítání dat...</div>
      ) : activeTab === 'bookings' ? (
        <div className="bg-white border border-[#E5E1DA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1DA]">
                  <th className="p-4 font-serif text-[#3c3c3c]">Datum a čas</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Zákazník</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Služba</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Stav</th>
                  <th className="p-4 font-serif text-[#3c3c3c] text-right">Akce</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Nenalezeny žádné rezervace.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-[#E5E1DA] last:border-0 hover:bg-[#FAF9F6] transition-colors group">
                      <td className="p-4">
                        <div className="font-medium text-[#3c3c3c]">
                          {format(parseISO(booking.date), 'd. MMMM yyyy', { locale: cs })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#3c3c3c]">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                        <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-[#3c3c3c]">{getServiceName(booking.serviceId)}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 text-xs uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          booking.status === 'completed' ? 'bg-[#E8E1D5] text-[#6B665F]' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {statusLabels[booking.status] || booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {booking.status === 'confirmed' ? (
                            <button 
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              className="text-sm text-[#A68966] hover:text-[#8e7555] transition-colors"
                            >
                              Zrušit
                            </button>
                          ) : booking.status === 'pending' ? (
                            <button
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              className="text-sm text-green-600 hover:text-green-800 transition-colors"
                            >
                              Potvrdit
                            </button>
                          ) : (
                            <button 
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              className="text-sm text-green-600 hover:text-green-800 transition-colors"
                            >
                              Obnovit
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Vymazat rezervaci"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E1DA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E5E1DA]">
                  <th className="p-4 font-serif text-[#3c3c3c]">Jméno</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Kontaktní údaje</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Počet návštěv</th>
                  <th className="p-4 font-serif text-[#3c3c3c]">Poslední návštěva</th>
                  <th className="p-4 font-serif text-[#3c3c3c] text-right">Akce</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Nenalezeny žádné kontakty.
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, idx) => (
                    <tr key={idx} className="border-b border-[#E5E1DA] last:border-0 hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-[#3c3c3c]">{contact.name}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#E5E1DA] text-[#A68966] font-medium">
                          {contact.count}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[#3c3c3c]">
                          {format(parseISO(contact.lastVisit), 'd. MMMM yyyy', { locale: cs })}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteContact(contact.email)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors inline-block"
                          title="Vymazat kontakt"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
