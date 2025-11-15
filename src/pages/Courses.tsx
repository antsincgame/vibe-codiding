import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (data) {
      setCourses(data);
    }
    setLoading(false);
  };

  const getGradient = (index: number) => {
    if (index % 3 === 0) return 'linear-gradient(135deg, var(--neon-cyan), var(--neon-blue))';
    if (index % 3 === 1) return 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))';
    return 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))';
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
          fontSize: 'clamp(40px, 6vw, 60px)',
          textAlign: 'center',
          marginBottom: '30px'
        }} className="glitch" data-text="НАШИ КУРСЫ">
          <span className="neon-text">НАШИ КУРСЫ</span>
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          opacity: 0.8,
          marginBottom: '60px',
          maxWidth: '800px',
          margin: '0 auto 60px'
        }}>
          Выбери направление, которое тебе интересно, и начни создавать будущее уже сегодня!
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="pulse" style={{
              fontSize: '48px',
              color: 'var(--neon-cyan)'
            }}>
              ⚡
            </div>
            <p style={{ marginTop: '20px', opacity: 0.7 }}>Загрузка курсов...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {courses.map((course, index) => (
              <div key={course.id} className="cyber-card" style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  height: '250px',
                  background: getGradient(index),
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '8px 15px',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: '1px solid var(--neon-cyan)'
                  }}>
                    {course.age_group}
                  </div>
                  💻
                </div>
                
                <h2 style={{
                  fontSize: '28px',
                  marginBottom: '20px',
                  color: 'var(--neon-cyan)'
                }}>
                  {course.title}
                </h2>
                
                <p style={{
                  opacity: 0.8,
                  marginBottom: '25px',
                  lineHeight: '1.7',
                  flex: 1
                }}>
                  {course.description}
                </p>
                
                <div style={{
                  marginBottom: '25px',
                  padding: '20px',
                  background: 'rgba(0, 255, 249, 0.05)',
                  border: '1px solid rgba(0, 255, 249, 0.2)'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    marginBottom: '15px',
                    color: 'var(--neon-green)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Чему научишься:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0
                  }}>
                    {(course.features as string[]).map((feature, idx) => (
                      <li key={idx} style={{
                        marginBottom: '8px',
                        paddingLeft: '20px',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--neon-cyan)'
                        }}>▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '25px',
                  padding: '20px 0',
                  borderTop: '1px solid rgba(0, 255, 249, 0.3)',
                  borderBottom: '1px solid rgba(0, 255, 249, 0.3)'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>
                      Длительность
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--neon-green)'
                    }}>
                      {course.duration}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', opacity: 0.6, marginBottom: '5px' }}>
                      Стоимость
                    </div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: 'var(--neon-pink)'
                    }}>
                      {course.price}
                    </div>
                  </div>
                </div>
                
                <Link to={`/course/${course.slug}`} style={{ width: '100%', display: 'block' }}>
                  <button className="cyber-button" style={{
                    width: '100%',
                    fontSize: '16px'
                  }}>
                    Подробнее о курсе
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '80px',
          padding: '60px 30px',
          background: 'rgba(19, 19, 26, 0.8)',
          border: '1px solid var(--neon-cyan)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '32px',
            marginBottom: '20px',
            color: 'var(--neon-cyan)'
          }}>
            ЕСТЬ ВОПРОСЫ О КУРСАХ?
          </h3>
          <p style={{
            fontSize: '18px',
            opacity: 0.8,
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            Свяжитесь с нами, и мы поможем выбрать подходящий курс и ответим на все вопросы.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer">
              <button className="cyber-button" style={{
                fontSize: '18px',
                padding: '12px 30px'
              }}>
                WhatsApp
              </button>
            </a>
            <a href="https://t.me/vibecodiding" target="_blank" rel="noopener noreferrer">
              <button className="cyber-button" style={{
                fontSize: '18px',
                padding: '12px 30px',
                borderColor: 'var(--neon-cyan)',
                color: 'var(--neon-cyan)'
              }}>
                Telegram
              </button>
            </a>
            <a href="mailto:info@vibe-codiding.by">
              <button className="cyber-button" style={{
                fontSize: '18px',
                padding: '12px 30px',
                borderColor: 'var(--neon-green)',
                color: 'var(--neon-green)'
              }}>
                Email
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
