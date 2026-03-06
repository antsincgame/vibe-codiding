import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SentEmail {
  id: string;
  recipient_email: string;
  subject: string;
  status: string;
  created_at: string;
  template_type: string;
}

type EditorMode = 'text' | 'html';

export default function ComposeEmailManager() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [editorMode, setEditorMode] = useState<EditorMode>('text');
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sentHistory, setSentHistory] = useState<SentEmail[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userProfiles, setUserProfiles] = useState<{ email: string; full_name: string | null }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState('');

  useEffect(() => {
    loadSentHistory();
    loadUserProfiles();
  }, []);

  const loadSentHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await supabase
        .from('email_logs')
        .select('id, recipient_email, subject, status, created_at, template_type')
        .eq('template_type', 'manual')
        .order('created_at', { ascending: false })
        .limit(20);
      setSentHistory(data || []);
    } catch (error) {
      console.error('Error loading sent history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadUserProfiles = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('email, full_name')
        .order('full_name');
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const filteredSuggestions = suggestionQuery.length >= 1
    ? userProfiles.filter(p =>
        p.email.toLowerCase().includes(suggestionQuery.toLowerCase()) ||
        (p.full_name && p.full_name.toLowerCase().includes(suggestionQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleToChange = (value: string) => {
    setTo(value);
    const lastPart = value.split(',').pop()?.trim() ?? '';
    setSuggestionQuery(lastPart);
    setShowSuggestions(lastPart.length >= 1 && filteredSuggestions.length > 0);
  };

  const selectSuggestion = (email: string) => {
    const parts = to.split(',');
    parts[parts.length - 1] = ' ' + email;
    setTo(parts.join(',').trimStart() + ', ');
    setShowSuggestions(false);
    setSuggestionQuery('');
  };

  const getHtmlContent = () => {
    if (editorMode === 'html') return body;
    return body
      .split('\n\n')
      .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  };

  const sendEmail = async () => {
    const recipients = to.split(',').map(e => e.trim()).filter(Boolean);
    if (!recipients.length || !subject.trim() || !body.trim()) {
      setResult({ success: false, message: 'Заполните все поля: получатель, тема, текст письма' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const htmlContent = getHtmlContent();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipients.length === 1 ? recipients[0] : recipients,
            subject: subject.trim(),
            html: htmlContent,
            text: editorMode === 'text' ? body : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Ошибка отправки');
      }

      await supabase.from('email_logs').insert(
        recipients.map(email => ({
          recipient_email: email,
          subject: subject.trim(),
          template_type: 'manual',
          status: 'sent',
          resend_email_id: data.id || null,
        }))
      );

      setResult({ success: true, message: `Письмо успешно отправлено на ${recipients.join(', ')}` });
      setTo('');
      setSubject('');
      setBody('');
      loadSentHistory();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setResult({ success: false, message: `Ошибка: ${msg}` });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const statusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#22c55e';
      case 'delivered': return '#4ade80';
      case 'opened': return '#60a5fa';
      case 'clicked': return '#818cf8';
      case 'bounced': return '#f87171';
      default: return '#94a3b8';
    }
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: 'Отправлено',
      delivered: 'Доставлено',
      opened: 'Открыто',
      clicked: 'Переход',
      bounced: 'Отклонено',
      failed: 'Ошибка',
    };
    return labels[status] || status;
  };

  return (
    <div style={{ padding: '24px 0', color: '#e2e8f0' }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 700,
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        ✉️ Написать письмо
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
        Отправка единичного письма через Resend с вашего домена
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

        {/* Compose form */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '24px',
        }}>

          {/* To field */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Кому
            </label>
            <input
              type="text"
              value={to}
              onChange={e => handleToChange(e.target.value)}
              onFocus={() => suggestionQuery.length >= 1 && setShowSuggestions(filteredSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="email@example.com, другой@example.com"
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#e2e8f0',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 50,
                background: '#1e293b',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '8px',
                marginTop: '4px',
                overflow: 'hidden',
              }}>
                {filteredSuggestions.map(p => (
                  <div
                    key={p.email}
                    onMouseDown={() => selectSuggestion(p.email)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{p.full_name || p.email}</div>
                    {p.full_name && <div style={{ fontSize: '11px', color: '#64748b' }}>{p.email}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Тема
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Тема письма..."
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#e2e8f0',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Режим:
            </label>
            {(['text', 'html'] as EditorMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => { setEditorMode(mode); setShowPreview(false); }}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: editorMode === mode ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: editorMode === mode ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: editorMode === mode ? '#f59e0b' : '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {mode === 'text' ? 'Обычный текст' : 'HTML'}
              </button>
            ))}
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                marginLeft: 'auto',
                padding: '4px 12px',
                borderRadius: '6px',
                border: showPreview ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                background: showPreview ? 'rgba(96,165,250,0.15)' : 'transparent',
                color: showPreview ? '#60a5fa' : '#64748b',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {showPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
            </button>
          </div>

          {/* Body */}
          {!showPreview ? (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Текст письма
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={
                  editorMode === 'html'
                    ? '<p>Привет!</p>\n<p>Текст письма...</p>'
                    : 'Привет!\n\nТекст вашего письма...'
                }
                rows={14}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: editorMode === 'html' ? 'monospace' : 'inherit',
                  boxSizing: 'border-box',
                  lineHeight: '1.6',
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Предпросмотр
              </label>
              <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '20px',
                minHeight: '200px',
                color: '#1e293b',
                fontSize: '14px',
                lineHeight: '1.7',
              }}
                dangerouslySetInnerHTML={{ __html: getHtmlContent() }}
              />
            </div>
          )}

          {/* Result message */}
          {result && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              background: result.success ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${result.success ? 'rgba(34,197,94,0.4)' : 'rgba(248,113,113,0.4)'}`,
              color: result.success ? '#4ade80' : '#f87171',
              fontSize: '14px',
            }}>
              {result.success ? '✓ ' : '✗ '}{result.message}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={sendEmail}
            disabled={sending || !to.trim() || !subject.trim() || !body.trim()}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '8px',
              border: 'none',
              background: sending || !to.trim() || !subject.trim() || !body.trim()
                ? 'rgba(245,158,11,0.3)'
                : 'linear-gradient(135deg, #f59e0b, #ec4899)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: sending ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            {sending ? '⏳ Отправка...' : '📨 Отправить письмо'}
          </button>
        </div>

        {/* Sent history */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b', margin: 0 }}>
              История отправок
            </h3>
            <button
              onClick={loadSentHistory}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              title="Обновить"
            >
              ↻
            </button>
          </div>

          {loadingHistory ? (
            <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              Загрузка...
            </div>
          ) : sentHistory.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              Нет отправленных писем
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sentHistory.map(email => (
                <div
                  key={email.id}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {email.recipient_email}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: statusColor(email.status),
                      background: `${statusColor(email.status)}18`,
                      border: `1px solid ${statusColor(email.status)}40`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}>
                      {statusLabel(email.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {email.subject}
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                    {formatDate(email.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
