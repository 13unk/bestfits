import { useState, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  maxPrice: number;
  onApplyPrice: (price: number) => void;
  selectedSizes: string[];
  onApplySizes: (sizes: string[]) => void;
  selectedBrands: string[];
  onApplyBrands: (brands: string[]) => void;
  onResetAll: () => void;
  totalFilteredCount: number;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const AVAILABLE_BRANDS = ['Amiri', 'Casablanca'];

export function FilterDrawer({
  isOpen,
  onClose,
  maxPrice,
  onApplyPrice,
  selectedSizes,
  onApplySizes,
  selectedBrands,
  onApplyBrands,
  onResetAll,
  totalFilteredCount,
}: FilterDrawerProps) {
  // Estados locales temporales (drafts) para permitir ajustar y aplicar
  const [draftPrice, setDraftPrice] = useState<number>(maxPrice);
  const [draftSizes, setDraftSizes] = useState<string[]>(selectedSizes);
  const [draftBrands, setDraftBrands] = useState<string[]>(selectedBrands);

  // Estados visuales de confirmación temporal para cada botón de aplicar
  const [appliedPriceFeedback, setAppliedPriceFeedback] = useState(false);
  const [appliedSizeFeedback, setAppliedSizeFeedback] = useState(false);
  const [appliedBrandFeedback, setAppliedBrandFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraftPrice(maxPrice);
      setDraftSizes(selectedSizes);
      setDraftBrands(selectedBrands);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, maxPrice, selectedSizes, selectedBrands, onClose]);

  const toggleSize = (size: string) => {
    setDraftSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleBrand = (brand: string) => {
    setDraftBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleApplyPrice = () => {
    onApplyPrice(draftPrice);
    setAppliedPriceFeedback(true);
    setTimeout(() => setAppliedPriceFeedback(false), 1200);
  };

  const handleApplySizes = () => {
    onApplySizes(draftSizes);
    setAppliedSizeFeedback(true);
    setTimeout(() => setAppliedSizeFeedback(false), 1200);
  };

  const handleApplyBrands = () => {
    onApplyBrands(draftBrands);
    setAppliedBrandFeedback(true);
    setTimeout(() => setAppliedBrandFeedback(false), 1200);
  };

  const handleApplyAllAndClose = () => {
    onApplyPrice(draftPrice);
    onApplySizes(draftSizes);
    onApplyBrands(draftBrands);
    onClose();
  };

  const handleReset = () => {
    setDraftPrice(250);
    setDraftSizes([]);
    setDraftBrands([]);
    onResetAll();
  };

  return (
    <>
      {/* Backdrop con desenfoque suave */}
      <div
        className={`filter-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel lateral deslizante de filtros (lado derecho) */}
      <aside
        className={`filter-drawer-panel ${isOpen ? 'open' : ''}`}
        aria-label="Panel de filtros"
      >
        {/* Cabecera del panel */}
        <div className="filter-drawer-header">
          <div className="filter-drawer-title-group">
            <h2 className="filter-drawer-title">FILTRAR</h2>
            <span className="filter-drawer-count">({totalFilteredCount} artículos)</span>
          </div>
          <button
            type="button"
            className="filter-drawer-close-btn"
            onClick={onClose}
            aria-label="Cerrar filtros"
          >
            <X size={22} />
          </button>
        </div>

        <div className="filter-drawer-body">
          {/* SECCIÓN 1: Filtrar por precios */}
          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">Filtrar por precios</h3>
              <span className="price-range-badge">0€ — {draftPrice}€</span>
            </div>

            <div className="filter-slider-container">
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={draftPrice}
                onChange={e => setDraftPrice(Number(e.target.value))}
                className="price-range-slider"
                aria-label="Precio máximo"
              />
              <div className="slider-limits">
                <span>0€</span>
                <span>Hasta <strong>{draftPrice}€</strong></span>
                <span>250€</span>
              </div>
            </div>

            <button
              type="button"
              className={`filter-apply-btn ${appliedPriceFeedback ? 'applied' : ''}`}
              onClick={handleApplyPrice}
            >
              {appliedPriceFeedback ? '✓ Aplicado' : 'Aplicar'}
            </button>
          </section>

          {/* SECCIÓN 2: TALLAS */}
          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">TALLAS</h3>
              {draftSizes.length > 0 && (
                <span className="filter-selected-tag">
                  {draftSizes.join(', ')}
                </span>
              )}
            </div>

            <div className="sizes-square-grid">
              {AVAILABLE_SIZES.map(size => {
                const isSelected = draftSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    className={`size-square-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSize(size)}
                    aria-pressed={isSelected}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={`filter-apply-btn ${appliedSizeFeedback ? 'applied' : ''}`}
              onClick={handleApplySizes}
            >
              {appliedSizeFeedback ? '✓ Aplicado' : 'Aplicar'}
            </button>
          </section>

          {/* SECCIÓN 3: Marcas */}
          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">Marcas</h3>
              {draftBrands.length > 0 && (
                <span className="filter-selected-tag">
                  {draftBrands.join(', ')}
                </span>
              )}
            </div>

            <div className="brands-boxes-list">
              {AVAILABLE_BRANDS.map(brand => {
                const isSelected = draftBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    className={`brand-box-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleBrand(brand)}
                    aria-pressed={isSelected}
                  >
                    <span className="brand-box-checkbox">
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span className="brand-box-label">{brand}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={`filter-apply-btn ${appliedBrandFeedback ? 'applied' : ''}`}
              onClick={handleApplyBrands}
            >
              {appliedBrandFeedback ? '✓ Aplicado' : 'Aplicar'}
            </button>
          </section>
        </div>

        {/* Pie del panel con acciones globales */}
        <div className="filter-drawer-footer">
          <button
            type="button"
            className="filter-reset-all-btn"
            onClick={handleReset}
          >
            <RotateCcw size={15} />
            <span>Restablecer todo</span>
          </button>

          <button
            type="button"
            className="filter-view-results-btn"
            onClick={handleApplyAllAndClose}
          >
            Ver {totalFilteredCount} artículo{totalFilteredCount === 1 ? '' : 's'}
          </button>
        </div>
      </aside>
    </>
  );
}
