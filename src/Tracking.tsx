import { useState } from 'react';

export function Tracking() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleTrack = () => {
    if (code.trim()) {
      setResult('Estado del pedido: En tránsito. Fecha de entrega estimada: 2 a 3 días hábiles. Ubicación actual: Centro logístico principal.');
    }
  };

  return (
    <main className="tracking-page">
      <h1 className="tracking-title">Sigue tu pedido</h1>
      <p className="tracking-desc">Introduce tu código de seguimiento para obtener información en tiempo real sobre tu envío.</p>
      
      <div className="tracking-input-group">
        <input 
          type="text" 
          className="tracking-input" 
          placeholder="Ej: 00000000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="tracking-btn" onClick={handleTrack}>Rastrear</button>
      </div>

      {result && (
        <div className="tracking-result">
          <h3>Detalles de seguimiento</h3>
          <p>{result}</p>
        </div>
      )}
    </main>
  );
}
