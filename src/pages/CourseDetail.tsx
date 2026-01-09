import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';
import ApplicationModal from '../components/ApplicationModal';
import HeroButton from '../components/HeroButton';

interface ModuleData {
  id: string;
  title: string;
  description?: string;
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
    subtitle: 'Полноценный курс по созданию веб-приложений с ИИ-ассистентом в браузере. От простого лендинга до SaaS-платформы с базой данных, авторизацией и приемом платежей.',
    badge: 'ВАЙБКОДИНГ С ИИ'
  },
  whatIs: {
    title: 'Bolt.new - ваша AI-среда разработки',
    description: 'Bolt.new - это полнофункциональная среда разработки в браузере на базе Claude AI от Anthropic. Платформа объединяет редактор кода WebContainers, превью в реальном времени, встроенный терминал и интеграцию с Supabase для работы с базами данных. Вы пишете промпты на русском языке, а ИИ генерирует готовый код на React, TypeScript, Tailwind CSS, подключает базу данных и публикует проект в интернет - все в одном окне браузера без локальной установки.',
    features: [
      { icon: '>', title: 'WebContainers', desc: 'Полноценная Node.js среда прямо в браузере - npm install, vite, typescript работают мгновенно' },
      { icon: '#', title: 'Claude AI Sonnet 3.5', desc: 'Самая продвинутая модель для программирования понимает контекст всего проекта' },
      { icon: '@', title: 'Supabase интеграция', desc: 'База данных PostgreSQL, авторизация, хранилище файлов подключаются в один клик' },
      { icon: '$', title: 'Netlify Deploy', desc: 'Публикация готового проекта на свой домен за 30 секунд' }
    ]
  },
  problemSolution: {
    title: 'Какую проблему решает курс',
    problem: {
      title: 'Без курса',
      points: [
        'Месяцы на изучение HTML, CSS, JavaScript с нуля',
        'Годы до уровня full-stack разработчика',
        'Сложная настройка окружения: Node.js, Git, IDE, базы данных',
        'Высокий порог входа отсеивает 90% начинающих',
        'Идеи остаются идеями - нет ресурсов на реализацию'
      ]
    },
    solution: {
      title: 'С Bolt.new',
      points: [
        'Первый работающий проект через 2 часа после старта',
        'Full-stack приложения за дни вместо месяцев',
        'Нулевая настройка - открыл браузер и пишешь код',
        'AI-ассистент объясняет каждый шаг и исправляет ошибки',
        'От идеи до работающего продукта за выходные'
      ]
    }
  },
  skills: [
    'Генерировать полноценные веб-приложения через промпты на русском языке',
    'Создавать React-компоненты с TypeScript и Tailwind CSS без ручного кода',
    'Проектировать структуру базы данных PostgreSQL через Supabase',
    'Настраивать авторизацию пользователей: email/пароль, Google OAuth',
    'Реализовывать Row Level Security для защиты данных пользователей',
    'Подключать Stripe для приема платежей картами и подписок',
    'Загружать и хранить изображения, документы в Supabase Storage',
    'Публиковать проекты на Netlify с SSL и собственным доменом',
    'Отлаживать код через встроенный терминал и консоль браузера',
    'Итерировать проект через диалог с AI: уточнять, дорабатывать, оптимизировать',
    'Создавать админ-панели для управления контентом сайта',
    'Интегрировать сторонние API: карты, погода, аналитика, email-рассылки'
  ],
  audience: [
    { icon: '>', title: 'Предприниматели и стартаперы', desc: 'Проверяйте бизнес-гипотезы за выходные. Создавайте MVP без найма разработчиков. Экономьте от $5000 на каждом прототипе.' },
    { icon: '#', title: 'Маркетологи и продакт-менеджеры', desc: 'Собирайте лендинги под рекламные кампании самостоятельно. A/B тесты, формы захвата, аналитика - все сами за вечер.' },
    { icon: '@', title: 'Дизайнеры и UX-специалисты', desc: 'Превращайте макеты Figma в работающие интерактивные прототипы. Показывайте клиентам живой продукт, а не картинки.' },
    { icon: '$', title: 'Начинающие разработчики', desc: 'Изучайте программирование на практике. AI объясняет каждую строчку кода. Собирайте портфолио реальных проектов.' },
    { icon: '%', title: 'Фрилансеры и агентства', desc: 'Выполняйте типовые заказы в 5-10 раз быстрее. Берите больше проектов, зарабатывайте больше при меньших усилиях.' },
    { icon: '^', title: 'No-code специалисты', desc: 'Переходите на следующий уровень. Bolt.new дает гибкость кода без необходимости его писать вручную.' }
  ],
  program: [
    {
      module: 'Модуль 0. Введение в BOLT.AI',
      description: 'Создать первый проект за 10 минут и понять возможности платформы',
      lessons: [
        { title: 'Первое приложение за 10 минут', duration: '15 мин' },
        { title: 'Вводная лекция', duration: '20 мин' },
        { title: 'Что такое BOLT.AI', duration: '25 мин' },
        { title: 'Регистрация и тарифы', duration: '15 мин' },
        { title: 'OpenRouter — экономия на AI', duration: '20 мин' },
        { title: 'Интерфейс платформы', duration: '25 мин' },
        { title: 'Что можно создавать', duration: '20 мин' }
      ]
    },
    {
      module: 'Модуль 1. Мастерство промптов',
      description: 'Научиться формулировать запросы для получения идеального результата',
      lessons: [
        { title: 'Структура эффективного промпта', duration: '30 мин' },
        { title: 'Enhance Prompt — автоулучшение промпта', duration: '20 мин' },
        { title: 'Описание структуры сайта', duration: '25 мин' },
        { title: 'Описание визуального стиля', duration: '25 мин' },
        { title: 'Описание функциональности', duration: '25 мин' },
        { title: 'Итеративная доработка', duration: '30 мин' },
        { title: 'Работа с ошибками', duration: '25 мин' },
        { title: 'Промпты для копирования стиля', duration: '20 мин' },
        { title: 'Проектирование архитектуры с AI', duration: '35 мин' },
        { title: 'Mind Map и структура проекта', duration: '25 мин' }
      ]
    },
    {
      module: 'Модуль 2. Создание лендингов',
      description: 'Создавать продающие одностраничники разных типов',
      lessons: [
        { title: 'Сайт-визитка', duration: '40 мин' },
        { title: 'Продающий лендинг', duration: '50 мин' },
        { title: 'Лендинг для услуг', duration: '45 мин' },
        { title: 'Лендинг для мероприятия', duration: '40 мин' },
        { title: 'Мультилендинг', duration: '35 мин' }
      ]
    },
    {
      module: 'Модуль 3. Многостраничные сайты',
      description: 'Создавать сайты с несколькими связанными страницами',
      lessons: [
        { title: 'Структура многостраничника', duration: '35 мин' },
        { title: 'Навигация между страницами', duration: '30 мин' },
        { title: 'Страница «О компании»', duration: '35 мин' },
        { title: 'Страница услуг/каталога', duration: '40 мин' },
        { title: 'Страница контактов', duration: '30 мин' }
      ]
    },
    {
      module: 'Модуль 4. Адаптивный дизайн',
      description: 'Создавать сайты которые отлично выглядят на любых устройствах',
      lessons: [
        { title: 'Принципы адаптивности', duration: '25 мин' },
        { title: 'Мобильная навигация', duration: '30 мин' },
        { title: 'Адаптивные сетки', duration: '30 мин' },
        { title: 'Адаптивная типографика', duration: '25 мин' },
        { title: 'Тестирование адаптивности', duration: '20 мин' }
      ]
    },
    {
      module: 'Модуль 5. Публикация и деплой',
      description: 'Выкладывать проекты в интернет с собственным адресом',
      lessons: [
        { title: 'Способы публикации', duration: '20 мин' },
        { title: 'Автодеплой через BOLT', duration: '25 мин' },
        { title: 'Экспорт проекта', duration: '20 мин' },
        { title: 'Публикация на поддомене школы', duration: '30 мин' },
        { title: 'Подключение домена', duration: '35 мин' },
        { title: 'Vercel как альтернатива', duration: '25 мин' }
      ]
    },
    {
      module: 'Модуль 6. База данных Supabase',
      description: 'Хранить и получать данные для динамических сайтов',
      lessons: [
        { title: 'Зачем база данных', duration: '20 мин' },
        { title: 'Создание проекта Supabase', duration: '25 мин' },
        { title: 'Создание таблиц', duration: '35 мин' },
        { title: 'Подключение к BOLT', duration: '30 мин' },
        { title: 'Вывод данных', duration: '40 мин' },
        { title: 'Добавление данных', duration: '35 мин' },
        { title: 'Редактирование и удаление', duration: '35 мин' }
      ]
    },
    {
      module: 'Модуль 7. Авторизация пользователей',
      description: 'Добавлять регистрацию, вход и личные кабинеты',
      lessons: [
        { title: 'Supabase Auth', duration: '25 мин' },
        { title: 'Форма регистрации', duration: '35 мин' },
        { title: 'Форма входа', duration: '30 мин' },
        { title: 'Вход через Google', duration: '40 мин' },
        { title: 'Защита страниц', duration: '30 мин' },
        { title: 'Личный кабинет', duration: '45 мин' },
        { title: 'Clerk — альтернатива Supabase Auth', duration: '30 мин' }
      ]
    },
    {
      module: 'Модуль 8. Основы API и интеграций',
      description: 'Понять как сервисы общаются между собой',
      lessons: [
        { title: 'Что такое API', duration: '25 мин' },
        { title: 'HTTP-методы', duration: '20 мин' },
        { title: 'JSON — формат данных', duration: '20 мин' },
        { title: 'Вебхуки — обратные вызовы', duration: '25 мин' },
        { title: 'Безопасность вебхуков', duration: '25 мин' },
        { title: 'Отладка API и вебхуков', duration: '30 мин' }
      ]
    },
    {
      module: 'Модуль 9. Email-уведомления Resend',
      description: 'Отправлять красивые письма клиентам',
      lessons: [
        { title: 'Обзор Resend', duration: '20 мин' },
        { title: 'Получение API-ключа', duration: '15 мин' },
        { title: 'Подключение домена', duration: '30 мин' },
        { title: 'Отправка писем из BOLT', duration: '35 мин' },
        { title: 'HTML-шаблоны писем', duration: '40 мин' },
        { title: 'Автоматические письма', duration: '35 мин' }
      ]
    },
    {
      module: 'Модуль 10. Telegram-уведомления',
      description: 'Получать мгновенные уведомления о заявках и заказах',
      lessons: [
        { title: 'Создание бота', duration: '20 мин' },
        { title: 'Получение chat_id', duration: '15 мин' },
        { title: 'Отправка уведомлений', duration: '30 мин' },
        { title: 'Форматирование сообщений', duration: '25 мин' },
        { title: 'Уведомления о заказах', duration: '30 мин' }
      ]
    },
    {
      module: 'Модуль 11. Платёжные системы',
      description: 'Принимать онлайн-оплату картами и через ЕРИП',
      lessons: [
        { title: 'Обзор платёжных систем', duration: '25 мин' },
        { title: 'Подключение WebPay', duration: '35 мин' },
        { title: 'Интеграция оплаты', duration: '45 мин' },
        { title: 'Обработка webhook оплаты', duration: '40 мин' },
        { title: 'Оплата через ЕРИП', duration: '30 мин' },
        { title: 'Stripe для международных', duration: '35 мин' },
        { title: 'Подписки и регулярные платежи', duration: '45 мин' }
      ]
    },
    {
      module: 'Модуль 12. Готовые проекты',
      description: 'Собрать всё вместе в коммерческие проекты',
      lessons: [
        { title: 'Интернет-магазин: структура', duration: '40 мин' },
        { title: 'Интернет-магазин: корзина', duration: '50 мин' },
        { title: 'Интернет-магазин: оформление заказа', duration: '45 мин' },
        { title: 'Сервис записи: структура', duration: '40 мин' },
        { title: 'Сервис записи: календарь', duration: '50 мин' },
        { title: 'Сервис записи: уведомления', duration: '35 мин' },
        { title: 'Админ-панель для бизнеса', duration: '60 мин' }
      ]
    },
    {
      module: 'Модуль 13. Безопасность',
      description: 'Защитить сайт и данные пользователей',
      lessons: [
        { title: 'Основы веб-безопасности', duration: '25 мин' },
        { title: 'HTTPS и SSL-сертификаты', duration: '20 мин' },
        { title: 'Защита форм: reCAPTCHA', duration: '30 мин' },
        { title: 'Защита форм: Honeypot', duration: '20 мин' },
        { title: 'Cloudflare: защита от DDoS', duration: '30 мин' },
        { title: 'Безопасность Supabase', duration: '35 мин' },
        { title: 'Валидация данных', duration: '30 мин' },
        { title: 'Чек-лист безопасности', duration: '20 мин' }
      ]
    },
    {
      module: 'Модуль 14. Монетизация',
      description: 'Начать зарабатывать на своих навыках',
      lessons: [
        { title: 'Где искать клиентов', duration: '30 мин' },
        { title: 'Ценообразование', duration: '25 мин' },
        { title: 'Работа с клиентом', duration: '35 мин' },
        { title: 'Портфолио', duration: '30 мин' },
        { title: 'Дополнительные услуги', duration: '25 мин' },
        { title: 'Масштабирование', duration: '30 мин' }
      ]
    }
  ],
  results: [
    { icon: '>', text: 'Создадите 5+ полноценных проектов для портфолио: от лендинга до SaaS' },
    { icon: '#', text: 'Освоите самый быстрорастущий стек: React, TypeScript, Tailwind, Supabase' },
    { icon: '@', text: 'Научитесь зарабатывать: навык создания сайтов за часы востребован на фрилансе' },
    { icon: '$', text: 'Сэкономите годы обучения: вместо 2-3 лет изучения программирования - недели практики' },
    { icon: '%', text: 'Получите работающий инструмент: запускайте свои идеи без найма разработчиков' },
    { icon: '^', text: 'Вступите в закрытое сообщество: поддержка, разборы проектов, нетворкинг' }
  ],
  courseIncludes: [
    '14 модулей видеоуроков с пожизненным доступом',
    '90+ практических уроков с заданиями',
    'Готовые промпты и шаблоны для типовых задач',
    'Исходный код всех проектов курса на GitHub',
    'Сертификат о прохождении курса',
    'Доступ в закрытый Telegram-чат выпускников',
    'Еженедельные Q&A сессии с преподавателем',
    'Персональный code review финального проекта'
  ],
  guarantee: {
    title: 'Гарантия результата',
    description: 'Если за 14 дней вы не создадите свой первый работающий проект - мы вернем 100% оплаты. Без вопросов и бюрократии.'
  },
  faq: [
    { q: 'Нужен ли опыт программирования?', a: 'Нет. Курс подходит для полных новичков. AI-ассистент объясняет каждый шаг и генерирует код за вас.' },
    { q: 'Какой компьютер нужен?', a: 'Любой с браузером Chrome/Edge. Bolt.new работает в облаке - вся нагрузка на серверах.' },
    { q: 'Сколько стоит Bolt.new?', a: 'Есть бесплатный тариф. Pro-тариф $20/месяц. На курсе научим максимально эффективно использовать лимиты.' },
    { q: 'Как долго будет доступ к курсу?', a: 'Пожизненный. Все обновления курса также будут доступны бесплатно.' },
    { q: 'Можно ли создавать коммерческие проекты?', a: 'Да. Все проекты на Bolt.new полностью ваши. Код можно скачать и разместить где угодно.' }
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

          <section style={{ padding: '100px 20px', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              right: 0,
              top: '20%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(255, 0, 110, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <span style={{ color: 'var(--neon-pink)' }}>Программа курса</span>
              </h2>

              <p style={{
                textAlign: 'center',
                fontSize: '18px',
                opacity: 0.8,
                marginBottom: '20px',
                maxWidth: '700px',
                margin: '0 auto 20px'
              }}>
                14 модулей, 90+ уроков - создание сайтов и приложений через промпты без кода
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                marginBottom: '50px',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--neon-cyan)' }}>14</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>модулей</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--neon-green)' }}>90+</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>уроков</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--neon-pink)' }}>50+</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>часов</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--neon-cyan)' }}>5</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>проектов</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(modules.length > 0 ? modules : content.program.map((p, i) => ({
                  id: `static-${i}`,
                  title: p.module,
                  description: p.description,
                  lessons: p.lessons.map((l, li) => ({
                    id: `l-${li}`,
                    title: typeof l === 'string' ? l : l.title,
                    duration: typeof l === 'string' ? '' : l.duration
                  }))
                }))).map((mod, idx) => (
                  <div key={mod.id} style={{
                    background: expandedModule === mod.id
                      ? 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 255, 249, 0.05) 100%)'
                      : 'rgba(255, 0, 110, 0.03)',
                    border: expandedModule === mod.id
                      ? '1px solid rgba(255, 0, 110, 0.4)'
                      : '1px solid rgba(255, 0, 110, 0.15)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <button
                      onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                      style={{
                        width: '100%',
                        padding: '24px 28px',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '20px',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flex: 1 }}>
                        <span style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: expandedModule === mod.id
                            ? 'linear-gradient(135deg, var(--neon-pink), var(--neon-cyan))'
                            : 'rgba(255, 0, 110, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: expandedModule === mod.id ? '#0a0a0f' : 'var(--neon-pink)',
                          fontWeight: 800,
                          fontSize: '18px',
                          flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}>
                          {idx + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            marginBottom: mod.description ? '6px' : 0,
                            color: expandedModule === mod.id ? 'white' : 'rgba(255, 255, 255, 0.95)'
                          }}>
                            {mod.title}
                          </div>
                          {mod.description && (
                            <div style={{
                              fontSize: '14px',
                              opacity: 0.6,
                              lineHeight: 1.4
                            }}>
                              {mod.description}
                            </div>
                          )}
                        </div>
                        <div style={{
                          padding: '6px 14px',
                          background: 'rgba(255, 0, 110, 0.1)',
                          borderRadius: '20px',
                          fontSize: '13px',
                          color: 'var(--neon-pink)',
                          fontWeight: 500,
                          whiteSpace: 'nowrap'
                        }}>
                          {mod.lessons.length} уроков
                        </div>
                      </div>
                      <span style={{
                        transform: expandedModule === mod.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        color: 'var(--neon-pink)',
                        fontSize: '18px',
                        marginTop: '14px'
                      }}>▼</span>
                    </button>

                    {expandedModule === mod.id && (
                      <div style={{
                        padding: '0 28px 24px',
                        borderTop: '1px solid rgba(255, 0, 110, 0.1)'
                      }}>
                        <div style={{ paddingTop: '16px' }}>
                          {mod.lessons.map((lesson, li) => (
                            <div key={lesson.id} style={{
                              padding: '14px 16px',
                              marginBottom: li < mod.lessons.length - 1 ? '8px' : 0,
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              border: '1px solid rgba(255, 255, 255, 0.03)'
                            }}>
                              <span style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'rgba(255, 0, 110, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--neon-pink)',
                                fontSize: '12px',
                                fontWeight: 600,
                                flexShrink: 0
                              }}>{li + 1}</span>
                              <span style={{
                                flex: 1,
                                fontSize: '15px',
                                opacity: 0.9,
                                lineHeight: 1.4
                              }}>{lesson.title}</span>
                              {lesson.duration && (
                                <span style={{
                                  fontSize: '13px',
                                  opacity: 0.5,
                                  background: 'rgba(0, 255, 249, 0.1)',
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  color: 'var(--neon-cyan)',
                                  whiteSpace: 'nowrap'
                                }}>{lesson.duration}</span>
                              )}
                            </div>
                          ))}
                        </div>
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
                    <span style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(57, 255, 20, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--neon-green)',
                      fontSize: '24px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      flexShrink: 0
                    }}>{r.icon}</span>
                    <span style={{ fontSize: '17px', lineHeight: 1.5 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '60px'
              }}>
                <span style={{ color: 'var(--neon-cyan)' }}>{content.problemSolution.title}</span>
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '40px'
              }}>
                <div style={{
                  padding: '40px',
                  background: 'rgba(255, 60, 60, 0.05)',
                  border: '1px solid rgba(255, 60, 60, 0.3)',
                  borderRadius: '20px'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    color: '#ff6b6b',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 60, 60, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>X</span>
                    {content.problemSolution.problem.title}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {content.problemSolution.problem.points.map((point, i) => (
                      <li key={i} style={{
                        padding: '12px 0',
                        borderBottom: i < content.problemSolution.problem.points.length - 1 ? '1px solid rgba(255, 60, 60, 0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        opacity: 0.9
                      }}>
                        <span style={{ color: '#ff6b6b', fontWeight: 600, flexShrink: 0 }}>-</span>
                        <span style={{ lineHeight: 1.6 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  padding: '40px',
                  background: 'rgba(57, 255, 20, 0.05)',
                  border: '1px solid rgba(57, 255, 20, 0.3)',
                  borderRadius: '20px'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    color: 'var(--neon-green)',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(57, 255, 20, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700
                    }}>V</span>
                    {content.problemSolution.solution.title}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {content.problemSolution.solution.points.map((point, i) => (
                      <li key={i} style={{
                        padding: '12px 0',
                        borderBottom: i < content.problemSolution.solution.points.length - 1 ? '1px solid rgba(57, 255, 20, 0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}>
                        <span style={{ color: 'var(--neon-green)', fontWeight: 600, flexShrink: 0 }}>+</span>
                        <span style={{ lineHeight: 1.6 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px', background: 'rgba(19, 19, 26, 0.5)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '20px',
                color: 'var(--neon-cyan)'
              }}>
                Что входит в курс
              </h2>
              <p style={{
                textAlign: 'center',
                fontSize: '18px',
                opacity: 0.7,
                marginBottom: '50px'
              }}>
                Все необходимое для освоения Bolt.new с нуля до профессионала
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {content.courseIncludes.map((item, i) => (
                  <div key={i} style={{
                    padding: '24px 28px',
                    background: 'rgba(0, 255, 249, 0.05)',
                    border: '1px solid rgba(0, 255, 249, 0.15)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                    e.currentTarget.style.background = 'rgba(0, 255, 249, 0.1)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 249, 0.15)';
                    e.currentTarget.style.background = 'rgba(0, 255, 249, 0.05)';
                  }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'rgba(0, 255, 249, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--neon-cyan)',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>+</span>
                    <span style={{ fontSize: '15px', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                padding: '50px',
                background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(0, 255, 249, 0.08) 100%)',
                border: '2px solid var(--neon-green)',
                borderRadius: '24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(57, 255, 20, 0.2) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
                <h3 style={{
                  fontSize: '32px',
                  color: 'var(--neon-green)',
                  marginBottom: '20px'
                }}>
                  {content.guarantee.title}
                </h3>
                <p style={{
                  fontSize: '18px',
                  lineHeight: 1.7,
                  opacity: 0.9,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  {content.guarantee.description}
                </p>
              </div>
            </div>
          </section>

          <section style={{ padding: '100px 20px', background: 'rgba(19, 19, 26, 0.5)' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
                marginBottom: '60px',
                color: 'var(--neon-pink)'
              }}>
                Частые вопросы
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {content.faq.map((item, i) => (
                  <div key={i} style={{
                    padding: '28px 32px',
                    background: 'rgba(255, 0, 110, 0.03)',
                    border: '1px solid rgba(255, 0, 110, 0.15)',
                    borderRadius: '16px'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--neon-pink)',
                      marginBottom: '12px'
                    }}>
                      {item.q}
                    </h4>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: 1.7,
                      opacity: 0.85,
                      margin: 0
                    }}>
                      {item.a}
                    </p>
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
