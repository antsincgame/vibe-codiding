export default function TestBlock() {
  return (
    <section className="test-block">
      <div className="container">
        <div className="test-content">
          <h2 className="test-title">Начни свой путь в программировании</h2>
          <p className="test-description">
            Присоединяйся к нашему сообществу студентов и начни создавать свои первые проекты уже сегодня.
            Получи доступ к современным инструментам и поддержке опытных менторов.
          </p>
          <div className="test-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Выпускников</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Завершают курс</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Поддержка</div>
            </div>
          </div>
          <button className="cta-button">
            <span>Начать обучение</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
