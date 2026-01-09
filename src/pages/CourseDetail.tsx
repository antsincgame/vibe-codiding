import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';
import ApplicationModal from '../components/ApplicationModal';
import HeroButton from '../components/HeroButton';

interface ModuleData {
  id: string;
  title: string;
  lessons: { id: string; title: string; duration: string }[];
}

const setSEO = (course: Course) => {
  const shortDesc = course.description.substring(0, 80).replace(/\n/g, ' ').trim();
  const defaultTitle = `${course.title} | Курс вайбкодинга - цена ${course.price}`;
  const defaultDescription = `Курс вайбкодинга "${course.title}": ${shortDesc}... Стоимость ${course.price}, длительность ${course.duration}. Обучение вайбкодингу онлайн с практикой. Записаться!`;
  const defaultKeywords = `${course.title} курс вайбкодинга, обучение вайбкодингу, Cursor AI курс, Bolt.new курс, вайбкодинг онлайн`;

  document.title = course.meta_title || defaultTitle;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', course.meta_description || defaultDescription);

  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) metaKeywords.setAttribute('content', course.meta_keywords || defaultKeywords);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', course.meta_title || defaultTitle);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', course.meta_description || defaultDescription);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', course.canonical_url || `https://vibecoding.by/course/${course.slug}`);

  let existingSchema = document.querySelector('script[type="application/ld+json"][data-page="course"]');
  if (existingSchema) existingSchema.remove();

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.setAttribute('data-page', 'course');
  schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.meta_description || defaultDescription,
    "provider": {
      "@type": "Organization",
      "name": "Vibecoding",
      "sameAs": "https://vibecoding.by",
      "url": "https://vibecoding.by"
    },
    "url": `https://vibecoding.by/course/${course.slug}`,
    "image": course.image_url || "https://vibecoding.by/bolt-new-logo.jpg",
    "offers": {
      "@type": "Offer",
      "price": course.price.replace(/[^0-9]/g, '') || "0",
      "priceCurrency": "BYN",
      "availability": "https://schema.org/InStock",
      "url": `https://vibecoding.by/course/${course.slug}`
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "duration": course.duration
    },
    "audience": {
      "@type": "Audience",
      "audienceType": course.age_group
    },
    "teaches": (course.features as string[]).slice(0, 5).join(", "),
    "inLanguage": "ru"
  });
  document.head.appendChild(schemaScript);
};

const boltCourseContent = {
  hero: {
    title: 'Bolt.new',
    subtitle: 'Создавай полноценные веб-приложения за минуты с помощью ИИ',
    badge: 'AI-POWERED DEVELOPMENT'
  },
  whatIs: {
    title: 'Что такое Bolt.new?',
    description: 'Bolt.new - это революционная ИИ-платформа для создания веб-приложений прямо в браузере. Вы описываете идею текстом, а ИИ генерирует полноценный код, разворачивает проект и публикует его в интернет - все за считанные минуты без установки программ.',
    features: [
      { icon: '🌐', title: 'Работа в браузере', desc: 'Не нужно устанавливать программы - все работает онлайн' },
      { icon: '⚡', title: 'Мгновенный результат', desc: 'От идеи до работающего сайта за 5-10 минут' },
      { icon: '🚀', title: 'Автодеплой', desc: 'Публикация проекта в интернет одним кликом' },
      { icon: '🔧', title: 'Полный стек', desc: 'Frontend, backend, база данных - все в одном месте' }
    ]
  },
  skills: [
    'Создавать полноценные веб-приложения с нуля используя ИИ',
    'Работать с современными фреймворками: React, Vue, Next.js',
    'Интегрировать базы данных и серверную логику',
    'Публиковать проекты в интернет за секунды',
    'Формулировать промпты для получения нужного результата',
    'Отлаживать и дорабатывать код совместно с ИИ',
    'Создавать адаптивные интерфейсы для любых устройств',
    'Добавлять авторизацию и работу с пользователями',
    'Интегрировать сторонние API и сервисы',
    'Монетизировать свои навыки и создавать проекты на заказ'
  ],
  audience: [
    { icon: '👨‍💼', title: 'Предприниматели', desc: 'Быстро проверять бизнес-идеи и создавать MVP без программистов' },
    { icon: '🎨', title: 'Дизайнеры', desc: 'Превращать макеты в работающие прототипы самостоятельно' },
    { icon: '📊', title: 'Маркетологи', desc: 'Создавать лендинги, формы и простые веб-инструменты' },
    { icon: '👶', title: 'Новички в IT', desc: 'Начать карьеру в разработке с минимальным порогом входа' },
    { icon: '💻', title: 'Разработчики', desc: 'Ускорить работу и автоматизировать рутинные задачи' },
    { icon: '🎓', title: 'Студенты', desc: 'Создавать учебные и pet-проекты для портфолио' }
  ],
  program: [
    {
      module: 'Модуль 1: Знакомство с Bolt.new',
      lessons: [
        'Что такое Bolt.new и как он работает',
        'Регистрация и настройка аккаунта',
        'Интерфейс платформы и основные функции',
        'Создание первого проекта за 5 минут'
      ]
    },
    {
      module: 'Модуль 2: Промпт-инжиниринг',
      lessons: [
        'Как правильно формулировать запросы к ИИ',
        'Структура эффективного промпта',
        'Итеративная разработка: уточнение и доработка',
        'Типичные ошибки и как их избежать'
      ]
    },
    {
      module: 'Модуль 3: Создание интерфейсов',
      lessons: [
        'Основы верстки и компонентов',
        'Работа с React и современными фреймворками',
        'Адаптивный дизайн для мобильных устройств',
        'Анимации и интерактивные элементы'
      ]
    },
    {
      module: 'Модуль 4: Работа с данными',
      lessons: [
        'Подключение баз данных (Supabase)',
        'CRUD-операции: создание, чтение, обновление, удаление',
        'Авторизация пользователей',
        'Защита данных и Row Level Security'
      ]
    },
    {
      module: 'Модуль 5: Публикация и деплой',
      lessons: [
        'Подготовка проекта к публикации',
        'Деплой на различные платформы',
        'Подключение домена',
        'Мониторинг и аналитика'
      ]
    },
    {
      module: 'Модуль 6: Практические проекты',
      lessons: [
        'Создание лендинга для бизнеса',
        'Разработка веб-приложения с авторизацией',
        'Интернет-магазин или каталог товаров',
        'Финальный проект: полноценный SaaS'
      ]
    }
  ],
  results: [
    { icon: '🎯', text: 'Создадите 5+ работающих проектов для портфолио' },
    { icon: '💼', text: 'Освоите востребованный навык на рынке' },
    { icon: '⏰', text: 'Научитесь создавать сайты в 10 раз быстрее' },
    { icon: '💰', text: 'Сможете брать заказы на фрилансе' },
    { icon: '🧠', text: 'Поймете как эффективно работать с ИИ' },
    { icon: '🚀', text: 'Запустите свой собственный проект' }
  ]
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

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
      loadModules(data.id);
    }
    setLoading(false);
  };

  const loadModules = async (courseId: string) => {
    const { data: modulesData } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (modulesData && modulesData.length > 0) {
      const moduleIds = modulesData.map(m => m.id);
      const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');

      const formatted = modulesData.map(mod => ({
        id: mod.id,
        title: mod.title,
        lessons: (lessonsData || [])
          .filter(l => l.module_id === mod.id)
          .map(l => ({ id: l.id, title: l.title, duration: l.duration }))
      }));
      setModules(formatted);
    }
  };

  const isBoltCourse = slug === 'vibecoding-bolt-new';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #13131a 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(0, 255, 249, 0.3)',
            borderTop: '3px solid var(--neon-cyan)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: 'var(--neon-cyan)', opacity: 0.8 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
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
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--neon-pink)' }}>
            Курс не найден
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.8, marginBottom: '40px' }}>
            Возможно, курс был удален или изменен
          </p>
          <Link to="/"><button className="cyber-button">Вернуться на главную</button></Link>
        </div>
      </div>
    );
  }

  const content = isBoltCourse ? boltCourseContent : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 20px 80px'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(0, 255, 249, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 0, 110, 0.05) 0%, transparent 70%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 249, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 249, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {content && (
            <div style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: 'rgba(0, 255, 249, 0.1)',
              border: '1px solid var(--neon-cyan)',
              borderRadius: '30px',
              fontSize: '12px',
              letterSpacing: '3px',
              color: 'var(--neon-cyan)',
              marginBottom: '30px',
              fontWeight: 600
            }}>
              {content.hero.badge}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 120px)',
            fontWeight: 900,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-green) 50%, var(--neon-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 80px rgba(0, 255, 249, 0.5)',
            letterSpacing: '-2px'
          }}>
            {content?.hero.title || course.title}
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 28px)',
            opacity: 0.9,
            maxWidth: '800px',
            margin: '0 auto 50px',
            lineHeight: 1.5,
            fontWeight: 300
          }}>
            {content?.hero.subtitle || course.description.substring(0, 150)}
          </p>

          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px'
          }}>
            <div style={{
              padding: '20px 40px',
              background: 'rgba(0, 255, 249, 0.1)',
              border: '2px solid var(--neon-cyan)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Длительность</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-cyan)' }}>{course.duration}</div>
            </div>
            <div style={{
              padding: '20px 40px',
              background: 'rgba(57, 255, 20, 0.1)',
              border: '2px solid var(--neon-green)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Формат</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-green)' }}>Онлайн</div>
            </div>
            <div style={{
              padding: '20px 40px',
              background: 'rgba(255, 0, 110, 0.1)',
              border: '2px solid var(--neon-pink)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Стоимость</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--neon-pink)' }}>{course.price}</div>
            </div>
          </div>

          <HeroButton onClick={() => setIsApplicationModalOpen(true)} style={{ fontSize: '18px', padding: '20px 60px' }}>
            Записаться на курс
          </HeroButton>
        </div>
      </section>

      {content && (
        <>
          <section style={{ padding: '100px 20px', background: 'rgba(19, 19, 26, 0.5)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '30px',
                color: 'var(--neon-cyan)'
              }}>
                {content.whatIs.title}
              </h2>
              <p style={{
                fontSize: '20px',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto 60px',
                lineHeight: 1.8,
                opacity: 0.9
              }}>
                {content.whatIs.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px'
              }}>
                {content.whatIs.features.map((f, i) => (
                  <div key={i} style={{
                    padding: '40px 30px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(0, 255, 249, 0.2)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 255, 249, 0.2)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 249, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>{f.icon}</div>
                    <h3 style={{ fontSize: '22px', marginBottom: '15px', color: 'var(--neon-cyan)' }}>{f.title}</h3>
                    <p style={{ opacity: 0.8, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(57, 255, 20, 0.1) 0%, transparent 70%)',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '60px'
              }}>
                <span style={{ color: 'var(--neon-green)' }}>Чему вы научитесь</span>
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {content.skills.map((skill, i) => (
                  <div key={i} style={{
                    padding: '25px 30px',
                    background: 'rgba(57, 255, 20, 0.05)',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'var(--neon-green)';
                    e.currentTarget.style.background = 'rgba(57, 255, 20, 0.1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(57, 255, 20, 0.2)';
                    e.currentTarget.style.background = 'rgba(57, 255, 20, 0.05)';
                  }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(57, 255, 20, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--neon-green)',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>✓</span>
                    <span style={{ fontSize: '16px', lineHeight: 1.5 }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px', background: 'rgba(19, 19, 26, 0.5)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '20px',
                color: 'var(--neon-cyan)'
              }}>
                Для кого этот курс
              </h2>
              <p style={{
                textAlign: 'center',
                fontSize: '18px',
                opacity: 0.8,
                marginBottom: '60px'
              }}>
                Bolt.new подходит для людей с разным опытом и целями
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '25px'
              }}>
                {content.audience.map((a, i) => (
                  <div key={i} style={{
                    padding: '35px',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(19, 19, 26, 0.8) 100%)',
                    border: '1px solid rgba(0, 255, 249, 0.15)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 249, 0.15)';
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '20px' }}>{a.icon}</div>
                    <h3 style={{ fontSize: '22px', marginBottom: '12px', color: 'var(--neon-cyan)' }}>{a.title}</h3>
                    <p style={{ opacity: 0.85, lineHeight: 1.7 }}>{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '60px'
              }}>
                <span style={{ color: 'var(--neon-pink)' }}>Программа курса</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {(modules.length > 0 ? modules : content.program.map((p, i) => ({
                  id: `static-${i}`,
                  title: p.module,
                  lessons: p.lessons.map((l, li) => ({ id: `l-${li}`, title: l, duration: '' }))
                }))).map((mod, idx) => (
                  <div key={mod.id} style={{
                    background: 'rgba(255, 0, 110, 0.05)',
                    border: '1px solid rgba(255, 0, 110, 0.2)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <button
                      onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                      style={{
                        width: '100%',
                        padding: '25px 30px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'rgba(255, 0, 110, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--neon-pink)',
                          fontWeight: 700,
                          fontSize: '18px'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>{mod.title}</span>
                      </div>
                      <span style={{
                        transform: expandedModule === mod.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        color: 'var(--neon-pink)',
                        fontSize: '20px'
                      }}>▼</span>
                    </button>

                    {expandedModule === mod.id && (
                      <div style={{
                        padding: '0 30px 25px',
                        borderTop: '1px solid rgba(255, 0, 110, 0.1)'
                      }}>
                        {mod.lessons.map((lesson, li) => (
                          <div key={lesson.id} style={{
                            padding: '15px 0',
                            borderBottom: li < mod.lessons.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <span style={{ color: 'var(--neon-pink)', opacity: 0.5 }}>•</span>
                            <span style={{ opacity: 0.9 }}>{lesson.title}</span>
                            {lesson.duration && (
                              <span style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.5 }}>{lesson.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px', background: 'rgba(19, 19, 26, 0.5)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '60px',
                color: 'var(--neon-green)'
              }}>
                Результаты после курса
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px'
              }}>
                {content.results.map((r, i) => (
                  <div key={i} style={{
                    padding: '30px',
                    background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(0, 255, 249, 0.05) 100%)',
                    border: '1px solid rgba(57, 255, 20, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <span style={{ fontSize: '36px' }}>{r.icon}</span>
                    <span style={{ fontSize: '17px', lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {!content && (
        <section style={{ padding: '100px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
              padding: '50px',
              background: 'rgba(19, 19, 26, 0.6)',
              border: '1px solid rgba(0, 255, 249, 0.2)',
              borderRadius: '16px'
            }}>
              <h2 style={{ fontSize: '32px', marginBottom: '30px', color: 'var(--neon-cyan)' }}>О курсе</h2>
              <p style={{ fontSize: '18px', lineHeight: 1.8, whiteSpace: 'pre-line', opacity: 0.9 }}>
                {course.description}
              </p>
            </div>

            {(course.features as string[]).length > 0 && (
              <div style={{ marginTop: '50px' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '30px', color: 'var(--neon-green)', textAlign: 'center' }}>
                  Чему вы научитесь
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {(course.features as string[]).map((feature, idx) => (
                    <div key={idx} style={{
                      padding: '20px 25px',
                      background: 'rgba(57, 255, 20, 0.05)',
                      border: '1px solid rgba(57, 255, 20, 0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ color: 'var(--neon-green)', fontWeight: 700 }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1) 0%, rgba(57, 255, 20, 0.05) 50%, rgba(255, 0, 110, 0.1) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 249, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 249, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            marginBottom: '25px'
          }}>
            Готовы начать обучение?
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '40px', lineHeight: 1.7 }}>
            Оставьте заявку и мы свяжемся с вами для уточнения деталей и подбора удобного времени занятий
          </p>
          <HeroButton onClick={() => setIsApplicationModalOpen(true)} style={{ fontSize: '20px', padding: '22px 70px' }}>
            Записаться на курс — {course.price}
          </HeroButton>
        </div>
      </section>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        preselectedCourse={course?.title}
      />
    </div>
  );
}
