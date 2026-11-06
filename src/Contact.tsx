import { useState } from 'react';
import { ShopLayout } from './ShopLayout';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos el envío
    setSubmitted(true);
  };

  return (
    <ShopLayout>
      <main className="tracking-page" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 className="tracking-title" style={{ textAlign: 'center' }}>Contáctanos</h1>
        <p className="tracking-desc" style={{ textAlign: 'center' }}>
          ¿Tienes alguna duda sobre tu pedido o necesitas más información? Escríbenos.
        </p>

        {submitted ? (
          <div className="tracking-result" style={{ textAlign: 'center' }}>
            <h3>¡Mensaje enviado!</h3>
            <p>Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Nombre" 
                className="tracking-input" 
                style={{ flex: 1, maxWidth: '100%' }}
                required 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="tracking-input" 
                style={{ flex: 1, maxWidth: '100%' }}
                required 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <input 
              type="text" 
              placeholder="Asunto (Opcional)" 
              className="tracking-input" 
              style={{ maxWidth: '100%' }}
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
            <textarea 
              placeholder="Tu mensaje..." 
              className="tracking-input" 
              style={{ maxWidth: '100%', minHeight: '150px', fontFamily: 'inherit', resize: 'vertical' }}
              required
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
            <button type="submit" className="tracking-btn" style={{ alignSelf: 'center', minWidth: '200px' }}>
              ENVIAR
            </button>
          </form>
        )}
      </main>
    </ShopLayout>
  );
}
