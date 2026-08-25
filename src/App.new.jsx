import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider, useCart } from './context/CartContext';

import PromoBanner from './components/PromoBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import ContactPage from './pages/Contact';
import SizeGuide from './pages/SizeGuide';
import Customization from './pages/Personnalisation'; // Importation de la page de personnalisation

// Création d'un client React Query pour les futures requêtes API
const queryClient = new QueryClient();

// Composant de secours temporaire en attendant le développement individuel des pages
const DummyPage = ({ title }) => {
  if (title === 'Personnalisation') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-premium text-lg sm:text-xl text-velora-dark bg-velora-cream px-6 text-center">
        <div className="max-w-2xl">
          <p className="mb-3 text-2xl sm:text-3xl font-bold">La personnalisation arrive bientôt.</p>
          <p className="text-base sm:text-lg">Préparez-vous à créer un accessoire aussi unique que votre compagnon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center font-premium text-2xl text-velora-dark bg-velora-cream">
      Page : {title} en cours de développement
    </div>
  );
};

function AppContent() {
  const { toast } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-velora-cream">
      <PromoBanner />
      <Navbar />

      {/* Conteneur de Page Dynamique */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/custom" element={<Customization />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/faq" element={<DummyPage title="FAQ" />} />
          <Route path="/login" element={<DummyPage title="Connexion" />} />
        </Routes>
      </main>

      <Footer />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}
