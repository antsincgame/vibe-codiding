import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function About() {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQuote();
  }, []);

  const generateQuote = async () => {
    try {
      setLoading(true);

      const { data: settings } = await supabase
        .from('openrouter_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settings && settings.api_key && settings.api_key.trim() !== '') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.api_key}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Vibe Coding School'
          },
          body: JSON.stringify({
            model: settings.model,
            messages: [
              {
                role: 'user',
                content: 'Создай короткую вдохновляющую цитату (2-3 предложения) о Vibe Coding - современном подходе к обучению программированию, где сочетается практический опыт, AI-инструменты и понятная подача материала. Цитата должна быть от лица преподавателя и мотивировать учеников. Только текст цитаты, без кавычек и атрибуции.'
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          setQuote(data.choices[0]?.message?.content || '');
        } else {
          setQuote('Я верю, что каждый может освоить веб-разработку. Мой подход — это сочетание практического опыта, современных AI-инструментов и понятной подачи материала. Вместо заучивания теории мы создаем реальные проекты, которые можно показать в портфолио.');
        }
      } else {
        setQuote('Я верю, что каждый может освоить веб-разработку. Мой подход — это сочетание практического опыта, современных AI-инструментов и понятной подачи материала. Вместо заучивания теории мы создаем реальные проекты, которые можно показать в портфолио.');
      }
    } catch (error) {
      setQuote('Я верю, что каждый может освоить веб-разработку. Мой подход — это сочетание практического опыта, современных AI-инструментов и понятной подачи материала. Вместо заучивания теории мы создаем реальные проекты, которые можно показать в портфолио.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 64px)',
          textAlign: 'center',
          marginBottom: '20px',
          color: 'var(--neon-cyan)'
        }} className="glitch" data-text="ДМИТРИЙ ОРЛОВ">
          ДМИТРИЙ ОРЛОВ
        </h1>

        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 32px)',
          textAlign: 'center',
          marginBottom: '60px',
          color: 'var(--neon-pink)',
          fontWeight: 600
        }}>
          Ведущий преподаватель веб-разработки и AI-технологий
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
          alignItems: 'start'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <div style={{
              border: '3px solid var(--neon-cyan)',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: `
                0 0 20px var(--neon-cyan),
                inset 0 0 20px rgba(0, 255, 249, 0.1)
              `,
              background: 'var(--dark-surface)'
            }}>
              <img
                src="/image copy.png"
                alt="Дмитрий Орлов"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '60px',
              height: '60px',
              border: '2px solid var(--neon-pink)',
              borderRadius: '5px',
              background: 'transparent'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              right: '-10px',
              width: '60px',
              height: '60px',
              border: '2px solid var(--neon-green)',
              borderRadius: '5px',
              background: 'transparent'
            }} />
          </div>

          <div style={{ fontSize: '18px', lineHeight: '1.9' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <div style={{
                padding: '10px 20px',
                background: 'rgba(0, 255, 249, 0.1)',
                border: '2px solid var(--neon-cyan)',
                borderRadius: '5px',
                color: 'var(--neon-cyan)',
                fontWeight: 700,
                fontSize: '16px'
              }}>
                15+ лет в IT-индустрии
              </div>
              <div style={{
                padding: '10px 20px',
                background: 'rgba(255, 0, 110, 0.1)',
                border: '2px solid var(--neon-pink)',
                borderRadius: '5px',
                color: 'var(--neon-pink)',
                fontWeight: 700,
                fontSize: '16px'
              }}>
                Основатель "Студия Орлова"
              </div>
              <div style={{
                padding: '10px 20px',
                background: 'rgba(0, 255, 65, 0.1)',
                border: '2px solid var(--neon-green)',
                borderRadius: '5px',
                color: 'var(--neon-green)',
                fontWeight: 700,
                fontSize: '16px'
              }}>
                Бывший Резидент ПВТ (5 лет опыта)
              </div>
            </div>

            <p style={{ marginBottom: '20px', opacity: 0.95 }}>
              <strong style={{ color: 'var(--neon-cyan)' }}>Дмитрий Орлов</strong> — практикующий специалист с богатым опытом создания и продвижения веб-проектов. Как основатель веб-студии <strong>"Студия Орлова"</strong> и компании <strong>ООО "Серендип"</strong> (резидент Парка Высоких Технологий), он реализовал десятки успешных проектов — от корпоративных сайтов до сложных веб-приложений с интеграцией искусственного интеллекта.
            </p>
          </div>
        </div>

        <div className="cyber-card" style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: '20px',
            color: 'var(--neon-pink)'
          }}>
            Экспертиза
          </h3>
          <p style={{ fontSize: '18px', lineHeight: '1.9', marginBottom: '20px', opacity: 0.95 }}>
            <strong style={{ color: 'var(--neon-cyan)' }}>Технический директор</strong> — это специалист, который руководит всеми техническими аспектами проектов: от выбора технологий и архитектуры до запуска и поддержки. Этот опыт бесценен для учеников, ведь Дмитрий не просто учит кодить, а показывает, как мыслит стратегически, принимать важные технические решения и создавать проекты, которые работают в реальном бизнесе.
          </p>
          <p style={{ fontSize: '18px', lineHeight: '1.9', marginBottom: '20px', opacity: 0.95 }}>
            <strong style={{ color: 'var(--neon-green)' }}>Что значит быть техническим директором?</strong> Это означает уметь видеть проект целиком: понимать, какие технологии выбрать, как организовать код, как обеспечить безопасность и масштабируемость. Дмитрий передает эти знания ученикам, обучая их не просто писать код, а создавать профессиональные решения с первого дня.
          </p>

          <h4 style={{
            fontSize: '22px',
            marginTop: '30px',
            marginBottom: '15px',
            color: 'var(--neon-green)'
          }}>
            Основные направления:
          </h4>
          <ul style={{
            fontSize: '18px',
            lineHeight: '2',
            paddingLeft: '25px',
            opacity: 0.95
          }}>
            <li>Информационные сайты и корпоративные порталы</li>
            <li>Интернет-магазины с полным функционалом</li>
            <li>Веб-приложения с AI-ассистентами</li>
            <li>SEO-продвижение и привлечение первых клиентов с использованием контекстной рекламы</li>
            <li>Современные инструменты разработки с использованием ИИ</li>
          </ul>
        </div>

        <div className="cyber-card" style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: '20px',
            color: 'var(--neon-pink)'
          }}>
            Что вы освоите на курсе
          </h3>
          <p style={{ fontSize: '18px', lineHeight: '1.9', marginBottom: '20px', opacity: 0.95 }}>
            Дмитрий проведет вас через весь путь создания веб-проекта — от первоначальной идеи до запуска готового сайта и привлечения клиентов. Сложные технические темы он объясняет простым и понятным языком, делая обучение доступным для каждого.
          </p>

          <h4 style={{
            fontSize: '22px',
            marginTop: '30px',
            marginBottom: '15px',
            color: 'var(--neon-green)'
          }}>
            На занятиях вы научитесь:
          </h4>
          <ul style={{
            fontSize: '18px',
            lineHeight: '2',
            paddingLeft: '25px',
            opacity: 0.95
          }}>
            <li>Превращать идеи в работающие веб-проекты</li>
            <li>Создавать современные адаптивные сайты</li>
            <li>Размещать проекты на хостинге и настраивать домены</li>
            <li>Находить и исправлять ошибки в коде</li>
            <li>Составлять эффективные промпты для AI-инструментов</li>
            <li>Использовать искусственный интеллект для ускорения разработки</li>
            <li>Применять базовые SEO-техники для привлечения трафика</li>
          </ul>
        </div>
      </section>

      <section style={{
        padding: '60px 20px',
        background: 'rgba(19, 19, 26, 0.5)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            textAlign: 'center',
            marginBottom: '40px',
            color: 'var(--neon-green)'
          }}>
            Философия преподавания
          </h2>

          <div style={{
            position: 'relative',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 110, 0.1))',
            border: '3px solid var(--neon-cyan)',
            borderRadius: '15px',
            boxShadow: `
              0 0 30px rgba(0, 255, 249, 0.3),
              inset 0 0 30px rgba(0, 255, 249, 0.1)
            `,
            marginBottom: '40px'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '20px',
              fontSize: '60px',
              color: 'var(--neon-pink)',
              opacity: 0.3,
              lineHeight: 1
            }}>
              "
            </div>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              fontSize: '60px',
              color: 'var(--neon-pink)',
              opacity: 0.3,
              lineHeight: 1
            }}>
              "
            </div>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '30px',
                fontSize: '18px',
                color: 'var(--neon-cyan)'
              }}>
                Генерируем вдохновляющую цитату...
              </div>
            ) : (
              <p style={{
                fontSize: '20px',
                lineHeight: '1.8',
                fontStyle: 'italic',
                textAlign: 'center',
                margin: '20px 0',
                color: '#fff'
              }}>
                {quote}
              </p>
            )}
          </div>

          <div style={{
            fontSize: '18px',
            lineHeight: '1.9',
            opacity: 0.95,
            marginBottom: '30px'
          }}>
            <p>
              Дмитрий постоянно исследует новые технологии и инструменты разработки, интегрируя в учебную программу только проверенные и актуальные решения. Его страсть к инновациям и искусственному интеллекту делает занятия не только полезными, но и вдохновляющими.
            </p>
          </div>
        </div>
      </section>

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          textAlign: 'center',
          marginBottom: '50px',
          color: 'var(--neon-cyan)'
        }}>
          Присоединяйтесь к курсу и откройте для себя мир современной веб-разработки!
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '40px'
        }}>
          <div className="cyber-card" style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(0, 255, 249, 0.1))',
            textAlign: 'center',
            padding: '40px'
          }}>
            <h3 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              marginBottom: '20px',
              color: 'var(--neon-pink)'
            }}>
              Ознакомиться с Vibe-Coding
            </h3>
            <p style={{
              fontSize: '18px',
              opacity: 0.9,
              marginBottom: '30px',
              lineHeight: '1.7'
            }}>
              Посмотрите видео о том, что такое Vibe-Coding и как мы обучаем программированию
            </p>
            <a
              href="https://www.youtube.com/watch?v=w3K1EguBrTc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button className="cyber-button" style={{
                fontSize: '18px',
                padding: '15px 35px',
                borderColor: 'var(--neon-pink)',
                color: 'var(--neon-pink)'
              }}>
                Смотреть видео
              </button>
            </a>
          </div>

          <div className="cyber-card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(0, 255, 65, 0.1))',
            textAlign: 'center',
            padding: '40px'
          }}>
            <h3 style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              marginBottom: '20px',
              color: 'var(--neon-cyan)'
            }}>
              Готовы начать обучение?
            </h3>
            <p style={{
              fontSize: '18px',
              opacity: 0.9,
              marginBottom: '30px',
              lineHeight: '1.7'
            }}>
              Свяжитесь с нами, чтобы узнать больше о курсах
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
                  padding: '15px 35px'
                }}>
                  WhatsApp
                </button>
              </a>
              <a href="https://t.me/vibecodiding" target="_blank" rel="noopener noreferrer">
                <button className="cyber-button" style={{
                  fontSize: '18px',
                  padding: '15px 35px',
                  borderColor: 'var(--neon-cyan)',
                  color: 'var(--neon-cyan)'
                }}>
                  Telegram
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
