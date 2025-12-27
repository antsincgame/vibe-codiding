import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EmailSettings {
  confirmationEnabled: boolean;
  confirmationSubject: string;
  confirmationTemplate: string;
  welcomeSubject: string;
  welcomeTemplate: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  smtpSecure: boolean;
}

export default function EmailSettingsManager() {
  const [settings, setSettings] = useState<EmailSettings>({
    confirmationEnabled: true,
    confirmationSubject: '',
    confirmationTemplate: '',
    welcomeSubject: '',
    welcomeTemplate: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpFromName: 'VIBECODING',
    smtpSecure: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'confirmation' | 'welcome' | 'smtp'>('confirmation');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', [
          'email_confirmation_enabled',
          'email_confirmation_subject',
          'email_confirmation_template',
          'email_welcome_subject',
          'email_welcome_template',
          'smtp_host',
          'smtp_port',
          'smtp_user',
          'smtp_password',
          'smtp_from_email',
          'smtp_from_name',
          'smtp_secure'
        ]);

      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });

        setSettings({
          confirmationEnabled: settingsMap['email_confirmation_enabled'] === 'true',
          confirmationSubject: settingsMap['email_confirmation_subject'] || '',
          confirmationTemplate: settingsMap['email_confirmation_template'] || '',
          welcomeSubject: settingsMap['email_welcome_subject'] || '',
          welcomeTemplate: settingsMap['email_welcome_template'] || '',
          smtpHost: settingsMap['smtp_host'] || '',
          smtpPort: settingsMap['smtp_port'] || '587',
          smtpUser: settingsMap['smtp_user'] || '',
          smtpPassword: settingsMap['smtp_password'] || '',
          smtpFromEmail: settingsMap['smtp_from_email'] || '',
          smtpFromName: settingsMap['smtp_from_name'] || 'VIBECODING',
          smtpSecure: settingsMap['smtp_secure'] === 'true'
        });
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        {
          key: 'email_confirmation_enabled',
          value: settings.confirmationEnabled.toString(),
          description: 'Enable email confirmation for new students'
        },
        {
          key: 'email_confirmation_subject',
          value: settings.confirmationSubject,
          description: 'Subject for email confirmation'
        },
        {
          key: 'email_confirmation_template',
          value: settings.confirmationTemplate,
          description: 'HTML template for email confirmation'
        },
        {
          key: 'email_welcome_subject',
          value: settings.welcomeSubject,
          description: 'Subject for welcome email'
        },
        {
          key: 'email_welcome_template',
          value: settings.welcomeTemplate,
          description: 'HTML template for welcome email'
        },
        {
          key: 'smtp_host',
          value: settings.smtpHost,
          description: 'SMTP server host'
        },
        {
          key: 'smtp_port',
          value: settings.smtpPort,
          description: 'SMTP server port'
        },
        {
          key: 'smtp_user',
          value: settings.smtpUser,
          description: 'SMTP username'
        },
        {
          key: 'smtp_password',
          value: settings.smtpPassword,
          description: 'SMTP password'
        },
        {
          key: 'smtp_from_email',
          value: settings.smtpFromEmail,
          description: 'Email FROM address'
        },
        {
          key: 'smtp_from_name',
          value: settings.smtpFromName,
          description: 'Email FROM name'
        },
        {
          key: 'smtp_secure',
          value: settings.smtpSecure.toString(),
          description: 'Use TLS/SSL for SMTP'
        }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            key: update.key,
            value: update.value,
            description: update.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) throw error;
      }

      alert('Настройки email успешно сохранены!');
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(0, 255, 249, 0.05)',
        border: '1px solid rgba(0, 255, 249, 0.2)',
        borderRadius: '8px'
      }}>
        <h3 style={{
          fontSize: '18px',
          marginBottom: '15px',
          color: 'var(--neon-cyan)'
        }}>
          Важная информация
        </h3>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
          Настройки email применяются в Supabase Dashboard. Для полной настройки:
        </p>
        <ol style={{ fontSize: '14px', opacity: 0.9, paddingLeft: '20px' }}>
          <li>Перейдите в Authentication → Email Templates в Supabase Dashboard</li>
          <li>Скопируйте HTML шаблоны из полей ниже</li>
          <li>Убедитесь, что Email Confirmation включен в Auth Settings</li>
        </ol>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={settings.confirmationEnabled}
            onChange={(e) => setSettings({ ...settings, confirmationEnabled: e.target.checked })}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer'
            }}
          />
          <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Включить подтверждение email для новых учеников
          </span>
        </label>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        borderBottom: '2px solid rgba(0, 255, 249, 0.2)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTemplate('confirmation')}
          className="cyber-button"
          style={{
            background: activeTemplate === 'confirmation' ? 'rgba(0, 255, 249, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTemplate === 'confirmation' ? '2px solid var(--neon-cyan)' : 'none',
            borderRadius: 0,
            padding: '15px 30px'
          }}
        >
          Подтверждение Email
        </button>
        <button
          onClick={() => setActiveTemplate('welcome')}
          className="cyber-button"
          style={{
            background: activeTemplate === 'welcome' ? 'rgba(255, 0, 110, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTemplate === 'welcome' ? '2px solid var(--neon-pink)' : 'none',
            borderRadius: 0,
            padding: '15px 30px'
          }}
        >
          Приветственное письмо
        </button>
        <button
          onClick={() => setActiveTemplate('smtp')}
          className="cyber-button"
          style={{
            background: activeTemplate === 'smtp' ? 'rgba(0, 255, 100, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTemplate === 'smtp' ? '2px solid var(--neon-green)' : 'none',
            borderRadius: 0,
            padding: '15px 30px'
          }}
        >
          SMTP настройки
        </button>
      </div>

      {activeTemplate === 'confirmation' && (
        <div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              color: 'var(--neon-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              Тема письма подтверждения
            </label>
            <input
              type="text"
              value={settings.confirmationSubject}
              onChange={(e) => setSettings({ ...settings, confirmationSubject: e.target.value })}
              className="cyber-input"
              placeholder="Подтверждение регистрации в VIBECODING"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              color: 'var(--neon-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              HTML шаблон подтверждения
              <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '10px', textTransform: 'none' }}>
                (Используйте переменные: {'\{\{ .ConfirmationURL \}\}'}, {'\{\{ .SiteURL \}\}'})
              </span>
            </label>
            <textarea
              value={settings.confirmationTemplate}
              onChange={(e) => setSettings({ ...settings, confirmationTemplate: e.target.value })}
              className="cyber-input"
              style={{
                minHeight: '400px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.5'
              }}
              placeholder="<!DOCTYPE html>..."
            />
          </div>
        </div>
      )}

      {activeTemplate === 'welcome' && (
        <div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              color: 'var(--neon-pink)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              Тема приветственного письма
            </label>
            <input
              type="text"
              value={settings.welcomeSubject}
              onChange={(e) => setSettings({ ...settings, welcomeSubject: e.target.value })}
              className="cyber-input"
              placeholder="Добро пожаловать в VIBECODING!"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              color: 'var(--neon-pink)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: 600
            }}>
              HTML шаблон приветствия
              <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '10px', textTransform: 'none' }}>
                (Используйте переменные: {'\{\{ .UserName \}\}'}, {'\{\{ .DashboardURL \}\}'}, {'\{\{ .SiteURL \}\}'})
              </span>
            </label>
            <textarea
              value={settings.welcomeTemplate}
              onChange={(e) => setSettings({ ...settings, welcomeTemplate: e.target.value })}
              className="cyber-input"
              style={{
                minHeight: '400px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.5'
              }}
              placeholder="<!DOCTYPE html>..."
            />
          </div>
        </div>
      )}

      {activeTemplate === 'smtp' && (
        <div>
          <div style={{
            marginBottom: '25px',
            padding: '20px',
            background: 'rgba(0, 255, 100, 0.05)',
            border: '1px solid rgba(0, 255, 100, 0.2)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: '16px',
              marginBottom: '10px',
              color: 'var(--neon-green)'
            }}>
              Информация о SMTP
            </h3>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
              Настройки SMTP позволяют отправлять email с собственного почтового сервера.
            </p>
            <ul style={{ fontSize: '13px', opacity: 0.8, paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Используйте данные вашего SMTP сервера (Gmail, Yandex, Mail.ru и др.)</li>
              <li>Для Gmail используйте "Пароли приложений" вместо основного пароля</li>
              <li>Стандартные порты: 587 (TLS), 465 (SSL), 25 (без шифрования)</li>
            </ul>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                SMTP Хост *
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                className="cyber-input"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                SMTP Порт *
              </label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                className="cyber-input"
                placeholder="587"
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                SMTP Пользователь (email) *
              </label>
              <input
                type="email"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                className="cyber-input"
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                SMTP Пароль *
              </label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                className="cyber-input"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                Email отправителя *
              </label>
              <input
                type="email"
                value={settings.smtpFromEmail}
                onChange={(e) => setSettings({ ...settings, smtpFromEmail: e.target.value })}
                className="cyber-input"
                placeholder="noreply@vibecoding.com"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--neon-cyan)',
                fontWeight: 600
              }}>
                Имя отправителя
              </label>
              <input
                type="text"
                value={settings.smtpFromName}
                onChange={(e) => setSettings({ ...settings, smtpFromName: e.target.value })}
                className="cyber-input"
                placeholder="VIBECODING"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.smtpSecure}
                onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>
                Использовать TLS/SSL (рекомендуется для безопасности)
              </span>
            </label>
          </div>

          <div style={{
            padding: '15px',
            background: 'rgba(255, 255, 100, 0.05)',
            border: '1px solid rgba(255, 255, 100, 0.3)',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>
              <strong style={{ color: 'var(--neon-cyan)' }}>Примеры настроек для популярных провайдеров:</strong>
              <div style={{ marginTop: '10px', lineHeight: '1.8' }}>
                <div><strong>Gmail:</strong> smtp.gmail.com, Port: 587, TLS: Да</div>
                <div><strong>Yandex:</strong> smtp.yandex.ru, Port: 587, TLS: Да</div>
                <div><strong>Mail.ru:</strong> smtp.mail.ru, Port: 587, TLS: Да</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'flex-end',
        marginTop: '30px'
      }}>
        <button
          onClick={loadSettings}
          className="cyber-button"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
          disabled={saving}
        >
          Сбросить
        </button>
        <button
          onClick={saveSettings}
          className="cyber-button"
          disabled={saving}
          style={{
            opacity: saving ? 0.5 : 1,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
        </button>
      </div>
    </div>
  );
}
