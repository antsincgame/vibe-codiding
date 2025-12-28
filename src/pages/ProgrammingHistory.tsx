import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface EraData {
  id: string;
  year: string;
  title: string;
  image: string;
  content: string[];
  quote?: {
    text: string;
    source: string;
  };
  skeptics?: string;
  lesson: string;
}

const erasData: EraData[] = [
  {
    id: 'fortran',
    year: '1950-е',
    title: 'FORTRAN и первый большой спор "компилятор vs ручная оптимизация"',
    image: 'https://images.pexels.com/photos/5765829/pexels-photo-5765829.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Когда FORTRAN появился как высокоуровневый язык для инженерных расчетов, скептики утверждали, что "машина никогда не даст такой эффективности, как человек, пишущий числовые коды вручную". И именно поэтому в истории FORTRAN так важен не только язык, но и оптимизирующий компилятор: он должен был доказать, что абстракция может быть быстрой. IBM позже прямо фиксировала этот конфликт: FORTRAN "опроверг скептиков", уверенных, что компилируемый код неизбежно будет хуже ручного.',
    ],
    quote: {
      text: 'FORTRAN опроверг скептиков, уверенных, что компилируемый код неизбежно будет хуже ручного.',
      source: 'IBM',
    },
    lesson: '"Скорость" стала не свойством "рук программиста", а свойством стека (компилятор + профилирование + ограничения языка).',
  },
  {
    id: 'goto',
    year: '1968',
    title: '"Go To Statement Considered Harmful" и борьба за управляемую сложность',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'В конце 60-х спор был не про производительность, а про читаемость и доказуемость. Дейкстра в знаменитом письме в CACM писал, что пришел к убеждению: "...the go to statement should be abolished" (по смыслу: "goto должно быть устранено").',
      'Важно, что победителем здесь была не "красота", а масштабирование мышления: когда системы растут, способность локально рассуждать о коде становится дороже микровыгод.',
    ],
    quote: {
      text: '...the go to statement should be abolished',
      source: 'Эдсгер Дейкстра, письмо в CACM',
    },
    lesson: 'Абстракция часто возникает как ответ на рост сложности, а не как "мода".',
  },
  {
    id: 'unix',
    year: '1973',
    title: 'Unix переписывают на C — "как можно отказаться от прямого контроля?"',
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Один из самых символичных скачков — переписывание Unix с ассемблера на C. Деннис Ритчи в статье 1974 года фиксирует факт предельно прямолинейно: "during the summer of 1973, it was rewritten in C".',
      'И там же — ключевой аргумент в пользу абстракции: новая система стала "намного легче для понимания и модификации".',
      'В более позднем тексте он назовет это "водоразделом", после которого Unix принял современную форму.',
    ],
    quote: {
      text: 'During the summer of 1973, it was rewritten in C... новая система стала намного легче для понимания и модификации.',
      source: 'Деннис Ритчи, 1974',
    },
    skeptics: 'С отрывом от железа мы потеряем дисциплину.',
    lesson: 'Дисциплина сместилась — появились новые "святыни": переносимость, интерфейсы, системные вызовы, соглашения ABI.',
  },
  {
    id: 'relational',
    year: '1970-е',
    title: 'Реляционная модель и идея "пользователь не обязан знать физику хранения"',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Кодд в работе 1970 года закладывает идею, которая по тем временам звучала почти кощунственно: отделить логику данных от физического представления — и тем самым защитить пользователей от "разрушительных" изменений в реализации. IBM, пересказывая значение статьи, подчеркивает: цель — доступ к информации "без знания физического чертежа" базы.',
    ],
    quote: {
      text: 'Цель — доступ к информации без знания физического чертежа базы.',
      source: 'IBM о работе Кодда',
    },
    skeptics: 'SQL-запросы не контролируют план выполнения, значит это несерьезно.',
    lesson: 'Индустрия не отказалась от контроля — она создала оптимизатор, индексы, explain-планы, профилирование запросов. Контроль не исчез — он стал другим.',
  },
  {
    id: 'nosb',
    year: '1986',
    title: 'Фред Брукс и холодный душ "No Silver Bullet"',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Важная историческая развилка: Брукс в "No Silver Bullet" предупреждает, что нет одного магического приема, который даст десятикратный рост продуктивности "сам по себе". Его формулировка стала канонической.',
      'Почему это важно в контексте ИИ: даже когда появляется мощная абстракция, она не отменяет сущностную сложность предметной области. Она убирает часть случайной сложности (рутина, шаблоны), но не заменяет мышление о системе.',
    ],
    quote: {
      text: 'No single development... promises even one order of magnitude improvement...',
      source: 'Фред Брукс, "No Silver Bullet"',
    },
    lesson: 'Даже мощная абстракция не отменяет сущностную сложность предметной области. Она убирает случайную сложность, но не заменяет мышление о системе.',
  },
  {
    id: 'gc',
    year: '1990-е',
    title: 'Управляемая память и "как можно доверить GC то, что должен контролировать инженер?"',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Java закрепляет идею, что безопасность и продуктивность важнее "ручного delete". В спецификации языка это сказано прямо: Java включает "automatic storage management... to avoid the safety problems of explicit deallocation".',
      'Скептики, конечно, были не без оснований: GC добавляет паузы, меняет профиль производительности, усложняет диагностику. Но индустрия ответила тем же паттерном, что и раньше: метрики, тюнинг, инструменты, и даже отдельные руководства по GC от Oracle.',
    ],
    quote: {
      text: 'Java включает automatic storage management... to avoid the safety problems of explicit deallocation.',
      source: 'Спецификация Java',
    },
    lesson: 'Индустрия ответила тем же паттерном: метрики, тюнинг, инструменты, и даже отдельные руководства по GC.',
  },
  {
    id: 'cloud',
    year: '1999-2006',
    title: 'Виртуализация и облако — "никто не будет запускать прод на чужих серверах"',
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'В 1999 VMware описывает, как им удалось принести виртуализацию на x86 в виде Workstation.',
      'А в 2006 AWS публично анонсирует EC2 как "ресайзабельные вычисления" через веб-интерфейс.',
      'Ровно тот же конфликт: контроль vs скорость изменений.',
    ],
    lesson: 'Выигрывает не "капитуляция перед магией", а стандартизация: IaC, мониторинг, SRE-практики, threat model для облака.',
  },
  {
    id: 'react',
    year: '2010-е',
    title: 'React, JSX и вечный спор "просто пиши на чистом JS"',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Даже вокруг фронтенда повторилась та же рифма. В старой документации React буквально сказано: "React doesn\'t require using JSX" — JSX опционален.',
      'То есть "чистый JS" никуда не делся — он просто перестал быть удобным default-путем.',
    ],
    quote: {
      text: 'React doesn\'t require using JSX — JSX опционален.',
      source: 'Документация React',
    },
    lesson: 'Новая абстракция не запрещает старое — она делает другое поведение нормой, потому что оно ускоряет работу и снижает когнитивную нагрузку.',
  },
];

const aiInsights = [
  {
    type: 'positive' as const,
    text: 'В контролируемом эксперименте по Copilot группа с ассистентом завершала задачу на ~55.8% быстрее.',
    source: 'arXiv',
  },
  {
    type: 'warning' as const,
    text: 'ИИ может подталкивать к менее безопасным решениям и повышать уверенность разработчиков в том, что код "точно безопасен".',
    source: 'OpenReview',
  },
  {
    type: 'warning' as const,
    text: 'Отдельная работа по безопасности Copilot в security-чувствительных сценариях находила заметную долю уязвимых генераций (в их постановке — около 40%).',
    source: 'arXiv',
  },
];

const newRisks = [
  { title: 'Недетерминизм', desc: 'и "правдоподобная" ошибка' },
  { title: 'Сдвиг ответственности', desc: 'ты не пишешь — ты верифицируешь' },
  { title: 'Рост поверхности атак', desc: 'особенно в security/infra' },
  { title: 'Проблемы происхождения', desc: 'почему модель так решила? откуда паттерн?' },
];

const practicalAdvice = [
  { icon: 'test', text: 'Тесты, свойства, контрактные спецификации (чтобы машина не "угадывала", а попадала в критерий)' },
  { icon: 'analyze', text: 'Статический анализ / линтеры / SAST для всего, что генерируется' },
  { icon: 'policy', text: '"Policy by default" (запрет опасных паттернов, секретов, небезопасных API)' },
  { icon: 'log', text: 'Журналирование промптов/версий моделей/диффов (воспроизводимость)' },
  { icon: 'review', text: 'Культура review, где человек отвечает за инварианты, а не за набивку шаблонов' },
];

function FloatingParticles() {
  return (
    <div className="history-particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="history-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ProgrammingHistory() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.title = 'История программирования: от FORTRAN до AI-ассистентов';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'История абстракций в программировании: FORTRAN, Unix, SQL, Java GC, облака и AI-ассистенты. Как технологии меняли профессию разработчика. Эволюция кода.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'история программирования, FORTRAN, Unix, SQL, Java, облачные вычисления, AI ассистенты, эволюция кода, абстракции в программировании, Copilot, вайб кодинг история');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'История программирования: от FORTRAN до AI');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Ключевые переломы в истории кода: FORTRAN, Unix, SQL, облака и AI-ассистенты. Как абстракции меняли разработку.');
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="history-page">
      <div
        className="history-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />
      <FloatingParticles />

      <section className="history-hero">
        <div className="history-hero-overlay" />
        <div className="history-hero-content">
          <Link to="/" className="history-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            На главную
          </Link>

          <h1 className="history-title">
            <span className="history-title-main glitch" data-text="ИСТОРИЯ">ИСТОРИЯ</span>
            <span className="history-title-sub">ПРОГРАММИРОВАНИЯ</span>
          </h1>

          <p className="history-subtitle">
            Путешествие сквозь эпохи абстракций
          </p>

          <div className="history-scroll-indicator">
            <div className="history-scroll-mouse">
              <div className="history-scroll-wheel" />
            </div>
            <span>Листайте вниз</span>
          </div>
        </div>
      </section>

      <section className="history-intro">
        <div className="history-intro-card">
          <div className="history-intro-glow" />
          <p className="history-intro-text">
            Каждое поколение инженеров в какой-то момент сталкивается с технологией, которая делает одну и ту же вещь:
            <strong className="history-highlight-cyan"> сдвигает границу ответственности вверх</strong>.
            Раньше ты отвечал за байты — потом за структуры; раньше за файлы — потом за запросы; раньше за сервера — потом за API.
          </p>
          <p className="history-intro-text history-intro-text-italic">
            И почти всегда первая реакция на такой сдвиг звучит одинаково:
            <span className="history-highlight-pink">"Так нельзя. Ты теряешь контроль. Ты не понимаешь, что реально происходит."</span>
          </p>
          <div className="history-intro-divider" />
          <p className="history-intro-conclusion">
            Иногда это правда. Но дальше происходит то, что и делает историю программирования
            <span className="history-highlight-green"> историей абстракций</span>: индустрия учится формализовать новый уровень
            (правила, инструменты проверки, дебаг, профилирование, best practices), и <strong>"невозможное" становится рутиной</strong>.
          </p>
        </div>

        <p className="history-intro-note">
          Ниже — несколько ключевых "переломов" (с фактами и короткими цитатами),
          которые хорошо рифмуются с сегодняшней волной ИИ.
        </p>
      </section>

      <section className="history-timeline">
        <div className="history-timeline-line" />

        {erasData.map((era, index) => (
          <div
            key={era.id}
            className={`history-era ${index % 2 === 0 ? 'history-era-left' : 'history-era-right'} ${activeEra === era.id ? 'history-era-active' : ''}`}
            onMouseEnter={() => setActiveEra(era.id)}
            onMouseLeave={() => setActiveEra(null)}
          >
            <div className="history-era-node">
              <div className="history-era-node-inner" />
              <div className="history-era-node-pulse" />
            </div>

            <div className="history-era-card">
              <div className="history-era-image-container">
                <img src={era.image} alt={era.title} className="history-era-image" />
                <div className="history-era-image-overlay" />
                <span className="history-era-year">{era.year}</span>
              </div>

              <div className="history-era-content">
                <h2 className="history-era-title">{era.title}</h2>

                {era.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="history-era-text">{paragraph}</p>
                ))}

                {era.quote && (
                  <blockquote className="history-era-quote">
                    <svg className="history-quote-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    <p className="history-quote-text">"{era.quote.text}"</p>
                    <cite className="history-quote-source">— {era.quote.source}</cite>
                  </blockquote>
                )}

                {era.skeptics && (
                  <div className="history-era-skeptics">
                    <span className="history-skeptics-label">Что бесило скептиков:</span>
                    <p className="history-skeptics-text">"{era.skeptics}"</p>
                  </div>
                )}

                <div className="history-era-lesson">
                  <div className="history-lesson-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="history-lesson-label">Что изменилось в культуре:</span>
                    <p className="history-lesson-text">{era.lesson}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="history-ai-section">
        <div className="history-ai-bg" />

        <div className="history-ai-header">
          <span className="history-ai-badge">НАШИ ДНИ</span>
          <h2 className="history-ai-title">
            <span className="neon-text">2020-е: ИИ как абстракция над кодом</span>
          </h2>
          <p className="history-ai-subtitle">
            Почему спор выглядит знакомо, но ставки выше
          </p>
        </div>

        <div className="history-ai-intro">
          <p>
            Сегодня ИИ-ассистенты действительно дают измеримый прирост скорости на типовых задачах.
            Но одновременно появляются строгие предупреждения о новых рисках.
          </p>
        </div>

        <div className="history-ai-insights">
          {aiInsights.map((insight, index) => (
            <div key={index} className={`history-ai-insight history-ai-insight-${insight.type}`}>
              <div className="history-insight-icon">
                {insight.type === 'positive' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
              </div>
              <div className="history-insight-content">
                <p className="history-insight-text">{insight.text}</p>
                <span className="history-insight-source">{insight.source}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="history-ai-risks">
          <h3 className="history-risks-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            Новый класс рисков
          </h3>
          <p className="history-risks-intro">
            Скептики не просто ворчат — они указывают на реальный новый класс рисков:
          </p>
          <div className="history-risks-grid">
            {newRisks.map((risk, index) => (
              <div key={index} className="history-risk-card">
                <span className="history-risk-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong className="history-risk-title">{risk.title}</strong>
                  <span className="history-risk-desc">{risk.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="history-ai-nuance">
          <div className="history-nuance-icon">!</div>
          <p>
            <strong>Главный исторический нюанс:</strong> раньше абстракции обычно были
            <span className="history-highlight-cyan"> формальными</span> (компилятор, оптимизатор, GC, SQL) —
            их можно было понимать как систему правил. Генеративный ИИ во многом
            <span className="history-highlight-pink"> статистичен</span>, а значит требует другой культуры контроля.
          </p>
        </div>
      </section>

      <section className="history-advice-section">
        <div className="history-advice-header">
          <h2 className="history-advice-title">
            Что делать инженеру
          </h2>
          <p className="history-advice-subtitle">
            чтобы "не повторить рифму" — но и не попасть в ловушку
          </p>
        </div>

        <div className="history-advice-wisdom">
          <p className="history-wisdom-text">
            <strong>История не доказывает, что "скептики всегда неправы".</strong>
            <br />Она показывает другое:
          </p>
          <ol className="history-wisdom-list">
            <li>
              Они <span className="history-highlight-green">правы насчет рисков</span> — вначале.
            </li>
            <li>
              Они <span className="history-highlight-pink">ошибаются в прогнозе тотального запрета</span> —
              потому что индустрия почти всегда находит способ приручить выгоду.
            </li>
          </ol>
        </div>

        <div className="history-advice-practical">
          <h3 className="history-practical-title">
            <span className="neon-text">"Компиляторы эпохи ИИ"</span>
          </h3>
          <p className="history-practical-intro">
            Практичный вывод: ИИ стоит воспринимать как новый слой, который требует своих инструментов:
          </p>

          <div className="history-advice-grid">
            {practicalAdvice.map((advice, index) => (
              <div key={index} className="history-advice-card">
                <div className="history-advice-number">{index + 1}</div>
                <p className="history-advice-text">{advice.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="history-conclusion">
        <div className="history-conclusion-content">
          <div className="history-conclusion-glow" />
          <p className="history-conclusion-text">
            ИИ — это не "конец инженерии", а
            <span className="history-highlight-cyan"> смена ремесла</span>:
            меньше ручной кладки кирпичей, больше
            <span className="history-highlight-pink"> архитектуры</span>,
            <span className="history-highlight-green"> проверки</span>,
            безопасности и постановки правильных ограничений.
          </p>
        </div>
      </section>
    </div>
  );
}
