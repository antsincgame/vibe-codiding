import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { stripMarkdown } from '../lib/markdown';
import type { Course, HomePageSettings, VideoTestimonial } from '../types';
import CourseProgram from '../components/CourseProgram';

const defaultSettings: HomePageSettings = {
  title: 'VIBECODING',
  subtitle: 'Vibecoding - лучшая школа программирования с помощью ИИ (вайбкодинг)',
  description: 'Забудьте о сложных языках программирования! В Vibecoding мы научим вас создавать настоящие сайты, веб-сервисы и приложения, используя революционный подход — вайбкодинг с Cursor AI и Bolt.ai.',
  meta_title: 'Вайбкодинг с нуля 2025 | Школа Vibecoding - Cursor AI и Bolt.new',
  meta_description: 'Вайбкодинг - создавай сайты и приложения с ИИ за 2 месяца! Школа Vibecoding: курсы Cursor AI и Bolt.new для начинающих. Практика с первого дня, 7+ проектов в портфолио. Онлайн обучение от 16 лет.',
  meta_keywords: 'вайбкодинг, вайбкодинг обучение, вайбкодинг курсы, Cursor AI, Bolt.new, создание сайтов с ИИ, программирование с нейросетью, vibecoding, школа вайбкодинга',
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<HomePageSettings>(defaultSettings);
  const [expandedCourseProgram, setExpandedCourseProgram] = useState<string | null>(null);
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    document.title = settings.meta_title || 'Vibecoding - Курсы вайб-кодинга с Cursor AI и Bolt.new';

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
    await loadVideoTestimonials();
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
      .order('order_index', { ascending: true });

    if (data) {
      setCourses(data);
    }
  };

  const loadVideoTestimonials = async () => {
    const { data } = await supabase
      .from('video_testimonials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(3);

    if (data) {
      setVideoTestimonials(data);
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          marginBottom: '40px',
          alignItems: 'stretch',
          paddingTop: '20px'
        }} className="courses-grid">
          {courses.map((course, index) => {
            const isMiddle = index === 1;
            const courseDescriptions: Record<string, string> = {
              'vibecoding-bolt-new': 'Создайте реальный веб-проект с нуля, даже если никогда не программировали. Курс для абсолютных новичков, которые хотят освоить современные инструменты разработки.',
              'curdor-ai': 'Ускорьте разработку с помощью ИИ-ассистента. Для тех, кто готов выйти на новый уровень и создавать продукты профессионального качества.',
              'architect-vibecode': 'Станьте полноценным вайб-разработчиком! Комплексный курс, объединяющий Bolt.new и Cursor AI для создания приложений от идеи до продакшена.'
            };

            return (
              <div
                key={course.id}
                className="cyber-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transform: isMiddle ? 'scale(1.02)' : 'none',
                  border: isMiddle ? '2px solid var(--neon-cyan)' : '1px solid rgba(0, 255, 249, 0.3)',
                  boxShadow: isMiddle ? '0 0 30px rgba(0, 255, 249, 0.3), inset 0 0 20px rgba(0, 255, 249, 0.05)' : 'none',
                  position: 'relative',
                  zIndex: isMiddle ? 2 : 1
                }}
              >
                {isMiddle && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--neon-cyan)',
                    color: '#000',
                    padding: '4px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderRadius: '4px'
                  }}>
                    Полный курс
                  </div>
                )}
                <div style={{
                  height: '180px',
                  background: course.image_url ? 'transparent' : '#0a0a0f',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 255, 249, 0.2)'
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
                    <div style={{
                      fontSize: '42px',
                      fontWeight: 900,
                      fontFamily: 'Orbitron, sans-serif',
                      color: isMiddle ? 'var(--neon-cyan)' : '#fff',
                      textShadow: isMiddle ? '0 0 20px var(--neon-cyan)' : 'none'
                    }}>
                      {course.slug === 'vibecoding-bolt-new' ? 'bolt.new' :
                       course.slug === 'curdor-ai' ? 'CURSOR' :
                       'ARCHITECT'}
                    </div>
                  )}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  marginBottom: '15px',
                  color: isMiddle ? 'var(--neon-cyan)' : 'var(--neon-cyan)',
                  lineHeight: '1.3'
                }}>
                  {course.title}
                </h3>
                <p style={{
                  opacity: 0.9,
                  marginBottom: '20px',
                  lineHeight: '1.7',
                  flex: 1,
                  fontSize: '14px'
                }}>
                  {courseDescriptions[course.slug || ''] || stripMarkdown(course.description.split('---')[0]).substring(0, 150)}
                  {' '}
                  <Link to={`/course/${course.slug}`} style={{ color: 'var(--neon-cyan)', textDecoration: 'underline' }}>
                    Узнать больше про вайбкодинг сайтов и приложений
                  </Link>
                </p>
                {Array.isArray(course.features) && course.features.length > 0 && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '15px',
                    background: 'rgba(0, 255, 249, 0.05)',
                    border: '1px solid rgba(0, 255, 249, 0.2)',
                    borderRadius: '6px'
                  }}>
                    <h4 style={{
                      fontSize: '12px',
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
                      gap: '8px'
                    }}>
                      {(course.features as string[]).slice(0, 5).map((feature, idx) => (
                        <div key={idx} style={{
                          fontSize: '12px',
                          padding: '6px 10px',
                          background: 'rgba(0, 255, 249, 0.08)',
                          border: '1px solid rgba(0, 255, 249, 0.15)',
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
                  marginBottom: '15px',
                  padding: '12px 0',
                  borderTop: '1px solid rgba(0, 255, 249, 0.2)',
                  borderBottom: '1px solid rgba(0, 255, 249, 0.2)'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Возраст</div>
                    <div style={{ color: 'var(--neon-green)', fontSize: '14px' }}>{course.age_group}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>Длительность</div>
                    <div style={{ color: 'var(--neon-green)', fontSize: '14px' }}>{course.duration}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--neon-pink)',
                  marginBottom: '15px'
                }}>
                  {course.price}
                </div>
                <CourseProgram
                  isExpanded={expandedCourseProgram === course.id}
                  onToggle={() => setExpandedCourseProgram(
                    expandedCourseProgram === course.id ? null : course.id
                  )}
                  courseSlug={course.slug || ''}
                  courseId={course.id}
                />
              </div>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .courses-grid {
              grid-template-columns: 1fr !important;
            }
            .courses-grid > div {
              transform: none !important;
            }
          }
        `}</style>

        <div style={{
          marginTop: '80px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            marginBottom: '15px',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: 'var(--neon-cyan)'
          }}>
            Тарифы обучения
          </h2>
          <p style={{
            fontSize: '16px',
            opacity: 0.7,
            marginBottom: '50px'
          }}>
            Присоединяйтесь сейчас и будьте в числе первых кто получит преимущество в разработке с ИИ.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '25px',
            maxWidth: '1100px',
            margin: '0 auto'
          }} className="pricing-grid">
            <div style={{
              background: 'rgba(19, 19, 26, 0.9)',
              border: '1px solid rgba(0, 255, 249, 0.2)',
              borderRadius: '8px',
              padding: '35px 25px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '18px',
                marginBottom: '20px',
                color: '#fff',
                fontWeight: 600
              }}>
                Отдельный курс
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontSize: '14px',
                  textDecoration: 'line-through',
                  opacity: 0.5,
                  marginRight: '10px'
                }}>
                  2000 BYN
                </span>
                <span style={{
                  background: 'var(--neon-green)',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  -50%
                </span>
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '15px',
                color: '#fff'
              }}>
                1000 BYN
              </div>
              <p style={{
                fontSize: '14px',
                opacity: 0.7,
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                Полный доступ к курсу по освоению ИИ-инструментов в разработке
              </p>
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '15px',
                  color: 'var(--neon-cyan)'
                }}>
                  Что включено:
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    'Пожизненный доступ к материалам курса',
                    'Bolt.new ИЛИ Cursor AI на выбор',
                    'Практические проекты в портфолио',
                    'Поддержка в общем чате'
                  ].map((item, idx) => (
                    <li key={idx} style={{
                      fontSize: '13px',
                      marginBottom: '10px',
                      paddingLeft: '20px',
                      position: 'relative',
                      opacity: 0.85,
                      lineHeight: '1.5'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--neon-cyan)'
                      }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}>
                  Оплатить
                </button>
              </a>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(0, 255, 65, 0.05))',
              border: '2px solid var(--neon-cyan)',
              borderRadius: '8px',
              padding: '35px 25px',
              textAlign: 'left',
              position: 'relative',
              boxShadow: '0 0 40px rgba(0, 255, 249, 0.2)'
            }}>
              <h3 style={{
                fontSize: '18px',
                marginBottom: '8px',
                color: '#fff',
                fontWeight: 600
              }}>
                Курс и подписка на Vibecoding
              </h3>
              <div style={{
                fontSize: '13px',
                color: 'var(--neon-cyan)',
                marginBottom: '20px'
              }}>
                комьюнити
              </div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  fontSize: '14px',
                  textDecoration: 'line-through',
                  opacity: 0.5,
                  marginRight: '10px'
                }}>
                  3600 BYN
                </span>
                <span style={{
                  background: 'var(--neon-cyan)',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  -50%
                </span>
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '15px',
                color: 'var(--neon-cyan)'
              }}>
                1800 BYN
              </div>
              <p style={{
                fontSize: '14px',
                opacity: 0.7,
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                Полный курс + годовое членство в сообществе Vibecoding
              </p>
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '15px',
                  color: 'var(--neon-cyan)'
                }}>
                  Что включено:
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    'Bolt.new + Cursor AI (оба курса)',
                    'Доступ в закрытый телеграм-чат студентов',
                    'Бесплатный доступ ко всем будущим курсам и обновлениям в течение 12 месяцев',
                    'Лучшие студенты получат доступ к лидам для платной разработки'
                  ].map((item, idx) => (
                    <li key={idx} style={{
                      fontSize: '13px',
                      marginBottom: '10px',
                      paddingLeft: '20px',
                      position: 'relative',
                      opacity: 0.85,
                      lineHeight: '1.5'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--neon-cyan)'
                      }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <button className="cyber-button" style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  Начать обучение
                </button>
              </a>
            </div>

            <div style={{
              background: 'rgba(19, 19, 26, 0.9)',
              border: '1px solid rgba(0, 255, 249, 0.2)',
              borderRadius: '8px',
              padding: '35px 25px',
              textAlign: 'left',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'var(--neon-pink)',
                color: '#000',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Premium
              </span>
              <h3 style={{
                fontSize: '18px',
                marginBottom: '20px',
                color: '#fff',
                fontWeight: 600
              }}>
                Персональные консультации
              </h3>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '15px',
                color: '#fff'
              }}>
                3500 BYN
              </div>
              <p style={{
                fontSize: '14px',
                opacity: 0.7,
                marginBottom: '25px',
                lineHeight: '1.6'
              }}>
                Полный курс + комьюнити + персональное сопровождение с автором курса в течение 6 месяцев.
              </p>
              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '15px',
                  color: 'var(--neon-cyan)'
                }}>
                  Что включено:
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    'Все из тарифа "Комьюнити"',
                    'Ежемесячные часовые 1-1 созвоны с автором курса',
                    'Индивидуальный план по достижению ваших ИИ-целей',
                    'Персональная поддержка в Telegram',
                    'Приоритетный доступ к лидам на разработку'
                  ].map((item, idx) => (
                    <li key={idx} style={{
                      fontSize: '13px',
                      marginBottom: '10px',
                      paddingLeft: '20px',
                      position: 'relative',
                      opacity: 0.85,
                      lineHeight: '1.5'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--neon-cyan)'
                      }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}>
                  Получить доступ
                </button>
              </a>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .pricing-grid {
                grid-template-columns: 1fr !important;
                max-width: 400px !important;
              }
            }
          `}</style>
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

      {videoTestimonials.length > 0 && (
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
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(57, 255, 20, 0.6)',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 249, 0.5))'
          }}>
            Отзывы наших учеников
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '18px',
            opacity: 0.8,
            marginBottom: '50px',
            lineHeight: '1.6'
          }}>
            Узнайте, что говорят студенты о нашей школе вайб-кодинга
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {videoTestimonials.map((testimonial) => {
              const hasVideo = testimonial.video_url && (
                testimonial.video_url.includes('youtube.com') ||
                testimonial.video_url.includes('youtu.be') ||
                testimonial.video_url.includes('.mp4') ||
                testimonial.video_url.includes('.webm')
              );

              return (
                <div key={testimonial.id} className="cyber-card" style={{
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, rgba(0, 20, 30, 0.9), rgba(0, 40, 50, 0.8))',
                  border: '1px solid rgba(0, 255, 249, 0.3)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
                  {hasVideo ? (
                    <div style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      overflow: 'hidden',
                      background: '#000'
                    }}>
                      <iframe
                        src={testimonial.video_url}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '25px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '20px',
                        marginBottom: '20px'
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '3px solid var(--neon-cyan)',
                          boxShadow: '0 0 20px rgba(0, 255, 249, 0.4)'
                        }}>
                          <img
                            src={testimonial.thumbnail_url}
                            alt={testimonial.student_name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '20px',
                            color: 'var(--neon-cyan)',
                            fontWeight: 700,
                            marginBottom: '5px',
                            fontFamily: 'Orbitron, sans-serif'
                          }}>
                            {testimonial.student_name}
                          </h3>
                          <div style={{
                            color: 'var(--neon-green)',
                            fontSize: '14px',
                            fontWeight: 600
                          }}>
                            Выпускник Vibecoding
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '32px',
                        color: 'var(--neon-cyan)',
                        opacity: 0.3,
                        lineHeight: 1,
                        marginBottom: '10px'
                      }}>
                        "
                      </div>
                      <p style={{
                        fontSize: '15px',
                        lineHeight: '1.7',
                        opacity: 0.9,
                        color: 'var(--text-primary)',
                        marginBottom: '15px'
                      }}>
                        {testimonial.testimonial_text}
                      </p>
                      <div style={{
                        fontSize: '32px',
                        color: 'var(--neon-cyan)',
                        opacity: 0.3,
                        lineHeight: 1,
                        textAlign: 'right'
                      }}>
                        "
                      </div>
                    </div>
                  )}
                  {hasVideo && (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        color: 'var(--neon-cyan)',
                        fontWeight: 600
                      }}>
                        {testimonial.student_name}
                      </h3>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
