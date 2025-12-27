import { Link } from 'react-router-dom';

interface TimelineItem {
  year: string;
  title: string;
  content: string[];
  quote?: {
    text: string;
    source: string;
  };
  lesson?: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '1950-е',
    title: 'FORTRAN и первый большой спор "компилятор vs ручная оптимизация"',
    content: [
      'Когда FORTRAN появился как высокоуровневый язык для инженерных расчетов, скептики утверждали, что "машина никогда не даст такой эффективности, как человек, пишущий числовые коды вручную".',
      'И именно поэтому в истории FORTRAN так важен не только язык, но и оптимизирующий компилятор: он должен был доказать, что абстракция может быть быстрой.',
    ],
    quote: {
      text: 'FORTRAN "опроверг скептиков", уверенных, что компилируемый код неизбежно будет хуже ручного.',
      source: 'IBM',
    },
    lesson: '"Скорость" стала не свойством "рук программиста", а свойством стека (компилятор + профилирование + ограничения языка).',
  },
  {
    year: '1968',
    title: '"Go To Statement Considered Harmful" и борьба за управляемую сложность',
    content: [
      'В конце 60-х спор был не про производительность, а про читаемость и доказуемость.',
    ],
    quote: {
      text: '...the go to statement should be abolished',
      source: 'Эдсгер Дейкстра, письмо в CACM',
    },
    lesson: 'Абстракция часто возникает как ответ на рост сложности, а не как "мода".',
  },
  {
    year: '1973',
    title: 'Unix переписывают на C — "как можно отказаться от прямого контроля?"',
    content: [
      'Один из самых символичных скачков — переписывание Unix с ассемблера на C.',
    ],
    quote: {
      text: 'During the summer of 1973, it was rewritten in C... новая система стала "намного легче для понимания и модификации".',
      source: 'Деннис Ритчи, 1974',
    },
    lesson: 'Дисциплина сместилась — появились новые "святыни": переносимость, интерфейсы, системные вызовы, соглашения ABI.',
  },
  {
    year: '1970-е',
    title: 'Реляционная модель — "пользователь не обязан знать физику хранения"',
    content: [
      'Кодд в работе 1970 года закладывает идею, которая по тем временам звучала почти кощунственно: отделить логику данных от физического представления.',
    ],
    quote: {
      text: 'Цель — доступ к информации "без знания физического чертежа" базы.',
      source: 'IBM о работе Кодда',
    },
    lesson: 'Индустрия не отказалась от контроля — она создала оптимизатор, индексы, explain-планы, профилирование запросов. Контроль не исчез — он стал другим.',
  },
  {
    year: '1986',
    title: 'Фред Брукс и холодный душ "No Silver Bullet"',
    content: [
      'Брукс предупреждает, что нет одного магического приема, который даст десятикратный рост продуктивности "сам по себе".',
    ],
    quote: {
      text: 'No single development... promises even one order of magnitude improvement...',
      source: 'Фред Брукс, "No Silver Bullet"',
    },
    lesson: 'Даже мощная абстракция не отменяет сущностную сложность предметной области. Она убирает часть случайной сложности, но не заменяет мышление о системе.',
  },
  {
    year: '1990-е',
    title: 'Управляемая память — "как можно доверить GC то, что должен контролировать инженер?"',
    content: [
      'Java закрепляет идею, что безопасность и продуктивность важнее "ручного delete".',
    ],
    quote: {
      text: 'Java включает "automatic storage management... to avoid the safety problems of explicit deallocation".',
      source: 'Спецификация Java',
    },
    lesson: 'Индустрия ответила тем же паттерном: метрики, тюнинг, инструменты, и даже отдельные руководства по GC.',
  },
  {
    year: '1999–2006',
    title: 'Виртуализация и облако — "никто не будет запускать прод на чужих серверах"',
    content: [
      'В 1999 VMware приносит виртуализацию на x86.',
      'В 2006 AWS публично анонсирует EC2 как "ресайзабельные вычисления" через веб-интерфейс.',
    ],
    lesson: 'Выигрывает не "капитуляция перед магией", а стандартизация: IaC, мониторинг, SRE-практики, threat model для облака.',
  },
  {
    year: '2010-е',
    title: 'React, JSX и вечный спор "просто пиши на чистом JS"',
    content: [
      'Даже вокруг фронтенда повторилась та же рифма.',
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
    type: 'positive',
    text: 'В контролируемом эксперименте группа с ИИ-ассистентом завершала задачу на ~55.8% быстрее.',
    source: 'arXiv, исследование Copilot',
  },
  {
    type: 'warning',
    text: 'ИИ может подталкивать к менее безопасным решениям и повышать уверенность разработчиков в том, что код "точно безопасен".',
    source: 'OpenReview',
  },
  {
    type: 'warning',
    text: 'Исследование безопасности Copilot в security-чувствительных сценариях находило около 40% уязвимых генераций.',
    source: 'arXiv',
  },
];

const newRisks = [
  'Недетерминизм и "правдоподобная" ошибка',
  'Сдвиг ответственности (ты не пишешь — ты верифицируешь)',
  'Рост поверхности атак (особенно в security/infra)',
  'Проблемы происхождения (почему модель так решила? откуда паттерн?)',
];

const practicalAdvice = [
  'Тесты, свойства, контрактные спецификации (чтобы машина не "угадывала", а попадала в критерий)',
  'Статический анализ / линтеры / SAST для всего, что генерируется',
  '"Policy by default" (запрет опасных паттернов, секретов, небезопасных API)',
  'Журналирование промптов/версий моделей/диффов (воспроизводимость)',
  'Культура review, где человек отвечает за инварианты, а не за набивку шаблонов',
];

export default function ProgrammingHistory() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--neon-cyan)',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '40px',
              opacity: 0.8,
              transition: 'opacity 0.3s',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            На главную
          </Link>

          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <h1
              className="glitch"
              data-text="ИСТОРИЯ ПРОГРАММИРОВАНИЯ"
              style={{
                fontSize: 'clamp(32px, 7vw, 56px)',
                marginBottom: '0',
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-2px',
              }}
            >
              <span
                className="neon-text"
                style={{
                  background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-green))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(0, 255, 249, 0.4))',
                }}
              >
                ИСТОРИЯ ПРОГРАММИРОВАНИЯ
              </span>
            </h1>
          </div>

          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: 'var(--neon-pink)',
              fontStyle: 'italic',
              maxWidth: '700px',
              margin: '0 auto 35px',
              letterSpacing: '0.5px',
              fontWeight: 400,
            }}
          >
            как история <span style={{ color: 'var(--neon-cyan)', fontWeight: 500 }}>"снятия боли"</span>
          </p>

          <div
            className="cyber-card"
            style={{
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.05), rgba(255, 0, 110, 0.05))',
              borderLeft: '4px solid var(--neon-cyan)',
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
              Каждое поколение инженеров в какой-то момент сталкивается с технологией, которая делает одну и ту же
              вещь: <strong style={{ color: 'var(--neon-cyan)' }}>сдвигает границу ответственности вверх</strong>.
              Раньше ты отвечал за байты — потом за структуры; раньше за файлы — потом за запросы; раньше за сервера
              — потом за API.
            </p>
            <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px', marginBottom: 0 }}>
              И почти всегда первая реакция на такой сдвиг звучит одинаково:{' '}
              <em style={{ color: 'var(--neon-pink)' }}>
                "Так нельзя. Ты теряешь контроль. Ты не понимаешь, что реально происходит."
              </em>
            </p>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '20px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, var(--neon-cyan), var(--neon-pink), var(--neon-green))',
              opacity: 0.3,
            }}
          />

          {timelineData.map((item, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                paddingLeft: '60px',
                marginBottom: '50px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '5px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--dark-bg)',
                  border: '2px solid var(--neon-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(0, 255, 249, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--neon-cyan)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  background: 'rgba(0, 255, 249, 0.1)',
                  border: '1px solid var(--neon-cyan)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'var(--neon-cyan)',
                  marginBottom: '15px',
                  letterSpacing: '1px',
                }}
              >
                {item.year}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(20px, 3vw, 26px)',
                  marginBottom: '20px',
                  color: '#fff',
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </h2>

              {item.content.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.8,
                    opacity: 0.9,
                    marginBottom: '15px',
                  }}
                >
                  {paragraph}
                </p>
              ))}

              {item.quote && (
                <blockquote
                  style={{
                    margin: '25px 0',
                    padding: '20px 25px',
                    background: 'rgba(255, 0, 110, 0.08)',
                    borderLeft: '3px solid var(--neon-pink)',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <p
                    style={{
                      fontSize: '17px',
                      fontStyle: 'italic',
                      margin: 0,
                      lineHeight: 1.7,
                      color: '#fff',
                    }}
                  >
                    "{item.quote.text}"
                  </p>
                  <cite
                    style={{
                      display: 'block',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'var(--neon-pink)',
                      fontStyle: 'normal',
                    }}
                  >
                    — {item.quote.source}
                  </cite>
                </blockquote>
              )}

              {item.lesson && (
                <div
                  style={{
                    padding: '15px 20px',
                    background: 'rgba(0, 255, 136, 0.08)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    borderRadius: '8px',
                    marginTop: '20px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      color: 'var(--neon-green)',
                      marginBottom: '8px',
                      fontWeight: 'bold',
                    }}
                  >
                    Что изменилось
                  </span>
                  <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>{item.lesson}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="cyber-card" style={{ padding: '40px', marginTop: '60px', marginBottom: '50px' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            <span className="neon-text">2020-е: ИИ как абстракция над кодом</span>
          </h2>

          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: '30px',
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            Почему спор выглядит знакомо, но ставки выше
          </p>

          <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  background:
                    insight.type === 'positive' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                  border: `1px solid ${insight.type === 'positive' ? 'var(--neon-green)' : '#ffc107'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: insight.type === 'positive' ? 'var(--neon-green)' : '#ffc107',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {insight.type === 'positive' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                      <path d="M12 9v4M12 17h.01" />
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.7 }}>{insight.text}</p>
                  <span style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px', display: 'block' }}>
                    {insight.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '25px',
              background: 'rgba(255, 0, 110, 0.1)',
              border: '1px solid var(--neon-pink)',
              borderRadius: '12px',
            }}
          >
            <h3 style={{ color: 'var(--neon-pink)', marginBottom: '20px', fontSize: '20px' }}>
              Новый класс рисков
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {newRisks.map((risk, index) => (
                <li key={index} style={{ marginBottom: '12px', fontSize: '16px', lineHeight: 1.6 }}>
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '25px',
              background: 'rgba(0, 255, 249, 0.05)',
              border: '1px dashed var(--neon-cyan)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.8, fontStyle: 'italic' }}>
              <strong>Главный исторический нюанс:</strong> раньше абстракции обычно были{' '}
              <span style={{ color: 'var(--neon-cyan)' }}>формальными</span> (компилятор, оптимизатор, GC, SQL) — их
              можно было понимать как систему правил. Генеративный ИИ во многом{' '}
              <span style={{ color: 'var(--neon-pink)' }}>статистичен</span>, а значит требует другой культуры
              контроля.
            </p>
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '40px' }}>
          <h2
            style={{
              fontSize: 'clamp(22px, 3.5vw, 28px)',
              marginBottom: '15px',
              textAlign: 'center',
            }}
          >
            <span className="neon-text">Что делать инженеру</span>
          </h2>

          <p
            style={{
              textAlign: 'center',
              fontSize: '16px',
              opacity: 0.8,
              marginBottom: '35px',
            }}
          >
            чтобы "не повторить рифму" — но и не попасть в ловушку
          </p>

          <div
            style={{
              padding: '25px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              marginBottom: '35px',
            }}
          >
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.8 }}>
              <strong>История не доказывает, что "скептики всегда неправы".</strong> Она показывает другое:
            </p>
            <ol style={{ marginTop: '20px', marginBottom: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px', fontSize: '16px', lineHeight: 1.7 }}>
                Они <span style={{ color: 'var(--neon-green)' }}>правы насчет рисков</span> — вначале.
              </li>
              <li style={{ fontSize: '16px', lineHeight: 1.7 }}>
                Они <span style={{ color: 'var(--neon-pink)' }}>ошибаются в прогнозе тотального запрета</span> — потому
                что индустрия почти всегда находит способ приручить выгоду.
              </li>
            </ol>
          </div>

          <h3
            style={{
              fontSize: '20px',
              marginBottom: '25px',
              color: 'var(--neon-cyan)',
            }}
          >
            "Компиляторы эпохи ИИ"
          </h3>

          <div style={{ display: 'grid', gap: '15px' }}>
            {practicalAdvice.map((advice, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px',
                  padding: '15px 20px',
                  background: 'rgba(0, 255, 249, 0.05)',
                  border: '1px solid rgba(0, 255, 249, 0.2)',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: 'var(--neon-cyan)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.7 }}>{advice}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: '60px',
            textAlign: 'center',
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 110, 0.1))',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(18px, 3vw, 22px)',
              lineHeight: 1.8,
              margin: 0,
              fontWeight: 500,
            }}
          >
            ИИ — это не "конец инженерии", а{' '}
            <span style={{ color: 'var(--neon-cyan)' }}>смена ремесла</span>: меньше ручной кладки кирпичей, больше{' '}
            <span style={{ color: 'var(--neon-pink)' }}>архитектуры</span>,{' '}
            <span style={{ color: 'var(--neon-green)' }}>проверки</span>, безопасности и постановки правильных
            ограничений.
          </p>
        </div>
      </div>
    </div>
  );
}
