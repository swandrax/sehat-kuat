import React, { useEffect } from 'react';
import { useAppointmentsQueueStore } from '../stores/useAppointmentsQueueStore';

interface LiveQueueScreenProps {
  onNavigate: (screen: string) => void;
}

export const LiveQueueScreen: React.FC<LiveQueueScreenProps> = ({ onNavigate }) => {
  const { activeQueue, fetchActiveQueue } = useAppointmentsQueueStore();

  useEffect(() => {
    fetchActiveQueue();
    const interval = setInterval(() => {
      fetchActiveQueue();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const queue = activeQueue || {
    id: 'q-1',
    queueNumber: 7,
    status: 'WAITING' as const,
    currentServingNumber: 5,
    estimatedWaitMinutes: 12,
    doctor: { user: { name: 'dr. Andi Setiawan, Sp.PD' } },
    clinic: { name: 'Klinik Zavora Life Pusat Jakarta (Poli Penyakit Dalam - Lt. 2)' },
    date: new Date().toLocaleDateString('id-ID'),
  };

  const serving = (queue as any).currentServingNumber || 5;
  const sisaAntrean = Math.max(0, queue.queueNumber - serving);

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => onNavigate('Home')}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', marginRight: '8px' }}
        >
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Antrean Digital Real-time</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Update langsung dari loket faskes</span>
        </div>
      </div>

      {/* Ticket Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #0284c7',
        borderRadius: '20px',
        padding: '24px 20px',
        textAlign: 'center',
        boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.15)',
        position: 'relative',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, letterSpacing: '1px' }}>
          TIKET ANTREAN PASIEN
        </div>
        <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
          {queue.clinic?.name}
        </div>

        <div style={{
          margin: '20px auto',
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          backgroundColor: '#eff6ff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '4px solid #bfdbfe',
        }}>
          <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700 }}>NOMOR ANDA</span>
          <span style={{ fontSize: '42px', fontWeight: 900, color: '#1d4ed8' }}>
            #{queue.queueNumber}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>DILAYANI SAAT INI</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              #{serving}
            </div>
          </div>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>ESTIMASI MENUNGGU</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
              ~{queue.estimatedWaitMinutes || (sisaAntrean * 6)} mnt
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '14px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Dokter Pemeriksa:</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            {queue.doctor?.user?.name || 'dr. Andi Setiawan, Sp.PD'}
          </div>
          <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
            Status: {queue.status === 'WAITING' ? '⏳ Menunggu Giliran' : queue.status === 'CALLED' ? '📢 Silakan Masuk Ruang Poli' : queue.status}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '12px',
        color: '#065f46',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <span>💡</span>
        <span>Notifikasi push akan berbunyi saat nomor antrean Anda tersisa 2 pasien lagi.</span>
      </div>
    </div>
  );
};
