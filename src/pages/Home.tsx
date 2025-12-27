import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { stripMarkdown } from '../lib/markdown';
import type { Course, HomePageSettings } from '../types';
import StudentWorksSection from '../components/StudentWorksSection';

const defaultSettings: HomePageSettings = {
  title: 'VIBECODING',
  subtitle: 'Vibecoding - лучшая школа программирования с помощью ИИ (вайб-кодинг)',
  description: 'Забудьте о сложных языках программирования! В Vibecoding мы научим вас создавать настоящие сайты, веб-сервисы и приложения, используя революционный подход — вайб-кодинг с Cursor AI и Bolt.ai.',
  meta_title: 'Лучшая онлайн школа вайб-кодинга | Обучение Cursor AI и Bolt.ai | Создание веб-приложений',
  meta_description: 'Онлайн школа программирования вайб кодинга. Обучение Cursor AI и Bolt.ai с нуля. Создание веб-приложений без сложного кода. Курсы vibe coding для начинающих и продвинутых.',
  meta_keywords: 'обучение вайб кодингу, курсы vibe coding, школа программирования вайб кодинга, создание веб приложений, обучение Cursor AI, Bolt.ai курсы, онлайн школа программирования, AI разработка, вайб-кодинг обучение',
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<HomePageSettings>(defaultSettings);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.title = settings.meta_title || 'Лучшая онлайн школа вайб-кодинга | Обучение Cursor AI и Bolt.ai';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.meta_description || defaultSettings.meta_description);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', settings.meta_keywords || defaultSettings.meta_keywords);
    }
  }, [settings]);

  const loadData = async () => {
    await loadSettings();
    await loadCourses();
  };

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('system_settings')
        .select('key, value')
        .in('key', ['home_title', 'home_subtitle', 'home_description', 'home_meta_title', 'home_meta_description', 'home_meta_keywords']);

      if (data && data.length > 0) {
        const settingsMap: Record<string, string> = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });

        setSettings({
          title: settingsMap['home_title'] || defaultSettings.title,
          subtitle: settingsMap['home_subtitle'] || defaultSettings.subtitle,
          description: settingsMap['home_description'] || defaultSettings.description,
          meta_title: settingsMap['home_meta_title'] || defaultSettings.meta_title,
          meta_description: settingsMap['home_meta_description'] || defaultSettings.meta_description,
          meta_keywords: settingsMap['home_meta_keywords'] || defaultSettings.meta_keywords,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

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
          }} className="glitch" data-text={settings.title}>
            <span className="neon-text">{settings.title}</span>
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
            {settings.subtitle}
          </h2>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.8'
          }}>
            {settings.description}
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
            Вайб-кодинг (vibe coding) — это современный метод разработки программ с помощью искусственного интеллекта, который был представлен в 2025 году исследователем AI Андреем Карпати из OpenAI. Вместо написания кода строка за строкой, вы просто общаетесь с AI-помощником на обычном языке, описывая что хотите создать, а искусственный интеллект превращает ваши идеи в работающие приложения. Наша <strong>онлайн школа программирования вайб кодинга</strong> обучает работе с <strong>Cursor AI</strong> и <strong>Bolt.ai</strong> — ведущими инструментами для <strong>создания веб-приложений</strong>.
          </p>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            opacity: 0.9
          }}>
            Это означает, что программирование теперь доступно каждому — <strong>обучение вайб кодингу</strong> и <strong>курсы Cursor AI</strong> помогут вам начать путь в IT независимо от возраста, образования или предыдущего опыта.
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
          <strong>Онлайн курсы vibe coding</strong> для подростков от 16 лет и взрослых. Освойте <strong>Cursor AI</strong> или <strong>Bolt.ai</strong> — два направления для <strong>создания веб-приложений</strong> с помощью искусственного интеллекта.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {courses.map((course, index) => (
            <div key={course.id} className="cyber-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: '200px',
                background: course.image_url ? 'transparent' : (index % 2 === 0
                  ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))'
                  : 'linear-gradient(135deg, var(--neon-green), var(--neon-cyan))'),
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  '💻'
                )}
              </div>
              <h3 style={{
                fontSize: '24px',
                marginBottom: '15px',
                color: 'var(--neon-cyan)'
              }}>
                {course.title}
              </h3>
              <p style={{
                opacity: 0.9,
                marginBottom: '20px',
                lineHeight: '1.8',
                flex: 1,
                fontSize: '15px'
              }}>
                {(() => {
                  const firstSection = course.description.split('---')[0];
                  const cleaned = stripMarkdown(firstSection).replace(/\n+/g, ' ').trim();
                  const words = cleaned.split(/\s+/).slice(0, 35).join(' ');
                  return words.length < cleaned.length ? words + '...' : words;
                })()}
              </p>
              {Array.isArray(course.features) && course.features.length > 0 && (
                <div style={{
                  marginBottom: '20px',
                  padding: '20px',
                  background: 'rgba(0, 255, 249, 0.08)',
                  border: '1px solid rgba(0, 255, 249, 0.3)',
                  borderRadius: '6px'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    color: 'var(--neon-green)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px',
                    fontWeight: 600
                  }}>
                    Основные особенности:
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px'
                  }}>
                    {(course.features as string[]).map((feature, idx) => (
                      <div key={idx} style={{
                        fontSize: '13px',
                        padding: '8px 12px',
                        background: 'rgba(0, 255, 249, 0.1)',
                        border: '1px solid rgba(0, 255, 249, 0.2)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="cyber-card" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            marginBottom: '20px',
            color: 'var(--neon-pink)',
            textAlign: 'center'
          }}>
            Что вы освоите на курсе
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.9', marginBottom: '20px', opacity: 0.95, textAlign: 'center' }}>
            Хотите научиться <strong>созданию веб-приложений</strong>? Наша <strong>онлайн школа вайб кодинга</strong> проведет вас через весь путь — от идеи до запуска готового проекта. <strong>Обучение Cursor AI</strong> и <strong>Bolt.ai</strong> объясняется простым языком, делая <strong>курсы vibe coding</strong> доступными для каждого.
          </p>

          <h3 style={{
            fontSize: '22px',
            marginTop: '30px',
            marginBottom: '15px',
            color: 'var(--neon-green)',
            textAlign: 'center'
          }}>
            На занятиях вы научитесь:
          </h3>
          <ul style={{
            fontSize: '18px',
            lineHeight: '2',
            paddingLeft: '25px',
            opacity: 0.95,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <li>Работать с Cursor AI для профессиональной разработки</li>
            <li>Создавать веб-приложения с помощью Bolt.ai</li>
            <li>Превращать идеи в работающие онлайн-проекты</li>
            <li>Размещать проекты на хостинге и настраивать домены</li>
            <li>Составлять эффективные промпты для AI-инструментов</li>
            <li>Использовать вайб-кодинг для ускорения разработки</li>
            <li>Применять базовые SEO-техники для привлечения трафика</li>
          </ul>
        </div>

        <h2 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          textAlign: 'center',
          marginBottom: '50px',
          color: 'var(--neon-cyan)'
        }}>
          Присоединяйтесь к лучшей онлайн школе вайб-кодинга!
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
              Свяжитесь с нами, чтобы записаться на <strong>обучение Cursor AI</strong> и <strong>Bolt.ai</strong> и узнать расписание онлайн-занятий
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
        </div>
      </section>

      <StudentWorksSection />

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="cyber-card" style={{ padding: '40px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 36px)',
            marginBottom: '30px',
            color: 'var(--neon-cyan)',
            textAlign: 'center'
          }}>
            Онлайн школа программирования вайб кодинга — Vibecoding
          </h2>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.9',
            opacity: 0.85
          }}>
            <p style={{ marginBottom: '20px' }}>
              <strong>Vibecoding</strong> — это <strong>лучшая онлайн школа вайб-кодинга</strong>, где вы освоите <strong>создание веб-приложений</strong> с помощью искусственного интеллекта. Наши <strong>курсы vibe coding</strong> включают <strong>обучение Cursor AI</strong> и <strong>Bolt.ai</strong> — ведущим инструментам AI-разработки. Программа подходит как для подростков от 16 лет, так и для взрослых, желающих освоить востребованную профессию.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Школа программирования вайб кодинга</strong> Vibecoding не требует предварительной подготовки. Все объясняется простым языком, а искусственный интеллект становится вашим помощником в написании кода. <strong>Обучение вайб кодингу</strong> проходит онлайн — вы можете учиться из любой точки мира.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>Курсы Cursor AI</strong> и <strong>Bolt.ai</strong> включают практические проекты для портфолио. Вы научитесь <strong>созданию веб-приложений</strong>, размещению проектов в интернете, настройке доменов и применению SEO-техник. Это полноценное <strong>обучение программированию с AI</strong> для современного рынка труда.
            </p>
            <p>
              Записывайтесь на <strong>онлайн курсы vibe coding</strong> уже сегодня и станьте частью сообщества AI-разработчиков с Vibecoding!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
