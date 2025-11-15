import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(3);
    
    if (data) {
      setCourses(data);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            marginBottom: '30px',
            lineHeight: '1.2'
          }} className="glitch" data-text="VIBE CODING SCHOOL">
            <span className="neon-text">VIBE CODING</span><br />
            <span style={{ color: 'var(--neon-pink)' }}>SCHOOL</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.8'
          }}>
            Школа программирования для детей и взрослых в Гродно
            <br />
            Погрузись в мир веб-разработки!
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/trial">
              <button className="cyber-button" style={{ fontSize: '18px' }}>
                Записаться на пробный урок
              </button>
            </Link>
            <Link to="/courses">
              <button className="cyber-button" style={{
                fontSize: '18px',
                borderColor: 'var(--neon-pink)',
                color: 'var(--neon-pink)'
              }}>
                Смотреть курсы
              </button>
            </Link>
          </div>
        </div>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,255,249,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 4s ease-in-out infinite',
          zIndex: 1
        }} />
      </section>

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          textAlign: 'center',
          marginBottom: '20px',
          color: 'var(--neon-pink)'
        }}>
          Выбери свой курс
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          opacity: 0.8,
          marginBottom: '60px'
        }}>
          У нас есть два курса они различаются только технологиями, подходят как для детей 12+ так и для взрослых, занятия проходят в раздельных группах
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {courses.map((course) => (
            <div key={course.id} className="cyber-card">
              <div style={{
                height: '200px',
                background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px'
              }}>
                💻
              </div>
              <h3 style={{
                fontSize: '24px',
                marginBottom: '15px',
                color: 'var(--neon-cyan)'
              }}>
                {course.title}
              </h3>
              <p style={{
                opacity: 0.8,
                marginBottom: '20px',
                lineHeight: '1.7'
              }}>
                {course.description}
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                padding: '15px 0',
                borderTop: '1px solid rgba(0, 255, 249, 0.3)',
                borderBottom: '1px solid rgba(0, 255, 249, 0.3)'
              }}>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>Возраст</div>
                  <div style={{ color: 'var(--neon-green)' }}>{course.age_group}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', opacity: 0.6 }}>Длительность</div>
                  <div style={{ color: 'var(--neon-green)' }}>{course.duration}</div>
                </div>
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--neon-pink)',
                marginBottom: '20px'
              }}>
                {course.price}
              </div>
              <Link to="/trial" style={{ width: '100%', display: 'block' }}>
                <button className="cyber-button" style={{ width: '100%' }}>
                  Записаться
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{
        padding: '80px 20px',
        background: 'rgba(19, 19, 26, 0.5)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            marginBottom: '30px',
            color: 'var(--neon-green)'
          }}>
            ГОТОВ НАЧАТЬ?
          </h2>
          <p style={{
            fontSize: '20px',
            opacity: 0.8,
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            Запишись на бесплатное пробное занятие и окунись в мир программирования!
          </p>
          <Link to="/trial">
            <button className="cyber-button" style={{
              fontSize: '20px',
              padding: '15px 40px'
            }}>
              Записаться на пробный урок
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
