import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, Clock, AlertCircle, Search, Filter, Download, 
  Trash2, ExternalLink, Phone, Mail, MessageSquare, Plus, ArrowLeft,
  Building2, TrendingUp, Columns, Activity, DoorClosed, Sparkles, FileText,
  Eye, RefreshCw, X, ChevronDown, Check, UserCheck, Calendar, MapPin
} from 'lucide-react';
import { cmsService } from '../services/cmsService';
import { useLanguage } from '../context/LanguageContext';

export default function CmsDashboard() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [activeLeadModal, setActiveLeadModal] = useState(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [internalNotesEdit, setInternalNotesEdit] = useState('');
  const [estimatedValueEdit, setEstimatedValueEdit] = useState('');

  // New manual lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    clientType: 'homeowner',
    services: ['stairs'],
    projectScope: 'residential',
    priority: 'standard',
    message: '',
    estimatedValue: ''
  });

  const loadLeads = () => {
    setLeads(cmsService.getLeads());
  };

  useEffect(() => {
    loadLeads();

    const handleUpdate = () => {
      loadLeads();
    };

    window.addEventListener('station-cms-lead-updated', handleUpdate);
    return () => window.removeEventListener('station-cms-lead-updated', handleUpdate);
  }, []);

  const handleStatusChange = (leadId, newStatus) => {
    cmsService.updateLeadStatus(leadId, newStatus);
    loadLeads();
    if (activeLeadModal && activeLeadModal.id === leadId) {
      setActiveLeadModal(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteLead = (leadId) => {
    if (window.confirm(isEs ? '¿Estás seguro de eliminar este lead del CMS?' : 'Are you sure you want to delete this lead?')) {
      cmsService.deleteLead(leadId);
      loadLeads();
      if (activeLeadModal && activeLeadModal.id === leadId) {
        setActiveLeadModal(null);
      }
    }
  };

  const handleSaveLeadMeta = (leadId) => {
    cmsService.updateLeadMeta(leadId, {
      internalNotes: internalNotesEdit,
      estimatedValue: estimatedValueEdit
    });
    loadLeads();
    setActiveLeadModal(prev => ({
      ...prev,
      internalNotes: internalNotesEdit,
      estimatedValue: estimatedValueEdit
    }));
  };

  const openLeadDetail = (lead) => {
    setActiveLeadModal(lead);
    setInternalNotesEdit(lead.internalNotes || '');
    setEstimatedValueEdit(lead.estimatedValue || '');
  };

  const handleCreateManualLead = (e) => {
    e.preventDefault();
    if (!newLeadForm.name) return;

    cmsService.saveLead({
      status: 'new',
      client: {
        name: newLeadForm.name,
        email: newLeadForm.email,
        phone: newLeadForm.phone,
        city: newLeadForm.city,
        clientType: newLeadForm.clientType
      },
      services: newLeadForm.services,
      projectScope: newLeadForm.projectScope,
      priority: newLeadForm.priority,
      message: newLeadForm.message,
      estimatedValue: newLeadForm.estimatedValue || 'Pending Quote',
      files: []
    });

    setIsNewLeadModalOpen(false);
    setNewLeadForm({
      name: '',
      email: '',
      phone: '',
      city: '',
      clientType: 'homeowner',
      services: ['stairs'],
      projectScope: 'residential',
      priority: 'standard',
      message: '',
      estimatedValue: ''
    });
    loadLeads();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Status', 'Name', 'Email', 'Phone', 'City', 'Client Type', 'Services', 'Scope', 'Priority', 'Estimated Value', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      l.status,
      `"${l.client?.name || ''}"`,
      `"${l.client?.email || ''}"`,
      `"${l.client?.phone || ''}"`,
      `"${l.client?.city || ''}"`,
      l.client?.clientType || '',
      `"${(l.services || []).join(', ')}"`,
      l.projectScope || '',
      l.priority || '',
      `"${l.estimatedValue || ''}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `station_metalworks_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      lead.id.toLowerCase().includes(searchLower) ||
      (lead.client?.name || '').toLowerCase().includes(searchLower) ||
      (lead.client?.email || '').toLowerCase().includes(searchLower) ||
      (lead.client?.phone || '').toLowerCase().includes(searchLower) ||
      (lead.client?.city || '').toLowerCase().includes(searchLower) ||
      (lead.message || '').toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus = 
      selectedStatus === 'all' || 
      lead.status === selectedStatus;

    // Service filter
    const matchesService = 
      selectedService === 'all' || 
      (lead.services || []).includes(selectedService);

    return matchesSearch && matchesStatus && matchesService;
  });

  // Calculate Metrics
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === 'new' || l.status === 'draft_step1').length;
  const reviewCount = leads.filter(l => l.status === 'under_review').length;
  const quotedCount = leads.filter(l => l.status === 'quoted').length;
  const productionCount = leads.filter(l => l.status === 'in_production' || l.status === 'completed').length;

  const serviceIcons = {
    stairs: <TrendingUp size={14} className="service-icon-svg" />,
    railings: <Columns size={14} className="service-icon-svg" />,
    handrails: <Activity size={14} className="service-icon-svg" />,
    gates: <DoorClosed size={14} className="service-icon-svg" />,
    custom: <Sparkles size={14} className="service-icon-svg" />
  };

  const serviceLabels = {
    stairs: isEs ? 'Escaleras' : 'Stairs',
    railings: isEs ? 'Barandillas' : 'Railings',
    handrails: isEs ? 'Pasamanos' : 'Handrails',
    gates: isEs ? 'Portones' : 'Gates & Doors',
    custom: isEs ? 'Mobiliario & Mesas' : 'Custom & Tables'
  };

  const statusBadges = {
    draft_step1: { label: isEs ? 'Borrador Paso 1' : 'Draft (Step 1)', class: 'status-draft' },
    new: { label: isEs ? 'Nuevo' : 'New', class: 'status-new' },
    under_review: { label: isEs ? 'En Revisión' : 'Under Review', class: 'status-review' },
    quoted: { label: isEs ? 'Cotizado' : 'Quoted', class: 'status-quoted' },
    in_production: { label: isEs ? 'En Taller / Fabricación' : 'In Production', class: 'status-production' },
    completed: { label: isEs ? 'Entregado / Completado' : 'Completed', class: 'status-completed' },
    archived: { label: isEs ? 'Archivado' : 'Archived', class: 'status-archived' }
  };

  return (
    <div className="cms-page-wrapper">
      {/* Top Navbar */}
      <header className="cms-header">
        <div className="cms-header-container">
          <div className="cms-brand-group">
            <a href="#/" className="cms-back-btn" title={isEs ? 'Volver al Sitio Web' : 'Return to Website'}>
              <ArrowLeft size={16} />
              <span>{isEs ? 'Sitio Web' : 'Back to Site'}</span>
            </a>
            <div className="cms-divider" />
            <img src="/logo.png" alt="Station Metalworks" className="cms-logo-img" />
            <div className="cms-title-badge">
              <Shield size={14} className="text-crimson" />
              <span>CMS // LEADS & WORKSHOP PIPELINE</span>
            </div>
          </div>

          <div className="cms-header-actions">
            <button onClick={handleExportCSV} className="cms-btn-secondary" title="Export to CSV">
              <Download size={14} />
              <span>{isEs ? 'Exportar CSV' : 'Export CSV'}</span>
            </button>
            <button onClick={() => setIsNewLeadModalOpen(true)} className="cms-btn-primary">
              <Plus size={15} />
              <span>{isEs ? 'Nuevo Lead Manual' : 'Add Manual Lead'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="cms-main-content">
        <div className="cms-inner-container">

          {/* Metric KPI HUD Cards */}
          <div className="cms-metrics-grid">
            <div className="cms-metric-card">
              <div className="metric-header">
                <span className="metric-label">{isEs ? 'TOTAL LEADS' : 'TOTAL LEADS'}</span>
                <Building2 size={16} className="metric-icon" />
              </div>
              <span className="metric-value">{totalCount}</span>
              <span className="metric-sub">{isEs ? 'Pipeline global' : 'All time inquiries'}</span>
            </div>

            <div className="cms-metric-card highlight-blue">
              <div className="metric-header">
                <span className="metric-label">{isEs ? 'NUEVOS / SIN ATENDER' : 'NEW / UNTOUCHED'}</span>
                <Clock size={16} className="metric-icon text-blue" />
              </div>
              <span className="metric-value text-blue">{newCount}</span>
              <span className="metric-sub">{isEs ? 'Requieren contacto' : 'Awaiting contact'}</span>
            </div>

            <div className="cms-metric-card highlight-amber">
              <div className="metric-header">
                <span className="metric-label">{isEs ? 'EN REVISIÓN TALLER' : 'UNDER REVIEW'}</span>
                <AlertCircle size={16} className="metric-icon text-amber" />
              </div>
              <span className="metric-value text-amber">{reviewCount}</span>
              <span className="metric-sub">{isEs ? 'Revisión técnica de José' : 'Engineering check'}</span>
            </div>

            <div className="cms-metric-card highlight-purple">
              <div className="metric-header">
                <span className="metric-label">{isEs ? 'COTIZADOS' : 'QUOTED'}</span>
                <FileText size={16} className="metric-icon text-purple" />
              </div>
              <span className="metric-value text-purple">{quotedCount}</span>
              <span className="metric-sub">{isEs ? 'Propuesta enviada' : 'Quotes issued'}</span>
            </div>

            <div className="cms-metric-card highlight-green">
              <div className="metric-header">
                <span className="metric-label">{isEs ? 'EN FABRICACIÓN' : 'IN PRODUCTION'}</span>
                <CheckCircle2 size={16} className="metric-icon text-green" />
              </div>
              <span className="metric-value text-green">{productionCount}</span>
              <span className="metric-sub">{isEs ? 'Obras en taller' : 'Active shop jobs'}</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="cms-toolbar">
            <div className="cms-search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder={isEs ? 'Buscar por cliente, email, teléfono, ciudad o ID...' : 'Search by client, email, phone, city or ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cms-search-input"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="search-clear-btn">✕</button>
              )}
            </div>

            <div className="cms-filters-row">
              {/* Status Filter */}
              <div className="filter-group">
                <span className="filter-label">{isEs ? 'Estado:' : 'Status:'}</span>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="cms-select"
                >
                  <option value="all">{isEs ? 'Todos los Estados' : 'All Statuses'}</option>
                  <option value="new">{isEs ? 'Nuevos' : 'New'}</option>
                  <option value="under_review">{isEs ? 'En Revisión' : 'Under Review'}</option>
                  <option value="quoted">{isEs ? 'Cotizados' : 'Quoted'}</option>
                  <option value="in_production">{isEs ? 'En Taller / Fabricación' : 'In Production'}</option>
                  <option value="completed">{isEs ? 'Entregados' : 'Completed'}</option>
                  <option value="draft_step1">{isEs ? 'Borrador Paso 1' : 'Draft (Step 1)'}</option>
                </select>
              </div>

              {/* Service Filter */}
              <div className="filter-group">
                <span className="filter-label">{isEs ? 'Servicio:' : 'Service:'}</span>
                <select 
                  value={selectedService} 
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="cms-select"
                >
                  <option value="all">{isEs ? 'Todas las Disciplinas' : 'All Disciplines'}</option>
                  <option value="stairs">{isEs ? 'Escaleras' : 'Stairs'}</option>
                  <option value="railings">{isEs ? 'Barandillas' : 'Railings'}</option>
                  <option value="handrails">{isEs ? 'Pasamanos' : 'Handrails'}</option>
                  <option value="gates">{isEs ? 'Portones & Puertas' : 'Gates & Doors'}</option>
                  <option value="custom">{isEs ? 'Mobiliario & Mesas' : 'Custom & Tables'}</option>
                </select>
              </div>

              {/* Reset Demo Data Button */}
              <button 
                onClick={() => {
                  if (window.confirm(isEs ? '¿Restablecer datos de muestra del CMS?' : 'Reset CMS demo leads?')) {
                    cmsService.resetLeads();
                    loadLeads();
                  }
                }} 
                className="cms-btn-ghost"
                title={isEs ? 'Restablecer datos iniciales' : 'Reset demo leads'}
              >
                <RefreshCw size={13} />
                <span>{isEs ? 'Reiniciar Datos' : 'Reset Demo'}</span>
              </button>
            </div>
          </div>

          {/* Leads Table / List */}
          <div className="cms-leads-table-container">
            {filteredLeads.length === 0 ? (
              <div className="cms-empty-state">
                <AlertCircle size={36} className="text-muted" />
                <h3>{isEs ? 'No se encontraron solicitudes con estos filtros' : 'No inquiries found matching these filters'}</h3>
                <p>{isEs ? 'Intenta modificar la búsqueda o el filtro de estado.' : 'Try adjusting your search criteria or status filter.'}</p>
              </div>
            ) : (
              <table className="cms-leads-table">
                <thead>
                  <tr>
                    <th>{isEs ? 'ID / FECHA' : 'ID / DATE'}</th>
                    <th>{isEs ? 'CLIENTE / CONTACTO' : 'CLIENT / CONTACT'}</th>
                    <th>{isEs ? 'SERVICIOS' : 'SERVICES'}</th>
                    <th>{isEs ? 'UBICACIÓN / TIPO' : 'LOCATION / TYPE'}</th>
                    <th>{isEs ? 'ARCHIVOS' : 'FILES'}</th>
                    <th>{isEs ? 'ESTADO' : 'STATUS'}</th>
                    <th>{isEs ? 'ACCIONES' : 'ACTIONS'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => {
                    const statusObj = statusBadges[lead.status] || statusBadges.new;
                    const clientPhone = lead.client?.phone || '';
                    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');

                    return (
                      <tr key={lead.id} className="cms-table-row">
                        {/* ID / Date */}
                        <td className="cell-id-date">
                          <span className="lead-id-tag">{lead.id}</span>
                          <span className="lead-date-txt">
                            {new Date(lead.createdAt).toLocaleDateString(isEs ? 'es-ES' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {lead.priority === 'fast' && (
                            <span className="priority-badge-fast">⚡ FAST-TRACK</span>
                          )}
                        </td>

                        {/* Client Info */}
                        <td className="cell-client">
                          <div className="client-info-box">
                            <strong className="client-name">{lead.client?.name || 'Inquiry Draft'}</strong>
                            <div className="client-contact-links">
                              {lead.client?.email && (
                                <a href={`mailto:${lead.client.email}`} className="contact-link" title="Send Email">
                                  <Mail size={12} />
                                  <span>{lead.client.email}</span>
                                </a>
                              )}
                              {lead.client?.phone && (
                                <a href={`tel:${lead.client.phone}`} className="contact-link" title="Call">
                                  <Phone size={12} />
                                  <span>{lead.client.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Services */}
                        <td className="cell-services">
                          <div className="services-tag-cluster">
                            {(lead.services || []).map(srv => (
                              <span key={srv} className="service-mini-pill">
                                {serviceIcons[srv]}
                                <span>{serviceLabels[srv] || srv}</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Location & Client Type */}
                        <td className="cell-meta">
                          <div className="client-meta-box">
                            <span className="client-city">
                              <MapPin size={12} className="text-crimson" />
                              {lead.client?.city || 'No Location'}
                            </span>
                            <span className="client-type-tag">
                              {lead.client?.clientType?.replace('_', ' ').toUpperCase() || 'HOMEOWNER'}
                            </span>
                          </div>
                        </td>

                        {/* Files */}
                        <td className="cell-files">
                          {lead.files && lead.files.length > 0 ? (
                            <span className="files-indicator-badge">
                              <FileText size={13} />
                              <span>{lead.files.length} {lead.files.length === 1 ? (isEs ? 'archivo' : 'file') : (isEs ? 'archivos' : 'files')}</span>
                            </span>
                          ) : (
                            <span className="files-empty">—</span>
                          )}
                        </td>

                        {/* Status Selector */}
                        <td className="cell-status">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`status-inline-select ${statusObj.class}`}
                          >
                            <option value="draft_step1">{isEs ? 'Borrador Paso 1' : 'Draft (Step 1)'}</option>
                            <option value="new">{isEs ? 'Nuevo' : 'New'}</option>
                            <option value="under_review">{isEs ? 'En Revisión' : 'Under Review'}</option>
                            <option value="quoted">{isEs ? 'Cotizado' : 'Quoted'}</option>
                            <option value="in_production">{isEs ? 'En Taller / Fabricación' : 'In Production'}</option>
                            <option value="completed">{isEs ? 'Entregado' : 'Completed'}</option>
                            <option value="archived">{isEs ? 'Archivado' : 'Archived'}</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="cell-actions">
                          <div className="actions-cluster">
                            {cleanPhone && (
                              <a 
                                href={`https://wa.me/${cleanPhone.startsWith('1') ? cleanPhone : '1' + cleanPhone}?text=${encodeURIComponent(
                                  isEs 
                                    ? `Hola ${lead.client?.name}, te contactamos de Station Metalworks respecto a tu solicitud de cotización ${lead.id}.`
                                    : `Hello ${lead.client?.name}, this is Station Metalworks contacting you regarding your quote request ${lead.id}.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="action-icon-btn whatsapp"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare size={14} />
                              </a>
                            )}
                            <button 
                              onClick={() => openLeadDetail(lead)}
                              className="action-icon-btn inspect"
                              title={isEs ? 'Ver Detalle' : 'View Details'}
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteLead(lead.id)}
                              className="action-icon-btn delete"
                              title={isEs ? 'Eliminar' : 'Delete'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>

      {/* =========================================================================
          LEAD DETAIL MODAL
         ========================================================================= */}
      {activeLeadModal && (
        <div className="cms-modal-backdrop" onClick={() => setActiveLeadModal(null)}>
          <div className="cms-modal-dossier glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dossier-header">
              <div className="dossier-id-cluster">
                <span className="dossier-id">{activeLeadModal.id}</span>
                <span className={`status-badge-pill ${statusBadges[activeLeadModal.status]?.class}`}>
                  {statusBadges[activeLeadModal.status]?.label}
                </span>
                {activeLeadModal.priority === 'fast' && (
                  <span className="priority-badge-fast">⚡ PRIORIDAD TALLER</span>
                )}
              </div>
              <button onClick={() => setActiveLeadModal(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-dossier-body">
              {/* Client Profile Section */}
              <div className="dossier-section">
                <h4 className="dossier-sec-title">{isEs ? 'DATOS DEL CLIENTE (PASO 1)' : 'CLIENT PROFILE (STEP 1)'}</h4>
                <div className="dossier-grid-2">
                  <div className="dossier-field">
                    <span className="field-lbl">{isEs ? 'Nombre Completo' : 'Full Name'}</span>
                    <strong className="field-val">{activeLeadModal.client?.name || '—'}</strong>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">{isEs ? 'Tipo de Solicitante' : 'Client Role'}</span>
                    <span className="field-val capitalize">{activeLeadModal.client?.clientType?.replace('_', ' ') || 'Homeowner'}</span>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">Email</span>
                    <a href={`mailto:${activeLeadModal.client?.email}`} className="field-val link">
                      {activeLeadModal.client?.email || '—'}
                    </a>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">{isEs ? 'Teléfono' : 'Phone'}</span>
                    <a href={`tel:${activeLeadModal.client?.phone}`} className="field-val link">
                      {activeLeadModal.client?.phone || '—'}
                    </a>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">{isEs ? 'Ciudad / Estado' : 'Location'}</span>
                    <span className="field-val">{activeLeadModal.client?.city || 'Houston, TX'}</span>
                  </div>
                  <div className="dossier-field">
                    <span className="field-lbl">{isEs ? 'Fecha de Ingreso' : 'Inquiry Date'}</span>
                    <span className="field-val">{new Date(activeLeadModal.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Selected Services (Step 2) */}
              <div className="dossier-section">
                <h4 className="dossier-sec-title">{isEs ? 'DISCIPLINAS Y SERVICIOS REQUERIDOS (PASO 2)' : 'REQUESTED SERVICES (STEP 2)'}</h4>
                <div className="dossier-services-row">
                  {(activeLeadModal.services || []).map(srv => (
                    <div key={srv} className="dossier-service-card">
                      {serviceIcons[srv]}
                      <strong>{serviceLabels[srv] || srv}</strong>
                    </div>
                  ))}
                  <div className="dossier-scope-tag">
                    <span>{isEs ? 'Alcance:' : 'Scope:'}</span>
                    <strong>{(activeLeadModal.projectScope || 'residential').toUpperCase()}</strong>
                  </div>
                </div>
              </div>

              {/* Project Message & Uploaded Files (Step 3) */}
              <div className="dossier-section">
                <h4 className="dossier-sec-title">{isEs ? 'DESCRIPCIÓN DEL PROYECTO & PLANOS (PASO 3)' : 'PROJECT DESCRIPTION & BLUEPRINTS (STEP 3)'}</h4>
                <div className="dossier-message-box">
                  <p>{activeLeadModal.message || (isEs ? 'No se incluyeron notas adicionales.' : 'No additional notes provided.')}</p>
                </div>

                {activeLeadModal.files && activeLeadModal.files.length > 0 && (
                  <div className="dossier-files-group">
                    <span className="field-lbl">{isEs ? 'Archivos Anexados por el Cliente:' : 'Client Attachments:'}</span>
                    <div className="dossier-files-list">
                      {activeLeadModal.files.map(file => (
                        <div key={file.id || file.name} className="dossier-file-item">
                          <FileText size={16} className="text-crimson" />
                          <div className="file-meta">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{file.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Workshop Notes & Estimation (Admin Control) */}
              <div className="dossier-section admin-notes-box">
                <h4 className="dossier-sec-title">{isEs ? 'NOTAS INTERNAS DE TALLER & ESTIMACIÓN (ADMIN)' : 'WORKSHOP INTERNAL NOTES & ESTIMATION'}</h4>
                <div className="admin-notes-grid">
                  <div className="form-group">
                    <label className="field-lbl">{isEs ? 'Valor Estimado de Cotización ($)' : 'Estimated Quote Value ($)'}</label>
                    <input 
                      type="text"
                      value={estimatedValueEdit}
                      onChange={(e) => setEstimatedValueEdit(e.target.value)}
                      placeholder="$12,500"
                      className="cms-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-lbl">{isEs ? 'Notas Técnicas de José / Taller:' : 'Technical Notes from Shop / José:'}</label>
                    <textarea 
                      rows="3"
                      value={internalNotesEdit}
                      onChange={(e) => setInternalNotesEdit(e.target.value)}
                      placeholder={isEs ? 'Anotaciones sobre perfiles, cálculo de cargas, fecha de visita...' : 'Notes regarding profiles, load calculations, field visit...'}
                      className="cms-textarea"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleSaveLeadMeta(activeLeadModal.id)}
                  className="cms-btn-primary save-notes-btn"
                >
                  <Check size={14} />
                  <span>{isEs ? 'Guardar Anotaciones de Taller' : 'Save Workshop Notes'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer with Direct Contact Actions */}
            <div className="modal-dossier-footer">
              <div className="dossier-direct-contact">
                {activeLeadModal.client?.phone && (
                  <a 
                    href={`https://wa.me/${activeLeadModal.client.phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="dossier-contact-btn wa"
                  >
                    <MessageSquare size={15} />
                    <span>WhatsApp</span>
                  </a>
                )}
                {activeLeadModal.client?.phone && (
                  <a href={`tel:${activeLeadModal.client.phone}`} className="dossier-contact-btn phone">
                    <Phone size={15} />
                    <span>{isEs ? 'Llamar' : 'Call'}</span>
                  </a>
                )}
                {activeLeadModal.client?.email && (
                  <a href={`mailto:${activeLeadModal.client.email}`} className="dossier-contact-btn email">
                    <Mail size={15} />
                    <span>Email</span>
                  </a>
                )}
              </div>

              <div className="dossier-status-updater">
                <span className="field-lbl">{isEs ? 'Cambiar Estado:' : 'Change Status:'}</span>
                <select 
                  value={activeLeadModal.status}
                  onChange={(e) => handleStatusChange(activeLeadModal.id, e.target.value)}
                  className="cms-select"
                >
                  <option value="new">{isEs ? 'Nuevo' : 'New'}</option>
                  <option value="under_review">{isEs ? 'En Revisión' : 'Under Review'}</option>
                  <option value="quoted">{isEs ? 'Cotizado' : 'Quoted'}</option>
                  <option value="in_production">{isEs ? 'En Fabricación' : 'In Production'}</option>
                  <option value="completed">{isEs ? 'Entregado' : 'Completed'}</option>
                  <option value="archived">{isEs ? 'Archivar' : 'Archive'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NEW MANUAL LEAD MODAL
         ========================================================================= */}
      {isNewLeadModalOpen && (
        <div className="cms-modal-backdrop" onClick={() => setIsNewLeadModalOpen(false)}>
          <div className="cms-modal-form glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dossier-header">
              <h3 className="modal-title">{isEs ? 'Registrar Nuevo Lead Manual' : 'Register New Manual Lead'}</h3>
              <button onClick={() => setIsNewLeadModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="modal-form-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label>{isEs ? 'Nombre Completo *' : 'Full Name *'}</label>
                  <input 
                    type="text" 
                    required 
                    value={newLeadForm.name} 
                    onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="Ej. Marcus Vance"
                    className="cms-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={newLeadForm.email} 
                    onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="marcus@vance.com"
                    className="cms-input"
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>{isEs ? 'Teléfono' : 'Phone'}</label>
                  <input 
                    type="tel" 
                    value={newLeadForm.phone} 
                    onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+1 (346) 234-9640"
                    className="cms-input"
                  />
                </div>
                <div className="form-group">
                  <label>{isEs ? 'Ciudad' : 'City'}</label>
                  <input 
                    type="text" 
                    value={newLeadForm.city} 
                    onChange={e => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    placeholder="Houston, TX"
                    className="cms-input"
                  />
                </div>
                <div className="form-group">
                  <label>{isEs ? 'Tipo de Cliente' : 'Client Type'}</label>
                  <select 
                    value={newLeadForm.clientType} 
                    onChange={e => setNewLeadForm({ ...newLeadForm, clientType: e.target.value })}
                    className="cms-select"
                  >
                    <option value="homeowner">{isEs ? 'Propietario Residencial' : 'Homeowner'}</option>
                    <option value="general_contractor">{isEs ? 'Contratista General (GC)' : 'General Contractor'}</option>
                    <option value="architect">{isEs ? 'Arquitecto / Diseñador' : 'Architect / Designer'}</option>
                    <option value="commercial">{isEs ? 'Comercial / Empresa' : 'Commercial'}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{isEs ? 'Servicios Requeridos (Selecciona)' : 'Required Services'}</label>
                <div className="manual-services-selector">
                  {['stairs', 'railings', 'handrails', 'gates', 'custom'].map(srv => {
                    const isSelected = newLeadForm.services.includes(srv);
                    return (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => {
                          if (isSelected) {
                            setNewLeadForm({
                              ...newLeadForm,
                              services: newLeadForm.services.filter(s => s !== srv)
                            });
                          } else {
                            setNewLeadForm({
                              ...newLeadForm,
                              services: [...newLeadForm.services, srv]
                            });
                          }
                        }}
                        className={`manual-service-btn ${isSelected ? 'selected' : ''}`}
                      >
                        {serviceIcons[srv]}
                        <span>{serviceLabels[srv]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>{isEs ? 'Notas del Proyecto' : 'Project Notes'}</label>
                <textarea 
                  rows="3" 
                  value={newLeadForm.message}
                  onChange={e => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder={isEs ? 'Detalles de la obra, medidas aproximadas...' : 'Project details, measurements...'}
                  className="cms-textarea"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>{isEs ? 'Valor Estimado ($)' : 'Estimated Value ($)'}</label>
                  <input 
                    type="text" 
                    value={newLeadForm.estimatedValue}
                    onChange={e => setNewLeadForm({ ...newLeadForm, estimatedValue: e.target.value })}
                    placeholder="$15,000"
                    className="cms-input"
                  />
                </div>
                <div className="form-group">
                  <label>{isEs ? 'Prioridad' : 'Priority'}</label>
                  <select 
                    value={newLeadForm.priority}
                    onChange={e => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                    className="cms-select"
                  >
                    <option value="standard">{isEs ? 'Estándar (5-7 días)' : 'Standard (5-7 days)'}</option>
                    <option value="fast">{isEs ? '⚡ Prioritaria en Taller' : '⚡ Fast-Track Queue'}</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-actions">
                <button type="button" onClick={() => setIsNewLeadModalOpen(false)} className="cms-btn-secondary">
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button type="submit" className="cms-btn-primary">
                  <Plus size={15} />
                  <span>{isEs ? 'Crear Lead en CMS' : 'Save Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoped Styling */}
      <style>{`
        .cms-page-wrapper {
          min-height: 100vh;
          background: #020032;
          color: #F8FAFC;
          font-family: var(--font-body, system-ui, sans-serif);
          padding-bottom: 80px;
        }

        /* Header */
        .cms-header {
          background: rgba(2, 0, 50, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 16px 0;
        }

        .cms-header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cms-brand-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cms-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }

        .cms-back-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.12);
        }

        .cms-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.15);
        }

        .cms-logo-img {
          height: 32px;
          width: auto;
          filter: brightness(0) invert(1);
        }

        .cms-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: #FFFFFF;
          background: rgba(224, 0, 39, 0.2);
          border: 1px solid rgba(224, 0, 39, 0.4);
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .cms-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cms-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-accent, #e00027);
          color: #FFFFFF;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cms-btn-primary:hover {
          background: #c00022;
          transform: translateY(-1px);
        }

        .cms-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cms-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.16);
        }

        .cms-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #94A3B8;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.76rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cms-btn-ghost:hover {
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Content Layout */
        .cms-main-content {
          padding-top: 32px;
        }

        .cms-inner-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* KPI Cards Grid */
        .cms-metrics-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .cms-metric-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s;
        }

        .cms-metric-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label {
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.05em;
        }

        .metric-icon {
          color: #94A3B8;
        }

        .metric-value {
          font-family: monospace;
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1;
        }

        .metric-sub {
          font-size: 0.72rem;
          color: #64748B;
        }

        .text-blue { color: #38BDF8; }
        .text-amber { color: #FBBF24; }
        .text-purple { color: #C084FC; }
        .text-green { color: #34D399; }
        .text-crimson { color: var(--color-accent, #e00027); }

        /* Toolbar */
        .cms-toolbar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cms-search-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
        }

        .cms-search-input {
          width: 100%;
          background: rgba(2, 0, 50, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          padding: 10px 36px 10px 40px;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .cms-search-input:focus {
          border-color: var(--color-accent, #e00027);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .cms-filters-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 0.78rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .cms-select {
          background: rgba(2, 0, 50, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }

        .cms-select option {
          background: #020032;
          color: #FFFFFF;
        }

        /* Leads Table */
        .cms-leads-table-container {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow-x: auto;
        }

        .cms-leads-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .cms-leads-table th {
          background: rgba(255, 255, 255, 0.04);
          color: #94A3B8;
          font-family: monospace;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          white-space: nowrap;
        }

        .cms-table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.15s;
        }

        .cms-table-row:hover {
          background: rgba(255, 255, 255, 0.035);
        }

        .cms-table-row td {
          padding: 16px 18px;
          vertical-align: middle;
          font-size: 0.82rem;
        }

        /* Specific Cells */
        .cell-id-date {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lead-id-tag {
          font-family: monospace;
          font-weight: 800;
          font-size: 0.82rem;
          color: #FFFFFF;
        }

        .lead-date-txt {
          font-size: 0.72rem;
          color: #64748B;
        }

        .priority-badge-fast {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-family: monospace;
          font-size: 0.62rem;
          font-weight: 800;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          width: fit-content;
          margin-top: 2px;
        }

        .client-info-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .client-name {
          font-size: 0.88rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .client-contact-links {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.74rem;
          transition: color 0.15s;
        }

        .contact-link:hover {
          color: #FFFFFF;
        }

        .services-tag-cluster {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .service-mini-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          color: #E2E8F0;
        }

        .service-icon-svg {
          color: var(--color-accent, #e00027);
        }

        .client-meta-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .client-city {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: #CBD5E1;
        }

        .client-type-tag {
          font-family: monospace;
          font-size: 0.65rem;
          color: #64748B;
          font-weight: 700;
        }

        .files-indicator-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #38BDF8;
          background: rgba(56, 189, 248, 0.1);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
        }

        .files-empty {
          color: #64748B;
        }

        /* Status Inline Select */
        .status-inline-select {
          border-radius: 999px;
          padding: 5px 12px;
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          outline: none;
          border: 1px solid transparent;
        }

        .status-draft {
          background: rgba(148, 163, 184, 0.15);
          color: #94A3B8;
          border-color: rgba(148, 163, 184, 0.3);
        }

        .status-new {
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          border-color: rgba(56, 189, 248, 0.3);
        }

        .status-review {
          background: rgba(251, 191, 36, 0.15);
          color: #FBBF24;
          border-color: rgba(251, 191, 36, 0.3);
        }

        .status-quoted {
          background: rgba(192, 132, 252, 0.15);
          color: #C084FC;
          border-color: rgba(192, 132, 252, 0.3);
        }

        .status-production {
          background: rgba(52, 211, 153, 0.15);
          color: #34D399;
          border-color: rgba(52, 211, 153, 0.3);
        }

        .status-completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.4);
        }

        .status-archived {
          background: rgba(100, 116, 139, 0.15);
          color: #64748B;
          border-color: rgba(100, 116, 139, 0.3);
        }

        /* Actions */
        .actions-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #CBD5E1;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .action-icon-btn.whatsapp:hover {
          background: #25D366;
          color: #FFFFFF;
          border-color: #25D366;
        }

        .action-icon-btn.inspect:hover {
          background: #FFFFFF;
          color: #020032;
          border-color: #FFFFFF;
        }

        .action-icon-btn.delete:hover {
          background: #EF4444;
          color: #FFFFFF;
          border-color: #EF4444;
        }

        /* Empty state */
        .cms-empty-state {
          padding: 60px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .cms-empty-state h3 {
          font-size: 1.1rem;
          color: #FFFFFF;
          margin: 0;
        }

        .cms-empty-state p {
          color: #64748B;
          font-size: 0.85rem;
          margin: 0;
        }

        /* =========================================================================
           Modal Dossier Styles
           ========================================================================= */
        .cms-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }

        .cms-modal-dossier,
        .cms-modal-form {
          background: #06033E;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          max-width: 780px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
        }

        .modal-dossier-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dossier-id-cluster {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dossier-id {
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: 900;
          color: #FFFFFF;
        }

        .status-badge-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .modal-close-btn:hover {
          color: #FFFFFF;
        }

        .modal-dossier-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dossier-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dossier-sec-title {
          font-family: monospace;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--color-accent, #e00027);
          letter-spacing: 0.05em;
          margin: 0;
        }

        .dossier-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .dossier-field {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .field-lbl {
          font-size: 0.72rem;
          color: #64748B;
          font-weight: 600;
        }

        .field-val {
          font-size: 0.88rem;
          color: #F8FAFC;
        }

        .field-val.link {
          color: #38BDF8;
          text-decoration: none;
        }

        .field-val.link:hover {
          text-decoration: underline;
        }

        .dossier-services-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .dossier-service-card {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
        }

        .dossier-scope-tag {
          font-size: 0.78rem;
          color: #94A3B8;
          display: flex;
          gap: 6px;
        }

        .dossier-message-box {
          background: rgba(2, 0, 50, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #CBD5E1;
        }

        .dossier-files-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
        }

        .dossier-files-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dossier-file-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .file-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .file-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        .file-size {
          font-size: 0.72rem;
          color: #64748B;
        }

        /* Admin notes inside modal */
        .admin-notes-box {
          background: rgba(224, 0, 39, 0.04);
          border-color: rgba(224, 0, 39, 0.15);
        }

        .admin-notes-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cms-input,
        .cms-textarea {
          width: 100%;
          background: rgba(2, 0, 50, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FFFFFF;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .cms-input:focus,
        .cms-textarea:focus {
          border-color: var(--color-accent, #e00027);
        }

        .save-notes-btn {
          align-self: flex-start;
          margin-top: 4px;
        }

        /* Modal Footer */
        .modal-dossier-footer {
          padding: 18px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dossier-direct-contact {
          display: flex;
          gap: 10px;
        }

        .dossier-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .dossier-contact-btn.wa {
          background: #25D366;
          color: #FFFFFF;
        }

        .dossier-contact-btn.phone {
          background: #3B82F6;
          color: #FFFFFF;
        }

        .dossier-contact-btn.email {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dossier-status-updater {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Form Modal */
        .modal-form-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.78rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .manual-services-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .manual-service-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94A3B8;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .manual-service-btn.selected {
          background: rgba(224, 0, 39, 0.2);
          border-color: var(--color-accent, #e00027);
          color: #FFFFFF;
        }

        .modal-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .cms-metrics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .cms-metrics-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2,
          .form-row-3,
          .dossier-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
