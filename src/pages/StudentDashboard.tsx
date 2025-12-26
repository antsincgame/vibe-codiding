import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  console.log('StudentDashboard rendered - user:', user?.email, 'profile:', profile?.email);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName });
    if (error) {
      alert('Ошибка сохранения профиля');
    } else {
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            margin: 0
          }} className="glitch" data-text="ЛИЧНЫЙ КАБИНЕТ">
            <span className="neon-text">ЛИЧНЫЙ КАБИНЕТ</span>
          </h1>

          <button
            onClick={handleSignOut}
            className="cyber-button"
            style={{
              fontSize: '14px',
              padding: '12px 24px',
              background: 'rgba(255, 0, 110, 0.2)',
              border: '2px solid var(--neon-pink)'
            }}
          >
            ВЫЙТИ
          </button>
        </div>

        <div className="cyber-card" style={{ padding: '40px', marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '3px solid var(--neon-cyan)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '3px solid var(--neon-cyan)',
                background: 'rgba(0, 255, 249, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: 700,
                color: 'var(--neon-cyan)'
              }}>
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '28px',
                marginBottom: '10px',
                color: 'var(--neon-cyan)'
              }}>
                {profile?.full_name || 'Ученик'}
              </h2>
              <p style={{
                fontSize: '16px',
                opacity: 0.8,
                marginBottom: '5px'
              }}>
                {profile?.email}
              </p>
              <p style={{
                fontSize: '14px',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Роль: {profile?.role === 'admin' ? 'Администратор' : 'Ученик'}
              </p>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(0, 255, 249, 0.3)',
            paddingTop: '30px'
          }}>
            <h3 style={{
              fontSize: '20px',
              marginBottom: '20px',
              color: 'var(--neon-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Редактировать профиль
            </h3>

            {isEditing ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '14px',
                    color: 'var(--neon-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 600
                  }}>
                    Имя
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="cyber-input"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '15px'
                }}>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="cyber-button"
                    style={{
                      opacity: saving ? 0.5 : 1,
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile?.full_name || '');
                    }}
                    className="cyber-button"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    ОТМЕНА
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="cyber-button"
              >
                РЕДАКТИРОВАТЬ
              </button>
            )}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '40px' }}>
          <h3 style={{
            fontSize: '24px',
            marginBottom: '20px',
            color: 'var(--neon-cyan)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Мои курсы
          </h3>
          <p style={{
            fontSize: '16px',
            opacity: 0.7,
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            Функционал курсов находится в разработке. Скоро здесь появятся ваши активные курсы, прогресс обучения и домашние задания.
          </p>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => navigate('/courses')}
              className="cyber-button"
            >
              ПОСМОТРЕТЬ ДОСТУПНЫЕ КУРСЫ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
