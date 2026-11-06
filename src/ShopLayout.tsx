import { useState, useEffect, useLayoutEffect, useRef, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Truck } from 'lucide-react';
import { useShop } from './ShopContext';

export function ShopLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useShop();

  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const prevCartCount = useRef(totalItemCount);

  // Pantalla de carga inicial
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  // Siempre abrir desde arriba del todo al cambiar de ruta
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalItemCount > prevCartCount.current) {
      setShowPlusOne(true);
      const t = setTimeout(() => setShowPlusOne(false), 1000);
      prevCartCount.current = totalItemCount;
      return () => clearTimeout(t);
    } else {
      prevCartCount.current = totalItemCount;
    }
  }, [totalItemCount]);

  return (
    <div className="shop-container">
      {/* Pantalla de carga BESTFITS */}
      {isLoading && (
        <div className={`shop-loader-screen ${isFadingOut ? 'fade-out' : ''}`}>
          <h1 className="shop-loader-title">BESTFITS</h1>
        </div>
      )}

      {/* Header */}
      <nav className={`shop-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="shop-nav-main">
          <div className="shop-nav-left">
            <div className="shop-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              BESTFITS
            </div>
            <div className="shop-nav-links desktop-nav-links">
              <span 
                onClick={() => navigate('/')}
                className={location.pathname === '/' || location.pathname.toLowerCase() === '/shop' ? 'active-link' : ''}
              >
                Home
              </span>
              <span 
                onClick={() => navigate('/all')}
                className={location.pathname.toLowerCase().includes('all') ? 'active-link' : ''}
              >
                TODOS LOS ARTÍCULOS
              </span>
            </div>
          </div>
          <div className="shop-nav-right">
            <Search size={20} style={{ cursor: 'pointer' }} />
            <Truck size={20} style={{ cursor: 'pointer' }} onClick={() => navigate('/tracking')} />
            <div className="shop-cart-btn" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {totalItemCount > 0 && <span className="cart-badge">{totalItemCount}</span>}
              {showPlusOne && <span className="cart-plus-one">+1</span>}
            </div>
          </div>
        </div>
        {/* Mobile secondary links row */}
        <div className="shop-nav-links mobile-nav-links">
          <span 
            onClick={() => navigate('/')}
            className={location.pathname === '/' || location.pathname.toLowerCase() === '/shop' ? 'active-link' : ''}
          >
            Home
          </span>
          <span 
            onClick={() => navigate('/all')}
            className={location.pathname.toLowerCase().includes('all') ? 'active-link' : ''}
          >
            TODOS LOS ARTÍCULOS
          </span>
        </div>
      </nav>

      {/* Main Content wrapped with a key for transition */}
      <div key={location.pathname} className="shop-page-transition">
        {children}
      </div>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="shop-footer-separator"></div>
        <div className="shop-footer-links">
          <span onClick={() => navigate('/contact')}>CONTÁCTANOS</span>
          <span onClick={() => navigate('/faq#terms')}>TÉRMINOS Y CONDICIONES</span>
          <span onClick={() => navigate('/faq#shipping')}>ENVÍOS</span>
          <span onClick={() => navigate('/faq#returns')}>DEVOLUCIONES</span>
        </div>
      </footer>
    </div>
  );
}
