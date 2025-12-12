import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('key, value');

    if (data) {
      const settingsMap = data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);
      setSettings(settingsMap);
    }
  };

  const handleCopyrightClick = () => {
    navigate('/login');
  };

  return (
    <footer style={{
      background: 'rgba(19, 19, 26, 0.9)',
      borderTop: '1px solid var(--neon-cyan)',
      marginTop: '80px',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        <div>
          <h3 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: 'var(--neon-cyan)'
          }}>
            {settings.school_name || 'Vibecoding'}
          </h3>
          <p style={{ opacity: 0.8, lineHeight: '1.8' }}>
            {settings.about_text || 'Школа программирования для детей и взрослых, обучение веб разработки, веб приложений'}
          </p>
        </div>
        
        <div>
          <h4 style={{
            fontSize: '18px',
            marginBottom: '20px',
            color: 'var(--neon-pink)'
          }}>
            Контакты
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.8 }}>
            <div>📍 {settings.address || 'г. Гродно'}</div>
            <div>
              📞 <a
                href="https://wa.me/375292828878"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-green)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                {settings.phone || '+375 (29) 282-88-78'}
              </a>
            </div>
            <div>
              📧 <a
                href="mailto:info@vibecoding.by"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-green)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                {settings.email || 'info@vibecoding.by'}
              </a>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <a
                href="https://wa.me/375292828878"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '28px',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, opacity 0.3s',
                  opacity: 0.8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.opacity = '0.8';
                }}
              >
                💬
              </a>
              <a
                href="https://t.me/vibecoding"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '28px',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, opacity 0.3s',
                  opacity: 0.8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.opacity = '0.8';
                }}
              >
                ✈️
              </a>
            </div>
          </div>
        </div>
        
      </div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0, 255, 249, 0.2)',
        textAlign: 'center',
        opacity: 0.6
      }}>
        <span
          onClick={handleCopyrightClick}
          style={{
            cursor: 'pointer',
            transition: 'opacity 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          © 2025 Vibecoding. Все права защищены.
        </span>
      </div>
    </footer>
  );
}
