import React, { useEffect, useState } from 'react';
import { useClaimsStore, ClaimItem } from '../stores/useClaimsStore';

interface ClaimsListScreenProps {
  onNavigate: (screen: string) => void;
  onSelectClaim: (claimId: string) => void;
}

export const ClaimsListScreen: React.FC<ClaimsListScreenProps> = ({
  onNavigate,
  onSelectClaim,
}) => {
  const { claims, fetchClaims, isLoading } = useClaimsStore();
  const [filter, setFilter] = useState<'ALL' | 'AUTO_APPROVED' | 'MANUAL_REVIEW' | 'PAID'>('ALL');

  useEffect(() => {
    fetchClaims();
  }, []);

  const filtered = claims.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Riwayat Klaim Asuransi</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Pelacakan status & otorisasi pre-approval</span>
        </div>
        <button
          onClick={() => onNavigate('SubmitClaim')}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Klaim Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {(['ALL', 'AUTO_APPROVED', 'MANUAL_REVIEW', 'PAID'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: filter === tab ? '1px solid #0284c7' : '1px solid #e2e8f0',
              backgroundColor: filter === tab ? '#eff6ff' : '#ffffff',
              color: filter === tab ? '#0284c7' : '#64748b',
            }}
          >
            {tab === 'ALL' ? 'Semua Klaim' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Claim Cards List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>Memuat riwayat klaim...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 16px',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
        }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>📑</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>Belum ada klaim terdaftar</div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 16px' }}>
            Unggah kuitansi faskes untuk memproses klaim otomatis dengan AUTRA.
          </p>
          <button
            onClick={() => onNavigate('SubmitClaim')}
            style={{
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Ajukan Klaim Sekarang
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectClaim(item.id)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{item.claimNumber}</span>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{item.providerName}</div>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor:
                    item.status === 'AUTO_APPROVED' || item.status === 'PAID'
                      ? '#ecfdf5'
                      : item.status === 'MANUAL_REVIEW'
                      ? '#fffbeb'
                      : '#fef2f2',
                  color:
                    item.status === 'AUTO_APPROVED' || item.status === 'PAID'
                      ? '#065f46'
                      : item.status === 'MANUAL_REVIEW'
                      ? '#92400e'
                      : '#991b1b',
                }}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {item.preAuthCode && (
                <div style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#0284c7',
                  backgroundColor: '#f0f9ff',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '8px',
                }}>
                  Pre-Auth: {item.preAuthCode}
                </div>
              )}

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>TOTAL KLAIM</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    Rp {item.claimAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>
                  Lihat Audit & PDF →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
