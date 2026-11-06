import { Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './ShopContext';
import { ShopLayout } from './ShopLayout';
import { Shop } from './Shop';
import { AllArticles } from './AllArticles';
import { Product } from './Product';
import { Cart } from './Cart';
import { Tracking } from './Tracking';
import { Faq } from './Faq';
import { Contact } from './Contact';
import './Shop.css';

export default function App() {
  return (
    <ShopProvider>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Shop />} />
        <Route path="/all" element={<ShopLayout><AllArticles /></ShopLayout>} />
        <Route path="/product/:id" element={<ShopLayout><Product /></ShopLayout>} />
        <Route path="/cart" element={<ShopLayout><Cart /></ShopLayout>} />
        <Route path="/tracking" element={<ShopLayout><Tracking /></ShopLayout>} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />

        {/* Legacy /shop aliases */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/all" element={<ShopLayout><AllArticles /></ShopLayout>} />
        <Route path="/shop/product/:id" element={<ShopLayout><Product /></ShopLayout>} />
        <Route path="/shop/cart" element={<ShopLayout><Cart /></ShopLayout>} />
        <Route path="/shop/tracking" element={<ShopLayout><Tracking /></ShopLayout>} />
        <Route path="/shop/faq" element={<Faq />} />
        <Route path="/shop/contact" element={<Contact />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ShopProvider>
  );
}
