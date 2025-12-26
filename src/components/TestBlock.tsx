export default function TestBlock() {
  return (
    <section className="test-block">
      <div className="container">
        <div className="test-content">
          <h2 className="test-title">Начни Свой Путь в Программировании</h2>
          <p className="test-description">
            Присоединяйся к сообществу молодых разработчиков, которые уже создают свои первые проекты
            и осваивают современные технологии. Начни обучение с пробного урока и убедись,
            что программирование — это увлекательно и доступно!
          </p>

          <div className="test-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Учеников</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Проектов</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Довольных</div>
            </div>
          </div>

          <button
            className="cta-button"
            onClick={() => window.location.href = '/trial'}
          >
            Записаться на пробный урок
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
