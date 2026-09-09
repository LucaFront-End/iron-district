/**
 * Serverless API to save form submissions & popups directly to Wix CMS collection "Contacto"
 */
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const WIX_CLIENT_ID = process.env.WIX_CLIENT_ID || '8d22ac43-bd56-44f9-a4a3-0ab3e0a37492';
const DEFAULT_COLLECTION = 'Contacto';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = req.body || {};
    const collectionId = body.collectionId || DEFAULT_COLLECTION;

    // Extract standard fields
    const name = body.name || body.nombre || body.contacto_nombre || body.cliente_nombre || '';
    const email = body.email || body.correo || '';
    const phone = body.phone || body.telefono || body.contacto_telefono || '';
    const origin = body.origin || body.origen || body.source || 'Sitio Web';
    const type = body.type || body.tipo || body.tipo_servicio || 'formulario';
    const city = body.city || body.ciudad || '';
    const service = body.service || body.servicio || body.projectType || '';
    const message = body.message || body.mensaje || body.detalles_proyecto || body.notes || '';
    const extraDetails = body.details || body.detalles || body.extra || null;

    const title = body.title || `${name || 'Contacto'} — ${origin}`;

    const payload = {
      title,
      name,
      nombre: name,
      email,
      correo: email,
      phone,
      telefono: phone,
      city,
      ciudad: city,
      service,
      servicio: service,
      source: origin,
      origen: origin,
      type,
      tipo: type,
      message,
      mensaje: message,
      details: extraDetails ? (typeof extraDetails === 'object' ? JSON.stringify(extraDetails, null, 2) : extraDetails) : message,
      detalles: extraDetails ? (typeof extraDetails === 'object' ? JSON.stringify(extraDetails, null, 2) : extraDetails) : message,
      status: 'new',
      submittedAt: new Date().toISOString(),
      ...(body.customFields || {}),
    };

    const client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
    });

    const result = await client.items.insert(collectionId, payload);
    console.log('[API CMS] Successfully inserted into', collectionId, result?._id);

    return res.status(200).json({
      success: true,
      id: result?._id,
      collection: collectionId,
    });
  } catch (err) {
    console.error('[API CMS] Error inserting to Wix CMS:', err);
    return res.status(500).json({
      error: 'Failed to insert into Wix CMS',
      details: err.message,
    });
  }
}
