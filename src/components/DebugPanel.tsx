import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'info' | 'error' | 'warn' | 'success';
  source: string;
  message: string;
  data?: unknown;
}

const logs: LogEntry[] = [];
let logId = 0;
let listeners: (() => void)[] = [];

export function debugLog(source: string, message: string, data?: unknown, type: LogEntry['type'] = 'info') {
  const entry: LogEntry = {
    id: ++logId,
    timestamp: new Date().toISOString().split('T')[1].split('.')[0],
    type,
    source,
    message,
    data
  };
  logs.push(entry);
  if (logs.length > 200) logs.shift();
  listeners.forEach(l => l());

  const style = type === 'error' ? 'color: #ff4444' :
                type === 'warn' ? 'color: #ffaa00' :
                type === 'success' ? 'color: #00ff00' : 'color: #00ffff';
  console.log(`%c[${entry.timestamp}] [${source}] ${message}`, style, data ?? '');
}

export function DebugPanel() {
  const [, setUpdate] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = () => setUpdate(u => u + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const filteredLogs = filter
    ? logs.filter(l => l.source.toLowerCase().includes(filter.toLowerCase()) ||
                       l.message.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return '#ff4444';
      case 'warn': return '#ffaa00';
      case 'success': return '#00ff00';
      default: return '#00ffff';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderTop: '2px solid #00ffff',
      zIndex: 99999,
      fontFamily: 'monospace',
      fontSize: '11px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 10px',
        borderBottom: '1px solid #333',
        backgroundColor: '#111'
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: '#00ffff',
            color: '#000',
            border: 'none',
            padding: '3px 10px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {expanded ? 'HIDE' : 'SHOW'} DEBUG ({logs.length})
        </button>
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            background: '#222',
            border: '1px solid #444',
            color: '#fff',
            padding: '3px 8px',
            width: '150px'
          }}
        />
        <button
          onClick={() => { logs.length = 0; setUpdate(u => u + 1); }}
          style={{
            background: '#ff4444',
            color: '#fff',
            border: 'none',
            padding: '3px 10px',
            cursor: 'pointer'
          }}
        >
          CLEAR
        </button>
        <span style={{ color: '#888', marginLeft: 'auto' }}>
          SUPABASE: {import.meta.env.VITE_SUPABASE_URL}
        </span>
      </div>

      {expanded && (
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '5px'
        }}>
          {filteredLogs.length === 0 && (
            <div style={{ color: '#666', padding: '10px' }}>No logs yet...</div>
          )}
          {filteredLogs.map(log => (
            <div key={log.id} style={{
              padding: '2px 5px',
              borderBottom: '1px solid #222',
              display: 'flex',
              gap: '10px'
            }}>
              <span style={{ color: '#666', minWidth: '70px' }}>{log.timestamp}</span>
              <span style={{
                color: '#888',
                minWidth: '120px',
                backgroundColor: '#222',
                padding: '0 5px',
                borderRadius: '3px'
              }}>
                {log.source}
              </span>
              <span style={{ color: getColor(log.type) }}>{log.message}</span>
              {log.data !== undefined && (
                <span style={{ color: '#888' }}>
                  {typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data)}
                </span>
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
