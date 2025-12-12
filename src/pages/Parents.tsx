import { useState } from 'react';

export default function Parents() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqs = [
    {
      category: 'ВОПРОСЫ О КУРСЕ',
      questions: [
        {
          q: 'Сколько часов в неделю?',
          a: '4.5 часа в неделю (3 занятия по 1.5 часа) + 2-3 часа домашних заданий. Всего около 7-8 часов в неделю.'
        },
        {
          q: 'Какой возраст подходит?',
          a: '12-17 лет. Младшие дети могут присутствовать но может быть сложновато. Старшие полностью готовы.'
        },
        {
          q: 'Мой ребенок боится сломать компьютер?',
          a: 'Это нормальный страх! Объясните: "Компьютер не сломается. Максимум мы перезагрузим браузер."'
        },
        {
          q: 'Не будет ли это слишком сложно?',
          a: 'Нет! ИИ делает это очень простым. Даже если ребенок никогда не программировал - справится.'
        },
        {
          q: 'А если мой ребенок не умеет печатать быстро?',
          a: 'Это не нужно. Печатание приходит со временем. Главное понимание логики.'
        },
        {
          q: 'Может ли мой ребенок заработать денег?',
          a: 'Да! В 16-17 лет может брать фриланс заказы на Fiverr или Upwork. Начиная с $5-10 за простой проект.'
        },
        {
          q: 'А если ребенку не понравится?',
          a: 'Возвращаем деньги за первые 2 недели. Никаких вопросов.'
        }
      ]
    },
    {
      category: 'ВОПРОСЫ О ТЕХНИКЕ',
      questions: [
        {
          q: 'Какой браузер использовать?',
          a: 'Chrome, Firefox или Safari. Главное чтобы был свежий версии.'
        },
        {
          q: 'Нужна ли установка программ?',
          a: 'Минимально. Только Cursor если хотим продвинутый код. Но это опционально.'
        },
        {
          q: 'Интернет нужен постоянно?',
          a: 'Да, нужен интернет. Все работает в облаке.'
        },
        {
          q: 'Какие ноутбуки подойдут?',
          a: 'Любые. Windows, Mac, Linux. Все работает через браузер. Старый ноутбук 2015 года полностью подойдет.'
        }
      ]
    },
    {
      category: 'ВОПРОСЫ О РЕЗУЛЬТАТАХ',
      questions: [
        {
          q: 'Что получит мой ребенок в конце курса?',
          a: 'Портфолио с 7+ работающими проектами, GitHub профиль, сертификат об окончании, возможность работать как фрилансер, понимание как работает веб.'
        },
        {
          q: 'Сможет ли после курса найти работу?',
          a: 'В 15-16 лет: фриланс работа ($5-20 за проект). В 17 лет: стажировка в IT компании. В 18+: junior разработчик ($500-1500 в месяц).'
        },
        {
          q: 'Это будет помогать в школе?',
          a: 'Да! Это помогает: логическому мышлению, английскому языку (много документации на англ), математике, креативности.'
        },
        {
          q: 'Есть ли гарантия что выучит?',
          a: 'Если ребенок посещает регулярно и делает домашние задания - гарантия 100%.'
        }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 60px)',
          textAlign: 'center',
          marginBottom: '30px'
        }} className="glitch" data-text="ГАЙД ДЛЯ РОДИТЕЛЕЙ">
          <span className="neon-text">ГАЙД ДЛЯ РОДИТЕЛЕЙ</span>
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          opacity: 0.8,
          marginBottom: '60px',
          maxWidth: '800px',
          margin: '0 auto 60px'
        }}>
          Как помочь ребенку преуспеть в курсе программирования
        </p>

        {faqs.map((section, idx) => (
          <div key={idx} className="cyber-card" style={{
            padding: '40px',
            marginBottom: '30px'
          }}>
            <h2 style={{
              fontSize: '28px',
              marginBottom: '30px',
              color: 'var(--neon-cyan)',
              textTransform: 'uppercase'
            }}>
              {section.category}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {section.questions.map((item, qIdx) => (
                <div key={qIdx} style={{
                  padding: '20px',
                  background: 'rgba(0, 255, 249, 0.05)',
                  border: '1px solid rgba(0, 255, 249, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onClick={() => toggleSection(`${idx}-${qIdx}`)}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--neon-cyan)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 255, 249, 0.2)'}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      color: 'var(--neon-green)',
                      fontWeight: 600
                    }}>
                      Q: {item.q}
                    </h3>
                    <span style={{
                      fontSize: '24px',
                      color: 'var(--neon-cyan)',
                      transform: openSection === `${idx}-${qIdx}` ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}>
                      ▼
                    </span>
                  </div>
                  {openSection === `${idx}-${qIdx}` && (
                    <p style={{
                      fontSize: '16px',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid rgba(0, 255, 249, 0.2)',
                      opacity: 0.9,
                      lineHeight: '1.7'
                    }}>
                      A: {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="cyber-card" style={{
          padding: '40px',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '30px',
            color: 'var(--neon-pink)',
            textTransform: 'uppercase'
          }}>
            КАК ПОМОЧЬ РЕБЕНКУ (15 минут в день)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { num: '1', text: 'Спросите: "Что новое ты выучил сегодня?"' },
              { num: '2', text: 'Посмотрите: его проекты (покажет ссылки на Netlify)' },
              { num: '3', text: 'Похвалите: конкретно за что-то ("Крутой дизайн!", "Умная идея!")' },
              { num: '4', text: 'Помогите: если застрял на домашнем задании (но не делайте вместо него!)' }
            ].map((item) => (
              <div key={item.num} style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '20px',
                background: 'rgba(255, 0, 110, 0.05)',
                border: '1px solid rgba(255, 0, 110, 0.2)'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: 'var(--neon-pink)',
                  minWidth: '40px'
                }}>
                  {item.num}.
                </div>
                <p style={{
                  fontSize: '18px',
                  opacity: 0.9,
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card" style={{
          padding: '40px',
          marginBottom: '30px',
          background: 'rgba(0, 255, 65, 0.1)',
          border: '2px solid var(--neon-green)'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '25px',
            color: 'var(--neon-green)',
            textTransform: 'uppercase'
          }}>
            ПРИЗНАКИ ЧТО ВСЕ ХОРОШО
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              'Ребенок хочет идти на занятия',
              'Рассказывает про свои проекты',
              'Показывает ссылки друзьям/семье',
              'Дома сидит кодит свои идеи',
              'Спрашивает что еще можно сделать'
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '24px',
                  color: 'var(--neon-green)'
                }}>✓</span>
                <p style={{
                  fontSize: '18px',
                  opacity: 0.9,
                  margin: 0
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="cyber-card" style={{
          padding: '40px',
          marginBottom: '30px',
          background: 'rgba(255, 0, 110, 0.1)',
          border: '2px solid var(--neon-pink)'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '25px',
            color: 'var(--neon-pink)',
            textTransform: 'uppercase'
          }}>
            ПРИЗНАКИ ЧТО ПРОБЛЕМА
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {[
              'Ребенок говорит "Это слишком сложно"',
              'Не хочет идти на занятия',
              'Не делает домашние задания',
              'Не показывает результаты'
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '24px',
                  color: 'var(--neon-pink)'
                }}>✗</span>
                <p style={{
                  fontSize: '18px',
                  opacity: 0.9,
                  margin: 0
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <h3 style={{
            fontSize: '22px',
            marginBottom: '20px',
            color: 'var(--neon-cyan)'
          }}>
            Что делать?
          </h3>

          <ol style={{
            paddingLeft: '25px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {[
              'Поговорите с преподавателем',
              'Может быть материал идет слишком быстро',
              'Возможно нужна дополнительная консультация',
              'Или может ребенку нужен другой подход'
            ].map((item, idx) => (
              <li key={idx} style={{
                fontSize: '18px',
                opacity: 0.9,
                lineHeight: '1.7'
              }}>
                {item}
              </li>
            ))}
          </ol>
        </div>

        <div style={{
          padding: '60px 30px',
          background: 'rgba(19, 19, 26, 0.8)',
          border: '2px solid var(--neon-cyan)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '36px',
            marginBottom: '25px',
            color: 'var(--neon-cyan)'
          }}>
            ЕСТЬ ВОПРОСЫ?
          </h2>
          <p style={{
            fontSize: '20px',
            opacity: 0.9,
            marginBottom: '35px',
            maxWidth: '700px',
            margin: '0 auto 35px'
          }}>
            Свяжитесь с нами удобным для вас способом
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer">
              <button className="cyber-button" style={{
                fontSize: '20px',
                padding: '15px 40px'
              }}>
                WhatsApp
              </button>
            </a>
            <a href="https://t.me/vibecoding" target="_blank" rel="noopener noreferrer">
              <button className="cyber-button" style={{
                fontSize: '20px',
                padding: '15px 40px',
                borderColor: 'var(--neon-cyan)',
                color: 'var(--neon-cyan)'
              }}>
                Telegram
              </button>
            </a>
            <a href="mailto:info@vibecoding.by">
              <button className="cyber-button" style={{
                fontSize: '20px',
                padding: '15px 40px',
                borderColor: 'var(--neon-green)',
                color: 'var(--neon-green)'
              }}>
                Email
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
