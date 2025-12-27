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
            height: '400px',
            marginBottom: '60px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '3px solid var(--neon-cyan)',
            boxShadow: '0 10px 50px rgba(0, 255, 249, 0.3)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 15, 0.7) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            <img
              src={course.image_url}
              alt={course.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '50px'
            }}>
              <div className="course-info-card" style={{
                padding: '25px 30px',
                background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.15) 0%, rgba(0, 255, 249, 0.05) 100%)',
                border: '2px solid var(--neon-cyan)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '40px',
                  opacity: 0.1
                }}>👥</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Возраст
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-cyan)', textShadow: '0 0 10px rgba(0, 255, 249, 0.5)' }}>
                  {course.age_group}
                </div>
              </div>

              <div className="course-info-card" style={{
                padding: '25px 30px',
                background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.05) 100%)',
                border: '2px solid var(--neon-green)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '40px',
                  opacity: 0.1
                }}>⏱️</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Длительность
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-green)', textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' }}>
                  {course.duration}
                </div>
              </div>

              <div className="course-info-card" style={{
                padding: '25px 30px',
                background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.15) 0%, rgba(255, 0, 110, 0.05) 100%)',
                border: '2px solid var(--neon-pink)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '40px',
                  opacity: 0.1
                }}>💰</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Стоимость
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--neon-pink)', textShadow: '0 0 10px rgba(255, 0, 110, 0.5)' }}>
                  {course.price}
                </div>
              </div>
            </div>
          </div>

          <section className="cyber-card" style={{ padding: '50px' }}>
            <h2 style={{
              fontSize: '40px',
              marginBottom: '40px',
              color: 'var(--neon-cyan)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              textShadow: '0 0 20px rgba(0, 255, 249, 0.5)'
            }}>
              О курсе
            </h2>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.08) 0%, rgba(255, 0, 110, 0.08) 100%)',
              padding: '40px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 255, 249, 0.2)',
              marginBottom: '40px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                height: '4px',
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-cyan))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite'
              }} />
              <div
                className="course-description"
                style={{
                  fontSize: '18px',
                  lineHeight: '2',
                  opacity: 0.95
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
              />
            </div>

            <div style={{
              padding: '50px',
              background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 255, 249, 0.05) 100%)',
              border: '2px solid var(--neon-green)',
              marginBottom: '40px',
              borderRadius: '16px',
              position: 'relative',
              boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)'
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '80px',
                opacity: 0.1,
                color: 'var(--neon-green)',
                pointerEvents: 'none'
              }}>
                🎯
              </div>
              <h3 style={{
                fontSize: '32px',
                marginBottom: '40px',
                color: 'var(--neon-green)',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textAlign: 'center',
                textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
              }}>
                Чему вы научитесь
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {(course.features as string[]).map((feature, idx) => (
                  <div key={idx} className="feature-card" style={{
                    padding: '24px',
                    background: 'rgba(19, 19, 26, 0.9)',
                    border: '2px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(180deg, var(--neon-green), var(--neon-cyan))'
                    }} />
                    <span style={{
                      fontSize: '24px',
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--neon-green)',
                      background: 'rgba(57, 255, 20, 0.1)',
                      borderRadius: '8px',
                      flexShrink: 0,
                      fontWeight: 900,
                      border: '1px solid rgba(57, 255, 20, 0.3)'
                    }}>✓</span>
                    <span style={{
                      fontSize: '17px',
                      lineHeight: '1.6',
                      opacity: 0.95,
                      fontWeight: 500
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 255, 249, 0.1) 100%)',
              padding: '60px 40px',
              border: '2px solid var(--neon-pink)',
              textAlign: 'center',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(255, 0, 110, 0.2)'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '200px',
                opacity: 0.05,
                pointerEvents: 'none'
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '36px',
                marginBottom: '20px',
                color: 'var(--neon-pink)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(255, 0, 110, 0.5)',
                position: 'relative',
                zIndex: 1
              }}>
                Заинтересовались курсом?
              </h3>
              <p style={{
                fontSize: '19px',
                opacity: 0.9,
                marginBottom: '40px',
                lineHeight: '1.8',
                maxWidth: '700px',
                margin: '0 auto 40px',
                position: 'relative',
                zIndex: 1
              }}>
                Свяжитесь с нами, чтобы узнать больше о курсе и получить ответы на все ваши вопросы!
              </p>
              <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <button className="cyber-button" style={{
                  fontSize: '20px',
                  padding: '18px 50px',
                  background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-cyan))',
                  border: 'none',
                  boxShadow: '0 0 30px rgba(255, 0, 110, 0.4)',
                  fontWeight: 700,
                  letterSpacing: '2px'
                }}>
                  📱 НАПИСАТЬ В WHATSAPP
                </button>
              </a>
            </div>
          </section>

          <section style={{
            padding: '70px 50px',
            background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1) 0%, rgba(57, 255, 20, 0.1) 100%)',
            border: '2px solid var(--neon-cyan)',
            textAlign: 'center',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(0, 255, 249, 0.15)'
          }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              fontSize: '100px',
              opacity: 0.08,
              pointerEvents: 'none'
            }}>
              ❓
            </div>
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '100px',
              opacity: 0.08,
              pointerEvents: 'none',
              transform: 'rotate(180deg)'
            }}>
              ❓
            </div>
            <h3 style={{
              fontSize: '38px',
              marginBottom: '20px',
              color: 'var(--neon-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              textShadow: '0 0 20px rgba(0, 255, 249, 0.5)',
              position: 'relative',
              zIndex: 1
            }}>
              Остались вопросы?
            </h3>
            <p style={{
              fontSize: '20px',
              opacity: 0.9,
              marginBottom: '35px',
              lineHeight: '1.7',
              maxWidth: '600px',
              margin: '0 auto 35px',
              position: 'relative',
              zIndex: 1
            }}>
              Свяжитесь с нами удобным для вас способом
            </p>
            <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              <button className="cyber-button" style={{
                fontSize: '18px',
                padding: '16px 40px',
                fontWeight: 700,
                letterSpacing: '2px'
              }}>
                📱 СВЯЗАТЬСЯ
              </button>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
