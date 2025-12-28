import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SuccessModal from '../components/SuccessModal';

const SEO = {
  title: 'Бесплатный пробный урок Vibecoding | Записаться на вайб-кодинг 2025',
  description: 'Запишись на бесплатный пробный урок вайб-кодинга! Познакомься с Cursor AI и Bolt.new, создай первый проект за 1.5 часа. Онлайн занятие для подростков от 16 лет и взрослых. Без обязательств - просто попробуй!',
  keywords: 'пробный урок программирования бесплатно, бесплатное занятие вайб кодинг, Cursor AI попробовать бесплатно, Bolt.new демо урок, записаться на курс программирования, обучение IT бесплатно 2025'
};

export default function Trial() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    age_group: 'child',
    parent_name: '',
    child_name: '',
    child_age: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    document.title = SEO.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', SEO.description);
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) metaKeywords.setAttribute('content', SEO.keywords);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data based on age_group
    const registrationData: any = {
      age_group: formData.age_group,
      parent_name: formData.parent_name,
      phone: formData.phone,
      message: formData.message || ''
    };

    // Add child-specific data only for child group
    if (formData.age_group === 'child') {
      registrationData.child_name = formData.child_name;
      registrationData.child_age = parseInt(formData.child_age);
    } else {
      // For adults, set child fields to null
      registrationData.child_name = null;
      registrationData.child_age = null;
    }

    const { error } = await supabase
      .from('trial_registrations')
      .insert([registrationData]);

    if (error) {
      console.error('Error submitting registration:', error);
      alert('Ошибка при отправке заявки. Попробуйте еще раз.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If changing age_group, clear child-specific fields when switching to adult
    if (name === 'age_group') {
      if (value === 'adult') {
        setFormData({
          ...formData,
          age_group: value,
          child_name: '',
          child_age: ''
        });
      } else {
        setFormData({
          ...formData,
          age_group: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <>
      <SuccessModal
        isOpen={showModal}
        onClose={handleModalClose}
        message="Мы свяжемся с вами когда будем проводить пробный групповой урок"
      />

      <div style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '60px',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 56px)',
          textAlign: 'center',
          marginBottom: '20px'
        }} className="glitch" data-text="ПРОБНЫЙ УРОК">
          <span className="neon-text">ПРОБНЫЙ УРОК</span>
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          opacity: 0.8,
          marginBottom: '60px'
        }}>
          Запишись на бесплатное онлайн-занятие по <strong>вайб-кодингу</strong> и начни <strong>создание веб-приложений</strong> с <strong>Cursor AI</strong> и <strong>Bolt.ai</strong>!
        </p>

        <div className="cyber-card" style={{ padding: '40px' }}>
          <div style={{
            marginBottom: '40px',
            padding: '30px',
            background: 'rgba(0, 255, 249, 0.05)',
            border: '1px solid rgba(0, 255, 249, 0.3)'
          }}>
            <h3 style={{
              fontSize: '24px',
              marginBottom: '20px',
              color: 'var(--neon-cyan)'
            }}>
              Что тебя ждёт на пробном уроке:
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0
            }}>
              {[
                'Знакомство с преподавателем и онлайн-форматом обучения',
                'Первый практический проект с Cursor AI или Bolt.ai',
                'Определение подходящего курса вайб-кодинга',
                'Ответы на все вопросы о создании веб-приложений',
                'Демонстрация реальных проектов учеников'
              ].map((item, idx) => (
                <li key={idx} style={{
                  marginBottom: '12px',
                  paddingLeft: '25px',
                  position: 'relative',
                  fontSize: '18px'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: 'var(--neon-green)',
                    fontSize: '20px'
                  }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                Возрастная группа *
              </label>
              <select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                required
                className="cyber-input"
                style={{
                  cursor: 'pointer'
                }}
              >
                <option value="child">Подросток (16-18 лет)</option>
                <option value="adult">Взрослый (18+)</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                {formData.age_group === 'child' ? 'Контактное имя *' : 'Ваше имя *'}
              </label>
              <input
                type="text"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                required
                className="cyber-input"
                placeholder={formData.age_group === 'child' ? 'Введите контактное имя' : 'Введите ваше имя'}
              />
            </div>

            {formData.age_group === 'child' && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: 'var(--neon-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600
                  }}>
                    Имя подростка *
                  </label>
                  <input
                    type="text"
                    name="child_name"
                    value={formData.child_name}
                    onChange={handleChange}
                    required={formData.age_group === 'child'}
                    className="cyber-input"
                    placeholder="Введите имя подростка"
                  />
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '16px',
                    color: 'var(--neon-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600
                  }}>
                    Возраст *
                  </label>
                  <input
                    type="number"
                    name="child_age"
                    value={formData.child_age}
                    onChange={handleChange}
                    required={formData.age_group === 'child'}
                    className="cyber-input"
                    min="16"
                    max="18"
                    placeholder="16"
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                Телефон *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="cyber-input"
                placeholder="+375 (XX) XXX-XX-XX"
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                Дополнительная информация
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="cyber-input"
                placeholder={formData.age_group === 'child' ? 'Расскажите об интересах, предпочитаемом времени занятий или задайте вопрос' : 'Расскажите о своих интересах, предпочитаемом времени занятий или задайте вопрос'}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-button"
              style={{
                width: '100%',
                fontSize: '18px',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'ОТПРАВКА...' : 'ЗАПИСАТЬСЯ'}
            </button>
          </form>

          <p style={{
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '14px',
            opacity: 0.6
          }}>
            Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
          </p>
        </div>

        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'rgba(255, 0, 110, 0.1)',
          border: '1px solid var(--neon-pink)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '28px',
            marginBottom: '15px',
            color: 'var(--neon-pink)'
          }}>
            ОСТАЛИСЬ ВОПРОСЫ?
          </h3>
          <p style={{
            fontSize: '18px',
            marginBottom: '20px',
            opacity: 0.8
          }}>
            Позвони нам или напиши в мессенджер
          </p>
          <a
            href="https://wa.me/375292828878"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--neon-cyan)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-green)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--neon-cyan)'}
          >
            +375 (29) 282-88-78
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
