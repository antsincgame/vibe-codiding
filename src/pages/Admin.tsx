import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { uploadStudentWorkImage, uploadCourseImage, uploadBlogImage } from '../lib/storageService';
import { renderMarkdown, stripMarkdown } from '../lib/markdown';
import EmailSettingsManager from '../components/EmailSettingsManager';
import type { Course, FAQ, TrialRegistration, StudentWork, BlogPost, HomePageSettings } from '../types';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'faqs' | 'registrations' | 'works' | 'blog' | 'home' | 'email' | 'users'>('courses');

  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [registrations, setRegistrations] = useState<TrialRegistration[]>([]);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomePageSettings | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingWork, setEditingWork] = useState<StudentWork | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/login');
        return;
      }
      loadData();
    };
    checkAuth();
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const loadData = async () => {
    if (activeTab === 'courses') {
      const { data } = await supabase.from('courses').select('*').order('order_index');
      if (data) setCourses(data);
    } else if (activeTab === 'faqs') {
      const { data } = await supabase.from('faqs').select('*').order('category').order('order_index');
      if (data) setFaqs(data);
    } else if (activeTab === 'registrations') {
      const { data } = await supabase
        .from('trial_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setRegistrations(data);
    } else if (activeTab === 'works') {
      const { data } = await supabase
        .from('student_works')
        .select('*')
        .order('order_index');
      if (data) setStudentWorks(data);
    } else if (activeTab === 'blog') {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setBlogPosts(data);
    } else if (activeTab === 'home') {
      await loadHomeSettings();
    } else if (activeTab === 'users') {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setUsers(data);
    }
  };

  const loadHomeSettings = async () => {
    const { data } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', ['home_title', 'home_subtitle', 'home_description', 'home_meta_title', 'home_meta_description', 'home_meta_keywords']);

    if (data && data.length > 0) {
      const settingsMap: Record<string, string> = {};
      data.forEach(item => {
        settingsMap[item.key] = item.value;
      });

      setHomeSettings({
        title: settingsMap['home_title'] || '',
        subtitle: settingsMap['home_subtitle'] || '',
        description: settingsMap['home_description'] || '',
        meta_title: settingsMap['home_meta_title'] || '',
        meta_description: settingsMap['home_meta_description'] || '',
        meta_keywords: settingsMap['home_meta_keywords'] || '',
      });
    }
  };

  const saveHomeSettings = async (settings: HomePageSettings) => {
    try {
      const updates = [
        { key: 'home_title', value: settings.title, description: 'Title on home page' },
        { key: 'home_subtitle', value: settings.subtitle, description: 'Subtitle on home page' },
        { key: 'home_description', value: settings.description, description: 'Description on home page' },
        { key: 'home_meta_title', value: settings.meta_title, description: 'SEO meta title for home page' },
        { key: 'home_meta_description', value: settings.meta_description, description: 'SEO meta description for home page' },
        { key: 'home_meta_keywords', value: settings.meta_keywords, description: 'SEO keywords for home page' },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('system_settings')
          .upsert({
            key: update.key,
            value: update.value,
            description: update.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) {
          console.error('Error updating setting:', update.key, error);
          throw error;
        }
      }

      setHomeSettings(settings);
      alert('Настройки успешно сохранены! Обновите главную страницу для просмотра изменений.');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Удалить курс?')) return;
    await supabase.from('courses').delete().eq('id', id);
    loadData();
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Удалить вопрос?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    loadData();
  };

  const saveCourse = async (course: Partial<Course>) => {
    try {
      if (course.id) {
        const { error } = await supabase.from('courses').update(course).eq('id', course.id);
        if (error) {
          alert(`Ошибка сохранения: ${error.message}`);
          console.error('Error saving course:', error);
          return;
        }
      } else {
        const { id, ...courseWithoutId } = course;
        const { error } = await supabase.from('courses').insert([courseWithoutId]);
        if (error) {
          alert(`Ошибка создания курса: ${error.message}`);
          console.error('Error creating course:', error);
          return;
        }
      }
      setEditingCourse(null);
      loadData();
    } catch (err) {
      alert('Произошла ошибка при сохранении');
      console.error('Error:', err);
    }
  };

  const saveFaq = async (faq: Partial<FAQ>) => {
    try {
      if (faq.id) {
        const { error } = await supabase.from('faqs').update(faq).eq('id', faq.id);
        if (error) {
          alert(`Ошибка сохранения: ${error.message}`);
          return;
        }
      } else {
        const { id, ...faqWithoutId } = faq;
        const { error } = await supabase.from('faqs').insert([faqWithoutId]);
        if (error) {
          alert(`Ошибка создания: ${error.message}`);
          return;
        }
      }
      setEditingFaq(null);
      loadData();
    } catch (err) {
      alert('Произошла ошибка при сохранении');
    }
  };

  const deleteWork = async (id: string) => {
    if (!confirm('Удалить работу?')) return;
    await supabase.from('student_works').delete().eq('id', id);
    loadData();
  };

  const saveWork = async (work: Partial<StudentWork>) => {
    try {
      if (work.id) {
        const { error } = await supabase.from('student_works').update(work).eq('id', work.id);
        if (error) {
          alert(`Ошибка сохранения: ${error.message}`);
          return;
        }
      } else {
        const { id, ...workWithoutId } = work;
        const { error } = await supabase.from('student_works').insert([workWithoutId]);
        if (error) {
          alert(`Ошибка создания: ${error.message}`);
          return;
        }
      }
      setEditingWork(null);
      loadData();
    } catch (err) {
      alert('Произошла ошибка при сохранении');
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    loadData();
  };

  const saveBlogPost = async (post: Partial<BlogPost>) => {
    try {
      if (post.id) {
        const { error } = await supabase.from('blog_posts').update({
          ...post,
          updated_at: new Date().toISOString()
        }).eq('id', post.id);
        if (error) {
          alert(`Ошибка сохранения: ${error.message}`);
          return;
        }
      } else {
        const { id, ...postWithoutId } = post;
        const { error } = await supabase.from('blog_posts').insert([postWithoutId]);
        if (error) {
          alert(`Ошибка создания: ${error.message}`);
          return;
        }
      }
      setEditingBlogPost(null);
      loadData();
    } catch (err) {
      alert('Произошла ошибка при сохранении');
    }
  };

  const saveUser = async (user: Partial<UserProfile>) => {
    try {
      if (!user.id) {
        alert('Ошибка: ID пользователя не найден');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url
        })
        .eq('id', user.id);

      if (error) {
        alert(`Ошибка сохранения: ${error.message}`);
        return;
      }

      setEditingUser(null);
      loadData();
      alert('Данные пользователя успешно обновлены');
    } catch (err) {
      alert('Произошла ошибка при сохранении');
    }
  };

  const updateRegistrationStatus = async (id: string, status: string) => {
    await supabase
      .from('trial_registrations')
      .update({ status })
      .eq('id', id);
    loadData();
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <h1 style={{ fontSize: '48px' }} className="neon-text">
            ADMIN PANEL
          </h1>
          <button onClick={handleLogout} className="cyber-button" style={{
            borderColor: 'var(--neon-pink)',
            color: 'var(--neon-pink)'
          }}>
            Выход
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('courses')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'courses' ? 1 : 0.5
            }}
          >
            Курсы
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'faqs' ? 1 : 0.5
            }}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'registrations' ? 1 : 0.5
            }}
          >
            Заявки
          </button>
          <button
            onClick={() => setActiveTab('works')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'works' ? 1 : 0.5,
              borderColor: 'var(--neon-green)',
              color: 'var(--neon-green)'
            }}
          >
            Работы учеников
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'blog' ? 1 : 0.5,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Блог
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'home' ? 1 : 0.5,
              borderColor: 'var(--neon-cyan)',
              color: 'var(--neon-cyan)'
            }}
          >
            Главная страница
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'email' ? 1 : 0.5,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Email настройки
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'users' ? 1 : 0.5,
              borderColor: 'var(--neon-cyan)',
              color: 'var(--neon-cyan)'
            }}
          >
            Пользователи
          </button>
        </div>

        {activeTab === 'courses' && (
          <div>
            <button
              onClick={() => setEditingCourse({
                id: '',
                title: '',
                description: '',
                duration: '',
                age_group: '',
                price: '',
                image_url: '',
                features: [],
                is_active: true,
                order_index: 0,
                created_at: '',
                updated_at: ''
              })}
              className="cyber-button"
              style={{ marginBottom: '30px' }}
            >
              + Добавить курс
            </button>

            <div style={{ display: 'grid', gap: '20px' }}>
              {courses.map((course) => (
                <div key={course.id} className="cyber-card">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {course.image_url && (
                      <div style={{
                        width: '180px',
                        height: '120px',
                        borderRadius: '6px',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        <img
                          src={course.image_url}
                          alt={course.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '22px', color: 'var(--neon-cyan)', margin: 0 }}>
                          {course.title}
                        </h3>
                        {!course.is_active && (
                          <span style={{
                            background: 'rgba(255, 100, 100, 0.2)',
                            color: 'var(--neon-pink)',
                            padding: '2px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            Скрыт
                          </span>
                        )}
                        {course.slug && (
                          <span style={{
                            opacity: 0.5,
                            fontSize: '13px'
                          }}>
                            /{course.slug}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--neon-green)', marginBottom: '8px' }}>
                        {course.age_group} | {course.duration} | {course.price}
                      </div>
                      <p style={{ opacity: 0.8, marginBottom: '15px', fontSize: '14px' }}>
                        {stripMarkdown(course.description).substring(0, 150)}{stripMarkdown(course.description).length > 150 ? '...' : ''}
                      </p>
                      {Array.isArray(course.features) && course.features.length > 0 && (
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '15px' }}>
                          Особенности: {course.features.length} шт.
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="cyber-button"
                          style={{ padding: '8px 20px', fontSize: '14px' }}
                        >
                          Редактировать
                        </button>
                        {course.slug && (
                          <a
                            href={`/course/${course.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyber-button"
                            style={{
                              padding: '8px 20px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              borderColor: 'var(--neon-green)',
                              color: 'var(--neon-green)'
                            }}
                          >
                            Открыть
                          </a>
                        )}
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="cyber-button"
                          style={{
                            padding: '8px 20px',
                            fontSize: '14px',
                            borderColor: 'var(--neon-pink)',
                            color: 'var(--neon-pink)'
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="cyber-card" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ opacity: 0.6 }}>Пока нет курсов. Нажмите "Добавить курс" чтобы создать первый.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
            <button
              onClick={() => setEditingFaq({
                id: '',
                question: '',
                answer: '',
                category: 'general',
                order_index: 0,
                is_active: true,
                created_at: '',
                updated_at: ''
              })}
              className="cyber-button"
              style={{ marginBottom: '30px' }}
            >
              + Добавить вопрос
            </button>

            <div style={{ display: 'grid', gap: '20px' }}>
              {faqs.map((faq) => (
                <div key={faq.id} className="cyber-card">
                  <h3 style={{ fontSize: '20px', color: 'var(--neon-cyan)', marginBottom: '10px' }}>
                    {faq.question}
                  </h3>
                  <p style={{ opacity: 0.8, marginBottom: '15px' }}>{faq.answer}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="cyber-button"
                      style={{ padding: '8px 20px', fontSize: '14px' }}
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="cyber-button"
                      style={{
                        padding: '8px 20px',
                        fontSize: '14px',
                        borderColor: 'var(--neon-pink)',
                        color: 'var(--neon-pink)'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {registrations.map((reg) => (
              <div key={reg.id} className="cyber-card">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>
                      {reg.age_group === 'child' ? 'Родитель' : 'Имя'}
                    </div>
                    <div style={{ color: 'var(--neon-cyan)' }}>{reg.parent_name}</div>
                  </div>
                  {reg.age_group === 'child' && reg.child_name && (
                    <div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Подросток</div>
                      <div>{reg.child_name} ({reg.child_age} лет)</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Возрастная группа</div>
                    <div>{reg.age_group === 'child' ? 'Подросток (16-18 лет)' : 'Взрослый (18+)'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Телефон</div>
                    <div>{reg.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Email</div>
                    <div>{reg.email}</div>
                  </div>
                </div>
                {reg.message && (
                  <div style={{ marginBottom: '15px', opacity: 0.8 }}>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Сообщение</div>
                    {reg.message}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={reg.status}
                    onChange={(e) => updateRegistrationStatus(reg.id!, e.target.value)}
                    style={{ padding: '8px' }}
                  >
                    <option value="new">Новая</option>
                    <option value="contacted">Связались</option>
                    <option value="scheduled">Запланировано</option>
                    <option value="completed">Завершено</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'works' && (
          <div>
            <button
              onClick={() => setEditingWork({
                id: '',
                student_name: '',
                student_age: 14,
                project_title: '',
                project_description: '',
                project_url: '',
                image_url: '',
                tool_type: 'bolt',
                is_active: true,
                order_index: 0,
                created_at: '',
                updated_at: ''
              })}
              className="cyber-button"
              style={{ marginBottom: '30px' }}
            >
              + Добавить работу
            </button>

            <div style={{ display: 'grid', gap: '20px' }}>
              {studentWorks.map((work) => (
                <div key={work.id} className="cyber-card">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {work.image_url && (
                      <div style={{
                        width: '150px',
                        height: '100px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        <img
                          src={work.image_url}
                          alt={work.project_title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{ fontSize: '20px', color: 'var(--neon-cyan)', margin: 0 }}>
                          {work.project_title}
                        </h3>
                        <span style={{
                          background: work.tool_type === 'bolt' ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                          color: 'var(--bg-dark)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {work.tool_type === 'bolt' ? 'Bolt.new' : 'Cursor AI'}
                        </span>
                        {!work.is_active && (
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}>
                            Скрыто
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--neon-green)', marginBottom: '8px' }}>
                        {work.student_name}, {work.student_age} лет
                      </div>
                      <p style={{ opacity: 0.8, marginBottom: '15px', fontSize: '14px' }}>
                        {work.project_description}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditingWork(work)}
                          className="cyber-button"
                          style={{ padding: '8px 20px', fontSize: '14px' }}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => deleteWork(work.id)}
                          className="cyber-button"
                          style={{
                            padding: '8px 20px',
                            fontSize: '14px',
                            borderColor: 'var(--neon-pink)',
                            color: 'var(--neon-pink)'
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <button
              onClick={() => setEditingBlogPost({
                id: '',
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                image_url: '',
                meta_title: '',
                meta_description: '',
                meta_keywords: '',
                is_published: false,
                published_at: null,
                created_at: '',
                updated_at: ''
              })}
              className="cyber-button"
              style={{ marginBottom: '30px' }}
            >
              + Добавить статью
            </button>

            <div style={{ display: 'grid', gap: '20px' }}>
              {blogPosts.map((post) => (
                <div key={post.id} className="cyber-card">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {post.image_url && (
                      <div style={{
                        width: '200px',
                        height: '120px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        <img
                          src={post.image_url}
                          alt={post.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <h3 style={{ fontSize: '20px', color: 'var(--neon-pink)', margin: 0 }}>
                          {post.title}
                        </h3>
                        <span style={{
                          background: post.is_published ? 'var(--neon-green)' : 'rgba(255, 255, 255, 0.2)',
                          color: post.is_published ? 'var(--bg-dark)' : 'inherit',
                          padding: '2px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {post.is_published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                        /{post.slug}
                      </div>
                      <p style={{ opacity: 0.8, marginBottom: '15px', fontSize: '14px' }}>
                        {post.excerpt || 'Нет описания'}
                      </p>
                      {post.meta_title && (
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '10px' }}>
                          SEO: {post.meta_title}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setEditingBlogPost(post)}
                          className="cyber-button"
                          style={{ padding: '8px 20px', fontSize: '14px' }}
                        >
                          Редактировать
                        </button>
                        {post.is_published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cyber-button"
                            style={{
                              padding: '8px 20px',
                              fontSize: '14px',
                              textDecoration: 'none',
                              borderColor: 'var(--neon-cyan)',
                              color: 'var(--neon-cyan)'
                            }}
                          >
                            Открыть
                          </a>
                        )}
                        <button
                          onClick={() => deleteBlogPost(post.id)}
                          className="cyber-button"
                          style={{
                            padding: '8px 20px',
                            fontSize: '14px',
                            borderColor: 'var(--neon-pink)',
                            color: 'var(--neon-pink)'
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <div className="cyber-card" style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ opacity: 0.6 }}>Пока нет статей. Нажмите "Добавить статью" чтобы создать первую.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'home' && homeSettings && (
          <HomePageSettingsModal
            settings={homeSettings}
            onSave={saveHomeSettings}
          />
        )}

        {activeTab === 'email' && (
          <EmailSettingsManager />
        )}

        {activeTab === 'users' && (
          <div>
            <div style={{
              display: 'grid',
              gap: '20px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
            }}>
              {users.map((user) => (
                <div key={user.id} className="cyber-card">
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: user.avatar_url ? `url(${user.avatar_url})` : 'linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {!user.avatar_url && (user.full_name?.[0] || user.email[0]).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '18px',
                        color: 'var(--neon-cyan)',
                        marginBottom: '4px',
                        wordBreak: 'break-word'
                      }}>
                        {user.full_name || 'Без имени'}
                      </h3>
                      <div style={{
                        fontSize: '13px',
                        opacity: 0.8,
                        wordBreak: 'break-all'
                      }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '10px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: user.role === 'admin' ? 'var(--neon-pink)' : user.role === 'student' ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.2)',
                      color: user.role === 'admin' || user.role === 'student' ? 'var(--bg-dark)' : 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {user.role === 'admin' ? 'Администратор' : user.role === 'student' ? 'Студент' : user.role}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '12px',
                    opacity: 0.6,
                    marginBottom: '15px'
                  }}>
                    Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>

                  <button
                    onClick={() => setEditingUser(user)}
                    className="cyber-button"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '14px'
                    }}
                  >
                    Редактировать
                  </button>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="cyber-card" style={{
                textAlign: 'center',
                padding: '60px 20px'
              }}>
                <p style={{ opacity: 0.6, fontSize: '16px' }}>
                  Пользователи не найдены
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {editingCourse && (
        <CourseModal
          course={editingCourse}
          onSave={saveCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}

      {editingFaq && (
        <FaqModal
          faq={editingFaq}
          onSave={saveFaq}
          onClose={() => setEditingFaq(null)}
        />
      )}

      {editingWork && (
        <StudentWorkModal
          work={editingWork}
          onSave={saveWork}
          onClose={() => setEditingWork(null)}
        />
      )}

      {editingBlogPost && (
        <BlogPostModal
          post={editingBlogPost}
          onSave={saveBlogPost}
          onClose={() => setEditingBlogPost(null)}
        />
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          onSave={saveUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

function CourseModal({
  course,
  onSave,
  onClose
}: {
  course: Course;
  onSave: (course: Partial<Course>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(course);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/gi, (char) => {
        const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','','y','','e','yu','ya'];
        const index = ru.indexOf(char.toLowerCase());
        return index >= 0 ? en[index] : char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title)
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadCourseImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally {
      setIsUploading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const features = Array.isArray(formData.features) ? formData.features : [];
      setFormData({
        ...formData,
        features: [...features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const features = Array.isArray(formData.features) ? formData.features : [];
    setFormData({
      ...formData,
      features: features.filter((_, i) => i !== index)
    });
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const features = Array.isArray(formData.features) ? [...formData.features] : [];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= features.length) return;
    [features[index], features[newIndex]] = [features[newIndex], features[index]];
    setFormData({ ...formData, features });
  };

  const features = Array.isArray(formData.features) ? formData.features : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="cyber-card" style={{ maxWidth: '800px', width: '100%', margin: '40px 0' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '25px', color: 'var(--neon-cyan)' }}>
          {course.id ? 'Редактировать курс' : 'Новый курс'}
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Название курса *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Например: Веб-разработка для начинающих"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            URL (slug)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ opacity: 0.6 }}>/course/</span>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="web-development"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Описание * (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              style={{
                background: 'transparent',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            >
              {showPreview ? 'Скрыть предпросмотр' : 'Показать предпросмотр'}
            </button>
          </div>
          <div style={{
            fontSize: '12px',
            opacity: 0.7,
            marginBottom: '8px',
            padding: '8px 12px',
            background: 'rgba(0, 255, 249, 0.05)',
            border: '1px solid rgba(0, 255, 249, 0.2)',
            borderRadius: '4px'
          }}>
            Поддерживается Markdown: **жирный**, *курсив*, # Заголовок, ## Подзаголовок, - списки, [ссылка](url)
          </div>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={8}
            placeholder="Подробное описание курса с поддержкой Markdown"
            style={{ fontFamily: 'monospace', fontSize: '14px' }}
          />
          {showPreview && formData.description && (
            <div style={{
              marginTop: '15px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 249, 0.3)',
              borderRadius: '6px'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'var(--neon-green)',
                marginBottom: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Предпросмотр:
              </div>
              <div
                style={{ fontSize: '16px', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.description) }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Изображение курса
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            style={{ marginBottom: '10px' }}
          />
          {uploadError && (
            <div style={{ color: 'var(--neon-pink)', marginBottom: '10px', fontSize: '14px' }}>
              {uploadError}
            </div>
          )}
          {isUploading && (
            <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>
              Загрузка изображения...
            </div>
          )}
          {formData.image_url && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                border: '1px solid var(--neon-cyan)',
                marginBottom: '10px',
                overflow: 'hidden'
              }}>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image_url: '' })}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--neon-pink)',
                  color: 'var(--neon-pink)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  borderRadius: '4px'
                }}
              >
                Удалить изображение
              </button>
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', opacity: 0.8 }}>
              Или укажите URL изображения:
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Длительность *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="3 месяца"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Возрастная группа *
            </label>
            <input
              type="text"
              value={formData.age_group}
              onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
              placeholder="16+"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Цена *
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="200 BYN/мес"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Порядок отображения
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 255, 100, 0.05)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 255, 100, 0.2)'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--neon-green)', fontWeight: 600 }}>
            Особенности курса (features)
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px 15px',
                borderRadius: '6px'
              }}>
                <span style={{ flex: 1 }}>{feature}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => moveFeature(index, 'up')}
                    disabled={index === 0}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--neon-cyan)',
                      color: 'var(--neon-cyan)',
                      width: '28px',
                      height: '28px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      opacity: index === 0 ? 0.3 : 1,
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFeature(index, 'down')}
                    disabled={index === features.length - 1}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--neon-cyan)',
                      color: 'var(--neon-cyan)',
                      width: '28px',
                      height: '28px',
                      cursor: index === features.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: index === features.length - 1 ? 0.3 : 1,
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--neon-pink)',
                      color: 'var(--neon-pink)',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Добавить особенность..."
              style={{ flex: 1 }}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type="button"
              onClick={addFeature}
              className="cyber-button"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Добавить
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>Курс активен (отображается на сайте)</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(formData)}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            Сохранить курс
          </button>
          <button
            onClick={onClose}
            className="cyber-button"
            style={{
              flex: 1,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function FaqModal({
  faq,
  onSave,
  onClose
}: {
  faq: FAQ;
  onSave: (faq: Partial<FAQ>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(faq);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="cyber-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--neon-cyan)' }}>
          {faq.id ? 'Редактировать вопрос' : 'Новый вопрос'}
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Вопрос</label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Ответ</label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            rows={6}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Категория</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="general">Общие вопросы</option>
            <option value="courses">О курсах</option>
            <option value="payment">Оплата</option>
            <option value="technical">Технические вопросы</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(formData)}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="cyber-button"
            style={{
              flex: 1,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentWorkModal({
  work,
  onSave,
  onClose
}: {
  work: StudentWork;
  onSave: (work: Partial<StudentWork>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(work);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadStudentWorkImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="cyber-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--neon-green)' }}>
          {work.id ? 'Редактировать работу' : 'Новая работа'}
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Имя ученика</label>
          <input
            type="text"
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
            placeholder="Например: Мария"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Возраст</label>
          <input
            type="number"
            value={formData.student_age}
            onChange={(e) => setFormData({ ...formData, student_age: parseInt(e.target.value) || 0 })}
            min={1}
            max={100}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Название проекта</label>
          <input
            type="text"
            value={formData.project_title}
            onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
            placeholder="Например: Блог о котиках"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Описание проекта</label>
          <textarea
            value={formData.project_description}
            onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
            rows={3}
            placeholder="Краткое описание того, что делает проект"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>URL проекта</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="url"
              value={formData.project_url}
              onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
              placeholder="https://example.com"
              style={{ flex: 1 }}
            />
            {formData.project_url && (
              <a
                href={formData.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-button"
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                Открыть
              </a>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Картинка</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            style={{ marginBottom: '10px' }}
          />
          {uploadError && (
            <div style={{ color: 'var(--neon-pink)', marginBottom: '10px', fontSize: '14px' }}>
              {uploadError}
            </div>
          )}
          {isUploading && (
            <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>
              Загрузка...
            </div>
          )}
          {formData.image_url && (
            <div style={{
              marginTop: '10px',
              width: '100%',
              height: '150px',
              borderRadius: '4px',
              border: '1px solid var(--neon-cyan)',
              overflow: 'hidden'
            }}>
              <img
                src={formData.image_url}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Инструмент</label>
          <select
            value={formData.tool_type}
            onChange={(e) => setFormData({ ...formData, tool_type: e.target.value as 'bolt' | 'cursor' })}
          >
            <option value="bolt">Bolt.new (сайты)</option>
            <option value="cursor">Cursor AI (веб-приложения)</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Порядок</label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            min={0}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: 'var(--neon-cyan)' }}>Показывать на сайте</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(formData)}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="cyber-button"
            style={{
              flex: 1,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogPostModal({
  post,
  onSave,
  onClose
}: {
  post: BlogPost;
  onSave: (post: Partial<BlogPost>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(post);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadBlogImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Ошибка загрузки');
    } finally {
      setIsUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/gi, (char) => {
        const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','c','ch','sh','sch','','y','','e','yu','ya'];
        const index = ru.indexOf(char.toLowerCase());
        return index >= 0 ? en[index] : char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title)
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="cyber-card" style={{
        maxWidth: '900px',
        width: '100%',
        margin: '40px 0'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '25px', color: 'var(--neon-pink)' }}>
          {post.id ? 'Редактировать статью' : 'Новая статья'}
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Заголовок *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Название статьи"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            URL (slug) *
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ opacity: 0.6 }}>/blog/</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              placeholder="url-statyi"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Краткое описание (для превью)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            placeholder="Краткое описание статьи для списка блога"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Содержимое статьи *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            placeholder="Текст статьи. Поддерживается **жирный** и *курсив*"
            style={{ fontFamily: 'monospace', fontSize: '14px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Обложка
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            style={{ marginBottom: '10px' }}
          />
          {uploadError && (
            <div style={{ color: 'var(--neon-pink)', marginBottom: '10px', fontSize: '14px' }}>
              {uploadError}
            </div>
          )}
          {isUploading && (
            <div style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>
              Загрузка...
            </div>
          )}
          {formData.image_url && (
            <div style={{
              marginTop: '10px',
              width: '100%',
              height: '200px',
              borderRadius: '4px',
              border: '1px solid var(--neon-cyan)',
              overflow: 'hidden'
            }}>
              <img
                src={formData.image_url}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(0, 255, 249, 0.05)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 255, 249, 0.2)'
        }}>
          <h3 style={{ color: 'var(--neon-green)', marginBottom: '15px', fontSize: '18px' }}>
            SEO настройки
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Title (заголовок в поиске)
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Заголовок страницы для поисковиков (50-60 символов)"
            />
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
              {formData.meta_title.length}/60 символов
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Description (описание в поиске)
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={3}
              placeholder="Описание страницы для поисковиков (150-160 символов)"
            />
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
              {formData.meta_description.length}/160 символов
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Keywords (ключевые слова)
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              placeholder="программирование, гродно, обучение, курсы"
            />
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({
                ...formData,
                is_published: e.target.checked,
                published_at: e.target.checked && !formData.published_at
                  ? new Date().toISOString()
                  : formData.published_at
              })}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>Опубликовать статью</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(formData)}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="cyber-button"
            style={{
              flex: 1,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
function HomePageSettingsModal({
  settings,
  onSave,
}: {
  settings: HomePageSettings;
  onSave: (settings: HomePageSettings) => Promise<void>;
}) {
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(formData);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '40px 20px',
    }}>
      <div className="cyber-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '15px', color: 'var(--neon-cyan)' }}>
          Редактирование главной страницы
        </h2>
        <div style={{
          background: 'rgba(0, 255, 249, 0.1)',
          border: '1px solid rgba(0, 255, 249, 0.3)',
          padding: '12px 15px',
          borderRadius: '6px',
          marginBottom: '30px',
          fontSize: '14px',
          opacity: 0.8
        }}>
          После сохранения изменений обновите главную страницу, чтобы увидеть новые настройки
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Заголовок *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Основной заголовок страницы"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Подзаголовок *
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Подзаголовок под основным заголовком"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)', fontWeight: 600 }}>
            Описание *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={5}
            placeholder="Основной текст описания на главной странице"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{
          background: 'rgba(0, 255, 249, 0.05)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 255, 249, 0.2)'
        }}>
          <h3 style={{ color: 'var(--neon-green)', marginBottom: '15px', fontSize: '18px' }}>
            SEO настройки для главной страницы
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Title (заголовок в поиске)
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Заголовок для поисковиков (50-60 символов)"
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
              {formData.meta_title.length}/60 символов
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Description (описание в поиске)
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={3}
              placeholder="Описание для поисковиков (150-160 символов)"
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
              {formData.meta_description.length}/160 символов
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>
              Meta Keywords (ключевые слова)
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
              placeholder="программирование, веб-разработка, гродно, курсы"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {saveError && (
          <div style={{
            color: 'var(--neon-pink)',
            background: 'rgba(255, 100, 100, 0.1)',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid var(--neon-pink)'
          }}>
            {saveError}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserModal({
  user,
  onSave,
  onClose
}: {
  user: UserProfile;
  onSave: (user: Partial<UserProfile>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(user);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="cyber-card" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          color: 'var(--neon-cyan)'
        }}>
          Редактировать пользователя
        </h2>

        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: 'rgba(0, 255, 249, 0.05)',
          border: '1px solid rgba(0, 255, 249, 0.2)',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>
            <strong>ID:</strong> {user.id}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '5px' }}>
            <strong>Email:</strong> {user.email}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
            Email нельзя изменить через админ-панель
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--neon-cyan)',
            fontWeight: 600
          }}>
            Полное имя
          </label>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="cyber-input"
            placeholder="Иван Иванов"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--neon-cyan)',
            fontWeight: 600
          }}>
            Роль *
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid var(--neon-cyan)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            <option value="student">Студент</option>
            <option value="admin">Администратор</option>
          </select>
          <div style={{
            fontSize: '12px',
            opacity: 0.7,
            marginTop: '8px',
            padding: '10px',
            background: 'rgba(255, 255, 100, 0.05)',
            border: '1px solid rgba(255, 255, 100, 0.3)',
            borderRadius: '4px'
          }}>
            <strong style={{ color: 'var(--neon-pink)' }}>Внимание:</strong> Администраторы имеют полный доступ ко всем функциям системы
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--neon-cyan)',
            fontWeight: 600
          }}>
            URL аватара
          </label>
          <input
            type="url"
            value={formData.avatar_url || ''}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            className="cyber-input"
            placeholder="https://example.com/avatar.jpg"
          />
          {formData.avatar_url && (
            <div style={{
              marginTop: '10px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '2px solid var(--neon-cyan)',
              overflow: 'hidden'
            }}>
              <img
                src={formData.avatar_url}
                alt="Avatar preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '6px',
          fontSize: '13px',
          opacity: 0.8
        }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Создан:</strong> {new Date(user.created_at).toLocaleString('ru-RU')}
          </div>
          <div>
            <strong>Обновлен:</strong> {new Date(user.updated_at).toLocaleString('ru-RU')}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSave(formData)}
            className="cyber-button"
            style={{ flex: 1 }}
          >
            Сохранить
          </button>
          <button
            onClick={onClose}
            className="cyber-button"
            style={{
              flex: 1,
              borderColor: 'var(--neon-pink)',
              color: 'var(--neon-pink)'
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
