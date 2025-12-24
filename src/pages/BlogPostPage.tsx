import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', postSlug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (data) {
      setPost(data);
      document.title = data.meta_title || `${data.title} | Vibecoding`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.meta_description) {
        metaDesc.setAttribute('content', data.meta_description);
      }

      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (data.meta_keywords) {
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', data.meta_keywords);
      }
    } else {
      setNotFound(true);
    }
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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '18px', opacity: 0.6 }}>Загрузка...</div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: 'var(--neon-pink)'
          }}>
            404
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '30px' }}>
            Статья не найдена
          </p>
          <Link to="/blog" className="cyber-button" style={{ textDecoration: 'none' }}>
            Вернуться в блог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--neon-cyan)',
            textDecoration: 'none',
            marginBottom: '30px',
            fontSize: '14px',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          <span>←</span> Все статьи
        </Link>

        {post.image_url && (
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <img
              src={post.image_url}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}

        <div style={{
          fontSize: '14px',
          color: 'var(--neon-green)',
          marginBottom: '15px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {formatDate(post.published_at)}
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          marginBottom: '30px',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          lineHeight: '1.2',
          background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {post.title}
        </h1>

        <div
          className="blog-content"
          style={{
            fontSize: '17px',
            lineHeight: '1.8',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />

        <div style={{
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(0, 255, 249, 0.2)'
        }}>
          <Link to="/blog" className="cyber-button" style={{ textDecoration: 'none' }}>
            ← Все статьи
          </Link>
        </div>
      </article>

      <style>{`
        .blog-content h2 {
          font-size: 28px;
          color: var(--neon-cyan);
          margin: 40px 0 20px;
          font-family: 'Orbitron', sans-serif;
        }
        .blog-content h3 {
          font-size: 22px;
          color: var(--neon-green);
          margin: 30px 0 15px;
        }
        .blog-content p {
          margin-bottom: 20px;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 20px;
          padding-left: 25px;
        }
        .blog-content li {
          margin-bottom: 10px;
        }
        .blog-content a {
          color: var(--neon-cyan);
          text-decoration: underline;
        }
        .blog-content code {
          background: rgba(0, 255, 249, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: monospace;
        }
        .blog-content pre {
          background: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 20px;
          border: 1px solid rgba(0, 255, 249, 0.2);
        }
        .blog-content pre code {
          background: none;
          padding: 0;
        }
        .blog-content blockquote {
          border-left: 3px solid var(--neon-cyan);
          padding-left: 20px;
          margin: 20px 0;
          font-style: italic;
          opacity: 0.9;
        }
        .blog-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}

function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatContent(content: string): string {
  let sanitized = sanitizeHtml(content);

  let formatted = sanitized
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

  return formatted;
}
