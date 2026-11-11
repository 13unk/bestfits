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
  sizes?: string[];
}

export function parseProductPrice(priceStr: string): number {
  const match = priceStr.match(/(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

export const productsData: ProductItem[] = [
  { 
    id: 1, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '1€', 
    image: '/Ropa/1M.jpg', 
    images: ['/Ropa/1M.jpg', '/Ropa/1A.jpg', '/Ropa/1B.jpg', '/Ropa/1C.jpg', '/Ropa/1D.jpg'],
    description: 'Camiseta de corte relajado confeccionada en algodón orgánico de alto gramaje con gráfico psicodélico Casablanca Paris en el pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 2, 
    name: 'Camiseta Amiri', 
    brand: 'Amiri',
    color: 'Negro',
    price: '2€', 
    image: '/Ropa/2M.jpg', 
    images: ['/Ropa/2M.jpg', '/Ropa/2A.jpg', '/Ropa/2B.jpg', '/Ropa/2C.jpg', '/Ropa/2D.jpg'],
    description: 'Camiseta negra clásica de cuello redondo con el monograma MA de Amiri en el pecho y el logo serigrafiado en la espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 3, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '3€', 
    image: '/Ropa/3M.jpg', 
    images: ['/Ropa/3M.jpg', '/Ropa/3A.jpg', '/Ropa/3B.jpg', '/Ropa/3C.jpg', '/Ropa/3D.jpg'],
    description: 'Camiseta premium en color negro con motivo gráfico de diamante y monograma entrelazado Casa Blanca en el frontal y dorso.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 4, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '4€', 
    image: '/Ropa/4M.jpg', 
    images: ['/Ropa/4M.jpg', '/Ropa/4A.jpg', '/Ropa/4B.jpg', '/Ropa/4C.jpg', '/Ropa/4D.jpg'],
    description: 'Camiseta de algodón con ilustración en arco de atardecer, palmera y horizonte arquitectónico Casa Blanca.',
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  { 
    id: 5, 
    name: 'Camiseta Amiri', 
    brand: 'Amiri',
    color: 'Blanco',
    price: '45€', 
    image: '/Ropa/5M.jpg', 
    images: ['/Ropa/5M.jpg', '/Ropa/5A.jpg', '/Ropa/5B.jpg', '/Ropa/5C.jpg', '/Ropa/5D.jpg'],
    description: 'Camiseta blanca de algodón premium con el monograma MA y tipografía Amiri Hollywood Built on Dreams en el pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 6, 
    name: 'Camiseta Off-White', 
    brand: 'Off-White',
    color: 'Negro',
    price: '65€', 
    image: '/Ropa/6M.jpg', 
    images: ['/Ropa/6M.jpg', '/Ropa/6A.jpg', '/Ropa/6B.jpg', '/Ropa/6C.jpg', '/Ropa/6D.jpg'],
    description: 'Camiseta negra edición especial Off-White x André con gráfico XO azul y firma rosa en el frontal y flechas spray en la espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 7, 
    name: 'Camiseta Amiri', 
    brand: 'Amiri',
    color: 'Negro',
    price: '55€', 
    image: '/Ropa/7M.jpg', 
    images: ['/Ropa/7M.jpg', '/Ropa/7A.jpg', '/Ropa/7B.jpg', '/Ropa/7C.jpg', '/Ropa/7D.jpg'],
    description: 'Camiseta negra clásica de corte regular con el emblema MA y texto Amiri Hollywood Built on Dreams en blanco en pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 8, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '75€', 
    image: '/Ropa/8M.jpg', 
    images: ['/Ropa/8M.jpg', '/Ropa/8A.jpg', '/Ropa/8B.jpg', '/Ropa/8C.jpg', '/Ropa/8D.jpg'],
    description: 'Camiseta negra de algodón orgánico con ilustración tenística vintage y tipografía Casablanca en verde en el pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 9, 
    name: 'Camiseta Amiri', 
    brand: 'Amiri',
    color: 'Negro',
    price: '85€', 
    image: '/Ropa/9M.jpg', 
    images: ['/Ropa/9M.jpg', '/Ropa/9A.jpg', '/Ropa/9B.jpg', '/Ropa/9C.jpg', '/Ropa/9D.jpg'],
    description: 'Camiseta negra confeccionada en algodón de alto gramaje con gráfico de monogramas MA entrelazados con llamas y logo Amiri en pecho y dorso.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 10, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Negro',
    price: '95€', 
    image: '/Ropa/10M.jpg', 
    images: ['/Ropa/10M.jpg', '/Ropa/10A.jpg', '/Ropa/10B.jpg', '/Ropa/10C.jpg', '/Ropa/10D.jpg'],
    description: 'Camiseta negra con diseño clásico de templo griego, antorchas olímpicas, laureles y tipografía Casablanca Équipement Sportif.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 11, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Blanco',
    price: '110€', 
    image: '/Ropa/11M.jpg', 
    images: ['/Ropa/11M.jpg', '/Ropa/11A.jpg', '/Ropa/11B.jpg', '/Ropa/11C.jpg', '/Ropa/11D.jpg'],
    description: 'Camiseta blanca de algodón suave con ilustración de columna jónica clásica y logotipo Casa Blanca en tonos azules y dorados.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 12, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Blanco',
    price: '125€', 
    image: '/Ropa/12M.jpg', 
    images: ['/Ropa/12M.jpg', '/Ropa/12A.jpg', '/Ropa/12B.jpg', '/Ropa/12C.jpg', '/Ropa/12D.jpg'],
    description: 'Camiseta blanca de corte relajado con escena parisina en arco de la Torre Eiffel y coches clásicos Casa Blanca en pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 13, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Blanco',
    price: '140€', 
    image: '/Ropa/013M.jpg', 
    images: ['/Ropa/013M.jpg', '/Ropa/013A.jpg', '/Ropa/013B.jpg', '/Ropa/013C.jpg', '/Ropa/013D.jpg'],
    description: 'Camiseta blanca de algodón orgánico con ilustración arquitectónica surrealista de columna y monograma rojo entrelazado Casablanca.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  }
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
            <button 
              type="button"
              className="shop-banner-btn"
              onClick={() => navigate('/all?category=camisetas')}
            >
              VER CAMISETAS
            </button>
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
