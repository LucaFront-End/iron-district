/**
 * useFormCMS — Centralized hook for transmitting all forms, popups, and requests
 * to the Wix CMS collection "Contacto":
 * https://manage.wix.com/dashboard/03cd98f6-7587-4e42-b1e6-5c77de779c6a/wix-cms/data/Contacto
 */

import { useWix } from '../context/WixContext';

export const CMS_COLLECTION_ID = 'Contacto';

/**
 * Normalizes and dispatches a form payload to the Wix CMS "Contacto" collection.
 * Uses both English and Spanish property keys so whatever columns exist in the Wix Data
 * table are populated automatically.
 */
export async function sendSubmissionToCMS(wixClient, {
  name = '',
  email = '',
  phone = '',
  city = '',
  service = '',
  type = 'contact',
  source = 'Sitio Web',
  message = '',
  details = null,
  customFields = {},
}) {
  const cleanName = name?.trim() || '';
  const cleanEmail = email?.trim() || '';
  const cleanPhone = phone?.trim() || '';
  const cleanOrigin = source?.trim() || 'Sitio Web';

  const title = `${cleanName || 'Nuevo Contacto'} — ${cleanOrigin}`;

  const formattedDetails = details 
    ? (typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details))
    : message;

  const payload = {
    title,
    name: cleanName,
    nombre: cleanName,
    email: cleanEmail,
    correo: cleanEmail,
    phone: cleanPhone,
    telefono: cleanPhone,
    city: city || '',
    ciudad: city || '',
    service: service || '',
    servicio: service || '',
    source: cleanOrigin,
    origen: cleanOrigin,
    type,
    tipo: type,
    message: message || '',
    mensaje: message || '',
    details: formattedDetails || '',
    detalles: formattedDetails || '',
    status: 'new',
    submittedAt: new Date().toISOString(),
    ...customFields,
  };

  // 1. First try direct client SDK insertion
  if (wixClient?.items?.insert) {
    try {
      const res = await wixClient.items.insert(CMS_COLLECTION_ID, payload);
      console.log(`[FormCMS] Successfully inserted into "${CMS_COLLECTION_ID}":`, res?._id || 'OK');
      return { success: true, id: res?._id, method: 'sdk' };
    } catch (sdkErr) {
      console.warn('[FormCMS] SDK insert notice, attempting serverless fallback:', sdkErr.message);
    }
  }

  // 2. Serverless API fallback (/api/cms)
  try {
    const res = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: CMS_COLLECTION_ID,
        title,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        city,
        service,
        origin: cleanOrigin,
        type,
        message,
        details,
        customFields,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`[FormCMS] Serverless fallback saved to "${CMS_COLLECTION_ID}":`, data?.id || 'OK');
      return { success: true, id: data?.id, method: 'api' };
    }
  } catch (apiErr) {
    console.error('[FormCMS] All CMS submission channels failed:', apiErr);
  }

  return { success: false };
}

/**
 * React hook to submit any form data to the Wix CMS "Contacto" collection.
 * Non-blocking by default.
 */
export function useFormCMS() {
  const { wixClient, isReady } = useWix();

  const submitToCMS = async (formProps) => {
    try {
      return await sendSubmissionToCMS(wixClient, formProps);
    } catch (err) {
      console.error('[FormCMS] Unexpected error in submitToCMS:', err);
      return { success: false, error: err.message };
    }
  };

  return { submitToCMS, isReady };
}

export default useFormCMS;
