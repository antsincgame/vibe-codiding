import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { renderMarkdown } from '../lib/markdown';
import type { Course } from '../types';

const setSEO = (course: Course) => {
  document.title = `${course.title} | Онлайн курс вайб-кодинга | Vibecoding`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${course.description} Обучение Cursor AI и Bolt.ai онлайн.`);
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) metaKeywords.setAttribute('content', 'курсы vibe coding, обучение Cursor AI, Bolt.ai курсы, создание веб приложений, онлайн школа программирования');
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading course:', error);
    }

    if (data) {
      setCourse(data);
      setSEO(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse" style={{
            fontSize: '48px',
            color: 'var(--neon-cyan)'
          }}>
            ⚡
          </div>
          <p style={{ marginTop: '20px', opacity: 0.7 }}>Загрузка курса...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            color: 'var(--neon-pink)'
          }}>
            Курс не найден
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.8, marginBottom: '40px' }}>
            Возможно, курс был удален или изменен
          </p>
          <Link to="/">
            <button className="cyber-button">
              Вернуться на главную
            </button>
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {course.image_url && (
          <div style={{
            width: '100%',
            height: '350px',
            marginBottom: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(0, 255, 249, 0.3)'
          }}>
            <img
              src={course.image_url}
              alt={course.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '60px'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 56px)',
              marginBottom: '20px',
              lineHeight: '1.2'
            }} className="glitch" data-text={course.title}>
              <span className="neon-text">{course.title}</span>
            </h1>

            <div style={{
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                padding: '15px 25px',
                background: 'rgba(0, 255, 249, 0.1)',
                border: '1px solid var(--neon-cyan)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>
                  Возраст
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--neon-cyan)' }}>
                  {course.age_group}
                </div>
              </div>

              <div style={{
                padding: '15px 25px',
                background: 'rgba(0, 255, 249, 0.1)',
                border: '1px solid var(--neon-green)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>
                  Длительность
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--neon-green)' }}>
                  {course.duration}
                </div>
              </div>

              <div style={{
                padding: '15px 25px',
                background: 'rgba(255, 0, 128, 0.1)',
                border: '1px solid var(--neon-pink)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>
                  Стоимость
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-pink)' }}>
                  {course.price}
                </div>
              </div>
            </div>
          </div>

          <section className="cyber-card">
            <h2 style={{
              fontSize: '32px',
              marginBottom: '20px',
              color: 'var(--neon-cyan)'
            }}>
              О курсе
            </h2>
            <div
              style={{
                fontSize: '20px',
                lineHeight: '1.8',
                opacity: 0.9,
                marginBottom: '40px'
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
            />

            <div style={{
              padding: '40px',
              background: 'rgba(0, 255, 249, 0.05)',
              border: '1px solid rgba(0, 255, 249, 0.3)',
              marginBottom: '40px',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '24px',
                marginBottom: '30px',
                color: 'var(--neon-green)',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                Чему вы научитесь:
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {(course.features as string[]).map((feature, idx) => (
                  <div key={idx} style={{
                    padding: '16px 20px',
                    background: 'rgba(0, 255, 249, 0.08)',
                    border: '1px solid rgba(0, 255, 249, 0.25)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}>
                    <span style={{
                      fontSize: '20px',
                      color: 'var(--neon-cyan)',
                      flexShrink: 0,
                      marginTop: '2px',
                      fontWeight: 700
                    }}>✓</span>
                    <span style={{
                      fontSize: '16px',
                      lineHeight: '1.5',
                      opacity: 0.95
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(19, 19, 26, 0.8)',
              padding: '40px',
              border: '1px solid var(--neon-pink)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '28px',
                marginBottom: '20px',
                color: 'var(--neon-pink)'
              }}>
                Заинтересовались курсом?
              </h3>
              <p style={{
                fontSize: '18px',
                opacity: 0.8,
                marginBottom: '30px',
                lineHeight: '1.7'
              }}>
                Свяжитесь с нами, чтобы узнать больше о курсе и получить ответы на все ваши вопросы!
              </p>
              <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="cyber-button" style={{
                  fontSize: '18px',
                  padding: '15px 35px'
                }}>
                  WhatsApp
                </button>
              </a>
            </div>
          </section>

          <section style={{
            padding: '60px 40px',
            background: 'rgba(0, 255, 249, 0.05)',
            border: '1px solid var(--neon-cyan)',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '32px',
              marginBottom: '20px',
              color: 'var(--neon-cyan)'
            }}>
              Есть вопросы?
            </h3>
            <p style={{
              fontSize: '18px',
              opacity: 0.8,
              marginBottom: '30px'
            }}>
              Свяжитесь с нами удобным для вас способом
            </p>
            <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="cyber-button">
                WhatsApp
              </button>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
