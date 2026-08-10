/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import SignatureOrbitDivider from './components/SignatureOrbitDivider';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import GDPR from './pages/GDPR';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-[#F7F3EC]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sluzby" element={<Services />} />
            <Route path="/sluzby/:categorySlug" element={<Services />} />
            <Route path="/o-mne" element={<About />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/rezervace" element={<Booking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SignatureOrbitDivider side="right" />
        <Footer />

      </div>
    </Router>
  );
}
