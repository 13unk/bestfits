function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildWhatsAppUrl(rawPhone) {
  const digits = String(rawPhone || '').replace(/[^\d]/g, '');
  if (!digits) return '';
  // Asumir prefijo español (+34) si el cliente introduce 9 dígitos empezando por 6, 7, 8 o 9
  const normalized = digits.length === 9 && /^[6789]/.test(digits) ? `34${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

function formatTelegramMessage({ orderNumber, total, items, customer }) {
  const itemsLines = (items || [])
    .map((item) => {
      const qty = item.quantity || 1;
      const unitNum = parseFloat(String(item.price || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
      const lineTotal = unitNum * qty;
      return `• <b>${qty}x</b> ${escapeHtml(item.name)} (Talla <b>${escapeHtml(item.size)}</b>) — ${lineTotal}€`;
    })
    .join('\n');

  const addressParts = [
    escapeHtml(customer.direccion),
    customer.detalles ? escapeHtml(customer.detalles) : '',
  ].filter(Boolean);

  const waUrl = buildWhatsAppUrl(customer.telefono);
  const waLine = waUrl ? `\n💬 <a href="${waUrl}">Abrir WhatsApp con el cliente</a>` : '';
  const notesLine = customer.notas ? `\n📝 <b>Notas:</b> ${escapeHtml(customer.notas)}` : '';

  return [
    `🧾 <b>NUEVO PEDIDO</b> <code>${escapeHtml(orderNumber)}</code>`,
    `💶 <b>Importe Bizum:</b> ${escapeHtml(total)}€`,
    `⏳ <i>Estado: Pendiente de Bizum</i>`,
    ``,
    `🛍️ <b>Artículos:</b>`,
    itemsLines || '• Sin artículos',
    ``,
    `👤 <b>Cliente:</b>`,
    `• ${escapeHtml(customer.nombre)} ${escapeHtml(customer.apellidos)}`,
    `• 📞 ${escapeHtml(customer.telefono)}`,
    `• ✉️ ${escapeHtml(customer.email)}`,
    ``,
    `📍 <b>Dirección de envío:</b>`,
    `• ${addressParts.join(', ')}`,
    `• ${escapeHtml(customer.codigoPostal)} ${escapeHtml(customer.ciudad)}, ${escapeHtml(customer.provincia)} (${escapeHtml(customer.pais)})` +
      notesLine +
      waLine,
  ].join('\n');
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(payload);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'Method Not Allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return sendJson(res, 503, {
      ok: false,
      error: 'Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID en las variables de entorno.',
    });
  }

  try {
    const body = await readJsonBody(req);
    const { orderNumber, total, items, customer } = body || {};

    if (!orderNumber || !customer || !Array.isArray(items) || items.length === 0) {
      return sendJson(res, 400, { ok: false, error: 'Datos del pedido incompletos.' });
    }

    const text = formatTelegramMessage({ orderNumber, total, items, customer });

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const tgData = await tgResponse.json();
    if (!tgResponse.ok || !tgData.ok) {
      return sendJson(res, 502, {
        ok: false,
        error: tgData.description || 'Error al enviar el ticket a Telegram.',
      });
    }

    return sendJson(res, 200, { ok: true, orderNumber });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : 'Error interno procesando el pedido.',
    });
  }
}
