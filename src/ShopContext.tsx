import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: string;
  size: string;
  image: string;
  quantity: number;
};

interface ShopContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, newQuantity: number) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prevCart) => {
      // Stack if same product id AND same size
      const existingIndex = prevCart.findIndex(
        (ci) => ci.id === item.id && ci.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const existing = updated[existingIndex];
        const addedQty = item.quantity || 1;
        updated[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 1) + addedQty
        };
        return updated;
      } else {
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        const newCart = [...prevCart];
        newCart.splice(index, 1);
        return newCart;
      }
      const updated = [...prevCart];
      updated[index] = {
        ...updated[index],
        quantity: newQuantity
      };
      return updated;
    });
  };

  return (
    <ShopContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
}
