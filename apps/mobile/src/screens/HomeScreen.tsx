import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useInsuranceStore } from '../stores/useInsuranceStore';
import { useAppointmentsQueueStore } from '../stores/useAppointmentsQueueStore';
import { useRecommendationsStore } from '../stores/useRecommendationsStore';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { policies, selectedPolicy, fetchPolicies } = useInsuranceStore();
  const { activeQueue, fetchActiveQueue } = useAppointmentsQueueStore();
  const { recommendations, wellnessScore } = useRecommendationsStore();

  useEffect(() => {
    fetchPolicies();
    fetchActiveQueue();
  }, []);

  const policy = selectedPolicy || policies[0] || {
    provider: 'Zavora Life Protection Corporate',
    policyCode: 'ZVR-CORP-88912-ID',
    cardNumber: '9920-4411-8891-0012',
    remainingLimit: 238500000,
    annualLimit: 250000000,
    validUntil: '31 Des 2026',
    isCashless: true,
  };

  const limitPct = Math.round((policy.remainingLimit / policy.annualLimit) * 100);

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header Profile Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Portal Kesehatan & Asuransi Mobile
          </span>
          <h2 style={{ margin: '4px 0 0', fontSize: '20px', color: '#0f172a' }}>
            Halo, {user?.name || 'Budi Santoso'} 👋
          </h2>
        </div>
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '8px 14px',
          borderRadius: '20px',
          border: '1px solid #bfdbfe',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 700 }}>SKOR KESEHATAN</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>{wellnessScore}/100</div>
        </div>
      </div>

      {/* Digital Insurance Card (AUTRA Powered) */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '1px', opacity: 0.85, fontWeight: 700 }}>
              KARTU DIGITAL RESMI
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '2px' }}>
              {policy.provider}
            </div>
          </div>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
          }}>
            ⚡ CASHLESS 100%
          </span>
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: '15px', letterSpacing: '2px', marginBottom: '16px' }}>
          {policy.cardNumber}
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>SISA PLAFON TAHUNAN</div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>
              Rp {policy.remainingLimit.toLocaleString('id-ID')}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>BERLAKU S/D</div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{policy.validUntil}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.25)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${limitPct}%`, background: '#22c55e', height: '100%' }} />
        </div>
        <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '4px', opacity: 0.9 }}>
          Tersedia {limitPct}% dari Rp {policy.annualLimit.toLocaleString('id-ID')}
        </div>
      </div>

      {/* Active Digital Queue Ticket Alert (if any) */}
      {activeQueue && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
              🎫 ANTREAN AKTIF HARI INI
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#78350f', marginTop: '2px' }}>
              Nomor: #{activeQueue.queueNumber} • {activeQueue.clinic?.name || 'Klinik Zavora Pusat'}
            </div>
            <div style={{ fontSize: '12px', color: '#b45309' }}>
              Status: Sedang Menunggu (Estimasi 15 menit)
            </div>
          </div>
          <button
            onClick={() => onNavigate('Queue')}
            style={{
              backgroundColor: '#d97706',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Lihat Tiket
          </button>
        </div>
      )}

      {/* Quick Actions Grid */}
      <h3 style={{ fontSize: '15px', color: '#334155', margin: '0 0 12px', fontWeight: 700 }}>
        Aksi Cepat Layanan
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => onNavigate('SubmitClaim')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '12px 6px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>🤖</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Klaim AI</div>
          <div style={{ fontSize: '9px', color: '#0284c7', fontWeight: 600 }}>AUTRA</div>
        </button>

        <button
          onClick={() => onNavigate('Discovery')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '12px 6px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>👨‍⚕️</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Cari Dokter</div>
          <div style={{ fontSize: '9px', color: '#64748b' }}>Booking</div>
        </button>

        <button
          onClick={() => onNavigate('Queue')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '12px 6px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>⏱️</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Antrean</div>
          <div style={{ fontSize: '9px', color: '#64748b' }}>Live Ticker</div>
        </button>

        <button
          onClick={() => onNavigate('Chat')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '12px 6px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>💬</div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>Tanya AI</div>
          <div style={{ fontSize: '9px', color: '#64748b' }}>Triase 24J</div>
        </button>
      </div>

      {/* AI Personalized Recommendations */}
      <h3 style={{ fontSize: '15px', color: '#334155', margin: '0 0 12px', fontWeight: 700 }}>
        Rekomendasi Pintar Untuk Anda
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: rec.severity === 'RECOMMENDED' ? '#2563eb' : '#059669',
                backgroundColor: rec.severity === 'RECOMMENDED' ? '#eff6ff' : '#ecfdf5',
                padding: '2px 8px',
                borderRadius: '6px',
              }}>
                {rec.category.replace('_', ' ')}
              </span>
              <button
                onClick={() => onNavigate(rec.actionRoute)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {rec.actionText} →
              </button>
            </div>
            <h4 style={{ margin: '8px 0 4px', fontSize: '14px', color: '#0f172a' }}>{rec.title}</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
