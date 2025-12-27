import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'auth' | 'error' | 'info';
  details?: any;
}

export default function ErrorLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args: any[]) => {
      originalConsoleLog(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      if (message.toLowerCase().includes('auth') ||
          message.toLowerCase().includes('google') ||
          message.toLowerCase().includes('supabase')) {
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString('ru-RU'),
          message,
          type: 'info',
          details: args.length > 1 ? args : undefined
        }]);
      }
    };

    console.error = (...args: any[]) => {
      originalConsoleError(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString('ru-RU'),
        message,
        type: 'error',
        details: args.length > 1 ? args : undefined
      }]);
    };

    console.warn = (...args: any[]) => {
      originalConsoleWarn(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      setLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString('ru-RU'),
        message,
        type: 'auth',
        details: args.length > 1 ? args : undefined
      }]);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'var(--neon-pink)';
      case 'auth':
        return 'var(--neon-green)';
      default:
        return 'var(--neon-cyan)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 15, 0.95)',
      borderTop: '2px solid var(--neon-cyan)',
      zIndex: 9999,
      maxHeight: isExpanded ? (isMobile ? '70vh' : '400px') : '50px',
      transition: 'max-height 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: isMobile ? '10px 15px' : '12px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isExpanded ? '1px solid rgba(0, 255, 249, 0.2)' : 'none',
          background: 'rgba(0, 0, 0, 0.3)',
          fontSize: isMobile ? '13px' : '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
            Логи ошибок ({logs.length})
          </span>
          {logs.length > 0 && (
            <span style={{
              background: 'var(--neon-pink)',
              color: 'black',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: 'bold'
            }}>
              {logs.filter(l => l.type === 'error').length} ошибок
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {logs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearLogs();
              }}
              style={{
                padding: '4px 12px',
                background: 'var(--neon-pink)',
                border: 'none',
                borderRadius: '4px',
                color: 'black',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: 'bold'
              }}
            >
              Очистить
            </button>
          )}
          <span style={{ color: 'var(--neon-green)', fontSize: isMobile ? '16px' : '18px' }}>
            {isExpanded ? '▼' : '▲'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '10px' : '15px',
          fontSize: isMobile ? '11px' : '12px',
          fontFamily: 'monospace'
        }}>
          {logs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              opacity: 0.5,
              padding: '20px',
              fontSize: isMobile ? '12px' : '14px'
            }}>
              Нет записей в логах
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  padding: isMobile ? '8px' : '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: `3px solid ${getTypeColor(log.type)}`,
                  borderRadius: '4px',
                  wordBreak: 'break-word'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                  <span style={{
                    color: getTypeColor(log.type),
                    fontWeight: 'bold',
                    fontSize: isMobile ? '10px' : '11px'
                  }}>
                    [{log.type.toUpperCase()}]
                  </span>
                  <span style={{
                    opacity: 0.6,
                    fontSize: isMobile ? '10px' : '11px'
                  }}>
                    {log.timestamp}
                  </span>
                </div>
                <div style={{
                  color: '#fff',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4'
                }}>
                  {log.message}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
