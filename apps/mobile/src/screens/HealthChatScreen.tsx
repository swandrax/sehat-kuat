import React, { useState } from 'react';
import { useChatbotStore } from '../stores/useChatbotStore';

interface HealthChatScreenProps {
  onNavigate: (screen: string) => void;
}

export const HealthChatScreen: React.FC<HealthChatScreenProps> = ({ onNavigate }) => {
  const { messages, sendMessage, isTyping, isEscalatedToHuman, escalateToHumanAgent } = useChatbotStore();
  const [inputText, setInputText] = useState<string>('');

  const quickPrompts = [
    'Berapa sisa plafon asuransi saya?',
    'Bagaimana cara mengajukan klaim cashless?',
    'Jadwal dokter penyakit dalam hari ini',
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '480px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f8fafc',
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('Home')}
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', marginRight: '6px' }}
          >
            ←
          </button>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>
              {isEscalatedToHuman ? 'Konsultasi Tim Medis' : 'Asisten Pintar Zavora × AUTRA'}
            </h3>
            <span style={{ fontSize: '11px', color: isEscalatedToHuman ? '#059669' : '#0284c7', fontWeight: 600 }}>
              {isEscalatedToHuman ? '● Terhubung dengan Dokter Triase' : '● AI Online 24 Jam'}
            </span>
          </div>
        </div>

        {!isEscalatedToHuman && (
          <button
            onClick={() => escalateToHumanAgent('Pasien ingin konsultasi langsung dengan dokter')}
            style={{
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            👨‍⚕️ Bicara dg Petugas
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isAgent = msg.role === 'agent';

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: isUser ? '#0284c7' : isAgent ? '#ecfdf5' : '#ffffff',
                color: isUser ? '#ffffff' : '#1e293b',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: isUser ? '16px' : '4px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: isAgent ? '1px solid #a7f3d0' : isUser ? 'none' : '1px solid #e2e8f0',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              {isAgent && (
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#047857', marginBottom: '4px' }}>
                  🏥 TENAGA MEDIS / KLAIM RESMI
                </div>
              )}
              {msg.content}
            </div>
          );
        })}

        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#ffffff',
            padding: '10px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            color: '#64748b',
            border: '1px solid #e2e8f0',
          }}>
            AUTRA-AI sedang menganalisis panduan...
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: '8px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              backgroundColor: '#f1f5f9',
              border: 'none',
              fontSize: '11px',
              color: '#334155',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '8px',
      }}>
        <input
          type="text"
          placeholder="Ketik pertanyaan kesehatan atau klaim..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '0 16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Kirim
        </button>
      </div>
    </div>
  );
};
