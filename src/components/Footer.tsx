import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
}

export default function Footer() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [articles, setArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadSettings();
    loadArticles();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const loadArticles = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setArticles(data);
    }
  };

  const handleCopyrightClick = () => {
    navigate('/login');
  };

  return (
    <footer style={{
      background: 'rgba(19, 19, 26, 0.9)',
      borderTop: '1px solid var(--neon-cyan)',
      marginTop: isMobile ? '40px' : '80px',
      padding: isMobile ? '30px 15px' : '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '30px' : '40px'
      }}>
        <div>
          <h3 style={{
            fontSize: isMobile ? '20px' : '24px',
            marginBottom: '15px',
            color: 'var(--neon-cyan)'
          }}>
            {settings.school_name || 'Vibecoding'}
          </h3>
          <p style={{
            opacity: 0.8,
            lineHeight: '1.8',
            fontSize: isMobile ? '14px' : '16px'
          }}>
            {settings.about_text || 'Школа программирования для подростков и взрослых, обучение веб разработки, веб приложений'}
          </p>
        </div>

        {articles.length > 0 && (
          <div>
            <h4 style={{
              fontSize: isMobile ? '16px' : '18px',
              marginBottom: '15px',
              color: 'var(--neon-green)'
            }}>
              Полезные статьи
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: isMobile ? '14px' : '15px'
            }}>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    opacity: 0.8,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = 'var(--neon-cyan)';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                    e.currentTarget.style.color = 'inherit';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <span style={{ flexShrink: 0, opacity: 0.6 }}>→</span>
                  <span>{article.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 style={{
            fontSize: isMobile ? '16px' : '18px',
            marginBottom: '15px',
            color: 'var(--neon-pink)'
          }}>
            Контакты
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: 0.8,
            fontSize: isMobile ? '14px' : '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>📍</span>
              <a
                href="https://yandex.by/maps/-/CLDYuCZU"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                {settings.address || 'ул. Краснопартизанская 55-2, каб.29'}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>📞</span>
              <a
                href="tel:+375292828878"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flexShrink: 0 }}>✉️</span>
              <a
                href="mailto:info@vibecoding.by"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
              >
                info@vibecoding.by
              </a>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '5px', alignItems: 'center' }}>
              <a
                href="https://t.me/vibecodingby"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, opacity 0.3s, color 0.3s',
                  opacity: 0.8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = 'var(--neon-cyan)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                <svg
                  width={isMobile ? "20" : "24"}
                  height={isMobile ? "20" : "24"}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.242-1.865-.442-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.325.016.093.036.305.02.47z"/>
                </svg>
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <div style={{
        maxWidth: '1200px',
        margin: isMobile ? '30px auto 0' : '40px auto 0',
        paddingTop: '20px',
        paddingLeft: isMobile ? '15px' : '0',
        paddingRight: isMobile ? '15px' : '0',
        borderTop: '1px solid rgba(0, 255, 249, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ opacity: 0.6, marginBottom: '12px' }}>
          <span
            onClick={handleCopyrightClick}
            style={{
              cursor: 'pointer',
              transition: 'opacity 0.3s',
              fontSize: isMobile ? '13px' : '14px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            © 2025 Vibecoding. Все права защищены.
          </span>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link
            to="/privacy"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.3s, color 0.3s',
              fontSize: isMobile ? '13px' : '14px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = 'var(--neon-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6';
              e.currentTarget.style.color = 'inherit';
            }}
          >
            Политика конфиденциальности
          </Link>
          <span style={{ margin: '0 8px' }}>|</span>
          <Link
            to="/offer"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'opacity 0.3s, color 0.3s',
              fontSize: isMobile ? '13px' : '14px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = 'var(--neon-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.6';
              e.currentTarget.style.color = 'inherit';
            }}
          >
            Публичная оферта
          </Link>
        </div>
        <div style={{
          fontSize: isMobile ? '11px' : '13px',
          opacity: 0.7,
          lineHeight: '1.6',
          padding: isMobile ? '0 10px' : '0'
        }}>
          Деятельность ведет Орлов Дмитрий Дмитриевич, УНП: НА8252796
        </div>
      </div>
    </footer>
  );
}
