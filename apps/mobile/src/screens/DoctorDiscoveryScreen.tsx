import React, { useEffect, useState } from 'react';
import { useAppointmentsQueueStore } from '../stores/useAppointmentsQueueStore';

interface DoctorDiscoveryScreenProps {
  onNavigate: (screen: string) => void;
}

export const DoctorDiscoveryScreen: React.FC<DoctorDiscoveryScreenProps> = ({ onNavigate }) => {
  const { doctors, fetchDoctors, bookAppointmentAndQueue, isLoading } = useAppointmentsQueueStore();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ['ALL', 'Penyakit Dalam', 'Anak', 'Jantung', 'Dokter Umum'];

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty =
      selectedSpecialty === 'ALL' ||
      doc.specialization?.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchSearch && matchSpecialty;
  });

  const handleBooking = async (docId: string) => {
    setBookingDoctorId(docId);
    const success = await bookAppointmentAndQueue(docId, undefined, 'Pendaftaran konsultasi via mobile');
    setBookingDoctorId(null);
    if (success) {
      onNavigate('Queue');
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => onNavigate('Home')}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', padding: '4px 8px', marginRight: '8px' }}
        >
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Temukan Dokter & Jadwal</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Klinik Zavora Life & Rumah Sakit Rekanan</span>
        </div>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Cari nama dokter atau spesialisasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          marginBottom: '14px',
          boxSizing: 'border-box',
          fontSize: '13px',
        }}
      />

      {/* Specialty Filter Chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: selectedSpecialty === spec ? '1px solid #0284c7' : '1px solid #e2e8f0',
              backgroundColor: selectedSpecialty === spec ? '#eff6ff' : '#ffffff',
              color: selectedSpecialty === spec ? '#0284c7' : '#64748b',
            }}
          >
            {spec === 'ALL' ? 'Semua Spesialis' : spec}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(filtered.length > 0 ? filtered : [
          {
            id: 'doc-1',
            specialization: 'Spesialis Penyakit Dalam',
            user: { name: 'dr. Andi Setiawan, Sp.PD' },
            clinic: { name: 'Klinik Zavora Life Pusat Jakarta' },
          },
          {
            id: 'doc-2',
            specialization: 'Spesialis Anak',
            user: { name: 'dr. Amanda Kartika, Sp.A' },
            clinic: { name: 'Klinik Zavora Life Cabang Selatan' },
          },
          {
            id: 'doc-3',
            specialization: 'Spesialis Jantung & Pembuluh Darah',
            user: { name: 'dr. Budi Setiawan, Sp.JP' },
            clinic: { name: 'RS Citra Harapan Rekanan' },
          },
        ]).map((doc: any) => (
          <div
            key={doc.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '15px', color: '#0f172a' }}>{doc.user?.name}</h4>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>{doc.specialization}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  📍 {doc.clinic?.name || 'Klinik Zavora Life'}
                </div>
              </div>
              <span style={{ fontSize: '10px', backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Tersedia Hari Ini
              </span>
            </div>

            <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                ⚡ Cashless Zavora Life Aktif
              </span>
              <button
                onClick={() => handleBooking(doc.id)}
                disabled={bookingDoctorId === doc.id}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {bookingDoctorId === doc.id ? 'Memproses...' : 'Ambil Antrean'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
