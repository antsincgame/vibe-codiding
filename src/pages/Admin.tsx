import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { uploadStudentWorkImage } from '../lib/storageService';
import type { Course, FAQ, TrialRegistration, StudentWork, BlogPost, HomePageSettings } from '../types';
import EmailSettingsForm from '../components/EmailSettingsForm';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'faqs' | 'registrations' | 'email' | 'works' | 'blog' | 'home'>('courses');

  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [registrations, setRegistrations] = useState<TrialRegistration[]>([]);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomePageSettings | null>(null);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingWork, setEditingWork] = useState<StudentWork | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleLogout = () => {
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
    const updates = [
      { key: 'home_title', value: settings.title },
      { key: 'home_subtitle', value: settings.subtitle },
      { key: 'home_description', value: settings.description },
      { key: 'home_meta_title', value: settings.meta_title },
      { key: 'home_meta_description', value: settings.meta_description },
      { key: 'home_meta_keywords', value: settings.meta_keywords },
    ];

    for (const update of updates) {
      await supabase
        .from('system_settings')
        .update({ value: update.value })
        .eq('key', update.key);
    }

    setHomeSettings(settings);
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
    if (course.id) {
      await supabase.from('courses').update(course).eq('id', course.id);
    } else {
      await supabase.from('courses').insert([course]);
    }
    setEditingCourse(null);
    loadData();
  };

  const saveFaq = async (faq: Partial<FAQ>) => {
    if (faq.id) {
      await supabase.from('faqs').update(faq).eq('id', faq.id);
    } else {
      await supabase.from('faqs').insert([faq]);
    }
    setEditingFaq(null);
    loadData();
  };

  const deleteWork = async (id: string) => {
    if (!confirm('Удалить работу?')) return;
    await supabase.from('student_works').delete().eq('id', id);
    loadData();
  };

  const saveWork = async (work: Partial<StudentWork>) => {
    if (work.id) {
      await supabase.from('student_works').update(work).eq('id', work.id);
    } else {
      const { id, ...workWithoutId } = work;
      await supabase.from('student_works').insert([workWithoutId]);
    }
    setEditingWork(null);
    loadData();
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    loadData();
  };

  const saveBlogPost = async (post: Partial<BlogPost>) => {
    if (post.id) {
      await supabase.from('blog_posts').update({
        ...post,
        updated_at: new Date().toISOString()
      }).eq('id', post.id);
    } else {
      const { id, ...postWithoutId } = post;
      await supabase.from('blog_posts').insert([postWithoutId]);
    }
    setEditingBlogPost(null);
    loadData();
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
            onClick={() => setActiveTab('email')}
            className="cyber-button"
            style={{
              opacity: activeTab === 'email' ? 1 : 0.5
            }}
          >
            Email
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
                  <h3 style={{ fontSize: '24px', color: 'var(--neon-cyan)', marginBottom: '10px' }}>
                    {course.title}
                  </h3>
                  <p style={{ opacity: 0.8, marginBottom: '15px' }}>{course.description}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="cyber-button"
                      style={{ padding: '8px 20px', fontSize: '14px' }}
                    >
                      Редактировать
                    </button>
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
              ))}
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
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>Ребёнок</div>
                      <div>{reg.child_name} ({reg.child_age} лет)</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Возрастная группа</div>
                    <div>{reg.age_group === 'child' ? 'Ребёнок (12-18 лет)' : 'Взрослый (18+)'}</div>
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

        {activeTab === 'email' && (
          <EmailSettingsForm />
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
                        background: `url(${work.image_url}) center/cover no-repeat`,
                        borderRadius: '4px',
                        flexShrink: 0
                      }} />
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
                        background: `url(${post.image_url}) center/cover no-repeat`,
                        borderRadius: '4px',
                        flexShrink: 0
                      }} />
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
          {course.id ? 'Редактировать курс' : 'Новый курс'}
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Длительность</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Возрастная группа</label>
          <input
            type="text"
            value={formData.age_group}
            onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>Цена</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
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
              background: `url(${formData.image_url}) center/cover no-repeat`,
              borderRadius: '4px',
              border: '1px solid var(--neon-cyan)'
            }} />
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
      const imageUrl = await uploadStudentWorkImage(file);
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
              background: `url(${formData.image_url}) center/cover no-repeat`,
              borderRadius: '4px',
              border: '1px solid var(--neon-cyan)'
            }} />
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
  onSave: (settings: HomePageSettings) => void;
}) {
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
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
        <h2 style={{ fontSize: '28px', marginBottom: '30px', color: 'var(--neon-cyan)' }}>
          Редактирование главной страницы
        </h2>

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
