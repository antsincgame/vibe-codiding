import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EmailAttachment {
  filename: string;
  content_type: string;
  size: number;
  storage_path: string;
}

interface InboxEmail {
  id: string;
  message_id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  text_content: string | null;
  html_content: string | null;
  headers: Record<string, string>;
  attachments: EmailAttachment[];
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export default function InboxManager() {
  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [filter]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('inbox')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'archived') {
        query = query.eq('is_archived', true);
      } else {
        query = query.eq('is_archived', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      await supabase
        .from('inbox')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', emailId);

      setEmails(emails.map(email =>
        email.id === emailId ? { ...email, is_read: true } : email
      ));
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  const toggleArchive = async (emailId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('inbox')
        .update({ is_archived: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', emailId);

      fetchEmails();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const deleteEmail = async (emailId: string) => {
    if (!confirm('Удалить это письмо?')) return;

    try {
      await supabase
        .from('inbox')
        .delete()
        .eq('id', emailId);

      fetchEmails();
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const downloadAttachment = async (attachment: EmailAttachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('email-attachments')
        .download(attachment.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Ошибка при загрузке файла');
    }
  };

  const viewEmail = (email: InboxEmail) => {
    setSelectedEmail(email);
    setShowModal(true);
    if (!email.is_read) {
      markAsRead(email.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--neon-green)' }}>
          Входящие письма
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['all', 'unread', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              style={{
                padding: '8px 16px',
                background: filter === f ? 'var(--neon-green)' : 'rgba(0, 255, 100, 0.1)',
                color: filter === f ? '#000' : 'var(--neon-green)',
                border: '1px solid var(--neon-green)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: filter === f ? 'bold' : 'normal'
              }}
            >
              {f === 'all' ? 'Все' : f === 'unread' ? 'Непрочитанные' : 'Архив'}
            </button>
          ))}
        </div>
        <button
          onClick={fetchEmails}
          className="cyber-button"
          style={{ marginLeft: 'auto', padding: '8px 20px' }}
        >
          ОБНОВИТЬ
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          Загрузка...
        </div>
      ) : emails.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
          {filter === 'all' ? 'Нет входящих писем' :
           filter === 'unread' ? 'Нет непрочитанных писем' :
           'Нет архивных писем'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => viewEmail(email)}
              style={{
                padding: '20px',
                background: email.is_read ? 'rgba(0, 255, 100, 0.05)' : 'rgba(0, 255, 100, 0.1)',
                border: `1px solid ${email.is_read ? 'rgba(0, 255, 100, 0.2)' : 'var(--neon-green)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--neon-green)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = email.is_read ? 'rgba(0, 255, 100, 0.2)' : 'var(--neon-green)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                    {!email.is_read && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--neon-green)',
                        boxShadow: '0 0 10px var(--neon-green)'
                      }} />
                    )}
                    <strong style={{ color: 'var(--neon-green)', fontSize: '16px' }}>
                      {email.from_name || email.from_email}
                    </strong>
                    {email.from_name && (
                      <span style={{ opacity: 0.6, fontSize: '14px' }}>
                        &lt;{email.from_email}&gt;
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '15px', marginBottom: '5px' }}>
                    {email.subject || '(Без темы)'}
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.7 }}>
                    {email.text_content
                      ? email.text_content.substring(0, 100) + (email.text_content.length > 100 ? '...' : '')
                      : 'HTML письмо'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', opacity: 0.7 }}>
                  {formatDate(email.created_at)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {email.attachments && email.attachments.length > 0 && (
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#8b5cf6',
                    border: '1px solid #8b5cf6',
                    borderRadius: '4px'
                  }}>
                    📎 {email.attachments.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedEmail && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#1a1a1a',
              border: '2px solid var(--neon-green)',
              borderRadius: '12px',
              maxWidth: '900px',
              maxHeight: '90vh',
              width: '100%',
              overflow: 'auto',
              boxShadow: '0 0 30px rgba(0, 255, 100, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(0, 255, 100, 0.2)',
              position: 'sticky',
              top: 0,
              background: '#1a1a1a',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: 'var(--neon-green)', fontSize: '20px' }}>
                  {selectedEmail.subject || '(Без темы)'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--neon-pink)',
                    color: 'var(--neon-pink)',
                    padding: '5px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
                <div><strong>От:</strong> {selectedEmail.from_name || selectedEmail.from_email} &lt;{selectedEmail.from_email}&gt;</div>
                <div><strong>Кому:</strong> {selectedEmail.to_email}</div>
                <div><strong>Дата:</strong> {formatDate(selectedEmail.created_at)}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => toggleArchive(selectedEmail.id, selectedEmail.is_archived)}
                  className="cyber-button"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  {selectedEmail.is_archived ? 'РАЗАРХИВИРОВАТЬ' : 'В АРХИВ'}
                </button>
                <button
                  onClick={() => deleteEmail(selectedEmail.id)}
                  className="cyber-button"
                  style={{
                    padding: '6px 12px',
                    fontSize: '13px',
                    borderColor: 'var(--neon-pink)',
                    color: 'var(--neon-pink)'
                  }}
                >
                  УДАЛИТЬ
                </button>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>Вложения:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid #8b5cf6',
                          borderRadius: '6px'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px' }}>{attachment.filename}</div>
                          <div style={{ fontSize: '12px', opacity: 0.6 }}>
                            {attachment.content_type} • {formatFileSize(attachment.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => downloadAttachment(attachment)}
                          className="cyber-button"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          СКАЧАТЬ
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {selectedEmail.html_content ? (
                  <iframe
                    srcDoc={selectedEmail.html_content}
                    style={{
                      width: '100%',
                      minHeight: '400px',
                      border: 'none',
                      background: 'white',
                      borderRadius: '4px'
                    }}
                    title="Email content"
                  />
                ) : (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    margin: 0,
                    fontFamily: 'inherit'
                  }}>
                    {selectedEmail.text_content || 'Нет содержимого'}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
