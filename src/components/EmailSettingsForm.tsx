import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function EmailSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_password: '',
    notification_email: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'notification_email']);

    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      setSettings(prev => ({ ...prev, ...settingsMap }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value
    }));

    for (const update of updates) {
      await supabase
        .from('site_settings')
        .upsert(update, { onConflict: 'key' });
    }

    setLoading(false);
    alert('Настройки email сохранены');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <h3 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: 'var(--neon-cyan)'
      }}>
        Настройки Email
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--neon-pink)' }}>
          SMTP Host
        </label>
        <input
          type="text"
          value={settings.smtp_host}
          onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
          className="cyber-input"
          placeholder="smtp.gmail.com"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--neon-pink)' }}>
          SMTP Port
        </label>
        <input
          type="text"
          value={settings.smtp_port}
          onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
          className="cyber-input"
          placeholder="587"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--neon-pink)' }}>
          SMTP User
        </label>
        <input
          type="email"
          value={settings.smtp_user}
          onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
          className="cyber-input"
          placeholder="your-email@gmail.com"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--neon-pink)' }}>
          SMTP Password
        </label>
        <input
          type="password"
          value={settings.smtp_password}
          onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
          className="cyber-input"
          placeholder="App password"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--neon-pink)' }}>
          Email для уведомлений
        </label>
        <input
          type="email"
          value={settings.notification_email}
          onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
          className="cyber-input"
          placeholder="admin@example.com"
        />
      </div>

      <button
        type="submit"
        className="cyber-button"
        disabled={loading}
      >
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
}
