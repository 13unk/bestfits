import { useState, useEffect, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productsData } from './Shop';
import { useShop } from './ShopContext';

export function Product({ id }: { id?: number }) {
  const params = useParams();
  const productId = id !== undefined ? id : (params.id ? parseInt(params.id, 10) : 0);
  const product = productsData.find(p => p.id === productId);
  const { addToCart } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Product not found.</div>;
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image
    });
  };

  return (
    <div className="product-page">
      <div className="product-gallery">
        <div className="product-image-container">
          <img src={activeImage || product.image} alt={product.name} />
        </div>
        {images.length > 1 && (
          <div className="product-thumbnails">
            {images.map((img, index) => (
              <button
                key={index}
                type="button"
                className={`product-thumb-btn ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
                onMouseEnter={() => setActiveImage(img)}
              >
                <img src={img} alt={`${product.name} vista ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="product-details">
        <div className="product-header">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{product.price}</p>
        </div>
        <p className="product-description">{product.description}</p>
        
        <div className="product-options">
          <div className="product-sizes">
            {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
              <span 
                key={size} 
                onClick={() => setSelectedSize(size)}
                style={{ 
                  background: selectedSize === size ? '#111' : 'transparent',
                  color: selectedSize === size ? '#fff' : '#111',
                  borderColor: selectedSize === size ? '#111' : '#ccc'
                }}
              >
                {size}
              </span>
            ))}
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
        </div>
      </div>
    </div>
  );
}
