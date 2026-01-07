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
  facts?: string[];
  accentColor: 'cyan' | 'pink' | 'green' | 'gold' | 'orange';
}

const erasData: EraData[] = [
  {
    id: 'fortran',
    year: '1950-е',
    title: 'FORTRAN: когда машина стала умнее человека в оптимизации',
    image: 'https://images.pexels.com/photos/5765829/pexels-photo-5765829.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Когда FORTRAN появился как высокоуровневый язык для инженерных расчетов, скептики утверждали, что "машина никогда не даст такой эффективности, как человек, пишущий числовые коды вручную". Программисты того времени гордились умением писать оптимальный машинный код вручную.',
      'IBM поставила перед командой Джона Бэкуса амбициозную задачу: создать компилятор, который генерирует код не хуже ручного. И они справились. FORTRAN стал первым языком, где абстракция не означала потерю производительности.',
      'Революция была не только в синтаксисе. Появились концепции, которые мы используем до сих пор: переменные с осмысленными именами, циклы DO, условные операторы IF, подпрограммы. То, что сейчас кажется очевидным, тогда было радикальной идеей.',
    ],
    quote: {
      text: 'FORTRAN опроверг скептиков, уверенных, что компилируемый код неизбежно будет хуже ручного.',
      source: 'IBM, историческая справка',
    },
    lesson: '"Скорость" стала не свойством "рук программиста", а свойством стека: компилятор + профилирование + ограничения языка. Абстракция победила.',
    facts: [
      'Первый коммерчески успешный высокоуровневый язык',
      'Разработка заняла 3 года (1954-1957)',
      'До сих пор используется в научных вычислениях',
      'Название: FORmula TRANslating system',
    ],
    accentColor: 'cyan',
  },
  {
    id: 'goto',
    year: '1968',
    title: '"Go To Statement Considered Harmful": война за читаемость кода',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'В конце 60-х программы превратились в "спагетти-код" - запутанные клубки переходов GOTO, которые невозможно было понять и отладить. Эдсгер Дейкстра, голландский ученый, опубликовал письмо в журнале CACM, которое изменило программирование навсегда.',
      'Дейкстра доказал математически: программы со структурированным потоком управления (циклы, условия, функции) легче анализировать и доказывать их корректность. GOTO делает код непредсказуемым.',
      'Это была не просто эстетическая претензия. Дейкстра показал, что когда системы растут, способность локально рассуждать о коде становится дороже любых микрооптимизаций. Структурное программирование родилось как ответ на кризис сложности.',
      'Интересно, что споры о GOTO продолжались десятилетия. Линус Торвальдс защищал использование GOTO в ядре Linux для обработки ошибок. Но это исключение подтверждает правило: GOTO допустим только в очень специфических паттернах.',
    ],
    quote: {
      text: '...the go to statement should be abolished from all "higher level" programming languages.',
      source: 'Эдсгер Дейкстра, письмо в CACM, 1968',
    },
    skeptics: 'GOTO быстрее! Структурное программирование - это ограничение свободы программиста!',
    lesson: 'Абстракция часто возникает как ответ на рост сложности, а не как "мода". Ограничения освобождают мышление для более важных задач.',
    facts: [
      'Письмо Дейкстры изначально называлось "A Case Against the GO TO Statement"',
      'Редактор Никлаус Вирт изменил название на более провокационное',
      'Дейкстра получил премию Тьюринга в 1972 году',
      'Структурное программирование стало основой для ООП',
    ],
    accentColor: 'pink',
  },
  {
    id: 'unix',
    year: '1973',
    title: 'Unix переписывают на C: рождение переносимых систем',
    image: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Летом 1973 года произошел один из самых символичных скачков в истории программирования. Деннис Ритчи и Кен Томпсон переписали ядро Unix с ассемблера PDP-11 на язык C. Скептики были в ужасе: как можно операционную систему писать на чем-то кроме ассемблера?',
      'Аргументы против были весомыми: потеря контроля над железом, снижение производительности, невозможность тонкой оптимизации. Но Ритчи в статье 1974 года зафиксировал главное преимущество: система стала "намного легче для понимания и модификации".',
      'Результат превзошел ожидания. Unix стал первой по-настоящему переносимой операционной системой. Код можно было адаптировать для разных архитектур процессоров без полного переписывания. Это создало целую экосистему Unix-подобных систем.',
      'Ритчи позже назвал это "водоразделом", после которого Unix принял современную форму. Язык C, созданный специально для этой задачи, стал lingua franca системного программирования на следующие 50 лет.',
    ],
    quote: {
      text: 'During the summer of 1973, it was rewritten in C... The whole system became much easier to understand and to modify.',
      source: 'Деннис Ритчи, "The UNIX Time-Sharing System", 1974',
    },
    skeptics: 'С отрывом от железа мы потеряем дисциплину и контроль. Операционная система на высокоуровневом языке - это несерьезно.',
    lesson: 'Дисциплина сместилась - появились новые "святыни": переносимость, интерфейсы, системные вызовы, соглашения ABI. Контроль не исчез, он стал абстрактнее.',
    facts: [
      'Первая версия Unix была написана на ассемблере PDP-7 в 1969',
      'C был создан Ритчи специально для переписывания Unix',
      'К 1978 году Unix работал на более чем 600 машинах',
      'Linux, macOS, Android - все потомки идей Unix',
    ],
    accentColor: 'green',
  },
  {
    id: 'relational',
    year: '1970-е',
    title: 'SQL и реляционная модель: данные важнее структуры хранения',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Эдгар Кодд из IBM в 1970 году опубликовал работу, которая звучала почти кощунственно для программистов того времени. Он предложил отделить логику работы с данными от физического способа их хранения на диске.',
      'До реляционной модели программисты должны были знать точную структуру файлов: где какой байт, какие указатели на связанные записи, как обходить индексы. Изменение структуры данных означало переписывание всех программ.',
      'Кодд предложил SQL - язык, где ты описываешь ЧТО хочешь получить, а не КАК это найти. База данных сама решает, как выполнить запрос оптимально. Скептики возмущались: "SQL-запросы не контролируют план выполнения, значит это несерьезно!"',
      'Индустрия ответила созданием нового класса инструментов: оптимизаторы запросов, индексы, EXPLAIN-планы, профилирование. Контроль не исчез - он стал декларативным. Ты говоришь базе, что тебе нужно, и она находит лучший путь.',
    ],
    quote: {
      text: 'Цель - доступ к информации без знания физического чертежа базы данных.',
      source: 'IBM о работе Эдгара Кодда',
    },
    skeptics: 'Декларативный язык не даст контроля над производительностью! Настоящие программисты пишут прямые обращения к диску!',
    lesson: 'Индустрия не отказалась от контроля - она создала оптимизатор, индексы, explain-планы, профилирование запросов. Контроль стал другим: декларативным вместо императивного.',
    facts: [
      'Первая реляционная СУБД - System R (IBM, 1974)',
      'Oracle выпущен в 1979 году',
      'SQL стандартизирован ISO в 1987 году',
      'NoSQL-движение 2000-х не заменило SQL, а дополнило',
    ],
    accentColor: 'cyan',
  },
  {
    id: 'nosb',
    year: '1986',
    title: '"No Silver Bullet": предупреждение Фреда Брукса',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Фред Брукс, автор легендарной книги "Мифический человеко-месяц", написал эссе, которое стало холодным душем для индустрии. Он предупредил: нет и не будет "серебряной пули" - единственной технологии, которая даст десятикратный рост продуктивности.',
      'Брукс разделил сложность программирования на два типа. Случайная сложность (accidental complexity) - это проблемы инструментов, языков, сред разработки. Её можно уменьшать новыми технологиями. Но сущностная сложность (essential complexity) - это сложность самой предметной области.',
      'Ключевой вывод: даже самая мощная абстракция убирает только случайную сложность. Она не заменит понимания бизнес-логики, не отменит необходимость проектирования архитектуры, не избавит от анализа требований.',
      'Это эссе критически важно для понимания ИИ сегодня. Когда Copilot генерирует код, он убирает случайную сложность (набор синтаксиса). Но сущностная сложность - понимание задачи, выбор архитектуры, проверка корректности - остается за человеком.',
    ],
    quote: {
      text: 'There is no single development, in either technology or management technique, which by itself promises even one order of magnitude improvement within a decade in productivity, in reliability, in simplicity.',
      source: 'Фред Брукс, "No Silver Bullet", 1986',
    },
    lesson: 'Даже мощная абстракция не отменяет сущностную сложность предметной области. Она убирает случайную сложность (рутину, шаблоны), но не заменяет мышление о системе.',
    facts: [
      'Книга "Мифический человеко-месяц" написана в 1975 году',
      'Основана на опыте разработки OS/360 в IBM',
      'Закон Брукса: добавление людей к опаздывающему проекту задерживает его еще больше',
      'Эссе цитируется до сих пор в спорах о новых технологиях',
    ],
    accentColor: 'orange',
  },
  {
    id: 'gc',
    year: '1990-е',
    title: 'Java и сборка мусора: безопасность важнее микроконтроля',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'В 1995 году Sun Microsystems выпустила Java с радикальной идеей: программист не должен вручную управлять памятью. Garbage Collector (сборщик мусора) сам определяет, какие объекты больше не нужны, и освобождает память.',
      'Для программистов C/C++ это было неприемлемо. "Как можно доверить машине то, что должен контролировать инженер?" Ручной delete - это дисциплина, гарантия понимания жизненного цикла объектов.',
      'Но у ручного управления памятью была темная сторона: use-after-free, double-free, утечки памяти, buffer overflow. Эти ошибки годами были главными источниками уязвимостей в C/C++ программах. Java решила проблему радикально: не дать программисту возможность ошибиться.',
      'Скептики были правы насчет проблем: GC добавляет паузы, меняет профиль производительности, усложняет диагностику. Но индустрия ответила тем же паттерном: метрики, тюнинг, инструменты. Oracle выпустила целые руководства по настройке GC.',
    ],
    quote: {
      text: 'Java includes automatic storage management, usually implemented as a garbage collector, to avoid the safety problems of explicit deallocation.',
      source: 'Спецификация языка Java',
    },
    skeptics: 'GC непредсказуем! Паузы убьют real-time приложения! Настоящий программист контролирует каждый байт!',
    lesson: 'Индустрия ответила тем же паттерном: метрики, тюнинг, инструменты. Появились специализированные GC для разных сценариев: low-latency, high-throughput, generational.',
    facts: [
      'Java разрабатывалась как язык для бытовой электроники',
      'Первоначальное название - Oak',
      '"Write Once, Run Anywhere" - главный слоган',
      'GC существовал и раньше (Lisp, 1959), но Java сделала его мейнстримом',
    ],
    accentColor: 'pink',
  },
  {
    id: 'cloud',
    year: '2006',
    title: 'AWS и облака: "никто не будет запускать прод на чужих серверах"',
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'В 2006 году Amazon Web Services анонсировал EC2 - возможность арендовать виртуальные серверы через веб-интерфейс. Идея казалась абсурдной: какая серьезная компания доверит свои данные и код чужим серверам?',
      'Возражения были серьезными: безопасность данных, зависимость от провайдера (vendor lock-in), непредсказуемые затраты, потеря контроля над инфраструктурой. Для многих CTO облако было модной игрушкой, не более.',
      'Но преимущества оказались неотразимыми: масштабирование по требованию, отсутствие капитальных затрат на железо, глобальная доступность, managed-сервисы (базы данных, очереди, ML). Стартап мог за минуты получить инфраструктуру, которая раньше требовала месяцев планирования.',
      'Ровно тот же конфликт: контроль vs скорость изменений. И тот же ответ индустрии: новые практики контроля. Infrastructure as Code, мониторинг, SRE, DevSecOps, threat modeling для облака.',
    ],
    quote: {
      text: 'Amazon EC2 presents a true virtual computing environment, allowing you to use web service interfaces to launch instances with a variety of operating systems.',
      source: 'AWS, анонс EC2, 2006',
    },
    skeptics: 'Данные на чужих серверах - это безумие! Мы теряем контроль над железом! Облако - это модная игрушка!',
    lesson: 'Выигрывает не "капитуляция перед магией", а стандартизация: IaC (Terraform, CloudFormation), мониторинг (Prometheus, Datadog), SRE-практики, zero-trust security.',
    facts: [
      'AWS начинался как внутренняя платформа Amazon',
      'К 2023 году облачный рынок превысил $500 млрд',
      'VMware создала виртуализацию x86 в 1999 году',
      'Kubernetes (2014) стал стандартом оркестрации контейнеров',
    ],
    accentColor: 'green',
  },
  {
    id: 'react',
    year: '2013',
    title: 'React и JSX: смешение HTML и JavaScript',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: [
      'Когда Facebook представил React в 2013 году, сообщество было в шоке. JSX смешивал HTML-подобный синтаксис прямо в JavaScript-коде. Это нарушало священный принцип "разделения concerns" - логика отдельно, разметка отдельно.',
      'Годами веб-разработчики учились: JavaScript в .js файлах, HTML в .html, CSS в .css. Смешивать их - признак новичка. И вдруг Facebook предлагает писать `<div>` прямо в функциях? Это казалось шагом назад.',
      'Но React перевернул понимание "разделения". Настоящая граница - не между языками (JS/HTML/CSS), а между компонентами. Кнопка - это единица, которая включает свою разметку, логику и стили. Разбивать её на три файла - искусственное разделение.',
      'Важно: React не запрещал "чистый JS". Как сказано в документации: "React doesnt require using JSX". Но JSX стал нормой, потому что ускорял работу и снижал когнитивную нагрузку.',
    ],
    quote: {
      text: 'React doesnt require using JSX, but most people find it helpful as a visual aid when working with UI inside the JavaScript code.',
      source: 'Документация React',
    },
    skeptics: 'Смешивание HTML и JS - это антипаттерн! Мы 15 лет учились разделять concerns, а теперь это все зря?',
    lesson: 'Новая абстракция не запрещает старое - она делает другое поведение нормой, потому что оно ускоряет работу и снижает когнитивную нагрузку. Компонентный подход победил.',
    facts: [
      'React создан Джорданом Уолке в Facebook',
      'Первый публичный релиз - май 2013',
      'Virtual DOM - ключевая инновация для производительности',
      'React Native (2015) принес подход на мобильные платформы',
    ],
    accentColor: 'cyan',
  },
];

const aiInsights = [
  {
    type: 'positive' as const,
    text: 'В контролируемом эксперименте по GitHub Copilot группа с ИИ-ассистентом завершала задачу на 55.8% быстрее, чем контрольная группа.',
    source: 'arXiv, исследование Microsoft Research',
  },
  {
    type: 'positive' as const,
    text: 'Cursor, Claude и другие ИИ-ассистенты способны генерировать рабочий код по описанию на естественном языке, значительно снижая порог входа в программирование.',
    source: 'Вайбкодинг как явление',
  },
  {
    type: 'warning' as const,
    text: 'ИИ может подталкивать к менее безопасным решениям и повышать уверенность разработчиков в том, что сгенерированный код "точно безопасен", хотя это не так.',
    source: 'Stanford University, OpenReview',
  },
  {
    type: 'warning' as const,
    text: 'Отдельные исследования безопасности Copilot в security-чувствительных сценариях находили заметную долю уязвимых генераций - около 40% в некоторых экспериментах.',
    source: 'arXiv, исследования безопасности',
  },
];

const newRisks = [
  { title: 'Недетерминизм', desc: 'ИИ дает разные ответы на один вопрос. "Правдоподобная" ошибка опаснее явной.' },
  { title: 'Сдвиг ответственности', desc: 'Ты не пишешь код - ты верифицируешь чужой. Новый навык требует новой дисциплины.' },
  { title: 'Рост поверхности атак', desc: 'Особенно критично в security/infra. ИИ не понимает контекст безопасности.' },
  { title: 'Проблемы происхождения', desc: 'Почему модель так решила? Откуда паттерн? Воспроизводимость под вопросом.' },
];

const practicalAdvice = [
  { text: 'Тесты, свойства, контрактные спецификации - машина не "угадывает", а попадает в критерий. TDD становится важнее.' },
  { text: 'Статический анализ, линтеры, SAST для всего сгенерированного кода. Автоматическая проверка важнее ручного ревью.' },
  { text: '"Policy by default" - запрет опасных паттернов, секретов в коде, небезопасных API. Guardrails важнее доверия.' },
  { text: 'Журналирование промптов, версий моделей, диффов. Воспроизводимость - новое требование к разработке.' },
  { text: 'Культура review, где человек отвечает за инварианты и архитектуру, а не за набивку шаблонного кода.' },
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
      { name: 'Цикл Сарос', desc: 'Предсказание солнечных и лунных затмений. Период: 18 лет 11 дней. Через каждые 18 лет затмения повторяются в том же порядке.', detail: 'Применение: предсказание дат затмений за десятилетия вперед' },
      { name: 'Цикл Экселигмос', desc: 'Расширение Сарос цикла (3 x Saros = 54 года). Затмения происходят в одном и том же географическом месте.', detail: 'Точность: через 54 года затмение вернется на ту же широту' },
      { name: 'Метонический цикл', desc: 'Фазы Луны повторяются на те же дни года через 19 лет. На механизме: спираль на задней панели с 235 ячейками (лунные месяцы).', detail: 'Применение: синхронизация лунного и солнечного календарей' },
    ],
    color: 'gold',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ ЛУНЫ',
    items: [
      { name: 'Лунные фазы', desc: 'Визуализация: половинка бронзовой сферы (черная и белая). Механизм: система дифференциального привода, вращающая сферу.', detail: 'Точность: период синодического месяца = 29.53 дня (современное значение: 29.530589 дней). Ошибка менее 0.001%!' },
      { name: 'Аномалистический месяц', desc: 'Проблема: Луна движется быстрее в перигее (ближе к Земле), медленнее в апогее (дальше от Земли).', detail: 'Решение: механизм с штифтом и пазом (pin-and-slot mechanism). Один зубец входит в паз другого, изменяя радиус вращения. Результат: ускорение и замедление, моделирующие реальное движение Луны.' },
    ],
    color: 'cyan',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ СОЛНЦА',
    items: [
      { name: 'Положение в Зодиаке', desc: 'Отслеживает движение Солнца через 12 знаков зодиака. На циферблате: 365-дневный год.', detail: 'Это уже удивительная точность для того времени!' },
      { name: 'Солнечная аномалия', desc: 'Проблема: Земля не движется с одинаковой скоростью вокруг Солнца.', detail: 'Решение: система из 3 шестерен с эксцентрическим приводом. Результат: точное отслеживание неправильности орбиты.' },
      { name: 'Солнцестояния и равноденствия', desc: 'Отслеживает: дни летнего и зимнего солнцестояния, весеннего и осеннего равноденствия.', detail: 'Применение: критические дни для земледелия, религиозных обрядов, календаря' },
    ],
    color: 'orange',
  },
  {
    category: 'ОТСЛЕЖИВАНИЕ ПЛАНЕТ',
    items: [
      { name: '5 классических планет', desc: 'Меркурий, Венера, Марс, Юпитер, Сатурн - все видимые невооруженным глазом планеты древности.', detail: 'Механизм отслеживал положение каждой планеты на небесной сфере' },
      { name: 'Синодические циклы', desc: 'Периоды повторения положения планет относительно Солнца. Венера: 462 года. Сатурн: 442 года.', detail: 'Маркировки на корпусе: инструкции на задней крышке для расчета этих циклов' },
      { name: 'Восхождения звезд', desc: 'Heliacal Rising/Setting - отслеживает, когда звезды появляются и исчезают на горизонте.', detail: 'Критически важно для древней навигации и религиозных ритуалов' },
    ],
    color: 'pink',
  },
  {
    category: 'КАЛЕНДАРЬ И ИГРЫ',
    items: [
      { name: 'Египетский календарь', desc: 'День: указатель даты на передней панели. Дни года: 365 дней на кольцевом диске.', detail: 'Простой и практичный календарь для повседневного использования' },
      { name: 'Олимпийский цикл', desc: 'Вспомогательный циферблат на задней панели. Отслеживает: Панеллинские игры (Олимпиада, каждые 4 года).', detail: 'Применение: спортивные и религиозные мероприятия всей Греции' },
    ],
    color: 'green',
  },
  {
    category: 'КОСМИЧЕСКИЙ ПОРЯДОК',
    items: [
      { name: 'Греческий космос', desc: 'Кольцо из дисков, отображающее древнегреческое понимание устройства космоса.', detail: 'Система: планетарные кольца с индексными буквами, соответствующие текстам на передней панели (Front Cover Inscriptions - FCI)' },
      { name: 'Концентрические кольца', desc: 'Все планеты одновременно отображаются на системе концентрических колец.', detail: 'Визуализация: механическая модель геоцентрической вселенной Птолемея' },
    ],
    color: 'cyan',
  },
];

const researchHistory = [
  { year: '1901', event: 'Обнаружение', desc: 'Ныряльщики за губками находят обломки древнего корабля у острова Антикитера. Среди амфор и статуй - покрытый коррозией механизм.' },
  { year: '1902', event: 'Первое изучение', desc: 'Археолог Валериос Стаис замечает шестеренку в одном из фрагментов. Но находку считают просто астрономическими часами.' },
  { year: '1951', event: 'Первая реконструкция', desc: 'Дерек Прайс начинает серьезное исследование. Выдвигает гипотезу о вычислительном устройстве.' },
  { year: '1974', event: 'Публикация Прайса', desc: 'Выходит монография "Gears from the Greeks". Мир узнает о сложности механизма.' },
  { year: '2005', event: 'CT-сканирование', desc: 'Прорыв! Команда Antikythera Mechanism Research Project использует рентгеновскую томографию. Обнаружено более 3000 символов надписей.' },
  { year: '2006', event: 'Расшифровка', desc: 'Публикация в Nature. Подтверждено: это полноценный аналоговый компьютер для астрономических вычислений.' },
  { year: '2021', event: 'Полная модель', desc: 'Ученые UCL публикуют первую полную гипотетическую модель механизма с объяснением работы всех шестеренок.' },
];

function FloatingParticles() {
  return (
    <div className="history-particles">
      {[...Array(25)].map((_, i) => (
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
                src="https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=800"
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
                <p>Это аналоговый компьютер, как логарифмическая линейка или механический калькулятор XIX века.</p>
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
            Древние греки измерили неравномерность движения Луны и механизм это реализовал механически.
            Такая точность была недостижима до изобретения телескопов и открытия законов Кеплера в XVII веке.
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
          <p className="antikythera-research-intro">
            <strong>Почему так долго разгадывали?</strong> Фрагментирована (только 82 куска, 7 механически значимых).
            Корочка морской соли скрывала детали 100 лет. Много гипотез, мало фактов.
          </p>
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
            <strong>Урок истории:</strong>
            <p>После Антикитерского механизма человечество не создавало ничего столь сложного
            <strong> 1700 лет</strong> - до механических часов XIV века. Технологии могут быть
            утеряны на тысячелетия. Каждое поколение должно переоткрывать знания заново.
            Это был не просто механизм - это был <strong>компьютер, который вычислял космос</strong>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProgrammingHistory() {
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    document.title = 'История программирования | От Антикитерского механизма до вайбкодинга с ИИ';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Полная история программирования: от Антикитерского механизма (100 до н.э.) до вайбкодинга с Cursor AI. FORTRAN, Unix, SQL, Java, облака, React - как абстракции меняли разработку. Почему ИИ-ассистенты - следующий этап эволюции кода.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'история программирования, антикитерский механизм компьютер, первый компьютер, вайбкодинг история, эволюция кода, от FORTRAN до вайбкодинга, Cursor AI история, AI-ассистенты программирование, история абстракций, Unix история, SQL история, Java GC, облачные вычисления история, React JSX, цикл Сарос, Метонический цикл, древнегреческий компьютер');
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getAccentClass = (color: string) => {
    switch (color) {
      case 'cyan': return 'history-accent-cyan';
      case 'pink': return 'history-accent-pink';
      case 'green': return 'history-accent-green';
      case 'gold': return 'history-accent-gold';
      case 'orange': return 'history-accent-orange';
      default: return 'history-accent-cyan';
    }
  };

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
            2000 лет эволюции: от бронзовых шестеренок до нейронных сетей
          </p>

          <div className="history-hero-stats">
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">2000+</span>
              <span className="history-hero-stat-label">лет истории</span>
            </div>
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">10</span>
              <span className="history-hero-stat-label">переломных эпох</span>
            </div>
            <div className="history-hero-stat">
              <span className="history-hero-stat-value">82</span>
              <span className="history-hero-stat-label">фрагмента первого компьютера</span>
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
          <h2 className="history-intro-title">Один паттерн - тысячи лет</h2>
          <p className="history-intro-text">
            Каждое поколение инженеров сталкивается с технологией, которая
            <strong className="history-highlight-cyan"> сдвигает границу ответственности вверх</strong>.
            Раньше ты отвечал за байты - потом за структуры; раньше за файлы - потом за запросы;
            раньше за сервера - потом за API. Теперь - за промпты.
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
          Ниже - полная хронология от первого компьютера человечества до вайбкодинга.
          С фактами, цитатами и уроками для тех, кто работает с ИИ сегодня.
        </p>
      </section>

      <AntikytheraSection />

      <section className="history-timeline">
        <div className="history-timeline-header">
          <h2 className="history-timeline-title">Хронология абстракций</h2>
          <p className="history-timeline-subtitle">От FORTRAN до React: каждая эпоха учила нас доверять машине больше</p>
        </div>

        {erasData.map((era, index) => (
          <div
            key={era.id}
            className={`history-era ${index % 2 === 0 ? 'history-era-left' : 'history-era-right'} ${activeEra === era.id ? 'history-era-active' : ''} ${getAccentClass(era.accentColor)}`}
            onMouseEnter={() => setActiveEra(era.id)}
            onMouseLeave={() => setActiveEra(null)}
          >
            <div className="history-era-node">
              <div className="history-era-node-inner" />
              <div className="history-era-node-pulse" />
            </div>

            <div className="history-era-card">
              <div className="history-era-image-container">
                <img src={era.image} alt={era.title} className="history-era-image" loading="lazy" />
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
                    <cite className="history-quote-source">- {era.quote.source}</cite>
                  </blockquote>
                )}

                {era.skeptics && (
                  <div className="history-era-skeptics">
                    <span className="history-skeptics-label">Что говорили скептики:</span>
                    <p className="history-skeptics-text">"{era.skeptics}"</p>
                  </div>
                )}

                {era.facts && (
                  <div className="history-era-facts">
                    <span className="history-facts-label">Факты:</span>
                    <ul className="history-facts-list">
                      {era.facts.map((fact, fIndex) => (
                        <li key={fIndex}>{fact}</li>
                      ))}
                    </ul>
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
            Вайбкодинг, Cursor, Claude - почему спор выглядит знакомо, но ставки выше
          </p>
        </div>

        <div className="history-ai-intro">
          <p>
            Сегодня ИИ-ассистенты действительно дают измеримый прирост скорости на типовых задачах.
            GitHub Copilot, Cursor, Claude Code - все они позволяют описать задачу на естественном языке
            и получить работающий код. Это называют <strong>вайбкодингом</strong> - программированием через диалог с ИИ.
          </p>
          <p>
            Но одновременно появляются строгие предупреждения о новых рисках. История учит:
            скептики обычно правы насчет проблем, но ошибаются в прогнозе "это никогда не заработает".
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
            Скептики не просто ворчат - они указывают на реальный новый класс рисков,
            которого не было при предыдущих абстракциях:
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
            <span className="history-highlight-cyan"> формальными</span> (компилятор, оптимизатор, GC, SQL) -
            их можно было понимать как систему правил. Генеративный ИИ во многом
            <span className="history-highlight-pink"> статистичен</span>, а значит требует
            <strong> другой культуры контроля</strong>. Нельзя "прочитать исходники" модели.
          </p>
        </div>
      </section>

      <section className="history-advice-section">
        <div className="history-advice-header">
          <h2 className="history-advice-title">
            Что делать инженеру сегодня
          </h2>
          <p className="history-advice-subtitle">
            Чтобы "не повторить рифму" - но и не попасть в ловушку
          </p>
        </div>

        <div className="history-advice-wisdom">
          <p className="history-wisdom-text">
            <strong>История не доказывает, что "скептики всегда неправы".</strong>
            <br />Она показывает другое:
          </p>
          <ol className="history-wisdom-list">
            <li>
              Они <span className="history-highlight-green">правы насчет рисков</span> - вначале.
              FORTRAN действительно был медленнее ручного кода. GC действительно добавлял паузы.
              Облака действительно создавали новые угрозы безопасности.
            </li>
            <li>
              Они <span className="history-highlight-pink">ошибаются в прогнозе тотального запрета</span> -
              потому что индустрия почти всегда находит способ приручить выгоду.
              Появляются инструменты, практики, стандарты.
            </li>
          </ol>
        </div>

        <div className="history-advice-practical">
          <h3 className="history-practical-title">
            <span className="neon-text">"Компиляторы эпохи ИИ"</span>
          </h3>
          <p className="history-practical-intro">
            Практичный вывод: ИИ стоит воспринимать как новый слой, который требует своих инструментов контроля.
            Как компилятор требовал профилировщиков, как GC требовал метрик, так и ИИ требует:
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
          <h2 className="history-conclusion-title">Вывод</h2>
          <p className="history-conclusion-text">
            ИИ - это не "конец инженерии", а
            <span className="history-highlight-cyan"> смена ремесла</span>:
            меньше ручной кладки кирпичей, больше
            <span className="history-highlight-pink"> архитектуры</span>,
            <span className="history-highlight-green"> проверки</span>,
            безопасности и постановки правильных ограничений.
          </p>
          <p className="history-conclusion-subtext">
            От Антикитерского механизма до Cursor - история программирования учит одному:
            абстракции побеждают, но требуют новой дисциплины. Те, кто освоит эту дисциплину первыми,
            получат преимущество. Как получили его программисты FORTRAN, когда другие еще писали машинный код.
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
          <h2>История программирования: от древних механизмов до искусственного интеллекта</h2>
          <p>
            История программирования и вычислительной техники насчитывает более 2000 лет.
            Антикитерский механизм, созданный древними греками около 100 года до нашей эры,
            является первым известным аналоговым компьютером. Этот бронзовый механизм
            с 37-82 шестеренками мог предсказывать затмения по циклу Сарос (18 лет 11 дней),
            отслеживать движение планет и рассчитывать фазы Луны с точностью менее 0.001% ошибки.
          </p>
          <p>
            Механизм использовал систему дифференциального привода для визуализации лунных фаз,
            механизм штифт-паз для моделирования неравномерной орбиты Луны, и эксцентрический
            привод для отслеживания солнечной аномалии. Спираль на задней панели с 235 ячейками
            реализовывала Метонический цикл (19 лет) для синхронизации лунного и солнечного календарей.
          </p>
          <p>
            Современная эра программирования началась с появления FORTRAN в 1950-х годах -
            первого коммерчески успешного языка высокого уровня. Затем последовали
            структурное программирование (отказ от GOTO, 1968), переход Unix на язык C (1973),
            реляционные базы данных и SQL (1970-е), автоматическое управление памятью
            в Java (1990-е), облачные вычисления AWS (2006) и компонентный подход React (2013).
          </p>
          <p>
            Сегодня мы наблюдаем новую революцию - вайбкодинг с использованием ИИ-ассистентов.
            Cursor, GitHub Copilot, Claude и другие инструменты позволяют создавать код
            на естественном языке. Это следующий этап эволюции абстракций в программировании,
            который требует новых навыков и новой культуры разработки.
          </p>
        </div>
      </section>
    </div>
  );
}
