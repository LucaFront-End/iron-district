/**
 * Station Metalworks - CMS Service
 * Manages RFQ Quotes, Client Leads, Status Pipeline, and Local Storage Persistence.
 */

const STORAGE_KEY = 'station_metalworks_leads_cms';

const INITIAL_SEED_LEADS = [
  {
    id: 'SM-RFQ-9421',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'new',
    client: {
      name: 'Arthur Sterling, AIA',
      email: 'arthur@sterlingarchitects.com',
      phone: '+1 (310) 849-2210',
      city: 'Los Angeles, CA',
      clientType: 'architect'
    },
    services: ['stairs'],
    projectScope: 'residential',
    priority: 'fast',
    message: 'Proyecto de escalera voladiza monoviga de 22 pies para residencia privada en Bel Air. Se anexan modelos 3D y especificaciones de carga IBC.',
    files: [
      {
        id: 'f1',
        name: 'bel_air_stair_revit_plan.pdf',
        size: '4.8 MB',
        type: 'application/pdf'
      }
    ],
    internalNotes: 'Revisión prioritaria de taller asignada a José Almanza. Cargas vivas calculadas para 100 PSF.',
    estimatedValue: '$28,500'
  },
  {
    id: 'SM-RFQ-9380',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'under_review',
    client: {
      name: 'Marcus Vance',
      email: 'marcus@vanceluxury.com',
      phone: '+1 (512) 934-5512',
      city: 'Austin, TX',
      clientType: 'general_contractor'
    },
    services: ['railings', 'handrails'],
    projectScope: 'residential',
    priority: 'standard',
    message: 'Sistema perimetral de cable marino de acero inoxidable 316 (180 pies lineales) y pasamanos continuo de apoyo.',
    files: [
      {
        id: 'f2',
        name: 'lake_austin_deck_render.jpg',
        size: '1.9 MB',
        type: 'image/jpeg'
      }
    ],
    internalNotes: 'Enviada muestra de recubrimiento en polvo Tiger Drylac negro mate al cliente.',
    estimatedValue: '$16,200'
  },
  {
    id: 'SM-RFQ-9315',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'quoted',
    client: {
      name: 'Dr. Julian & Clara Hayes',
      email: 'julian.hayes@beverlyhealth.org',
      phone: '+1 (310) 774-1290',
      city: 'Beverly Hills, CA',
      clientType: 'homeowner'
    },
    services: ['gates'],
    projectScope: 'residential',
    priority: 'fast',
    message: 'Portón voladizo automatizado para entrada vehicular de 20 pies con lamas de privacidad horizontales.',
    files: [
      {
        id: 'f3',
        name: 'driveway_elevation.png',
        size: '2.3 MB',
        type: 'image/png'
      }
    ],
    internalNotes: 'Presupuesto #EST-4401 entregado con motor italiano BFT y pivotes industriales FritsJurgens.',
    estimatedValue: '$19,800'
  },
  {
    id: 'SM-RFQ-9240',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'in_production',
    client: {
      name: 'Carlos Mendonça',
      email: 'carlos@apexbuilds.com',
      phone: '+1 (713) 480-1133',
      city: 'Houston, TX',
      clientType: 'commercial'
    },
    services: ['custom', 'handrails'],
    projectScope: 'commercial',
    priority: 'fast',
    message: 'Tres mesas de juntas estructurales de 14 pies con acabado pavonado negro y 240 pies de pasamanos ADA.',
    files: [
      {
        id: 'f4',
        name: 'corporate_specs_dwg.pdf',
        size: '5.1 MB',
        type: 'application/pdf'
      }
    ],
    internalNotes: 'Anticipo 50% recibido. Acero ASTM A36 cortado en láser CNC; en proceso de armado y soldadura AWS.',
    estimatedValue: '$34,000'
  }
];

export const cmsService = {
  // Get all leads
  getLeads() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_LEADS));
        return INITIAL_SEED_LEADS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_SEED_LEADS;
    } catch (e) {
      console.error('Error reading leads from CMS storage', e);
      return INITIAL_SEED_LEADS;
    }
  },

  // Save or update a lead
  saveLead(leadData) {
    try {
      const leads = this.getLeads();
      const existingIndex = leads.findIndex(l => l.id === leadData.id);

      let savedLead;
      if (existingIndex >= 0) {
        // Update existing lead
        savedLead = {
          ...leads[existingIndex],
          ...leadData,
          updatedAt: new Date().toISOString()
        };
        leads[existingIndex] = savedLead;
      } else {
        // Create new lead
        const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
        savedLead = {
          id: leadData.id || `SM-RFQ-${uniqueNumber}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: leadData.status || 'new',
          client: leadData.client || {},
          services: leadData.services || [],
          projectScope: leadData.projectScope || 'residential',
          priority: leadData.priority || 'standard',
          origin: leadData.origin || 'Website RFQ Studio',
          message: leadData.message || '',
          files: leadData.files || [],
          internalNotes: leadData.internalNotes || '',
          estimatedValue: leadData.estimatedValue || 'Pending Workshop Review'
        };
        leads.unshift(savedLead);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

      // Dispatch custom event so any open CMS views react in real-time
      window.dispatchEvent(new CustomEvent('station-cms-lead-updated', { detail: savedLead }));

      return savedLead;
    } catch (e) {
      console.error('Error saving lead to CMS', e);
      return null;
    }
  },

  // Update lead status
  updateLeadStatus(leadId, newStatus) {
    try {
      const leads = this.getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        lead.status = newStatus;
        lead.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        window.dispatchEvent(new CustomEvent('station-cms-lead-updated', { detail: lead }));
        return lead;
      }
      return null;
    } catch (e) {
      console.error('Error updating lead status in CMS', e);
      return null;
    }
  },

  // Update internal notes or estimated value
  updateLeadMeta(leadId, { internalNotes, estimatedValue }) {
    try {
      const leads = this.getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        if (internalNotes !== undefined) lead.internalNotes = internalNotes;
        if (estimatedValue !== undefined) lead.estimatedValue = estimatedValue;
        lead.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
        window.dispatchEvent(new CustomEvent('station-cms-lead-updated', { detail: lead }));
        return lead;
      }
      return null;
    } catch (e) {
      console.error('Error updating lead meta in CMS', e);
      return null;
    }
  },

  // Delete a lead
  deleteLead(leadId) {
    try {
      let leads = this.getLeads();
      leads = leads.filter(l => l.id !== leadId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('station-cms-lead-updated', { detail: { id: leadId, deleted: true } }));
      return true;
    } catch (e) {
      console.error('Error deleting lead from CMS', e);
      return false;
    }
  },

  // Reset to initial seed
  resetLeads() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_LEADS));
    window.dispatchEvent(new CustomEvent('station-cms-lead-updated', { detail: { reset: true } }));
    return INITIAL_SEED_LEADS;
  }
};
