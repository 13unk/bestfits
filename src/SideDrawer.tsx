import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Plus, Minus } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  subcategories: { name: string; path: string }[];
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'camisetas',
    name: 'CAMISETAS',
    subcategories: [
      { name: 'Todo', path: '/all?category=camisetas' },
      { name: 'Amiri', path: '/all?category=camisetas&brand=Amiri' },
      { name: 'Casablanca', path: '/all?category=camisetas&brand=Casablanca' },
    ],
  },
  {
    id: 'sudaderas',
    name: 'SUDADERAS',
    subcategories: [
      { name: 'Todo', path: '/all?category=sudaderas' },
      { name: 'Amiri', path: '/all?category=sudaderas&brand=Amiri' },
      { name: 'Casablanca', path: '/all?category=sudaderas&brand=Casablanca' },
    ],
  },
  {
    id: 'chaquetas',
    name: 'CHAQUETAS',
    subcategories: [
      { name: 'Todo', path: '/all?category=chaquetas' },
      { name: 'Amiri', path: '/all?category=chaquetas&brand=Amiri' },
      { name: 'Casablanca', path: '/all?category=chaquetas&brand=Casablanca' },
    ],
  },
];

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Escuchar tecla ESC para cerrar y bloquear scroll del body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Foco opcional en el input
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleCategory = (id: string) => {
    setExpandedCategory(prev => (prev === id ? null : id));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/all?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Fondo oscuro con desenfoque suave */}
      <div 
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menú lateral deslizante */}
      <aside 
        className={`drawer-panel ${isOpen ? 'open' : ''}`}
        aria-label="Menú principal"
      >
        {/* Cabecera del menú */}
        <div className="drawer-header">
          <span 
            className="drawer-brand" 
            onClick={() => handleNavigate('/')}
          >
            BESTFITS
          </span>
          <button 
            type="button" 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        {/* Barra de búsqueda integrada */}
        <form className="drawer-search" onSubmit={handleSearchSubmit}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="drawer-search-input"
          />
          <button type="submit" className="drawer-search-btn" aria-label="Buscar artículos">
            <Search size={20} />
          </button>
        </form>

        {/* Lista de categorías principales con acordeón */}
        <div className="drawer-categories">
          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="drawer-category-group">
                <button
                  type="button"
                  className={`drawer-category-header ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  aria-expanded={isExpanded}
                >
                  <span className="drawer-category-name">{cat.name}</span>
                  <span className="drawer-category-icon">
                    {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                {/* Subcategorías desplegables */}
                <div className={`drawer-subcategories ${isExpanded ? 'expanded' : ''}`}>
                  {cat.subcategories.map((sub, index) => (
                    <div
                      key={index}
                      className="drawer-subcategory-item"
                      onClick={() => handleNavigate(sub.path)}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Enlace destacado de Ofertas en rojo */}
          <div className="drawer-category-group">
            <button
              type="button"
              className="drawer-category-header drawer-deals-header drawer-deals-red"
              onClick={() => handleNavigate('/all?filter=ofertas')}
            >
              <span className="drawer-category-name">Ofertas</span>
            </button>
          </div>
        </div>

        {/* Enlaces secundarios */}
        <div className="drawer-secondary-links">
          <span onClick={() => handleNavigate('/faq#about')}>Sobre nosotros</span>
          <span onClick={() => handleNavigate('/contact')}>Ayuda y contacto</span>
          <span onClick={() => handleNavigate('/faq')}>Opiniones</span>
          <span onClick={() => handleNavigate('/tracking')}>Seguimiento de pedido</span>
        </div>

        {/* Pie de confianza del menú lateral */}
        <div className="drawer-footer">
          <p className="drawer-footer-line">Envíos 24h · Pago contrareembolso</p>
          <p className="drawer-footer-line">Atención de lunes a domingo</p>
        </div>
      </aside>
    </>
  );
}
