import { useShop } from './ShopContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity } = useShop();

  const total = cart.reduce((acc, item) => {
    const val = parseFloat(item.price.replace('€', ''));
    const qty = item.quantity || 1;
    return acc + (isNaN(val) ? 0 : val) * qty;
  }, 0);

  return (
    <main className="cart-page">
      <h1 className="cart-title">Tu Carrito</h1>
      
      {cart.length === 0 ? (
        <div className="cart-empty">
          <h2>El carrito está vacío</h2>
          <p>Añade algunos artículos de la tienda.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item, index) => {
              const unitVal = parseFloat(item.price.replace('€', ''));
              const qty = item.quantity || 1;
              const lineTotal = isNaN(unitVal) ? item.price : `${unitVal * qty}€`;

              return (
                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.name}</h3>
                    <p className="cart-item-meta">Talla: <strong>{item.size}</strong></p>
                    
                    <div className="cart-qty-controls">
                      <button 
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(index, qty - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-qty-value">{qty}</span>
                      <button 
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(index, qty + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price-col">
                    <div className="cart-item-price">{lineTotal}</div>
                    {qty > 1 && (
                      <div className="cart-item-unit-price">
                        {item.price} / ud.
                      </div>
                    )}
                  </div>

                  <button 
                    className="cart-item-remove" 
                    onClick={() => removeFromCart(index)} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Eliminar del carrito"
                  >
                    <Trash2 size={18} color="#ff8800" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-total">Total: {total}€</div>
            <button className="cart-checkout-btn">CHECKOUT</button>
          </div>
        </>
      )}
    </main>
  );
}
