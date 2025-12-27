import { renderMarkdown } from '../lib/markdown';

interface CourseModule {
  icon: string;
  color: string;
  title: string;
  content: string;
  number: string;
}

const parseDescription = (description: string): { intro: string; modules: CourseModule[]; conclusion: string } => {
  const sections = description.split('---').map(s => s.trim());

  const intro = sections[0] || '';
  const conclusion = sections.length > 1 ? sections[sections.length - 1] : '';
  const moduleSections = sections.slice(1, -1);

  const moduleIcons = ['🎨', '⚡', '🗄️', '📦', '🚀', '🔍', '🤖'];
  const moduleColors = [
    'var(--neon-cyan)',
    'var(--neon-pink)',
    'var(--neon-green)',
    'var(--neon-cyan)',
    'var(--neon-pink)',
    'var(--neon-green)',
    'var(--neon-cyan)'
  ];

  const modules: CourseModule[] = moduleSections.map((section, idx) => {
    const lines = section.split('\n').filter(l => l.trim());
    const firstLine = lines[0] || '';
    const numberMatch = firstLine.match(/^(\d+)\)/);
    const number = numberMatch ? numberMatch[1] : String(idx + 1);
    const title = firstLine.replace(/^\d+\)\s*/, '').trim();
    const content = lines.slice(1).join('\n');

    return {
      icon: moduleIcons[idx % moduleIcons.length],
      color: moduleColors[idx % moduleColors.length],
      title,
      content,
      number
    };
  });

  return { intro, modules, conclusion };
};

export default function CourseDescription({ description }: { description: string }) {
  const { intro, modules, conclusion } = parseDescription(description);

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.08) 0%, rgba(255, 0, 110, 0.08) 100%)',
        padding: '40px',
        borderRadius: '16px',
        border: '2px solid rgba(0, 255, 249, 0.2)',
        marginBottom: '50px',
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
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '100px',
          opacity: 0.05,
          pointerEvents: 'none'
        }}>
          📚
        </div>
        <div
          className="course-description"
          style={{
            fontSize: '19px',
            lineHeight: '2',
            opacity: 0.95,
            position: 'relative',
            zIndex: 1
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(intro) }}
        />
      </div>

      {modules.length > 0 && (
        <div style={{ marginBottom: '50px' }}>
          <h3 style={{
            fontSize: '36px',
            marginBottom: '40px',
            color: 'var(--neon-green)',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
          }}>
            Программа курса
          </h3>
          <div style={{
            display: 'grid',
            gap: '30px'
          }}>
            {modules.map((module, idx) => (
              <div
                key={idx}
                className="module-card"
                style={{
                  background: `linear-gradient(135deg, ${module.color}08 0%, rgba(19, 19, 26, 0.95) 100%)`,
                  border: `2px solid ${module.color}`,
                  borderRadius: '16px',
                  padding: '40px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 0 20px ${module.color}15`
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '120px',
                  opacity: 0.05,
                  pointerEvents: 'none'
                }}>
                  {module.icon}
                </div>

                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  background: `linear-gradient(180deg, ${module.color}, transparent)`
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
                  <div style={{
                    minWidth: '70px',
                    height: '70px',
                    background: `${module.color}20`,
                    border: `2px solid ${module.color}`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    flexShrink: 0,
                    boxShadow: `0 0 20px ${module.color}30`
                  }}>
                    {module.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      color: module.color,
                      fontWeight: 700,
                      marginBottom: '8px',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      opacity: 0.8
                    }}>
                      Модуль {module.number}
                    </div>
                    <h4 style={{
                      fontSize: '28px',
                      color: module.color,
                      fontWeight: 700,
                      marginBottom: '20px',
                      textShadow: `0 0 15px ${module.color}50`,
                      lineHeight: '1.3'
                    }}>
                      {module.title}
                    </h4>
                  </div>
                </div>

                <div
                  className="course-description module-content"
                  style={{
                    fontSize: '17px',
                    lineHeight: '1.9',
                    opacity: 0.9,
                    paddingLeft: '90px'
                  }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(module.content) }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {conclusion && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 255, 249, 0.1) 100%)',
          padding: '50px',
          borderRadius: '16px',
          border: '2px solid var(--neon-pink)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(255, 0, 110, 0.15)'
        }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '120px',
            opacity: 0.05,
            pointerEvents: 'none'
          }}>
            🎯
          </div>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '100px',
            opacity: 0.05,
            pointerEvents: 'none'
          }}>
            🚀
          </div>
          <div
            className="course-description"
            style={{
              fontSize: '18px',
              lineHeight: '2',
              opacity: 0.95,
              position: 'relative',
              zIndex: 1
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(conclusion) }}
          />
        </div>
      )}
    </div>
  );
}
