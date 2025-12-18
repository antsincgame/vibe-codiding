import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface LessonFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  order_index: number;
  duration_minutes: number;
  difficulty_level: string;
  files?: LessonFile[];
}

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchLessons();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        await fetchLessons();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      if (lessonsData && lessonsData.length > 0) {
        const lessonIds = lessonsData.map((l) => l.id);
        const { data: filesData, error: filesError } = await supabase
          .from('lesson_files')
          .select('*')
          .in('lesson_id', lessonIds);

        if (filesError) throw filesError;

        const lessonsWithFiles = lessonsData.map((lesson) => ({
          ...lesson,
          files: filesData?.filter((f) => f.lesson_id === lesson.id) || [],
        }));

        setLessons(lessonsWithFiles);
        if (lessonsWithFiles.length > 0) {
          setSelectedLesson(lessonsWithFiles[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return '#00ff00';
      case 'intermediate':
        return '#ffff00';
      case 'advanced':
        return '#ff0000';
      default:
        return 'var(--neon-cyan)';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начинающий';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1
        className="neon-text"
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '48px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        Учебные Материалы
      </h1>
      <p
        style={{
          textAlign: 'center',
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '40px',
          fontFamily: 'Rajdhani, sans-serif',
        }}
      >
        Видеоуроки и материалы для обучения
      </p>

      {authLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
            Загрузка...
          </p>
        </div>
      ) : !isAuthenticated ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              background: 'var(--bg-dark)',
              border: '2px solid var(--neon-cyan)',
              borderRadius: '8px',
              padding: '40px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '24px',
                marginBottom: '20px',
                color: 'var(--neon-cyan)',
              }}
            >
              Доступ только для авторизованных пользователей
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                fontFamily: 'Rajdhani, sans-serif',
                lineHeight: '1.6',
              }}
            >
              Для просмотра учебных материалов необходимо войти в систему
            </p>
          </div>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
            Загрузка...
          </p>
        </div>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
            Уроки пока не добавлены
          </p>
        </div>
      ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '30px',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-dark)',
                  border: '2px solid var(--neon-cyan)',
                  borderRadius: '8px',
                  padding: '20px',
                  height: 'fit-content',
                  maxHeight: 'calc(100vh - 200px)',
                  overflowY: 'auto',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '20px',
                    marginBottom: '20px',
                    color: 'var(--neon-cyan)',
                  }}
                >
                  Список уроков
                </h3>
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      background:
                        selectedLesson?.id === lesson.id
                          ? 'rgba(0, 255, 249, 0.1)'
                          : 'rgba(0, 0, 0, 0.3)',
                      border:
                        selectedLesson?.id === lesson.id
                          ? '2px solid var(--neon-cyan)'
                          : '1px solid rgba(0, 255, 249, 0.3)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLesson?.id !== lesson.id) {
                        e.currentTarget.style.background = 'rgba(0, 255, 249, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLesson?.id !== lesson.id) {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                      }
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        marginBottom: '5px',
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{lesson.duration_minutes} мин</span>
                      <span
                        style={{
                          color: getDifficultyColor(lesson.difficulty_level),
                          fontWeight: 600,
                        }}
                      >
                        {getDifficultyText(lesson.difficulty_level)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedLesson && (
                <div
                  style={{
                    background: 'var(--bg-dark)',
                    border: '2px solid var(--neon-cyan)',
                    borderRadius: '8px',
                    padding: '30px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '32px',
                      marginBottom: '20px',
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    {selectedLesson.title}
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '20px',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    <span>
                      <strong>Длительность:</strong> {selectedLesson.duration_minutes} минут
                    </span>
                    <span>
                      <strong>Уровень:</strong>{' '}
                      <span
                        style={{
                          color: getDifficultyColor(selectedLesson.difficulty_level),
                          fontWeight: 600,
                        }}
                      >
                        {getDifficultyText(selectedLesson.difficulty_level)}
                      </span>
                    </span>
                  </div>

                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      marginBottom: '20px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedLesson.youtube_video_id}`}
                      title={selectedLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <h3
                      style={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: '20px',
                        marginBottom: '15px',
                        color: 'var(--neon-cyan)',
                      }}
                    >
                      Описание
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {selectedLesson.description}
                    </p>
                  </div>

                  {selectedLesson.files && selectedLesson.files.length > 0 && (
                    <div>
                      <h3
                        style={{
                          fontFamily: 'Orbitron, sans-serif',
                          fontSize: '20px',
                          marginBottom: '15px',
                          color: 'var(--neon-cyan)',
                        }}
                      >
                        Материалы к уроку
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedLesson.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '15px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid var(--neon-cyan)',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              color: 'var(--text-primary)',
                              fontFamily: 'Rajdhani, sans-serif',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 255, 249, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, marginBottom: '5px' }}>
                                {file.file_name}
                              </div>
                              {file.description && (
                                <div
                                  style={{
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  {file.description}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {formatFileSize(file.file_size)}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
    </div>
  );
}
