import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { StudentWork } from '../types';

export default function StudentWorksSection() {
  const [boltWorks, setBoltWorks] = useState<StudentWork[]>([]);
  const [cursorWorks, setCursorWorks] = useState<StudentWork[]>([]);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    const { data: bolt } = await supabase
      .from('student_works')
      .select('*')
      .eq('tool_type', 'bolt')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(3);

    const { data: cursor } = await supabase
      .from('student_works')
      .select('*')
      .eq('tool_type', 'cursor')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(3);

    if (bolt) setBoltWorks(bolt);
    if (cursor) setCursorWorks(cursor);
  };

  const WorkCard = ({ work }: { work: StudentWork }) => (
    <div className="cyber-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '180px',
        background: work.image_url
          ? `url(${work.image_url}) center/cover no-repeat`
          : 'linear-gradient(135deg, rgba(0, 255, 249, 0.3), rgba(255, 0, 255, 0.3))',
        marginBottom: '20px',
        borderRadius: '4px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: work.tool_type === 'bolt' ? 'var(--neon-cyan)' : 'var(--neon-pink)',
          color: 'var(--bg-dark)',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {work.tool_type === 'bolt' ? 'Bolt.new' : 'Cursor AI'}
        </div>
      </div>

      <h4 style={{
        fontSize: '20px',
        marginBottom: '10px',
        color: 'var(--neon-cyan)'
      }}>
        {work.project_title}
      </h4>

      <div style={{
        fontSize: '14px',
        color: 'var(--neon-green)',
        marginBottom: '12px'
      }}>
        {work.student_name}, {work.student_age} лет
      </div>

      <p style={{
        opacity: 0.8,
        marginBottom: '20px',
        lineHeight: '1.6',
        flex: 1
      }}>
        {work.project_description}
      </p>

      {work.project_url && (
        <a
          href={work.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-button"
          style={{
            display: 'block',
            textAlign: 'center',
            textDecoration: 'none',
            fontSize: '14px',
            padding: '10px 20px'
          }}
        >
          Перейти на сайт
        </a>
      )}
    </div>
  );

  if (boltWorks.length === 0 && cursorWorks.length === 0) {
    return null;
  }

  return (
    <section style={{
      padding: '80px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2 style={{
        fontSize: 'clamp(32px, 5vw, 48px)',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Примеры работ наших учеников
      </h2>
      <p style={{
        textAlign: 'center',
        fontSize: '18px',
        opacity: 0.8,
        marginBottom: '60px',
        maxWidth: '700px',
        margin: '0 auto 60px'
      }}>
        Посмотрите, что создают наши ученики уже после нескольких занятий. От простых сайтов до полноценных веб-приложений!
      </p>

      {boltWorks.length > 0 && (
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{
            fontSize: '28px',
            marginBottom: '30px',
            color: 'var(--neon-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{
              background: 'var(--neon-cyan)',
              color: 'var(--bg-dark)',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700
            }}>
              BOLT.NEW
            </span>
            Сайты и лендинги
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {boltWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      )}

      {cursorWorks.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '28px',
            marginBottom: '30px',
            color: 'var(--neon-pink)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{
              background: 'var(--neon-pink)',
              color: 'var(--bg-dark)',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700
            }}>
              CURSOR AI
            </span>
            Веб-приложения
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {cursorWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/works" style={{ textDecoration: 'none' }}>
          <button className="cyber-button" style={{
            fontSize: '18px',
            padding: '15px 40px'
          }}>
            Смотреть все работы
          </button>
        </Link>
      </div>
    </section>
  );
}
