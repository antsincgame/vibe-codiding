import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { StudentWork } from '../types';

export default function StudentWorks() {
  const [works, setWorks] = useState<StudentWork[]>([]);
  const [filter, setFilter] = useState<'all' | 'bolt' | 'cursor'>('all');

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    const { data } = await supabase
      .from('student_works')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (data) setWorks(data);
  };

  const filteredWorks = works.filter((work) => {
    if (filter === 'all') return true;
    return work.tool_type === filter;
  });

  const WorkCard = ({ work }: { work: StudentWork }) => (
    <div className="cyber-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '200px',
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

      <h3 style={{
        fontSize: '22px',
        marginBottom: '10px',
        color: 'var(--neon-cyan)'
      }}>
        {work.project_title}
      </h3>

      <div style={{
        fontSize: '14px',
        color: 'var(--neon-green)',
        marginBottom: '15px'
      }}>
        {work.student_name}, {work.student_age} лет
      </div>

      <p style={{
        opacity: 0.8,
        marginBottom: '20px',
        lineHeight: '1.7',
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
            padding: '12px 24px'
          }}
        >
          Перейти на сайт
        </a>
      )}
    </div>
  );

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
          Примеры работ наших учеников
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
          Здесь собраны проекты, которые наши ученики создали во время обучения.
          Каждая работа - это реальный результат, достигнутый с помощью вайб-кодинга!
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '50px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setFilter('all')}
            className="cyber-button"
            style={{
              opacity: filter === 'all' ? 1 : 0.5,
              padding: '12px 30px'
            }}
          >
            Все работы
          </button>
          <button
            onClick={() => setFilter('bolt')}
            className="cyber-button"
            style={{
              opacity: filter === 'bolt' ? 1 : 0.5,
              borderColor: 'var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              padding: '12px 30px'
            }}
          >
            Bolt.new
          </button>
          <button
            onClick={() => setFilter('cursor')}
            className="cyber-button"
            style={{
              opacity: filter === 'cursor' ? 1 : 0.5,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)',
              padding: '12px 30px'
            }}
          >
            Cursor AI
          </button>
        </div>

        {filteredWorks.length === 0 ? (
          <div className="cyber-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '20px', opacity: 0.8 }}>
              Пока нет работ для отображения
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
