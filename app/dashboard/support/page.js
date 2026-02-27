'use client';
import { useState, useRef, useEffect } from 'react';

var INIT = [{ id: 1, from: 'support', text: 'Hey! Welcome to Kumo support. How can I help you today?', time: '10:00 AM' }];
var REPLIES = [
  "Got it — I'm looking into this now. Give me a moment.",
  "That's a really common question. Here's what I'd recommend...",
  "I can see the issue on our end. Let me escalate this to engineering.",
  "Great news — that feature is available in your project settings.",
  "I've checked the server logs. Everything looks healthy on our side. Can you try redeploying?",
];

export default function SupportPage() {
  var [messages, setMessages] = useState(INIT);
  var [input, setInput] = useState('');
  var bottomRef = useRef(null);

  useEffect(function() { if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send() {
    if (!input.trim()) return;
    setMessages(function(m) { return m.concat([{ id: Date.now(), from: 'user', text: input, time: 'Now' }]); });
    setInput('');
    setTimeout(function() {
      setMessages(function(m) { return m.concat([{ id: Date.now(), from: 'support', text: REPLIES[Math.floor(Math.random() * REPLIES.length)], time: 'Now' }]); });
    }, 1200);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        .chat-input { flex: 1; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; }
        .chat-input:focus { border-color: rgba(56,189,168,0.25); }
        .chat-input::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.3)' }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Support Chat</h2>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: '4px 0 0 18px' }}>We typically reply within 5 minutes</p>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map(function(m) {
          var isUser = m.from === 'user';
          return (
            <div key={m.id} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
              <div style={{
                padding: '12px 16px', borderRadius: 16, fontSize: 14, lineHeight: 1.6,
                background: isUser ? 'linear-gradient(135deg, rgba(56,189,168,0.12), rgba(37,136,204,0.08))' : 'rgba(255,255,255,0.03)',
                color: isUser ? '#38bda8' : '#e8eaed', border: '1px solid ' + (isUser ? 'rgba(56,189,168,0.1)' : 'rgba(255,255,255,0.04)'),
                borderBottomRightRadius: isUser ? 4 : 16, borderBottomLeftRadius: isUser ? 16 : 4,
              }}>{m.text}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
                {!isUser ? 'Kumo Support \u00B7 ' : ''}{m.time}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10 }}>
        <input className="chat-input" value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key === 'Enter') send(); }} placeholder="Type a message..." />
        <button onClick={send} style={{ padding: '12px 22px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', cursor: 'pointer', fontFamily: "'Outfit'" }}>Send</button>
      </div>
    </div>
  );
}
