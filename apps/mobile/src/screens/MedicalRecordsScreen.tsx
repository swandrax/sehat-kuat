import React, { useEffect } from 'react';
import { useMedicalRecordsStore } from '../stores/useMedicalRecordsStore';

interface MedicalRecordsScreenProps {
  onNavigate: (screen: string) => void;
}

export const MedicalRecordsScreen: React.FC<MedicalRecordsScreenProps> = ({ onNavigate }) => {
  const { records, fetchRecords, isLoading } = useMedicalRecordsStore();

  useEffect(() => {
    fetchRecords();
  }, []);

  const sampleRecords = records.length > 0 ? records : [
    {
      id: 'rec-1',
      createdAt: '2026-08-20T10:30:00Z',
      chiefComplaint: 'Kontrol rutin gula darah dan evaluasi obat oral.',
      clinicalNotes: 'Pasien mengeluh sedikit lemas di sore hari. Gula darah puasa 128 mg/dL.',
      treatment: 'Penyesuaian dosis metformin dan edukasi diet rendah glikemik.',
      doctor: { user: { name: 'dr. Andi Setiawan, Sp.PD' } },
      diagnoses: [{ code: 'E11.9', name: 'Diabetes Melitus Tipe 2 Tanpa Komplikasi' }],
      prescriptions: [{
        items: [
          { medicineName: 'Metformin HCl', dosage: '500mg', frequency: '3x1 tablet sesudah makan' },
          { medicineName: 'Glimepiride', dosage: '2mg', frequency: '1x1 tablet pagi hari' },
        ],
      }],
    },
    {
      id: 'rec-2',
      createdAt: '2026-06-10T14:15:00Z',
      chiefComplaint: 'Batuk kering dan nyeri tenggorokan 3 hari.',
      clinicalNotes: 'Faring hiperemis (+), pembesaran tonsil T1/T1.',
      treatment: 'Simptomatik dan hidrasi adekuat.',
      doctor: { user: { name: 'dr. Hendra Pratama, Sp.PD' } },
      diagnoses: [{ code: 'J02.9', name: 'Faringitis Akut Tidak Spesifik' }],
      prescriptions: [{
        items: [
          { medicineName: 'Paracetamol', dosage: '500mg', frequency: '3x1 tablet bila demam/nyeri' },
        ],
      }],
    },
  ];

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
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Rekam Medis & E-Resep</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Standar SatuSehat & ICD-10 Kemenkes RI</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sampleRecords.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '15px', color: '#0f172a' }}>
                  {item.doctor?.user?.name || 'Dokter Spesialis'}
                </h4>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#0284c7',
                backgroundColor: '#f0f9ff',
                padding: '3px 8px',
                borderRadius: '6px',
              }}>
                RAWAT JALAN
              </span>
            </div>

            <div style={{ margin: '10px 0', fontSize: '13px', color: '#334155' }}>
              <strong>Keluhan:</strong> {item.chiefComplaint}
            </div>

            {item.diagnoses && item.diagnoses.length > 0 && (
              <div style={{ margin: '8px 0', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  DIAGNOSA KLINIS (ICD-10):
                </div>
                {item.diagnoses.map((d, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#0f172a', fontWeight: 600 }}>
                    🏷️ [{d.code}] {d.name}
                  </div>
                ))}
              </div>
            )}

            {item.prescriptions && item.prescriptions.length > 0 && (
              <div style={{ marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  E-RESEP FARMASI:
                </div>
                {item.prescriptions[0].items.map((med, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#1e293b', marginBottom: '4px' }}>
                    💊 <strong>{med.medicineName}</strong> {med.dosage} — <span style={{ color: '#64748b' }}>{med.frequency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
