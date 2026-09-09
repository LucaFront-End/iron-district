/**
 * Wix Inbox + CRM Chat API for Station Metalworks
 * Direct REST implementation to Wix APIs (avoiding SDK client-side bloat).
 */

const WIX_API_BASE = 'https://www.wixapis.com';
const DEFAULT_SITE_ID = '03cd98f6-7587-4e42-b1e6-5c77de779c6a';

async function wixFetch(path, options = {}) {
  const apiKey = process.env.WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || DEFAULT_SITE_ID;

  const url = `${WIX_API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
      'wix-site-id': siteId,
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Wix API returned non-JSON (status ${res.status}): ${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.details?.validationError?.fieldViolations?.[0]?.description ||
      data?.details?.applicationError?.description ||
      JSON.stringify(data);
    const err = new Error(`Wix API error ${res.status}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query?.action || req.body?.action;

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  const apiKey = process.env.WIX_API_KEY || '';
  const siteId = process.env.WIX_SITE_ID || DEFAULT_SITE_ID;

  // ─── STATUS CHECK (Used by frontend to gracefully detect availability) ───
  if (action === 'status') {
    return res.status(200).json({
      configured: Boolean(apiKey && siteId),
      hasApiKey: Boolean(apiKey),
      hasSiteId: Boolean(siteId),
      siteId: siteId ? siteId.slice(0, 8) + '...' : null,
    });
  }

  // ─── DIAGNOSTIC ──────────────────────────────────────────────────────────
  if (action === 'diagnostic') {
    const diag = {
      siteIdLength: siteId.length,
      siteIdStart: siteId ? siteId.slice(0, 8) + '...' : '',
      siteIdIsGuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(siteId.trim()),
      apiKeyLength: apiKey.length,
      apiKeyStart: apiKey ? apiKey.slice(0, 10) + '...' : '',
      apiKeyPrefix: apiKey ? apiKey.slice(0, 4) : '',
      apiKeyLooksValid: apiKey.trim().startsWith('IST.') && apiKey.trim().length > 50,
      instructions: !apiKey
        ? 'Para activar Wix Inbox en tiempo real, genera una API Key en Wix Dashboard > Configuración > Claves API y asígnala a la variable de entorno WIX_API_KEY en Vercel.'
        : 'WIX_API_KEY configurada.',
    };

    let testResult = null;
    if (apiKey && siteId) {
      try {
        const testRes = await wixFetch('/contacts/v4/contacts/query', {
          method: 'POST',
          body: JSON.stringify({
            query: { paging: { limit: 1 } },
          }),
        });
        testResult = { success: true, count: testRes.contacts?.length || 0 };
      } catch (err) {
        testResult = { success: false, error: err.message, status: err.status, wixData: err.data };
      }
    } else {
      testResult = { success: false, reason: 'WIX_API_KEY no definida en Vercel. El widget funcionará en modo Mensaje Directo y WhatsApp.' };
    }

    return res.status(200).json({ diagnostic: diag, testResult });
  }

  if (!apiKey) {
    return res.status(503).json({
      notConfigured: true,
      error: 'Wix credentials not configured on backend.',
      message: 'Chat service currently unavailable. Please use direct message form or WhatsApp.',
    });
  }

  try {
    // ─── INIT CONVERSATION ───────────────────────────────────────────────────
    if (action === 'init') {
      const { name, email, phone } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'Email is required for chat initialization' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = (name?.trim() || 'Visitor').split(' ');
      const firstName = cleanName[0];
      const lastName = cleanName.slice(1).join(' ') || undefined;

      let contactId = null;

      // 1. Query existing contacts by email
      try {
        const queryRes = await wixFetch('/contacts/v4/contacts/query', {
          method: 'POST',
          body: JSON.stringify({
            query: {
              filter: { 'primaryInfo.email': { $eq: cleanEmail } },
              paging: { limit: 1 },
            },
          }),
        });
        const items = queryRes.contacts || [];
        if (items.length > 0) {
          contactId = items[0].id || items[0]._id;
          console.log('[WixChat] Found existing contact:', contactId);
        }
      } catch (err) {
        console.error('[WixChat] Error querying contacts:', err.message);
      }

      // 2. Create contact if not found
      if (!contactId) {
        try {
          const nameObj = { first: firstName };
          if (lastName) nameObj.last = lastName;

          const contactInfo = {
            name: nameObj,
            emails: {
              items: [{ tag: 'MAIN', email: cleanEmail }],
            },
          };

          if (phone && phone.trim()) {
            contactInfo.phones = {
              items: [{ tag: 'MOBILE', phone: phone.trim() }],
            };
          }

          const createRes = await wixFetch('/contacts/v4/contacts', {
            method: 'POST',
            body: JSON.stringify({
              info: contactInfo,
              allowDuplicates: true,
            }),
          });
          contactId = createRes.contact?.id || createRes.contact?._id;
          console.log('[WixChat] Created contact:', contactId);
        } catch (err) {
          console.error('[WixChat] Error creating contact:', err.message, JSON.stringify(err.data || {}));
          return res.status(500).json({
            error: `Failed to create contact in CRM: ${err.message}`,
            details: err.message,
            wixData: err.data,
          });
        }
      }

      if (!contactId) {
        return res.status(500).json({ error: 'Could not retrieve or create contact ID' });
      }

      // 3. Get or create inbox conversation
      try {
        const convoRes = await wixFetch('/inbox/v2/conversations', {
          method: 'POST',
          body: JSON.stringify({
            participantId: { contactId },
          }),
        });
        const conversationId =
          convoRes.conversation?.id ||
          convoRes.conversationId ||
          convoRes.id;
        return res.status(200).json({ conversationId, contactId });
      } catch (err) {
        console.error('[WixChat] Error creating conversation:', err.message, JSON.stringify(err.data || {}));
        return res.status(500).json({
          error: `Failed to initialize conversation: ${err.message}`,
          details: err.message,
          wixData: err.data,
        });
      }

    // ─── LIST MESSAGES ───────────────────────────────────────────────────────
    } else if (action === 'list') {
      const conversationId = req.query?.conversationId || req.body?.conversationId;
      if (!conversationId) {
        return res.status(400).json({ error: 'conversationId is required' });
      }

      try {
        const msgRes = await wixFetch(
          `/inbox/v2/messages?conversationId=${conversationId}&visibility=BUSINESS_AND_PARTICIPANT`,
          { method: 'GET' }
        );
        return res.status(200).json(msgRes);
      } catch (err) {
        console.error('[WixChat] Error listing messages:', err.message);
        return res.status(500).json({ error: 'Failed to list messages', details: err.message });
      }

    // ─── SEND MESSAGE ─────────────────────────────────────────────────────────
    } else if (action === 'send') {
      const { conversationId, text } = req.body || {};
      if (!conversationId || !text) {
        return res.status(400).json({ error: 'conversationId and text are required' });
      }

      try {
        const sendRes = await wixFetch('/inbox/v2/messages', {
          method: 'POST',
          body: JSON.stringify({
            conversationId,
            conversation_id: conversationId,
            message: {
              content: {
                basic: {
                  items: [{ text }],
                },
              },
              direction: 'PARTICIPANT_TO_BUSINESS',
              visibility: 'BUSINESS_AND_PARTICIPANT',
            },
            sendAs: 'PARTICIPANT',
            send_as: 'PARTICIPANT',
          }),
        });
        return res.status(200).json(sendRes);
      } catch (err) {
        console.error('[WixChat] Error sending message:', err.message, JSON.stringify(err.data || {}));
        return res.status(500).json({ error: 'Failed to send message', details: err.message });
      }

    } else {
      return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (globalErr) {
    console.error('[WixChat] Unexpected error:', globalErr.message);
    return res.status(500).json({ error: 'Internal Server Error', details: globalErr.message });
  }
}
