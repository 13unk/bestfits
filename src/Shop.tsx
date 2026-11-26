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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
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
    price: '67€', 
    image: '/Ropa/013M.jpg', 
    images: ['/Ropa/013M.jpg', '/Ropa/013A.jpg', '/Ropa/013B.jpg', '/Ropa/013C.jpg', '/Ropa/013D.jpg'],
    description: 'Camiseta blanca de algodón orgánico con ilustración arquitectónica surrealista de columna y monograma rojo entrelazado Casablanca.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 14, 
    name: 'Camiseta Casablanca', 
    brand: 'Casablanca',
    color: 'Blanco',
    price: '67€', 
    image: '/Ropa/14M.jpg', 
    images: ['/Ropa/14M.jpg', '/Ropa/14A.jpg', '/Ropa/14B.jpg', '/Ropa/14C.jpg', '/Ropa/14D.jpg'],
    description: 'Camiseta blanca confeccionada en algodón orgánico con gráfico de arco crepuscular, palmera y luna creciente Casa Blanca en el pecho y espalda.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 15, 
    name: 'Sudadera C.P. Company', 
    brand: 'C.P. Company',
    color: 'Negro',
    price: '67€', 
    image: '/Ropa/15M.jpg', 
    images: ['/Ropa/15M.jpg', '/Ropa/15A.jpg', '/Ropa/15B.jpg', '/Ropa/15C.jpg', '/Ropa/15D.jpg'],
    description: 'Sudadera negra de cuello redondo en felpa diagonal de algodón con bolsillo funcional y lente icónica de C.P. Company en la manga.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 16, 
    name: 'Sudadera C.P. Company', 
    brand: 'C.P. Company',
    color: 'Gris',
    price: '67€', 
    image: '/Ropa/16M.jpg', 
    images: ['/Ropa/16M.jpg', '/Ropa/16A.jpg', '/Ropa/16B.jpg', '/Ropa/16C.jpg', '/Ropa/16D.jpg'],
    description: 'Sudadera gris plomo en suave algodón con cuello redondo, remates acanalados y detalle de lente exclusiva C.P. Company en la manga.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 17, 
    name: 'Sudadera C.P. Company', 
    brand: 'C.P. Company',
    color: 'Azul',
    price: '67€', 
    image: '/Ropa/17M.jpg', 
    images: ['/Ropa/17M.jpg', '/Ropa/17A.jpg', '/Ropa/17B.jpg', '/Ropa/17C.jpg', '/Ropa/17D.jpg'],
    description: 'Sudadera en azul petróleo confeccionada en felpa de algodón de primera calidad con bolsillo de cremallera y lente C.P. Company.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 18, 
    name: 'Sudadera C.P. Company', 
    brand: 'C.P. Company',
    color: 'Beige',
    price: '67€', 
    image: '/Ropa/18M.jpg', 
    images: ['/Ropa/18M.jpg', '/Ropa/18A.jpg', '/Ropa/18B.jpg', '/Ropa/18C.jpg', '/Ropa/18D.jpg'],
    description: 'Sudadera beige arena de corte cómodo confeccionada en algodón transpirable con lente distintiva C.P. Company en el bolsillo de la manga.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 19, 
    name: 'Sudadera C.P. Company', 
    brand: 'C.P. Company',
    color: 'Celeste',
    price: '67€', 
    image: '/Ropa/19M.jpg', 
    images: ['/Ropa/19M.jpg', '/Ropa/19A.jpg', '/Ropa/19B.jpg', '/Ropa/19C.jpg', '/Ropa/19D.jpg'],
    description: 'Sudadera celeste en algodón orgánico teñido en prenda con cuello redondo y mítica lente C.P. Company en el brazo.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 20, 
    name: 'Sudadera Stone Island', 
    brand: 'Stone Island',
    color: 'Naranja',
    price: '67€', 
    image: '/Ropa/20M.jpg', 
    images: ['/Ropa/20M.jpg', '/Ropa/20A.jpg', '/Ropa/20B.jpg', '/Ropa/20C.jpg', '/Ropa/20D.jpg'],
    description: 'Sudadera naranja salmón con canesú y bolsillos en relieve en los hombros, acabada con la insignia desmontable Stone Island Compass en la manga.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 21, 
    name: 'Sudadera Stone Island', 
    brand: 'Stone Island',
    color: 'Rosa',
    price: '67€', 
    image: '/Ropa/21M.jpg', 
    images: ['/Ropa/21M.jpg', '/Ropa/21A.jpg', '/Ropa/21B.jpg', '/Ropa/21C.jpg', '/Ropa/21D.jpg'],
    description: 'Sudadera en suave tono rosa pastel de felpa de algodón de alto gramaje con cuello redondo acanalado y parche clásico Stone Island Compass.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 22, 
    name: 'Chaqueta Stone Island Soft Shell', 
    brand: 'Stone Island',
    color: 'Verde',
    price: '67€', 
    image: '/Ropa/22M.jpg', 
    images: ['/Ropa/22M.jpg', '/Ropa/22A.jpg', '/Ropa/22B.jpg', '/Ropa/22C.jpg', '/Ropa/22D.jpg'],
    description: 'Chaqueta Soft Shell-R impermeable y cortavientos con capucha en tono verde salvia claro / caqui, cremallera completa e insignia Stone Island.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 23, 
    name: 'Chaqueta Stone Island Cortavientos', 
    brand: 'Stone Island',
    color: 'Negro',
    price: '67€', 
    image: '/Ropa/23M.jpg', 
    images: ['/Ropa/23M.jpg', '/Ropa/23A.jpg', '/Ropa/23B.jpg', '/Ropa/23C.jpg', '/Ropa/23D.jpg'],
    description: 'Chaqueta técnica ligera en nailon negro y antracita con paneles contrastados, capucha elástica, bolsillos con cremallera e insignia Compass.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 24, 
    name: 'Chaqueta Stone Island Cortavientos', 
    brand: 'Stone Island',
    color: 'Verde',
    price: '67€', 
    image: '/Ropa/24M.jpg', 
    images: ['/Ropa/24M.jpg', '/Ropa/24A.jpg', '/Ropa/24B.jpg', '/Ropa/24C.jpg', '/Ropa/24D.jpg'],
    description: 'Chaqueta cortavientos en doble tono verde oliva y militar, tejido ripstop resistente al agua con cremallera frontal e insignia Stone Island.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 25, 
    name: 'Chaqueta Stone Island Cortavientos', 
    brand: 'Stone Island',
    color: 'Azul',
    price: '67€', 
    image: '/Ropa/25M.jpg', 
    images: ['/Ropa/25M.jpg', '/Ropa/25A.jpg', '/Ropa/25B.jpg', '/Ropa/25C.jpg', '/Ropa/25D.jpg'],
    description: 'Chaqueta cortavientos azul marino en tejido técnico ultraligero y repelente al agua, capucha ajustable e insignia Stone Island Compass desmontable.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  { 
    id: 26, 
    name: 'Chaqueta C.P. Company Pro-Tek', 
    brand: 'C.P. Company',
    color: 'Azul',
    price: '67€', 
    image: '/Ropa/26M.jpg', 
    images: ['/Ropa/26M.jpg', '/Ropa/26A.jpg', '/Ropa/26B.jpg', '/Ropa/26C.jpg', '/Ropa/26D.jpg'],
    description: 'Chaqueta técnica azul marino confeccionada en tejido Pro-Tek de alto rendimiento elástico y resistente a la intemperie, con capucha y lente C.P. Company.',
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
