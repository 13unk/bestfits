// FAQ component
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Shop.css';
import { ShopLayout } from './ShopLayout';

export function Faq() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50); // slight delay to ensure render
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <ShopLayout>
      <main id="terms" className="shop-main faq-main">
        <h1 className="faq-title">Términos y condiciones de uso y venta</h1>
        
        <div className="faq-intro" style={{ color: '#555', marginBottom: '3rem', lineHeight: '1.6' }}>
          <p>Las presentes Condiciones Generales regulan el acceso y uso del sitio web, así como la adquisición de productos a través del mismo. La realización de cualquier pedido implica la aceptación plena y sin reservas de las presentes condiciones por parte del usuario.</p>
        </div>

        <section className="faq-section">
          <h2>1. Identificación del Titular y Naturaleza de la Web</h2>
          <p><strong>Naturaleza de la tienda:</strong> Esta plataforma opera exclusivamente como un espacio digital de carácter temporal (pop-up store) destinado a la liquidación puntual de stock de artículos de segunda mano y excedentes personales.</p>
          <p><strong>Modelo de venta:</strong> Los productos ofrecidos son artículos usados / de segunda mano, procedentes de particulares o de liquidación de colecciones anteriores, y se venden "tal cual" (as is).</p>
          <p><strong>Duración:</strong> La tienda permanecerá activa únicamente hasta agotar existencias (stock out), momento en el cual el sitio web cesará su actividad de forma definitiva sin previo aviso.</p>
        </section>

        <section className="faq-section">
          <h2>2. Estado de los Productos y Garantías</h2>
          <p><strong>Descripción del estado:</strong> Al tratarse de prendas y artículos de segunda mano, pueden presentar signos razonables de uso, desgaste, pequeñas imperfecciones o el paso del tiempo. Dichos detalles se detallan en las descripciones y fotografías de cada producto. El usuario acepta adquirir el producto conociendo de antemano su condición de usado.</p>
          <p><strong>Exclusión de garantía comercial:</strong> Al no tratarse de un establecimiento mercantil profesional dedicado de forma habitual a la venta de productos nuevos, y tratándose de transacciones de bienes usados entre particulares/plataforma de liquidación puntual, no se ofrece garantía de conformidad de productos nuevos, rigiéndose la compraventa por los artículos correspondientes del Código Civil aplicables a los vicios o defectos ocultos graves.</p>
        </section>

        <section className="faq-section">
          <h2>3. Precios y Disponibilidad</h2>
          <p><strong>Precios:</strong> Todos los precios se muestran en euros (€) e incluyen los impuestos aplicables (si procede) en el momento de la compra, salvo que se indique lo contrario. Los gastos de envío se calcularán y desglosarán antes de finalizar el proceso de pago.</p>
          <p><strong>Disparidad de stock y fin de existencias:</strong> Dado que se trata de piezas únicas o unidades muy limitadas de liquidación, la disponibilidad en tiempo real puede verse afectada. En caso de que un artículo se agote simultáneamente durante el proceso de pago de varios usuarios, se priorizará el pedido que haya entrado primero en el sistema y se procederá a la anulación y reembolso inmediato del importe del artículo agotado, quedando la empresa exenta de cualquier otra responsabilidad por falta de stock.</p>
        </section>

        <section id="shipping" className="faq-section">
          <h2>4. Envíos y Entregas</h2>
          <p>Los envíos se realizarán a la dirección facilitada por el comprador dentro de los plazos indicados en el proceso de compra.</p>
          <p>La empresa no se hace responsable de los retrasos ocasionados por causas de fuerza mayor, huelgas de transporte o errores imputables única y exclusivamente a la compañía de mensajería o a datos incorrectos facilitados por el cliente.</p>
        </section>

        <section id="returns" className="faq-section">
          <h2>5. Política de Cambios y Devoluciones</h2>
          <p><strong>Principio general:</strong> Debido a la naturaleza efímera de esta pop-up store de liquidación y a la condición de segunda mano de los artículos, no se admiten cambios ni devoluciones por motivos de talla, color, preferencias personales o "arrepentimiento de compra".</p>
          <p><strong>Excepción por defecto no descrito:</strong> Solo se aceptarán devoluciones en caso de que el artículo presente un defecto grave oculto que afecte de manera drástica a su funcionalidad y que no hubiera sido reflejado ni descrito en la ficha del producto. Para ello, el comprador deberá notificar la incidencia por correo electrónico en un plazo máximo de 48 horas desde la recepción del paquete, aportando pruebas gráficas (fotografías y/o vídeos) del desperfecto. Los costes de envío de devolución correrán a cargo del comprador, salvo acuerdo en contrario tras la verificación del caso.</p>
        </section>

        <section className="faq-section">
          <h2>6. Limitación de Responsabilidad</h2>
          <p>El titular de la web no se hace responsable de los daños indirectos, pérdida de beneficios o perjuicios derivados de interrupciones temporales del servicio web, fallos de conexión o caídas del servidor motivadas por el tráfico masivo típico de una apertura temporal o causas ajenas al control técnico.</p>
        </section>

        <section className="faq-section">
          <h2>7. Protección de Datos y Ley Aplicable</h2>
          <p>Los datos facilitados por los usuarios serán tratados única y exclusivamente con la finalidad de gestionar el envío de los pedidos realizados durante la vigencia de esta tienda temporal, cumpliendo con la normativa vigente en materia de protección de datos (RGPD). Una vez finalizada la liquidación y entregados todos los pedidos, los datos de carácter comercial podrán ser suprimidos.</p>
          <p>Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia o litigio derivado de estas condiciones, ambas partes se someten a los juzgados y tribunales correspondientes al domicilio del titular de la web, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
        </section>
      </main>
    </ShopLayout>
  );
}
