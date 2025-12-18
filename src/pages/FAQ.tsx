import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FAQ as FAQType } from '../types';

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading FAQs:', error);
    }
    
    if (data) {
      setFaqs(data);
    }
    setLoading(false);
  };

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const groupedFAQs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQType[]>);

  const categoryNames: Record<string, string> = {
    general: 'Общие вопросы',
    courses: 'О курсах',
    payment: 'Оплата',
    technical: 'Технические вопросы'
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 60px)',
          textAlign: 'center',
          marginBottom: '30px'
        }} className="glitch" data-text="ВОПРОСЫ И ОТВЕТЫ">
          <span className="neon-text">ВОПРОСЫ И ОТВЕТЫ</span>
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '20px',
          opacity: 0.8,
          marginBottom: '60px'
        }}>
          Ответы на самые популярные вопросы о школе Vibecoding
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="pulse" style={{
              fontSize: '48px',
              color: 'var(--neon-cyan)'
            }}>
              ⚡
            </div>
            <p style={{ marginTop: '20px', opacity: 0.7 }}>Загрузка вопросов...</p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedFAQs).map(([category, categoryFaqs]) => (
              <div key={category} style={{ marginBottom: '50px' }}>
                <h2 style={{
                  fontSize: '28px',
                  marginBottom: '30px',
                  color: 'var(--neon-pink)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  {categoryNames[category] || category}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {categoryFaqs.map((faq) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isActive = activeIndex === globalIndex;
                    
                    return (
                      <div
                        key={faq.id}
                        className="cyber-card"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '20px'
                        }}>
                          <h3 style={{
                            fontSize: '20px',
                            color: 'var(--neon-cyan)',
                            flex: 1
                          }}>
                            {faq.question}
                          </h3>
                          <div style={{
                            fontSize: '24px',
                            color: 'var(--neon-cyan)',
                            transform: isActive ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s ease'
                          }}>
                            ▼
                          </div>
                        </div>
                        
                        <div style={{
                          maxHeight: isActive ? '500px' : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease',
                          marginTop: isActive ? '20px' : '0'
                        }}>
                          <div style={{
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(0, 255, 249, 0.3)',
                            fontSize: '18px',
                            lineHeight: '1.8',
                            opacity: 0.9
                          }}>
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '80px',
          padding: '50px 30px',
          background: 'rgba(19, 19, 26, 0.8)',
          border: '1px solid var(--neon-green)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '32px',
            marginBottom: '20px',
            color: 'var(--neon-green)'
          }}>
            НЕ НАШЛИ ОТВЕТ?
          </h3>
          <p style={{
            fontSize: '18px',
            opacity: 0.8,
            marginBottom: '30px'
          }}>
            Свяжитесь с нами, и мы ответим на все ваши вопросы!
          </p>
          <a href="https://wa.me/375292828878" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="cyber-button">
              Написать в WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
