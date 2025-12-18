import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Блог о вайб-кодинге | Cursor AI и Bolt.ai статьи | Создание веб-приложений';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Статьи о вайб-кодинге, обучении Cursor AI и Bolt.ai. Узнайте как создавать веб-приложения с помощью искусственного интеллекта. Блог онлайн школы программирования.');
    }
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'блог вайб кодинг, статьи Cursor AI, Bolt.ai туториалы, создание веб приложений, обучение программированию с AI');
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error loading blog posts:', error);
    }

    if (data) setPosts(data);
    setLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 56px)',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan), var(--neon-pink))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Блог
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          opacity: 0.8,
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px',
          lineHeight: '1.7'
        }}>
          Статьи о вайб-кодинге, <strong>Cursor AI</strong>, <strong>Bolt.ai</strong> и <strong>создании веб-приложений</strong> с помощью искусственного интеллекта
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '18px', opacity: 0.6 }}>Загрузка...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="cyber-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '15px' }}>Скоро здесь появятся статьи</h2>
            <p style={{ opacity: 0.7 }}>Мы готовим интересные материалы для вас</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article className="cyber-card" style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 249, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
                >
                  <div style={{
                    height: '200px',
                    background: post.image_url
                      ? `url(${post.image_url}) center/cover no-repeat`
                      : 'linear-gradient(135deg, rgba(0, 255, 249, 0.3), rgba(57, 255, 20, 0.3))',
                    marginBottom: '20px',
                    borderRadius: '4px'
                  }} />

                  <div style={{
                    fontSize: '13px',
                    color: 'var(--neon-green)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {formatDate(post.published_at)}
                  </div>

                  <h2 style={{
                    fontSize: '22px',
                    marginBottom: '12px',
                    color: 'var(--neon-cyan)',
                    lineHeight: '1.3'
                  }}>
                    {post.title}
                  </h2>

                  <p style={{
                    opacity: 0.8,
                    lineHeight: '1.7',
                    flex: 1,
                    marginBottom: '20px'
                  }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    color: 'var(--neon-cyan)',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Читать далее
                    <span style={{ fontSize: '18px' }}>→</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
