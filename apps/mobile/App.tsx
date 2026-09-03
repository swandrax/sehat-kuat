import React, { useState } from 'react';
import { HomeScreen } from './src/screens/HomeScreen';
import { SubmitClaimScreen } from './src/screens/SubmitClaimScreen';
import { ClaimsListScreen } from './src/screens/ClaimsListScreen';
import { ClaimDetailScreen } from './src/screens/ClaimDetailScreen';
import { DoctorDiscoveryScreen } from './src/screens/DoctorDiscoveryScreen';
import { LiveQueueScreen } from './src/screens/LiveQueueScreen';
import { MedicalRecordsScreen } from './src/screens/MedicalRecordsScreen';
import { HealthChatScreen } from './src/screens/HealthChatScreen';
import { ProfileSettingsScreen } from './src/screens/ProfileSettingsScreen';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('Home');
  const [selectedClaimId, setSelectedClaimId] = useState<string>('CLM-2026-00891');

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    setCurrentScreen('ClaimDetail');
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 20px rgba(0,0,0,0.08)',
      position: 'relative',
    }}>
      {/* Top Mobile Status Bar Indicator */}
      <div style={{
        padding: '6px 16px',
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>Zavora Life Mobile • AUTRA AI Engine v2.4</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>● Online</span>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, paddingBottom: '70px', overflowY: 'auto' }}>
        {currentScreen === 'Home' && <HomeScreen onNavigate={navigateTo} />}
        {currentScreen === 'SubmitClaim' && (
          <SubmitClaimScreen
            onNavigate={navigateTo}
            onClaimSubmitted={(id) => {
              setSelectedClaimId(id);
              setCurrentScreen('ClaimDetail');
            }}
          />
        )}
        {currentScreen === 'ClaimsList' && (
          <ClaimsListScreen onNavigate={navigateTo} onSelectClaim={handleSelectClaim} />
        )}
        {currentScreen === 'ClaimDetail' && (
          <ClaimDetailScreen claimId={selectedClaimId} onNavigate={navigateTo} />
        )}
        {currentScreen === 'Discovery' && <DoctorDiscoveryScreen onNavigate={navigateTo} />}
        {currentScreen === 'Queue' && <LiveQueueScreen onNavigate={navigateTo} />}
        {currentScreen === 'Records' && <MedicalRecordsScreen onNavigate={navigateTo} />}
        {currentScreen === 'Chat' && <HealthChatScreen onNavigate={navigateTo} />}
        {currentScreen === 'Settings' && <ProfileSettingsScreen onNavigate={navigateTo} />}
      </div>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '480px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.03)',
      }}>
        <button
          onClick={() => navigateTo('Home')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'Home' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>🏠</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen === 'Home' ? 700 : 500, marginTop: '2px' }}>
            Beranda
          </span>
        </button>

        <button
          onClick={() => navigateTo('ClaimsList')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'ClaimsList' || currentScreen === 'SubmitClaim' || currentScreen === 'ClaimDetail' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>📑</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen.includes('Claim') ? 700 : 500, marginTop: '2px' }}>
            Klaim AI
          </span>
        </button>

        <button
          onClick={() => navigateTo('Queue')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'Queue' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>🎫</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen === 'Queue' ? 700 : 500, marginTop: '2px' }}>
            Antrean
          </span>
        </button>

        <button
          onClick={() => navigateTo('Records')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'Records' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>📋</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen === 'Records' ? 700 : 500, marginTop: '2px' }}>
            Rekam Medis
          </span>
        </button>

        <button
          onClick={() => navigateTo('Chat')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'Chat' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>💬</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen === 'Chat' ? 700 : 500, marginTop: '2px' }}>
            Tanya AI
          </span>
        </button>

        <button
          onClick={() => navigateTo('Settings')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: currentScreen === 'Settings' ? '#0284c7' : '#64748b',
          }}
        >
          <span style={{ fontSize: '18px' }}>⚙️</span>
          <span style={{ fontSize: '10px', fontWeight: currentScreen === 'Settings' ? 700 : 500, marginTop: '2px' }}>
            Akun
          </span>
        </button>
      </div>
    </div>
  );
};

export default App;
