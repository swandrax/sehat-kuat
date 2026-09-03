import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useProfileStore } from '../stores/useProfileStore';
import { usePreferencesStore } from '../stores/usePreferencesStore';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({ onNavigate }) => {
  const { user, logout } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const {
    biometricLoginEnabled,
    maskPiiOnScreen,
    toggleBiometric,
    toggleMaskPii,
  } = usePreferencesStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const maskedNik = maskPiiOnScreen ? '317102******0001' : '3171021505900001';
  const maskedPhone = maskPiiOnScreen ? '+62856****0123' : '+628567890123';

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
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Pengaturan & Privasi Pasien</h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Keamanan data medis & otentikasi</span>
        </div>
      </div>

      {/* Profile Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
            fontWeight: 800,
          }}>
            {(user?.name || 'BS')[0]}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{user?.name || 'Budi Santoso'}</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{user?.email || 'budi@pasien.id'}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>NIK (KTP)</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{maskedNik}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>No. Telepon</span>
            <span style={{ fontWeight: 600 }}>{maskedPhone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Golongan Darah</span>
            <span style={{ fontWeight: 700, color: '#dc2626' }}>O+</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Kontak Darurat</span>
            <span style={{ fontWeight: 600 }}>+628123333444 (Istri)</span>
          </div>
        </div>
      </div>

      {/* Security & Privacy Settings */}
      <h3 style={{ fontSize: '15px', color: '#334155', margin: '0 0 12px', fontWeight: 700 }}>
        Keamanan & Privasi PHI/PII
      </h3>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '8px 16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Sensor Data Sensitif (PII Masking)</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Sensor otomatis NIK & nomor kartu di layar</div>
          </div>
          <input
            type="checkbox"
            checked={maskPiiOnScreen}
            onChange={toggleMaskPii}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Kunci Biometrik (FaceID / Fingerprint)</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Otentikasi aman via hardware KeyStore</div>
          </div>
          <input
            type="checkbox"
            checked={biometricLoginEnabled}
            onChange={toggleBiometric}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={async () => {
          await logout();
          onNavigate('Home');
        }}
        style={{
          width: '100%',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '14px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Keluar dari Akun (Logout)
      </button>
    </div>
  );
};
