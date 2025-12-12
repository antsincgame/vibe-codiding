import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Course, FAQ, TrialRegistration, StudentWork } from '../types';
import EmailSettingsForm from '../components/EmailSettingsForm';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'faqs' | 'registrations' | 'email' | 'works'>('courses');

  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [registrations, setRegistrations] = useState<TrialRegistration[]>([]);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>([]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingWork, setEditingWork] = useState<StudentWork | null>(null);

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
      const { data } = await supabase.from('faqs').select('*').order('category, order_index');
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
          <input
            type="url"
            value={formData.project_url}
            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'var(--neon-cyan)' }}>URL картинки</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/screenshot.png"
          />
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
