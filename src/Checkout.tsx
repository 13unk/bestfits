import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Copy,
  Check,
  Smartphone,
  MessageCircle,
  MapPin,
  Package,
} from 'lucide-react';
import { useShop, CartItem } from './ShopContext';
import { parseProductPrice } from './Shop';

const BIZUM_PHONE = '6XX XXX XXX';

interface CheckoutFormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  detalles: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  pais: string;
  notas: string;
}

const INITIAL_FORM: CheckoutFormData = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  direccion: '',
  detalles: '',
  codigoPostal: '',
  ciudad: '',
  provincia: '',
  pais: 'España',
  notas: '',
};

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useShop();
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);
  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<'phone' | 'order' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => {
    const unit = parseProductPrice(item.price);
    const qty = item.quantity || 1;
    return acc + unit * qty;
  }, 0);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (key: 'phone' | 'order', text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const randomCode = `BF-${Math.floor(100000 + Math.random() * 900000)}`;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: randomCode,
          total: subtotal,
          items: cart,
          customer: formData,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error || 'No se pudo enviar el pedido. Inténtalo de nuevo en unos segundos.'
        );
      }

      setConfirmedTotal(subtotal);
      setConfirmedItems([...cart]);
      setOrderNumber(randomCode);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el pedido. Revisa tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirm-wrapper">
          {/* Cabecera principal */}
          <div className="checkout-confirm-header">
            <div className="checkout-confirm-badge">
              <CheckCircle2 size={16} />
              <span>PEDIDO REGISTRADO · PENDIENTE DE BIZUM</span>
            </div>
            <h1 className="checkout-confirm-title">¡Pedido confirmado!</h1>
            <p className="checkout-confirm-subtitle">
              Gracias por tu compra, <strong>{formData.nombre}</strong>. Tu pedido{' '}
              <span className="checkout-order-pill">{orderNumber}</span> está reservado.
            </p>
          </div>

          {/* Tarjeta destacada de Pago por Bizum */}
          <section className="bizum-hero-card">
            <div className="bizum-hero-top">
              <div className="bizum-hero-heading">
                <span className="bizum-hero-tag">
                  <Smartphone size={16} />
                  PASO FINAL OBLIGATORIO
                </span>
                <h2>Realiza el pago por Bizum para activar tu envío</h2>
                <p>
                  Tienes que hacer tu pago de <strong>{confirmedTotal}€</strong> por Bizum al{' '}
                  <strong>{BIZUM_PHONE}</strong> y poner <strong>{orderNumber}</strong> en el
                  asunto del Bizum.
                </p>
              </div>
            </div>

            <div className="bizum-data-grid">
              <div className="bizum-data-tile bizum-tile-amount">
                <span className="bizum-tile-label">IMPORTE A ENVIAR</span>
                <div className="bizum-tile-value">{confirmedTotal}€</div>
                <span className="bizum-tile-hint">Envío 24h incluido</span>
              </div>

              <div className="bizum-data-tile">
                <span className="bizum-tile-label">TELÉFONO BIZUM</span>
                <div className="bizum-tile-value mono">{BIZUM_PHONE}</div>
                <button
                  type="button"
                  className={`bizum-copy-btn ${copiedKey === 'phone' ? 'copied' : ''}`}
                  onClick={() => handleCopy('phone', BIZUM_PHONE)}
                >
                  {copiedKey === 'phone' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === 'phone' ? 'Copiado' : 'Copiar número'}</span>
                </button>
              </div>

              <div className="bizum-data-tile bizum-tile-concept">
                <span className="bizum-tile-label">ASUNTO OBLIGATORIO</span>
                <div className="bizum-tile-value mono">{orderNumber}</div>
                <button
                  type="button"
                  className={`bizum-copy-btn ${copiedKey === 'order' ? 'copied' : ''}`}
                  onClick={() => handleCopy('order', orderNumber)}
                >
                  {copiedKey === 'order' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === 'order' ? 'Copiado' : 'Copiar asunto'}</span>
                </button>
              </div>
            </div>

            <div className="bizum-steps-row">
              <div className="bizum-step">
                <span className="bizum-step-num">1</span>
                <span>Entra en la app de tu banco y selecciona <strong>Bizum</strong></span>
              </div>
              <div className="bizum-step">
                <span className="bizum-step-num">2</span>
                <span>Envía <strong>{confirmedTotal}€</strong> al <strong>{BIZUM_PHONE}</strong></span>
              </div>
              <div className="bizum-step">
                <span className="bizum-step-num">3</span>
                <span>Escribe <strong>{orderNumber}</strong> en el concepto / asunto</span>
              </div>
            </div>

            <div className="bizum-whatsapp-banner">
              <MessageCircle size={22} className="bizum-wa-icon" />
              <div>
                <strong>Confirmación directa por WhatsApp</strong>
                <p>
                  Cuando lo hayamos recibido, te confirmaremos tu compra por WhatsApp al{' '}
                  <strong>{formData.telefono}</strong> y prepararemos tu paquete.
                </p>
              </div>
            </div>
          </section>

          {/* Resumen inferior: Artículos + Dirección */}
          <div className="checkout-confirm-lower-grid">
            <div className="checkout-info-card">
              <h3 className="checkout-info-card-title">
                <Package size={18} />
                <span>Artículos del pedido</span>
              </h3>
              <div className="checkout-confirm-items">
                {confirmedItems.map((item, idx) => {
                  const qty = item.quantity || 1;
                  const unitVal = parseProductPrice(item.price);
                  return (
                    <div key={`${item.id}-${item.size}-${idx}`} className="checkout-summary-item">
                      <img src={item.image} alt={item.name} className="checkout-summary-img" />
                      <div className="checkout-summary-item-info">
                        <div className="checkout-summary-item-name">{item.name}</div>
                        <div className="checkout-summary-item-meta">
                          Talla: {item.size} · Cant: {qty}
                        </div>
                      </div>
                      <div className="checkout-summary-item-price">{unitVal * qty}€</div>
                    </div>
                  );
                })}
              </div>
              <div className="checkout-confirm-total-row">
                <span>Total del pedido</span>
                <strong>{confirmedTotal}€</strong>
              </div>
            </div>

            <div className="checkout-info-card">
              <h3 className="checkout-info-card-title">
                <MapPin size={18} />
                <span>Datos de envío y contacto</span>
              </h3>
              <div className="checkout-info-list">
                <div className="checkout-info-row">
                  <span>Destinatario</span>
                  <strong>{formData.nombre} {formData.apellidos}</strong>
                </div>
                <div className="checkout-info-row">
                  <span>Teléfono (WhatsApp)</span>
                  <strong>{formData.telefono}</strong>
                </div>
                <div className="checkout-info-row">
                  <span>Correo</span>
                  <strong>{formData.email}</strong>
                </div>
                <div className="checkout-info-row">
                  <span>Dirección</span>
                  <strong>
                    {formData.direccion}
                    {formData.detalles ? `, ${formData.detalles}` : ''}
                  </strong>
                </div>
                <div className="checkout-info-row">
                  <span>Localidad</span>
                  <strong>
                    {formData.codigoPostal} {formData.ciudad}, {formData.provincia} ({formData.pais})
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-success-actions">
            <button
              type="button"
              className="checkout-submit-btn"
              onClick={() => navigate('/all')}
            >
              SEGUIR COMPRANDO
            </button>
            <button
              type="button"
              className="checkout-secondary-btn"
              onClick={() => navigate('/tracking')}
            >
              SEGUIMIENTO DE ENVÍO
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Añade algún producto antes de finalizar el pedido.</p>
          <button
            type="button"
            className="checkout-submit-btn"
            style={{ marginTop: '1.5rem', maxWidth: '280px' }}
            onClick={() => navigate('/all')}
          >
            VER CATÁLOGO
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <button
        type="button"
        className="checkout-back-link"
        onClick={() => navigate('/cart')}
      >
        <ArrowLeft size={16} />
        <span>Volver al carrito</span>
      </button>

      <h1 className="checkout-title">Finalizar Compra</h1>

      <div className="checkout-grid">
        <form className="checkout-form-card" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2 className="checkout-section-title">1. Datos de contacto</h2>
            <div className="checkout-form-row">
              <div className="checkout-field">
                <label htmlFor="checkout-nombre">Nombre *</label>
                <input
                  id="checkout-nombre"
                  type="text"
                  className="checkout-input"
                  placeholder="Ej. Carlos"
                  autoComplete="given-name"
                  required
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-apellidos">Apellidos *</label>
                <input
                  id="checkout-apellidos"
                  type="text"
                  className="checkout-input"
                  placeholder="Ej. García López"
                  autoComplete="family-name"
                  required
                  value={formData.apellidos}
                  onChange={(e) => handleChange('apellidos', e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-form-row">
              <div className="checkout-field">
                <label htmlFor="checkout-email">Correo electrónico *</label>
                <input
                  id="checkout-email"
                  type="email"
                  className="checkout-input"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-telefono">Número de teléfono *</label>
                <input
                  id="checkout-telefono"
                  type="tel"
                  className="checkout-input"
                  placeholder="Ej. +34 600 123 456"
                  autoComplete="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section-title">2. Dirección de envío</h2>
            <div className="checkout-field">
              <label htmlFor="checkout-direccion">Dirección (Calle, número, piso/puerta) *</label>
              <input
                id="checkout-direccion"
                type="text"
                className="checkout-input"
                placeholder="Ej. Calle Mayor 14, 3º B"
                autoComplete="street-address"
                required
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="checkout-detalles">Información adicional (Portal, escalera, referencias...)</label>
              <input
                id="checkout-detalles"
                type="text"
                className="checkout-input"
                placeholder="Opcional"
                autoComplete="address-line2"
                value={formData.detalles}
                onChange={(e) => handleChange('detalles', e.target.value)}
              />
            </div>

            <div className="checkout-form-row">
              <div className="checkout-field">
                <label htmlFor="checkout-cp">Código postal *</label>
                <input
                  id="checkout-cp"
                  type="text"
                  className="checkout-input"
                  placeholder="Ej. 28001"
                  autoComplete="postal-code"
                  required
                  value={formData.codigoPostal}
                  onChange={(e) => handleChange('codigoPostal', e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-ciudad">Ciudad / Localidad *</label>
                <input
                  id="checkout-ciudad"
                  type="text"
                  className="checkout-input"
                  placeholder="Ej. Madrid"
                  autoComplete="address-level2"
                  required
                  value={formData.ciudad}
                  onChange={(e) => handleChange('ciudad', e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-form-row">
              <div className="checkout-field">
                <label htmlFor="checkout-provincia">Provincia *</label>
                <input
                  id="checkout-provincia"
                  type="text"
                  className="checkout-input"
                  placeholder="Ej. Madrid"
                  autoComplete="address-level1"
                  required
                  value={formData.provincia}
                  onChange={(e) => handleChange('provincia', e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label htmlFor="checkout-pais">País *</label>
                <select
                  id="checkout-pais"
                  className="checkout-input"
                  autoComplete="country-name"
                  required
                  value={formData.pais}
                  onChange={(e) => handleChange('pais', e.target.value)}
                >
                  <option value="España">España</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Francia">Francia</option>
                  <option value="Italia">Italia</option>
                  <option value="Alemania">Alemania</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="checkout-field">
              <label htmlFor="checkout-notas">Notas para el repartidor (opcional)</label>
              <textarea
                id="checkout-notas"
                className="checkout-input checkout-textarea"
                placeholder="Horario preferente, entregar en portería..."
                value={formData.notas}
                onChange={(e) => handleChange('notas', e.target.value)}
              />
            </div>
          </section>

          {submitError && (
            <div className="checkout-error-banner" role="alert">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'REGISTRANDO PEDIDO...'
              : `CONFIRMAR PEDIDO (${subtotal}€)`}
          </button>
        </form>

        <aside className="checkout-summary-card">
          <h2 className="checkout-section-title">Resumen del pedido</h2>

          <div className="checkout-summary-items">
            {cart.map((item, idx) => {
              const qty = item.quantity || 1;
              const unitVal = parseProductPrice(item.price);
              return (
                <div key={`${item.id}-${item.size}-${idx}`} className="checkout-summary-item">
                  <img src={item.image} alt={item.name} className="checkout-summary-img" />
                  <div className="checkout-summary-item-info">
                    <div className="checkout-summary-item-name">{item.name}</div>
                    <div className="checkout-summary-item-meta">
                      Talla: {item.size} · Cant: {qty}
                    </div>
                  </div>
                  <div className="checkout-summary-item-price">
                    {unitVal * qty}€
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-summary-totals">
            <div className="checkout-summary-line">
              <span>Subtotal</span>
              <span>{subtotal}€</span>
            </div>
            <div className="checkout-summary-line">
              <span>Envío 24h</span>
              <span className="checkout-free-shipping">GRATIS</span>
            </div>
            <div className="checkout-summary-line total">
              <span>Total</span>
              <span>{subtotal}€</span>
            </div>
          </div>

          <div className="checkout-trust-badges">
            <div className="checkout-trust-item">
              <Truck size={16} />
              <span>Envío urgente en 24h garantizado</span>
            </div>
            <div className="checkout-trust-item">
              <ShieldCheck size={16} />
              <span>Métodos de pago fiables y cambios fáciles</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
