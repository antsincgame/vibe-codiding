import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';
import StudentWorksSection from '../components/StudentWorksSection';

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
            marginBottom: '20px',
            lineHeight: '1.2'
          }} className="glitch" data-text="VIBECODING">
            <span className="neon-text">VIBECODING</span>
          </h1>

          <h2 style={{
            fontSize: 'clamp(16px, 2.5vw, 28px)',
            marginBottom: '40px',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-green))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(0, 255, 249, 0.5)',
            lineHeight: '1.4'
          }}>
            Vibecoding - первая в Гродно школа вайб-кодинга
          </h2>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.8'
          }}>
            Забудьте о сложных языках программирования! В Vibecoding мы научим вас создавать настоящие сайты, веб-сервисы и приложения, используя революционный подход — вайб-кодинг.
          </p>
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
        padding: '40px 20px 80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="cyber-card" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            marginBottom: '30px',
            color: 'var(--neon-pink)',
            textAlign: 'center'
          }}>
            Что такое вайб-кодинг?
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            opacity: 0.9,
            marginBottom: '20px'
          }}>
            Вайб-кодинг (vibe coding) — это современный метод разработки программ с помощью искусственного интеллекта, который был представлен в 2025 году исследователем AI Андреем Карпати из OpenAI. Вместо написания кода строка за строкой, вы просто общаетесь с AI-помощником на обычном языке, описывая что хотите создать, а искусственный интеллект превращает ваши идеи в работающие приложения.
          </p>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            opacity: 0.9
          }}>
            Это означает, что программирование теперь доступно каждому — независимо от возраста, образования или предыдущего опыта.
          </p>
        </div>

        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          background: 'linear-gradient(90deg, var(--neon-pink), var(--neon-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255, 0, 255, 0.6)',
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 249, 0.5))'
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
              <Link to={`/course/${course.slug}`} style={{ width: '100%', display: 'block' }}>
                <button className="cyber-button" style={{ width: '100%' }}>
                  Читать о курсе
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <StudentWorksSection />
    </div>
  );
}
