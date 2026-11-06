import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Shop.css';
import { Product } from './Product';
import { AllArticles } from './AllArticles';
import { ShopLayout } from './ShopLayout';

export interface ProductItem {
  id: number;
  name: string;
  brand: string;
  color: string;
  price: string;
  image: string;
  images: string[];
  description: string;
}

export const productsData: ProductItem[] = [
  { 
    id: 1, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '1€', 
    image: '/Ropa/1A.jpg', 
    images: ['/Ropa/1A.jpg', '/Ropa/1B.jpg', '/Ropa/1C.jpg', '/Ropa/1D.jpg'],
    description: 'Camiseta de corte relajado confeccionada en algodón orgánico de alto gramaje con gráfico psicodélico Casablanca Paris en el pecho y espalda.' 
  },
  { 
    id: 2, 
    name: 'Camiseta Amiri', 
    brand: 'Amiri',
    color: 'Negro',
    price: '2€', 
    image: '/Ropa/2A.jpg', 
    images: ['/Ropa/2A.jpg', '/Ropa/2B.jpg', '/Ropa/2C.jpg', '/Ropa/2D.jpg'],
    description: 'Camiseta negra clásica de cuello redondo con el monograma MA de Amiri en el pecho y el logo serigrafiado en la espalda.' 
  },
  { 
    id: 3, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '3€', 
    image: '/Ropa/3A.jpg', 
    images: ['/Ropa/3A.jpg', '/Ropa/3D.jpg', '/Ropa/3B.jpg', '/Ropa/3C.jpg'],
    description: 'Camiseta premium en color negro con motivo gráfico de diamante y monograma entrelazado Casa Blanca en el frontal y dorso.' 
  },
  { 
    id: 4, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '4€', 
    image: '/Ropa/4D.jpg', 
    images: ['/Ropa/4D.jpg', '/Ropa/4A.jpg', '/Ropa/4B.jpg', '/Ropa/4C.jpg'],
    description: 'Camiseta de algodón con ilustración en arco de atardecer, palmera y horizonte arquitectónico Casa Blanca.' 
  },
  // 12 artículos genéricos para catálogo
  ...Array.from({ length: 12 }, (_, i) => ({
    id: 5 + i,
    name: 'Camiseta',
    brand: 'Casablanca',
    color: 'Negro',
    price: 'XX€',
    image: '/tshirt-icon.svg',
    images: ['/tshirt-icon.svg'],
    description: 'Camiseta básica de algodón de alta calidad con corte regular y acabados reforzados.'
  }))
];

export function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const horizontalGridRef = useRef<HTMLDivElement>(null);
  
  const pathStr = location.pathname.replace(/^\/?/, '');
  const parts = pathStr.split('/').map(decodeURIComponent).filter(Boolean);
  
  const productIndex = parts.findIndex(p => p.toUpperCase() === 'PRODUCT');
  const isProduct = productIndex !== -1 && parts.length > productIndex + 1;
  const productId = isProduct ? parseInt(parts[productIndex + 1], 10) : null;
  
  const isAllArticles = parts.some(p => p.toUpperCase() === 'ALL');
  const isHome = !isProduct && !isAllArticles;

  const scrollLastUnits = (direction: 'left' | 'right') => {
    if (horizontalGridRef.current) {
      const amount = 320;
      horizontalGridRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <ShopLayout>
      {/* Banner for Home */}
      {isHome && (
        <div className="shop-banner">
          <img src="/Ropa/Banner.png" alt="BESTFITS Collection" />
          <div className="shop-banner-overlay">
            <h2>BESTFITS</h2>
            <p>LAS MEJORES MARCAS</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="shop-main">
        {isProduct && productId ? (
          <Product id={productId} />
        ) : isAllArticles ? (
          <AllArticles />
        ) : (
          <>
            <section className="shop-section">
              <h2 className="shop-section-title">DESTACADOS</h2>
              <div className="bento-grid">
                {productsData.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`bento-item bento-item-${index}`}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="bento-image-wrapper">
                      <img src={product.image} alt={product.name} className="bento-image" />
                    </div>
                    <div className="bento-info">
                      <h3 className="bento-name">{product.name}</h3>
                      <p className="bento-price">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="shop-section">
              <h2 className="shop-section-title">ÚLTIMAS UNIDADES</h2>
              <div className="horizontal-slider-wrapper">
                <button 
                  type="button"
                  className="slider-arrow slider-arrow-left" 
                  onClick={() => scrollLastUnits('left')}
                  aria-label="Deslizar a la izquierda"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="horizontal-grid" ref={horizontalGridRef}>
                  {productsData.slice(0, 8).map((product, index) => {
                    const unitsLeft = [6, 3, 5, 1, 4, 2, 7, 1];
                    const units = unitsLeft[index % unitsLeft.length];
                    const text = units === 1 ? 'SOLO QUEDA 1 UNIDAD' : `SOLO QUEDAN ${units} UNIDADES`;
                    return (
                      <div 
                        key={`last-${product.id}`} 
                        className="horizontal-item"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className="horizontal-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
                          <img src={product.image} alt={product.name} className="horizontal-image" />
                          <div className="units-left-banner">
                            {text}
                          </div>
                        </div>
                        <div className="horizontal-info">
                          <h3 className="bento-name">{product.name}</h3>
                          <p className="bento-price">{product.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  type="button"
                  className="slider-arrow slider-arrow-right" 
                  onClick={() => scrollLastUnits('right')}
                  aria-label="Deslizar a la derecha"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </ShopLayout>
  );
}
