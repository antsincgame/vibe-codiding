import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const fullTimeline = [
  { year: '100 до н.э.', event: 'Антикитерский механизм', desc: '82 шестеренки предсказывают звезды. Первый компьютер человечества.', color: 'gold' },
  { year: '1804', event: 'Жаккар: Перфокарты', desc: 'Joseph Marie Jacquard изобретает первую программируемую машину для ткацких станков.', color: 'cyan' },
  { year: '1843', event: 'Ada Lovelace: Первая программа', desc: 'Первый программист в истории. Алгоритм для чисел Бернулли. Язык Ada (1983) назван в её честь.', color: 'pink' },
  { year: '1912-1914', event: 'Torres Quevedo: El Ajedrecista', desc: 'Первая машина, которая сама принимает решения. Автоматический шахматный игрок.', color: 'green' },
  { year: '1930', event: 'Vannevar Bush: Differential Analyzer', desc: 'Первый аналоговый компьютер XX века. Автоматически решал дифференциальные уравнения.', color: 'cyan' },
  { year: '1942', event: 'Hedy Lamarr: Frequency Hopping', desc: 'Актриса + изобретательница. Патент US 2,292,387. Основа для Wi-Fi, Bluetooth, GPS.', color: 'pink' },
  { year: '1952', event: 'Grace Hopper: Первый компилятор', desc: 'A-0 компилятор. Машина пишет машинный код автоматически. COBOL, FORTRAN.', color: 'gold' },
  { year: '1957', event: 'FORTRAN', desc: 'FORmula TRANslating system. Первый коммерчески успешный язык высокого уровня.', color: 'green' },
  { year: '1996', event: 'IntelliSense (VB 5.0)', desc: 'Microsoft Visual Basic 5.0. Первое "умное" автодополнение в IDE.', color: 'cyan' },
  { year: '2018-2019', event: 'TabNine', desc: 'Первый AI-ассистент на GPT-2. Автодополнение целых функций.', color: 'pink' },
  { year: '2021', event: 'GitHub Copilot', desc: 'OpenAI Codex. 12 млрд параметров. 37% задач с первого раза.', color: 'gold' },
  { year: '2022', event: 'ChatGPT', desc: '30 ноября 2022. 100M пользователей за 2 месяца. Генерация целых приложений.', color: 'green' },
  { year: '2023-2024', event: 'Cursor, Claude Artifacts', desc: 'AI пишет целые проекты. GPT-4 + Claude в IDE.', color: 'cyan' },
  { year: '2025', event: 'Термин "Вайбкодинг"', desc: 'Andrej Karpathy, 3 февраля 2025. Название для 2000-летней идеи.', color: 'pink' },
];

const antikytheraSpecs = [
  { label: 'Количество шестеренок', value: '37-82', detail: '27 идентифицированных, 10+ выведено математически' },
  { label: 'Материал', value: 'Бронза', detail: 'Олово и медь, типичный сплав для эллинистического периода' },
  { label: 'Дата создания', value: '100-50 до н.э.', detail: 'I век до нашей эры, эллинистическая Греция' },
  { label: 'Размеры', value: '180 x 150 мм', detail: 'Главный фрагмент, размер современного ноутбука' },
  { label: 'Способ работы', value: 'Ручной кривошип', detail: 'Поворот ручки + система зубчатых передач' },
  { label: 'Фрагментов найдено', value: '82 куска', detail: '7 из них механически значимых' },
];

const antikytheraCapabilities = [
  {
    category: 'ПРЕДСКАЗАНИЕ ЗАТМЕНИЙ',
    items: [
      { name: 'Цикл Сарос (18 лет 11 дней)', desc: 'Предсказание солнечных и лунных затмений. Через каждые 18 лет затмения повторяются в том же порядке.', detail: 'Применение: предсказание дат затмений за десятилетия вперед' },
      { name: 'Цикл Экселигмос (54 года)', desc: 'Расширение Сарос цикла (3 x Saros). Затмения происходят в одном и том же географическом месте.', detail: 'Точность: через 54 года затмение вернется на ту же широту' },
      { name: 'Метонический цикл (19 лет)', desc: 'Фазы Луны повторяются на те же дни года через 19 лет. Спираль на задней панели с 235 ячейками (лунные месяцы).', detail: 'Применение: синхронизация лунного и солнечного календарей' },
    ],
    color: 'gold',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ ЛУНЫ',
    items: [
      { name: 'Лунные фазы', desc: 'Половинка бронзовой сферы (черная и белая). Система дифференциального привода, вращающая сферу.', detail: 'Точность: период синодического месяца = 29.53 дня. Современное значение: 29.530589 дней. Ошибка менее 0.001%!' },
      { name: 'Аномалистический месяц', desc: 'Луна движется быстрее в перигее (ближе к Земле), медленнее в апогее.', detail: 'Решение: механизм штифт-паз (pin-and-slot). Один зубец входит в паз другого, изменяя радиус вращения.' },
    ],
    color: 'cyan',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ СОЛНЦА',
    items: [
      { name: 'Положение в Зодиаке', desc: 'Движение Солнца через 12 знаков зодиака. На циферблате: 365-дневный год.', detail: 'Удивительная точность для того времени!' },
      { name: 'Солнечная аномалия', desc: 'Земля не движется с одинаковой скоростью вокруг Солнца.', detail: 'Решение: система из 3 шестерен с эксцентрическим приводом.' },
      { name: 'Солнцестояния и равноденствия', desc: 'Дни летнего и зимнего солнцестояния, весеннего и осеннего равноденствия.', detail: 'Критические дни для земледелия, религиозных обрядов, календаря' },
    ],
    color: 'orange',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ ПЛАНЕТ',
    items: [
      { name: '5 классических планет', desc: 'Меркурий, Венера, Марс, Юпитер, Сатурн - все видимые невооруженным глазом планеты.', detail: 'Механизм отслеживал положение каждой планеты на небесной сфере' },
      { name: 'Синодические циклы', desc: 'Венера: 462 года. Сатурн: 442 года.', detail: 'Маркировки на корпусе: инструкции на задней крышке для расчета' },
      { name: 'Восхождения звезд (Heliacal Rising)', desc: 'Когда звезды появляются и исчезают на горизонте.', detail: 'Критически важно для древней навигации' },
    ],
    color: 'pink',
  },
  {
    category: 'КАЛЕНДАРЬ И ОЛИМПИЙСКИЕ ИГРЫ',
    items: [
      { name: 'Египетский календарь', desc: 'Указатель даты на передней панели. 365 дней на кольцевом диске.', detail: 'Практичный календарь для повседневного использования' },
      { name: 'Олимпийский цикл (4 года)', desc: 'Вспомогательный циферблат на задней панели. Панеллинские игры.', detail: 'Спортивные и религиозные мероприятия всей Греции' },
    ],
    color: 'green',
  },
  {
    category: 'КОСМИЧЕСКИЙ ПОРЯДОК',
    items: [
      { name: 'Греческий космос', desc: 'Кольцо из дисков, отображающее древнегреческое понимание устройства космоса.', detail: 'Планетарные кольца с индексными буквами (Front Cover Inscriptions - FCI)' },
      { name: 'Концентрические кольца', desc: 'Все планеты одновременно на системе концентрических колец.', detail: 'Механическая модель геоцентрической вселенной Птолемея' },
    ],
    color: 'cyan',
  },
];

const researchHistory = [
  { year: '1901', event: 'Обнаружение', desc: 'Ныряльщики за губками находят обломки древнего корабля у острова Антикитера.' },
  { year: '1902', event: 'Первое изучение', desc: 'Археолог Валериос Стаис замечает шестеренку. Находку считают простыми часами.' },
  { year: '1951', event: 'Первая реконструкция', desc: 'Дерек Прайс начинает серьезное исследование. Гипотеза о вычислительном устройстве.' },
  { year: '1974', event: 'Публикация Прайса', desc: 'Монография "Gears from the Greeks". Мир узнает о сложности механизма.' },
  { year: '2005', event: 'CT-сканирование', desc: 'Прорыв! Рентгеновская томография. Обнаружено более 3000 символов надписей.' },
  { year: '2006', event: 'Расшифровка', desc: 'Публикация в Nature. Подтверждено: полноценный аналоговый компьютер.' },
  { year: '2021', event: 'Полная модель', desc: 'UCL публикует первую полную гипотетическую модель всех шестеренок.' },
];

const pioneers = [
  {
    id: 'jacquard',
    year: '1804',
    name: 'Joseph Marie Jacquard',
    title: 'Изобретатель перфокарт',
    image: '/image copy copy copy copy copy copy.png',
    story: 'Французский ткач, который революционизировал текстильную промышленность. Его механизм позволял ткацкому станку автоматически создавать сложные узоры по программе, записанной на перфокартах.',
    achievement: 'Первая программируемая машина после Антикитерского механизма',
    legacy: 'Перфокарты Жаккара вдохновили Чарльза Бэббиджа и использовались в компьютерах до 1970-х годов.',
    quote: '"Машина автоматически ткала сложные узоры - швея говорит машине ЧТО делать через карты"',
    facts: ['Перфокарты из дерева с отверстиями', 'Нити поднимались автоматически', 'Первая "программируемая" машина'],
    color: 'cyan',
  },
  {
    id: 'ada',
    year: '1843',
    name: 'Ada Lovelace',
    title: 'Первый программист в истории',
    image: '/image copy copy copy copy copy copy copy.png',
    story: 'Дочь поэта Байрона. Работала с Чарльзом Бэббиджем над Analytical Engine. Написала первый в истории алгоритм, предназначенный для выполнения машиной - вычисление чисел Бернулли.',
    achievement: 'Первая компьютерная программа в истории человечества',
    legacy: 'Язык программирования Ada (1983) назван в её честь. День Ады Лавлейс отмечается ежегодно.',
    quote: '"The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves"',
    facts: ['Алгоритм для чисел Бернулли', 'Предсказала будущее компьютеров', 'Поняла универсальность машины'],
    color: 'pink',
  },
  {
    id: 'torres',
    year: '1912-1914',
    name: 'Leonardo Torres Quevedo',
    title: 'Создатель первой "думающей" машины',
    image: '/image copy copy copy copy copy copy copy copy.png',
    story: 'Испанский инженер, создавший "El Ajedrecista" - автоматического шахматного игрока. Это была первая машина, которая сама принимала решения на основе логики, а не просто выполняла заранее запрограммированные действия.',
    achievement: 'Первая машина с искусственным интеллектом',
    legacy: 'Показал, что машины могут "думать" и принимать решения. Предтеча всех современных AI-систем.',
    quote: '"Как Антикитера решала, где будут планеты, теперь машина решает, какой ход лучше"',
    facts: ['Автоматически делал ходы в шахматах', 'Сам выбирал лучший ход', 'Машина "думала" о ходах'],
    color: 'green',
  },
  {
    id: 'bush',
    year: '1930',
    name: 'Vannevar Bush',
    title: 'Создатель Differential Analyzer',
    image: '/image copy copy copy copy copy copy copy copy copy.png',
    story: 'Американский инженер из MIT, создавший первый аналоговый компьютер XX века. Огромная машина с шестернями и трубками автоматически решала дифференциальные уравнения.',
    achievement: 'Первый практический аналоговый компьютер',
    legacy: 'Позже предложил концепцию Memex - прообраз гипертекста и World Wide Web.',
    quote: '"Машина автоматически решала дифференциальные уравнения - задачи, на которые математикам требовались недели"',
    facts: ['Огромная машина с шестернями', 'Автоматическое решение уравнений', 'Прообраз современных компьютеров'],
    color: 'cyan',
  },
  {
    id: 'hedy',
    year: '1942',
    name: 'Hedy Lamarr',
    title: 'Мать Wi-Fi, Bluetooth и GPS',
    image: '/image copy copy copy copy copy copy copy copy copy copy.png',
    story: 'Голливудская актриса 1940-х, которую называли "самой красивой женщиной в мире". Днём снималась в фильмах, ночью изобретала оружие. Вместе с композитором George Antheil создала систему Frequency Hopping Spread Spectrum.',
    achievement: 'Патент US 2,292,387 на систему управления торпедами',
    legacy: 'Технология стала основой для Wi-Fi, Bluetooth, GPS, 4G/5G. Pioneer Award в 83 года (1997).',
    quote: '"88 частот = 88 клавиш пианино. Вдохновение пришло от автоматического пианино!"',
    facts: ['Frequency Hopping Spread Spectrum', 'Армия не использовала до 1962 года', '88 частот для шифрования'],
    color: 'pink',
  },
  {
    id: 'hopper',
    year: '1952',
    name: 'Grace Murray Hopper',
    title: 'Мать компиляторов',
    image: '/image copy copy copy copy copy copy copy copy copy copy copy.png',
    story: 'Адмирал ВМС США, создавшая первый компилятор A-0. Революционная идея: машина АВТОМАТИЧЕСКИ переводит код с человеческого языка в машинный. До неё программисты писали в машинных кодах вручную.',
    achievement: 'Первый компилятор в истории (A-0, 1952)',
    legacy: 'COBOL (1960), FORTRAN. Миллионы программ до сих пор работают на языках, которые она помогла создать.',
    quote: '"Компилятор - это перевод. Из языка человека в язык машины."',
    facts: ['A-0 компилятор', 'COBOL для бизнеса', 'FORTRAN для науки'],
    color: 'gold',
  },
];

const aiEvolution = [
  {
    year: '2018-2019',
    name: 'TabNine',
    desc: 'Первый AI-ассистент на GPT-2. Автодополнение целых функций, а не просто слов.',
    tech: 'GPT-2, обучен на GitHub',
    color: 'gold',
  },
  {
    year: '2018-2020',
    name: 'Microsoft IntelliCode',
    desc: 'AI-предсказания в IntelliSense. Звездочка возле самых вероятных методов.',
    tech: 'Deep Learning на GitHub репозиториях',
    color: 'cyan',
  },
  {
    year: 'Август 2021',
    name: 'OpenAI Codex',
    desc: '12 млрд параметров. 159 GB кода GitHub. 37% задач решал с первого раза.',
    tech: 'GPT-3 + 159 GB кода',
    color: 'pink',
  },
  {
    year: 'Июнь 2021 - Июнь 2022',
    name: 'GitHub Copilot',
    desc: 'Первый коммерческий AI-ассистент. $10/месяц за автоматизацию кода.',
    tech: 'OpenAI Codex',
    color: 'green',
  },
  {
    year: '30 ноября 2022',
    name: 'ChatGPT',
    desc: '100M пользователей за 2 месяца. Не просто дополнение - полное создание с нуля.',
    tech: 'GPT-3.5, затем GPT-4',
    color: 'gold',
  },
  {
    year: '2023',
    name: 'Cursor IDE',
    desc: 'Форк VS Code + GPT-4. Весь IDE с интегрированным AI.',
    tech: 'GPT-4, Claude',
    color: 'cyan',
  },
  {
    year: '2024',
    name: 'Claude Artifacts',
    desc: 'AI создает интерактивные приложения прямо в чате.',
    tech: 'Claude 3, Claude 3.5',
    color: 'pink',
  },
  {
    year: '2024',
    name: 'Devin, Windsurf',
    desc: 'AI-агенты, которые сами пишут, тестируют и деплоят код.',
    tech: 'Agentic AI',
    color: 'green',
  },
  {
    year: '3 февраля 2025',
    name: 'Термин "Вайбкодинг"',
    desc: 'Андрей Карпатый (ex-Tesla, ex-OpenAI) дает имя 2000-летней идее.',
    tech: 'Культурный феномен',
    color: 'gold',
  },
];

function FloatingParticles() {
  return (
    <div className="history-particles">
      {[...Array(30)].map((_, i) => (
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

function AntikytheraSection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <section className="antikythera-section">
      <div className="antikythera-bg" />
      <div className="antikythera-container">
        <div className="antikythera-header">
          <span className="antikythera-badge">ПЕРВЫЙ КОМПЬЮТЕР ЧЕЛОВЕЧЕСТВА</span>
          <h2 className="antikythera-title">Антикитерский механизм</h2>
          <p className="antikythera-subtitle">100 год до нашей эры - 2000 лет до электричества</p>
        </div>

        <div className="antikythera-main">
          <div className="antikythera-image-block">
            <div className="antikythera-image-frame">
              <img
                src="/image copy copy copy copy copy.png"
                alt="Антикитерский механизм - древний аналоговый компьютер"
                className="antikythera-image"
              />
              <div className="antikythera-image-overlay" />
            </div>
            <div className="antikythera-specs-grid">
              {antikytheraSpecs.map((spec, index) => (
                <div key={index} className="antikythera-spec-card">
                  <span className="antikythera-spec-value">{spec.value}</span>
                  <span className="antikythera-spec-label">{spec.label}</span>
                  <span className="antikythera-spec-detail">{spec.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="antikythera-content">
            <p className="antikythera-text">
              В <strong>1901 году</strong> ныряльщики у острова Антикитера обнаружили обломки древнего корабля.
              Среди амфор и статуй лежал покрытый коррозией механизм - <strong>82 фрагмента бронзы</strong>,
              которые 100 лет считали простыми астрономическими часами.
            </p>
            <p className="antikythera-text">
              Только <strong>CT-сканирование в 2005 году</strong> раскрыло правду: это был
              <strong> аналоговый компьютер</strong>, созданный за 2000 лет до изобретения электричества.
              Исследователи обнаружили более <strong>3000 символов</strong> надписей, скрытых под коркой морской соли.
            </p>
            <p className="antikythera-text">
              Поворотом ручки древний грек мог узнать положение Солнца, Луны и пяти планет
              на любую дату - в прошлом или будущем. Механизм предсказывал затмения на
              <strong> 54 года вперед</strong> и рассчитывал даты Олимпийских игр.
            </p>
            <div className="antikythera-definition">
              <div className="antikythera-definition-icon">?</div>
              <div>
                <strong>Почему это компьютер?</strong>
                <p><strong>Определение:</strong> "Устройство, которое принимает входные данные, обрабатывает информацию и выводит результаты"</p>
                <ul className="antikythera-definition-list">
                  <li><strong>Вход:</strong> поворот ручки (кривошипа) на определенную дату</li>
                  <li><strong>Обработка:</strong> система 37+ шестерен с разными передаточными числами</li>
                  <li><strong>Выход:</strong> положение Солнца, Луны, 5 планет, фазы, затмения на циферблатах</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="antikythera-precision">
          <h3 className="antikythera-precision-title">Невероятная точность</h3>
          <div className="antikythera-precision-grid">
            <div className="antikythera-precision-card">
              <span className="antikythera-precision-value">29.53</span>
              <span className="antikythera-precision-label">дня - расчет механизма</span>
              <span className="antikythera-precision-detail">Лунный (синодический) месяц</span>
            </div>
            <div className="antikythera-precision-card">
              <span className="antikythera-precision-value">29.530589</span>
              <span className="antikythera-precision-label">дней - реальное значение</span>
              <span className="antikythera-precision-detail">Современные измерения</span>
            </div>
            <div className="antikythera-precision-card antikythera-precision-highlight">
              <span className="antikythera-precision-value">&lt;0.001%</span>
              <span className="antikythera-precision-label">ошибка</span>
              <span className="antikythera-precision-detail">Такая точность была недостижима до XVII века!</span>
            </div>
          </div>
          <p className="antikythera-precision-note">
            <strong>Гиппарх Родосский (II век до н.э.)</strong> изучал лунную аномалию.
            Древние греки измерили неравномерность движения Луны. Такая точность была недостижима
            до изобретения телескопов и открытия законов Кеплера в XVII веке.
          </p>
        </div>

        <div className="antikythera-capabilities">
          <h3 className="antikythera-capabilities-title">Полный список возможностей</h3>
          <div className="antikythera-categories">
            {antikytheraCapabilities.map((cat, catIndex) => (
              <div
                key={catIndex}
                className={`antikythera-category antikythera-category-${cat.color} ${activeCategory === catIndex ? 'active' : ''}`}
                onClick={() => setActiveCategory(activeCategory === catIndex ? null : catIndex)}
              >
                <div className="antikythera-category-header">
                  <span className="antikythera-category-number">{String(catIndex + 1).padStart(2, '0')}</span>
                  <h4 className="antikythera-category-title">{cat.category}</h4>
                  <span className="antikythera-category-toggle">{activeCategory === catIndex ? '-' : '+'}</span>
                </div>
                {activeCategory === catIndex && (
                  <div className="antikythera-category-content">
                    {cat.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="antikythera-item">
                        <strong className="antikythera-item-name">{item.name}</strong>
                        <p className="antikythera-item-desc">{item.desc}</p>
                        <p className="antikythera-item-detail">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="antikythera-research">
          <h3 className="antikythera-research-title">История исследования</h3>
          <div className="antikythera-timeline">
            {researchHistory.map((item, index) => (
              <div key={index} className="antikythera-timeline-item">
                <span className="antikythera-timeline-year">{item.year}</span>
                <div className="antikythera-timeline-content">
                  <strong>{item.event}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="antikythera-lesson">
          <div className="antikythera-lesson-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <strong>1700 ЛЕТ МОЛЧАНИЯ</strong>
            <p>После Антикитерского механизма человечество не создавало ничего столь сложного
            <strong> 1700 лет</strong> - до механических часов XIV века. Технологии могут быть
            утеряны на тысячелетия. Это был не просто механизм - это был <strong>компьютер, который вычислял космос</strong>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PioneersSection() {
  const [activePioneer, setActivePioneer] = useState<string | null>(null);

  return (
    <section className="pioneers-section">
      <div className="pioneers-bg" />
      <div className="pioneers-container">
        <div className="pioneers-header">
          <span className="pioneers-badge">ГИГАНТЫ, НА ПЛЕЧАХ КОТОРЫХ МЫ СТОИМ</span>
          <h2 className="pioneers-title">Пионеры автоматизации</h2>
          <p className="pioneers-subtitle">От перфокарт Жаккара до компиляторов Хоппер: 6 революционеров за 150 лет</p>
        </div>

        <div className="pioneers-grid">
          {pioneers.map((pioneer) => (
            <div
              key={pioneer.id}
              className={`pioneer-card pioneer-color-${pioneer.color} ${activePioneer === pioneer.id ? 'pioneer-active' : ''}`}
              onMouseEnter={() => setActivePioneer(pioneer.id)}
              onMouseLeave={() => setActivePioneer(null)}
            >
              <div className="pioneer-image-container">
                <img src={pioneer.image} alt={pioneer.name} className="pioneer-image" loading="lazy" />
                <div className="pioneer-image-overlay" />
                <span className="pioneer-year">{pioneer.year}</span>
              </div>

              <div className="pioneer-content">
                <h3 className="pioneer-name">{pioneer.name}</h3>
                <span className="pioneer-title">{pioneer.title}</span>

                <p className="pioneer-story">{pioneer.story}</p>

                <div className="pioneer-achievement">
                  <strong>Достижение:</strong>
                  <p>{pioneer.achievement}</p>
                </div>

                <blockquote className="pioneer-quote">"{pioneer.quote}"</blockquote>

                <div className="pioneer-facts">
                  {pioneer.facts.map((fact, index) => (
                    <span key={index} className="pioneer-fact">{fact}</span>
                  ))}
                </div>

                <div className="pioneer-legacy">
                  <strong>Наследие:</strong>
                  <p>{pioneer.legacy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pioneers-insight">
          <div className="pioneers-insight-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <p>
            <strong>Обратите внимание:</strong> Три из шести пионеров - женщины. Ada Lovelace, Hedy Lamarr и Grace Hopper
            внесли фундаментальный вклад в историю вычислительной техники. Программирование, Wi-Fi и компиляторы -
            все это изобретения женщин.
          </p>
        </div>
      </div>
    </section>
  );
}

function AIEvolutionSection() {
  return (
    <section className="ai-evolution-section">
      <div className="ai-evolution-bg" />
      <div className="ai-evolution-container">
        <div className="ai-evolution-header">
          <span className="ai-evolution-badge">ОТ GPT-2 К ВАЙБКОДИНГУ</span>
          <h2 className="ai-evolution-title">Эволюция AI-ассистентов</h2>
          <p className="ai-evolution-subtitle">7 лет революции: 2018-2025</p>
        </div>

        <div className="ai-evolution-intro">
          <p>
            <strong>Код писал себя ДО вайбкодинга.</strong> Термин появился 3 февраля 2025 года,
            но инструменты работали с 2018 года. Это не новая идея - это идея, которой 2000 лет.
            Андрей Карпатый просто дал ей имя.
          </p>
        </div>

        <div className="ai-evolution-timeline">
          {aiEvolution.map((item, index) => (
            <div key={index} className={`ai-evolution-item ai-evolution-color-${item.color}`}>
              <div className="ai-evolution-marker">
                <span className="ai-evolution-year">{item.year}</span>
              </div>
              <div className="ai-evolution-content">
                <h3 className="ai-evolution-name">{item.name}</h3>
                <p className="ai-evolution-desc">{item.desc}</p>
                <span className="ai-evolution-tech">{item.tech}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ai-evolution-karpathy">
          <div className="karpathy-portrait">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Andrej Karpathy"
              className="karpathy-image"
            />
          </div>
          <div className="karpathy-content">
            <span className="karpathy-date">3 февраля 2025</span>
            <h3 className="karpathy-name">Andrej Karpathy</h3>
            <span className="karpathy-title">ex-Tesla AI Director, ex-OpenAI</span>
            <blockquote className="karpathy-quote">
              "Vibe Coding" - термин для стиля программирования, где ты описываешь задачу на естественном языке,
              а AI пишет код за тебя. Ты направляешь, AI реализует.
            </blockquote>
            <p className="karpathy-insight">
              <strong>Ключевой инсайт:</strong> Карпатый не изобрел концепцию - он назвал то, что существовало
              2000 лет. Как Стив Джобс не изобрел смартфон, но дал ему имя "iPhone".
            </p>
          </div>
        </div>

        <div className="ai-evolution-comparison">
          <h3 className="ai-comparison-title">Сравнение эпох</h3>
          <div className="ai-comparison-grid">
            <div className="ai-comparison-card">
              <span className="ai-comparison-year">2015</span>
              <span className="ai-comparison-label">Программист пишет ВСЁ сам</span>
              <p>Медленно, строка за строкой. Монотонный звук печати клавиатуры.</p>
            </div>
            <div className="ai-comparison-card ai-comparison-modern">
              <span className="ai-comparison-year">2024+</span>
              <span className="ai-comparison-label">Опиши, что нужно - AI напишет за 2 секунды</span>
              <p>Курсор просто скользит по уже написанному коду. Волшебный звук "ding".</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FullTimelineSection() {
  return (
    <section className="full-timeline-section">
      <div className="full-timeline-bg" />
      <div className="full-timeline-container">
        <div className="full-timeline-header">
          <span className="full-timeline-badge">2000+ ЛЕТ ИСТОРИИ</span>
          <h2 className="full-timeline-title">Полная хронология</h2>
          <p className="full-timeline-subtitle">От Антикитеры до вайбкодинга: одна идея через тысячелетия</p>
        </div>

        <div className="full-timeline-visual">
          {fullTimeline.map((item, index) => (
            <div key={index} className={`full-timeline-item full-timeline-color-${item.color}`}>
              <div className="full-timeline-node" />
              <div className="full-timeline-card">
                <span className="full-timeline-year">{item.year}</span>
                <h3 className="full-timeline-event">{item.event}</h3>
                <p className="full-timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="full-timeline-conclusion">
          <div className="full-timeline-conclusion-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h3>ОДНА ИДЕЯ: ДАТЬ МАШИНЕ ИНСТРУКЦИИ</h3>
            <p>
              От Антикитеры, которая считала орбиты планет 2000 лет назад, к ChatGPT, который пишет код сегодня.
              От механизма с 82 шестернями к нейросетям с миллиардами параметров.
              <strong> Технология автоматического "программирования" существовала 2000 лет. Термин - несколько месяцев.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProgrammingHistory() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.title = 'История программирования | От Антикитерского механизма до вайбкодинга - 2000 лет автоматизации';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Полная история программирования за 2000 лет: Антикитерский механизм (100 до н.э.), Жаккар (1804), Ada Lovelace (1843), Hedy Lamarr (1942), Grace Hopper (1952), TabNine (2018), GitHub Copilot (2021), ChatGPT (2022), Cursor (2023), вайбкодинг Андрея Карпатого (2025).');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'история программирования, антикитерский механизм, первый компьютер, вайбкодинг, Андрей Карпатый, Ada Lovelace, Grace Hopper, Hedy Lamarr Wi-Fi, Joseph Marie Jacquard, Torres Quevedo, Vannevar Bush, TabNine, GitHub Copilot, ChatGPT, Cursor IDE, AI программирование, история автоматизации, цикл Сарос, Метонический цикл, перфокарты');
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
            <span className="history-title-main glitch" data-text="КОД ПИСАЛ СЕБЯ">КОД ПИСАЛ СЕБЯ</span>
            <span className="history-title-sub">2000+ ЛЕТ</span>
          </h1>

          <p className="history-subtitle">
            От бронзовых шестеренок Антикитеры до нейросетей ChatGPT: полная история автоматизации
          </p>

          <div className="history-hero-stats">
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">2000+</span>
              <span className="history-hero-stat-label">лет истории</span>
            </div>
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">6</span>
              <span className="history-hero-stat-label">великих пионеров</span>
            </div>
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">82</span>
              <span className="history-hero-stat-label">шестерни первого компьютера</span>
            </div>
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">1</span>
              <span className="history-hero-stat-label">термин в 2025</span>
            </div>
          </div>

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
          <h2 className="history-intro-title">Это не рилс про новый тренд</h2>
          <p className="history-intro-text">
            Это история о том, как человечество <strong className="history-highlight-cyan">2000 лет</strong> училось
            делегировать работу машинам. От древнегреческого инженера, который создал компьютер из бронзы,
            к голливудской актрисе, изобретшей Wi-Fi. От первой женщины-программиста к военному адмиралу,
            создавшей компиляторы.
          </p>
          <p className="history-intro-text history-intro-text-italic">
            И вот, в 2025 году, Андрей Карпатый просто дал этой двухтысячелетней идее имя:
            <span className="history-highlight-pink"> "Вайбкодинг"</span>
          </p>
          <div className="history-intro-divider" />
          <p className="history-intro-conclusion">
            <span className="history-highlight-green">Технология существовала 2000 лет. Термин - несколько месяцев.</span>
          </p>
        </div>
      </section>

      <AntikytheraSection />
      <PioneersSection />
      <AIEvolutionSection />
      <FullTimelineSection />

      <section className="history-conclusion">
        <div className="history-conclusion-content">
          <div className="history-conclusion-glow" />
          <h2 className="history-conclusion-title">ВО ИМЯ ОМНИССИИ</h2>
          <p className="history-conclusion-text">
            От Антикитеры, которая считала орбиты планет, к ChatGPT, который пишет код.
            От механизма с <span className="history-highlight-cyan">82 шестернями</span> к нейросетям с
            <span className="history-highlight-pink"> миллиардами параметров</span>.
          </p>
          <p className="history-conclusion-subtext">
            Четыре женщины, два тысячелетия, одна революция: делегирование работы машинам.
            <strong> Спасибо, что стояли на плечах гигантов.</strong>
          </p>
          <div className="history-conclusion-cta">
            <Link to="/courses" className="history-cta-button">
              Научиться вайбкодингу
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="history-seo-content">
        <div className="history-seo-container">
          <h2>История программирования: от древней Греции до искусственного интеллекта</h2>
          <p>
            Полная история программирования и автоматизации за 2000+ лет. Антикитерский механизм (100 год до н.э.) -
            первый аналоговый компьютер с 82 шестернями, который предсказывал затмения по циклу Сарос (18 лет 11 дней)
            и рассчитывал фазы Луны с точностью менее 0.001% ошибки.
          </p>
          <p>
            Пионеры автоматизации: Joseph Marie Jacquard (1804) - изобретатель перфокарт, Ada Lovelace (1843) -
            первый программист в истории, Leonardo Torres Quevedo (1912-1914) - создатель первой "думающей" машины
            El Ajedrecista, Vannevar Bush (1930) - создатель Differential Analyzer, Hedy Lamarr (1942) - мать Wi-Fi,
            Bluetooth и GPS, Grace Murray Hopper (1952) - создатель первого компилятора.
          </p>
          <p>
            Эволюция AI-ассистентов: TabNine (2018-2019) - первый AI на GPT-2, Microsoft IntelliCode (2018-2020),
            OpenAI Codex (август 2021) - 12 млрд параметров, GitHub Copilot (июнь 2021 - июнь 2022) - первый
            коммерческий AI-ассистент, ChatGPT (30 ноября 2022) - 100M пользователей за 2 месяца,
            Cursor IDE (2023), Claude Artifacts (2024), термин "Вайбкодинг" от Андрея Карпатого (3 февраля 2025).
          </p>
          <p>
            Ключевой инсайт: код писал себя ДО вайбкодинга. Термин появился 3 февраля 2025, но инструменты
            работали с 2018 года. Андрей Карпатый (ex-Tesla AI Director, ex-OpenAI) не изобрел концепцию -
            он назвал то, что существовало 2000 лет.
          </p>
        </div>
      </section>
    </div>
  );
}
