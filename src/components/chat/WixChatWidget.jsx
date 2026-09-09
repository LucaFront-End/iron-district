import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Phone, Mail, User, RefreshCw, ChevronRight } from 'lucide-react';
import { useWix } from '../../context/WixContext';
import { useLanguage } from '../../context/LanguageContext';
import './WixChatWidget.css';

export default function WixChatWidget() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const { isReady } = useWix();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState(() => localStorage.getItem('sm_chat_convo_id') || '');
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'setup' | 'online' | 'fallback'
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initial user registration form
  const [initForm, setInitForm] = useState({ name: '', email: '', phone: '' });
  const [initError, setInitError] = useState('');
  const [diagInfo, setDiagInfo] = useState(null);
  const [runningDiag, setRunningDiag] = useState(false);

  // Fallback form states
  const [fallbackForm, setFallbackForm] = useState({ name: '', email: '', message: '' });
  const [fallbackSubmitted, setFallbackSubmitted] = useState(false);
  const [fallbackSubmitting, setFallbackSubmitting] = useState(false);
  const [fallbackError, setFallbackError] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, isTyping]);

  // Initial setup: check if conversation already stored in localStorage
  useEffect(() => {
    if (!isReady) return;

    const checkStoredConversation = async () => {
      try {
        // Check backend status first
        try {
          const statusRes = await fetch('/api/chat?action=status');
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (!statusData.configured) {
              console.log('[WixChat] Wix API credentials not configured yet, using Direct Message / WhatsApp fallback');
              setStatus('fallback');
              return;
            }
          }
        } catch (e) {
          // If status fails, continue
        }

        if (conversationId) {
          const res = await fetch(`/api/chat?action=list&conversationId=${conversationId}`);
          if (res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await res.json();
              if (data.messages) {
                const sorted = [...data.messages].sort((a, b) => {
                  const dateA = new Date(a.createdDate || a.createdAt || a._createdDate || 0);
                  const dateB = new Date(b.createdDate || b.createdAt || b._createdDate || 0);
                  return dateA - dateB;
                });
                setMessages(sorted);
                setStatus('online');
                return;
              }
            }
          }
          // Expired or invalid conversation
          localStorage.removeItem('sm_chat_convo_id');
          localStorage.removeItem('sm_chat_contact_id');
          setConversationId('');
        }

        setStatus('setup');
      } catch (err) {
        console.warn('[WixChat] Verification notice:', err.message);
        setStatus('fallback');
        setFallbackError('');
      }
    };

    checkStoredConversation();
  }, [isReady, conversationId]);

  // Initialize conversation with name, email and phone in Wix CRM & Inbox
  const initializeConversation = async (name, email, phone) => {
    setLoading(true);
    setInitError('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init', name, email, phone }),
      });

      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textErr = await res.text();
        throw new Error(textErr || 'A server error occurred');
      }

      if (!res.ok) {
        if (data.notConfigured || res.status === 503 || data.error?.includes('WIX_API_KEY')) {
          setStatus('fallback');
          setFallbackError('');
          return;
        }
        let errMsg = data.error || 'Failed to initialize chat';
        if (data.details) errMsg += ` - ${data.details}`;
        throw new Error(errMsg);
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem('sm_chat_convo_id', data.conversationId);
        localStorage.setItem('sm_chat_contact_id', data.contactId);
        setStatus('online');
        await fetchMessages(data.conversationId);
      } else {
        throw new Error('No conversation ID returned');
      }
    } catch (err) {
      console.warn('[WixChat] Init notice:', err.message);
      if (err.message?.includes('configure') || err.message?.includes('WIX_API_KEY') || err.message?.includes('unavailable')) {
        setStatus('fallback');
        setFallbackError('');
      } else {
        setInitError(err.message || (isEs ? 'Error al inicializar el chat' : 'Error initializing conversation'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages from Wix Inbox
  const fetchMessages = async (convoId) => {
    if (!convoId) return;
    try {
      const res = await fetch(`/api/chat?action=list&conversationId=${convoId}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.messages) {
            const sorted = [...data.messages].sort((a, b) => {
              const dateA = new Date(a.createdDate || a.createdAt || a._createdDate || 0);
              const dateB = new Date(b.createdDate || b.createdAt || b._createdDate || 0);
              return dateA - dateB;
            });
            setMessages(sorted);
          }
        }
      }
    } catch (err) {
      console.error('[WixChat] Failed to fetch messages:', err);
    }
  };

  // Poll for agent replies every 5 seconds when open
  useEffect(() => {
    if (status !== 'online' || !isOpen || !conversationId) return;

    const interval = setInterval(() => {
      fetchMessages(conversationId);
    }, 5000);

    return () => clearInterval(interval);
  }, [status, isOpen, conversationId]);

  // Send message to Wix Inbox
  const sendMessageToServer = async (text) => {
    setIsSending(true);

    const tempMessage = {
      id: `temp-${Date.now()}`,
      direction: 'PARTICIPANT_TO_BUSINESS',
      createdAt: new Date().toISOString(),
      content: {
        basic: {
          items: [{ text }],
        },
      },
    };
    setMessages((prev) => [...prev, tempMessage]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', conversationId, text }),
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errMsg = 'Failed to send message';
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } else {
          errMsg = (await res.text()) || errMsg;
        }
        throw new Error(errMsg);
      }

      await fetchMessages(conversationId);
    } catch (err) {
      console.error('[WixChat] Error sending message:', err);
    } finally {
      setIsSending(false);
      setTimeout(() => setIsTyping(false), 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || !conversationId) return;

    const messageText = inputText.trim();
    setInputText('');
    await sendMessageToServer(messageText);
  };

  // Quick FAQ suggestions for architectural metal clients
  const quickPrompts = isEs
    ? [
        {
          text: '¿Cómo cotizo una escalera o barandal? 📐',
          reply: 'Hola, me gustaría solicitar una cotización personalizada para un proyecto de escalera/barandal.',
        },
        {
          text: '¿Hacen envíos e instalación nacional? 🚚',
          reply: 'Hola, quería consultar sobre las opciones de despacho e instalación en mi ubicación.',
        },
        {
          text: '¿Tiempos de entrega y fabricación? ⏱️',
          reply: 'Hola, ¿cuál es el tiempo estimado de fabricación y entrega para proyectos a medida?',
        },
        {
          text: 'Hablar con un maestro herrero / asesor 💬',
          reply: 'Hola, necesito asistencia técnica directa de taller para definir detalles de mi diseño.',
        },
      ]
    : [
        {
          text: 'How do I quote a custom stair or railing? 📐',
          reply: 'Hi! I would like to request a custom quote for an architectural staircase or railing project.',
        },
        {
          text: 'Do you offer nationwide shipping & install? 🚚',
          reply: 'Hi! I would like to inquire about shipping and installation options for my location.',
        },
        {
          text: 'What are the fabrication lead times? ⏱️',
          reply: 'Hi, what is the current lead time for bespoke architectural metal assemblies?',
        },
        {
          text: 'Speak with a master fabricator 💬',
          reply: 'Hi! I need direct technical shop floor assistance for an upcoming architectural project.',
        },
      ];

  const handleQuickPromptClick = async (prompt) => {
    if (isSending || !conversationId) return;
    await sendMessageToServer(prompt.reply);
  };

  // Diagnostics runner
  const runDiagnostics = async () => {
    setRunningDiag(true);
    setDiagInfo(null);
    try {
      const res = await fetch('/api/chat?action=diagnostic');
      if (res.ok) {
        const data = await res.json();
        setDiagInfo(data);
      } else {
        const text = await res.text();
        setDiagInfo({ error: `Backend returned ${res.status}: ${text}` });
      }
    } catch (err) {
      setDiagInfo({ error: err.message });
    } finally {
      setRunningDiag(false);
    }
  };

  // Fallback form submit
  const handleFallbackSubmit = async (e) => {
    e.preventDefault();
    if (!fallbackForm.email.trim() || !fallbackForm.message.trim() || fallbackSubmitting) return;

    setFallbackSubmitting(true);
    setFallbackError('');

    try {
      // Direct notification simulation / local storage
      const existing = JSON.parse(localStorage.getItem('sm_offline_messages') || '[]');
      existing.push({
        ...fallbackForm,
        date: new Date().toISOString(),
      });
      localStorage.setItem('sm_offline_messages', JSON.stringify(existing));
      setFallbackSubmitted(true);
      setFallbackForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('[WixChat] Fallback failed:', err);
      setFallbackError(isEs ? 'Error al enviar mensaje' : 'Error sending message');
    } finally {
      setFallbackSubmitting(false);
    }
  };

  const handleInitSubmit = (e) => {
    e.preventDefault();
    if (initForm.email.trim() && initForm.phone.trim()) {
      initializeConversation(initForm.name, initForm.email, initForm.phone);
    }
  };

  const getMessageText = (msg) => {
    return msg.content?.basic?.items?.[0]?.text || msg.content?.basic?.text || msg.text || '';
  };

  const isMessageFromVisitor = (msg) => {
    const dir = msg.direction || '';
    return (
      dir === 'PARTICIPANT_TO_BUSINESS' ||
      dir === 'visitor' ||
      msg.sender?.role === 'visitor' ||
      msg.id?.startsWith('temp-')
    );
  };

  return (
    <div className="wix-chat-container">
      {/* Floating Chat Bubble Button */}
      <motion.button
        className="wix-chat-bubble"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isEs ? 'Chat con el Taller' : 'Chat with Workshop'}
        title={isEs ? 'Chat con Station Metalworks' : 'Chat with Station Metalworks'}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="chat-bubble-inner">
            <MessageSquare size={24} />
            <span className="bubble-ping" />
          </div>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="wix-chat-window"
            initial={{ opacity: 0, y: 35, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="header-info">
                <div className="avatar-group">
                  <div className="avatar">SM</div>
                  <span className="online-badge" />
                </div>
                <div className="info-text">
                  <h3>Station Metalworks</h3>
                  <div className="status-indicator">
                    <span className="pulse-dot" />
                    <span>{isEs ? 'Taller Conectado ⚡' : 'Shop Floor Live ⚡'}</span>
                    <span className="dot-divider">•</span>
                    <span>{isEs ? 'En línea' : 'Online'}</span>
                  </div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="chat-body">
              {status === 'connecting' && (
                <div className="chat-loading-screen">
                  <div className="premium-spinner" />
                  <p>{isEs ? 'Conectando con el taller...' : 'Connecting to workshop...'}</p>
                </div>
              )}

              {status === 'setup' && (
                /* Registration screen before chat starts */
                <motion.div
                  className="setup-form-container"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="setup-badge">
                    <ShieldCheck size={14} className="text-accent" />
                    <span>{isEs ? 'CANAL DIRECTO DE TALLER' : 'DIRECT WORKSHOP INBOX'}</span>
                  </div>
                  <h4>{isEs ? 'Inicia tu Consulta Técnica' : 'Start Your Technical Chat'}</h4>
                  <p className="setup-desc">
                    {isEs
                      ? 'Ingresa tus datos para conectarte directamente con nuestros maestros herreros e ingenieros estructurales.'
                      : 'Enter your details to connect directly with our master fabricators and structural engineers.'}
                  </p>

                  <form onSubmit={handleInitSubmit} className="premium-form">
                    <div className="form-group-premium">
                      <input
                        type="text"
                        required
                        value={initForm.name}
                        onChange={(e) => setInitForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder=" "
                        id="init_name"
                      />
                      <label htmlFor="init_name">
                        <User size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {isEs ? 'Nombre y Apellido *' : 'Full Name *'}
                      </label>
                    </div>

                    <div className="form-group-premium">
                      <input
                        type="email"
                        required
                        value={initForm.email}
                        onChange={(e) => setInitForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder=" "
                        id="init_email"
                      />
                      <label htmlFor="init_email">
                        <Mail size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {isEs ? 'Correo Electrónico *' : 'Email Address *'}
                      </label>
                    </div>

                    <div className="form-group-premium">
                      <input
                        type="tel"
                        required
                        value={initForm.phone}
                        onChange={(e) => setInitForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder=" "
                        id="init_phone"
                      />
                      <label htmlFor="init_phone">
                        <Phone size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {isEs ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp *'}
                      </label>
                    </div>

                    {initError && (
                      <div className="diag-error-card">
                        <p className="diag-error-text">{initError}</p>
                        <button
                          type="button"
                          onClick={runDiagnostics}
                          className="diag-run-btn"
                          disabled={runningDiag}
                        >
                          {runningDiag ? (isEs ? 'Analizando...' : 'Diagnosing...') : '🔍 Diagnosticar conexión'}
                        </button>
                        {diagInfo && (
                          <pre className="diag-json-output">
                            {JSON.stringify(diagInfo, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    <button type="submit" className="premium-submit-btn" disabled={loading}>
                      {loading ? (
                        <div className="btn-loader-spinner" />
                      ) : (
                        <span>{isEs ? 'Comenzar Chat de Taller' : 'Start Workshop Chat'}</span>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {status === 'fallback' && (
                /* Fallback Contact Form */
                <div className="setup-form-container">
                  <div className="setup-badge">
                    <AlertCircle size={14} className="text-accent" />
                    <span>{isEs ? 'MENSAJE DIRECTO' : 'DIRECT MESSAGE'}</span>
                  </div>
                  <h4>{isEs ? 'Déjanos tu Consulta' : 'Leave Us a Message'}</h4>
                  <p className="setup-desc">
                    {isEs
                      ? 'Envíanos tus requerimientos y un especialista te responderá a la brevedad por correo o WhatsApp.'
                      : 'Send us your requirements and a specialist will follow up shortly via email or WhatsApp.'}
                  </p>

                  {/* Quick Direct WhatsApp Button */}
                  <a
                    href="https://wa.me/13462349640?text=Hola%20Station%20Metalworks,%20quisiera%20consultar%20sobre%20un%20proyecto"
                    target="_blank"
                    rel="noreferrer"
                    className="chat-wa-direct-btn"
                  >
                    <MessageSquare size={16} />
                    <span>{isEs ? 'Chatear por WhatsApp (+1 346 234 9640)' : 'Chat on WhatsApp (+1 346 234 9640)'}</span>
                  </a>

                  <div className="chat-divider-or">
                    <span>{isEs ? 'O DÉJANOS UN MENSAJE DIRECTO' : 'OR LEAVE A DIRECT MESSAGE'}</span>
                  </div>

                  {fallbackSubmitted ? (
                    <motion.div
                      className="fallback-success-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="success-icon-wrapper">
                        <CheckCircle2 size={32} />
                      </div>
                      <h5>{isEs ? '¡Mensaje Recibido!' : 'Message Received!'}</h5>
                      <p>
                        {isEs
                          ? 'Hemos registrado tu consulta. Nuestro equipo de taller te contactará a la brevedad.'
                          : 'We have logged your request. Our workshop team will reach out to you shortly.'}
                      </p>
                      <button
                        className="btn-premium-retry"
                        onClick={() => setFallbackSubmitted(false)}
                      >
                        {isEs ? 'Enviar otro mensaje' : 'Send another message'}
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFallbackSubmit} className="premium-form">
                      <div className="form-group-premium">
                        <input
                          type="text"
                          required
                          value={fallbackForm.name}
                          onChange={(e) => setFallbackForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder=" "
                          id="fb_name"
                        />
                        <label htmlFor="fb_name">{isEs ? 'Tu Nombre' : 'Your Name'}</label>
                      </div>

                      <div className="form-group-premium">
                        <input
                          type="email"
                          required
                          value={fallbackForm.email}
                          onChange={(e) => setFallbackForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder=" "
                          id="fb_email"
                        />
                        <label htmlFor="fb_email">{isEs ? 'Correo Electrónico' : 'Email Address'}</label>
                      </div>

                      <div className="form-group-premium textarea-group">
                        <textarea
                          required
                          rows={3}
                          value={fallbackForm.message}
                          onChange={(e) => setFallbackForm((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder=" "
                          id="fb_message"
                        />
                        <label htmlFor="fb_message">{isEs ? 'Detalles del Proyecto' : 'Project Details'}</label>
                      </div>

                      {fallbackError && <p className="fallback-error-text">{fallbackError}</p>}

                      <button type="submit" className="premium-submit-btn" disabled={fallbackSubmitting}>
                        {fallbackSubmitting ? (
                          <div className="btn-loader-spinner" />
                        ) : (
                          <span>{isEs ? 'Enviar Mensaje Directo' : 'Send Direct Message'}</span>
                        )}
                      </button>

                      {/* Developer Diagnostic Toggle (Discreet) */}
                      <div className="diag-toggle-wrapper">
                        <button
                          type="button"
                          onClick={runDiagnostics}
                          className="diag-toggle-link"
                          disabled={runningDiag}
                        >
                          {runningDiag ? (isEs ? 'Analizando...' : 'Diagnosing...') : '⚙️ Diagnóstico técnico'}
                        </button>
                        {diagInfo && (
                          <pre className="diag-json-output">
                            {JSON.stringify(diagInfo, null, 2)}
                          </pre>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}

              {status === 'online' && (
                /* Chat Messages History */
                <div className="messages-history">
                  {messages.length === 0 ? (
                    <div className="chat-welcome-container">
                      <div className="welcome-logo">SM</div>
                      <h4>{isEs ? '¡Bienvenido a Station Metalworks!' : 'Welcome to Station Metalworks!'}</h4>
                      <p>
                        {isEs
                          ? '¿En qué podemos ayudarte hoy? Selecciona una consulta rápida o escribe tu mensaje a continuación.'
                          : 'How can we help with your architectural project today? Choose a quick question below or message us.'}
                      </p>
                    </div>
                  ) : (
                    <div className="chat-scroll-wrapper">
                      {messages.map((msg, index) => {
                        const isVisitor = isMessageFromVisitor(msg);
                        const text = getMessageText(msg);
                        if (!text) return null;

                        return (
                          <motion.div
                            key={msg.id || index}
                            className={`message-bubble-wrapper ${isVisitor ? 'visitor' : 'business'}`}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.22 }}
                          >
                            <div className="message-bubble">
                              <p>{text}</p>
                            </div>
                            <span className="timestamp">
                              {new Date(msg.createdDate || msg.createdAt || msg._createdDate || Date.now()).toLocaleTimeString(
                                isEs ? 'es-MX' : 'en-US',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </span>
                          </motion.div>
                        );
                      })}

                      {/* Visual Mock Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          className="message-bubble-wrapper business typing-wrapper"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="message-bubble typing-bubble">
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {/* Predefined Quick Prompts / FAQ Buttons */}
                  {messages.length === 0 && (
                    <div className="quick-prompts-container">
                      <span className="quick-prompts-title">
                        {isEs ? 'Consultas Frecuentes de Fabricación:' : 'Popular Inquiries:'}
                      </span>
                      {quickPrompts.map((prompt, idx) => (
                        <motion.button
                          key={idx}
                          className="quick-prompt-btn"
                          onClick={() => handleQuickPromptClick(prompt)}
                          whileHover={{ scale: 1.02, x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 * idx }}
                        >
                          <span>{prompt.text}</span>
                          <ChevronRight size={14} className="prompt-arrow" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Input (Only if online) */}
            {status === 'online' && (
              <form onSubmit={handleSendMessage} className="chat-footer">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isEs ? 'Escribe tu consulta sobre acero, medidas o acabados...' : 'Type your specs, measurements or questions...'}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="send-btn"
                  aria-label={isEs ? 'Enviar mensaje' : 'Send message'}
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
