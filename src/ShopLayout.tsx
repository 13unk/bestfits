import { useState, useEffect, useLayoutEffect, useRef, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Truck, Menu } from 'lucide-react';
import { useShop } from './ShopContext';
import { SideDrawer } from './SideDrawer';

const ANNOUNCEMENT_ITEMS = [
  'MÉTODOS DE PAGO FIABLES',
  'CAMBIOS Y DEVOLUCIONES',
  'ENVÍOS EN 24H',
  'ATENCIÓN DIRECTA 7 DÍAS A LA SEMANA',
  'CALIDAD ASEGURADA',
];

export function ShopLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  // Siempre abrir desde arriba del todo y cerrar drawer al cambiar de ruta
  useLayoutEffect(() => {
    setIsDrawerOpen(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

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

      {/* Barra superior de anuncios con marquesina infinita hacia la izquierda */}
      <div className="shop-top-announcement">
        <div className="shop-top-announcement-track">
          <div className="shop-top-announcement-group">
            {[...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS].map((text, i) => (
              <span key={`a-${i}`} className="shop-top-announcement-item">
                <span>{text}</span>
                <span className="bullet">•</span>
              </span>
            ))}
          </div>
          <div className="shop-top-announcement-group" aria-hidden="true">
            {[...ANNOUNCEMENT_ITEMS, ...ANNOUNCEMENT_ITEMS].map((text, i) => (
              <span key={`b-${i}`} className="shop-top-announcement-item">
                <span>{text}</span>
                <span className="bullet">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header con botón Burger */}
      <nav className={`shop-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="shop-nav-main">
          <div className="shop-nav-left">
            <button 
              type="button"
              className="shop-burger-btn" 
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir menú lateral"
            >
              <Menu size={25} />
            </button>
            <div className="shop-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              BESTFITS
            </div>
          </div>

          <div className="shop-nav-right">
            <button 
              type="button"
              className="shop-nav-icon-btn" 
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Buscar artículos"
              title="Buscar"
            >
              <Search size={21} />
            </button>
            <button 
              type="button"
              className="shop-nav-icon-btn" 
              onClick={() => navigate('/tracking')}
              aria-label="Seguimiento de envío"
              title="Seguimiento de envío"
            >
              <Truck size={21} />
            </button>
            <div className="shop-cart-btn" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
              <ShoppingBag size={21} />
              {totalItemCount > 0 && <span className="cart-badge">{totalItemCount}</span>}
              {showPlusOne && <span className="cart-plus-one">+1</span>}
            </div>
          </div>
        </div>
      </nav>

      {/* Menú Lateral Desplegable */}
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      {/* Main Content wrapped with a key for transition */}
      <div key={location.pathname} className="shop-page-transition">
        {children}
      </div>

      {/* Footer */}
      <footer className="shop-footer">
        <div className="shop-footer-main">
          {/* Categorías de la tienda en texto blanco */}
          <div className="shop-footer-categories">
            <span onClick={() => navigate('/all?category=camisetas')}>CAMISETAS</span>
            <span onClick={() => navigate('/all?category=sudaderas')}>SUDADERAS</span>
            <span onClick={() => navigate('/all?category=chaquetas')}>CHAQUETAS</span>
            <span onClick={() => navigate('/all?filter=ofertas')} className="footer-deals-tag">OFERTAS</span>
          </div>

          <div className="shop-footer-separator"></div>

          {/* Enlaces secundarios */}
          <div className="shop-footer-links">
            <span onClick={() => navigate('/contact')}>CONTÁCTANOS</span>
            <span onClick={() => navigate('/faq#terms')}>TÉRMINOS Y CONDICIONES</span>
            <span onClick={() => navigate('/faq#shipping')}>ENVÍOS</span>
            <span onClick={() => navigate('/faq#returns')}>DEVOLUCIONES</span>
            <span onClick={() => navigate('/tracking')}>SEGUIMIENTO</span>
          </div>

          <div className="shop-footer-copy">
            © {new Date().getFullYear()} BESTFITS. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </footer>
    </div>
  );
}
