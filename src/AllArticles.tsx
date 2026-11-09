import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { productsData, parseProductPrice } from './Shop';
import { FilterDrawer } from './FilterDrawer';
import './Shop.css';

type SortOption = 'default' | 'price-asc' | 'price-desc';

const SORT_LABELS: Record<SortOption, string> = {
  'default': 'ORDEN PREDETERMINADO',
  'price-asc': 'PRECIO MÁS BAJO',
  'price-desc': 'PRECIO MÁS ALTO',
};

export function AllArticles() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const filterParam = searchParams.get('filter') || '';

  // Estados de filtrado y ordenación
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    return brandParam ? [brandParam] : [];
  });

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar parámetro de marca si cambia desde la URL o menú lateral
  useEffect(() => {
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
  }, [brandParam]);

  // Cerrar el desplegable de ordenar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado de artículos
  const filtered = productsData.filter(product => {
    // 1. Filtro por categoría (de la URL o menú lateral)
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      if (cat === 'camisetas' && !product.name.toLowerCase().includes('camiseta')) return false;
      if (cat === 'sudaderas' && !product.name.toLowerCase().includes('sudadera')) return false;
      if (cat === 'chaquetas' && !product.name.toLowerCase().includes('chaqueta')) return false;
    }

    // 2. Filtro por búsqueda textual
    if (queryParam) {
      const q = queryParam.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Filtro por precio (slider de 0 a 250€)
    const priceNum = parseProductPrice(product.price);
    if (priceNum > maxPrice) return false;

    // 4. Filtro por tallas (S a XXL)
    if (selectedSizes.length > 0) {
      const hasSize = product.sizes && product.sizes.some(s => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    // 5. Filtro por marcas (Amiri, Casablanca)
    if (selectedBrands.length > 0) {
      const hasBrand = selectedBrands.some(
        b => b.toLowerCase() === product.brand.toLowerCase()
      );
      if (!hasBrand) return false;
    }

    return true;
  });

  // Ordenación de artículos
  const sorted = [...filtered].sort((a, b) => {
    const priceA = parseProductPrice(a.price);
    const priceB = parseProductPrice(b.price);

    if (sortBy === 'price-asc') {
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      return priceB - priceA;
    }
    return a.id - b.id; // ORDEN PREDETERMINADO
  });

  // Cálculo del número de filtros activos
  const activeFiltersCount =
    (maxPrice < 250 ? 1 : 0) +
    selectedSizes.length +
    selectedBrands.length;

  const handleResetAllFilters = () => {
    setMaxPrice(250);
    setSelectedSizes([]);
    setSelectedBrands([]);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.delete('category');
    newParams.delete('brand');
    newParams.delete('filter');
    setSearchParams(newParams);
  };

  const handleRemoveBrand = (brandToRemove: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brandToRemove));
    if (brandParam && brandParam.toLowerCase() === brandToRemove.toLowerCase()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('brand');
      setSearchParams(newParams);
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSelectedSizes(prev => prev.filter(s => s !== sizeToRemove));
  };

  return (
    <div className="all-articles-page">
      {/* Barra de herramientas: Botones FILTRAR y ORDENAR */}
      <div className="catalog-toolbar">
        {/* Botón FILTRAR que abre el menú lateral derecho */}
        <button
          type="button"
          className="catalog-toolbar-btn catalog-filter-btn"
          onClick={() => setIsFilterDrawerOpen(true)}
          aria-label="Abrir panel de filtros"
        >
          <SlidersHorizontal size={18} />
          <span className="toolbar-btn-text">FILTRAR</span>
          {activeFiltersCount > 0 && (
            <span className="toolbar-badge-count">{activeFiltersCount}</span>
          )}
        </button>

        {/* Botón y desplegable ORDENAR */}
        <div className="catalog-sort-wrapper" ref={sortDropdownRef}>
          <button
            type="button"
            className={`catalog-toolbar-btn catalog-sort-btn ${isSortDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            aria-expanded={isSortDropdownOpen}
            aria-label="Ordenar productos"
          >
            <span className="toolbar-btn-text">
              ORDENAR: <span className="sort-current-val">{SORT_LABELS[sortBy]}</span>
            </span>
            <ChevronDown size={17} className={`toolbar-chevron ${isSortDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <div className="catalog-sort-dropdown">
              {(['default', 'price-asc', 'price-desc'] as SortOption[]).map(optionKey => (
                <button
                  key={optionKey}
                  type="button"
                  className={`catalog-sort-item ${sortBy === optionKey ? 'selected' : ''}`}
                  onClick={() => {
                    setSortBy(optionKey);
                    setIsSortDropdownOpen(false);
                  }}
                >
                  {SORT_LABELS[optionKey]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Etiquetas / Chips de filtros activos */}
      {(activeFiltersCount > 0 || queryParam || categoryParam || filterParam) && (
        <div className="active-filters-chips-bar">
          <span className="active-chips-label">Filtros aplicados:</span>

          {categoryParam && (
            <span className="filter-chip">
              Categoría: <strong>{categoryParam.toUpperCase()}</strong>
              <button
                type="button"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('category');
                  setSearchParams(newParams);
                }}
              >
                <X size={13} />
              </button>
            </span>
          )}

          {queryParam && (
            <span className="filter-chip">
              Búsqueda: "<strong>{queryParam}</strong>"
              <button
                type="button"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('q');
                  setSearchParams(newParams);
                }}
              >
                <X size={13} />
              </button>
            </span>
          )}

          {maxPrice < 250 && (
            <span className="filter-chip">
              Hasta <strong>{maxPrice}€</strong>
              <button type="button" onClick={() => setMaxPrice(250)}>
                <X size={13} />
              </button>
            </span>
          )}

          {selectedSizes.map(size => (
            <span key={size} className="filter-chip">
              Talla: <strong>{size}</strong>
              <button type="button" onClick={() => handleRemoveSize(size)}>
                <X size={13} />
              </button>
            </span>
          ))}

          {selectedBrands.map(brand => (
            <span key={brand} className="filter-chip">
              Marca: <strong>{brand}</strong>
              <button type="button" onClick={() => handleRemoveBrand(brand)}>
                <X size={13} />
              </button>
            </span>
          ))}

          <button
            type="button"
            className="clear-all-chips-btn"
            onClick={handleResetAllFilters}
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Cuadrícula de artículos */}
      {sorted.length === 0 ? (
        <div className="catalog-empty-state">
          <h3>No se encontraron artículos</h3>
          <p>Prueba a ajustar o restablecer los filtros para ver más resultados.</p>
          <button
            type="button"
            className="catalog-reset-empty-btn"
            onClick={handleResetAllFilters}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="all-articles-grid">
          {sorted.map((product, i) => (
            <div
              key={`prod-${product.id}-${i}`}
              className="bento-item all-articles-item"
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
      )}

      {/* Menú lateral de filtros */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        maxPrice={maxPrice}
        onApplyPrice={price => setMaxPrice(price)}
        selectedSizes={selectedSizes}
        onApplySizes={sizes => setSelectedSizes(sizes)}
        selectedBrands={selectedBrands}
        onApplyBrands={brands => setSelectedBrands(brands)}
        onResetAll={handleResetAllFilters}
        totalFilteredCount={sorted.length}
      />
    </div>
  );
}
