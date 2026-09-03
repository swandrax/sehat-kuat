import React, { useState } from 'react';
import { useClaimsStore, OcrExtractedData } from '../stores/useClaimsStore';
import { useInsuranceStore } from '../stores/useInsuranceStore';

interface SubmitClaimScreenProps {
  onNavigate: (screen: string) => void;
  onClaimSubmitted?: (claimId: string) => void;
}

export const SubmitClaimScreen: React.FC<SubmitClaimScreenProps> = ({
  onNavigate,
  onClaimSubmitted,
}) => {
  const { policies, selectedPolicy } = useInsuranceStore();
  const { analyzeDocumentWithAutra, submitClaim, isAnalyzingOcr, isSubmitting } = useClaimsStore();

  const [step, setStep] = useState<number>(1);
  const [chosenPolicyCode, setChosenPolicyCode] = useState<string>(
    selectedPolicy?.policyCode || policies[0]?.policyCode || 'ZVR-CORP-88912-ID',
  );

  // Document state
  const [fileName, setFileName] = useState<string>('invoice_rs_citra_harapan.pdf');
  const [extractedData, setExtractedData] = useState<OcrExtractedData | null>(null);

  // Form editable states (pre-populated by AUTRA OCR)
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [providerName, setProviderName] = useState<string>('RS Citra Harapan');
  const [claimAmount, setClaimAmount] = useState<number>(1450000);
  const [diagnosisCode, setDiagnosisCode] = useState<string>('E11.9');
  const [notes, setNotes] = useState<string>('');

  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Trigger simulated OCR extraction via AUTRA API
  const handleOcrAnalysis = async () => {
    const ocrResult = await analyzeDocumentWithAutra(fileName);
    if (ocrResult) {
      setExtractedData(ocrResult);
      if (ocrResult.detectedInvoiceNumber) setInvoiceNumber(ocrResult.detectedInvoiceNumber);
      if (ocrResult.detectedProvider) setProviderName(ocrResult.detectedProvider);
      if (ocrResult.detectedAmount) setClaimAmount(ocrResult.detectedAmount);
      if (ocrResult.detectedDiagnosisCode) setDiagnosisCode(ocrResult.detectedDiagnosisCode);
      setStep(3); // Go to review step
    }
  };

  // Final submission with idempotency protection
  const handleSubmit = async () => {
    const res = await submitClaim({
      policyCode: chosenPolicyCode,
      providerName,
      claimAmount,
      invoiceNumber,
      diagnosisCode,
      notes,
      documents: [
        {
          fileName,
          fileUrl: `https://storage.zavoralife.id/temp/${fileName}`,
          documentType: extractedData?.documentType || 'MEDICAL_INVOICE',
          ocrRawText: extractedData?.rawText || 'KWITANSI KLINIK RESMI',
        },
      ],
    });

    if (res.success && res.claim) {
      setSubmissionResult(res);
      setStep(5);
      if (onClaimSubmitted) {
        onClaimSubmitted(res.claim.id);
      }
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onNavigate('Home'))}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px',
            marginRight: '8px',
          }}
        >
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
            Pengajuan Klaim AUTRA-AI
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Langkah {step} dari 5 • Verifikasi Cashless Real-time
          </span>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: s <= step ? '#0284c7' : '#e2e8f0',
            }}
          />
        ))}
      </div>

      {/* STEP 1: Pilih Polis Asuransi */}
      {step === 1 && (
        <div>
          <h3 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
            1. Pilih Polis Asuransi Penjamin
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Pilih kartu asuransi yang akan digunakan untuk menanggung tagihan faskes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {(policies.length > 0 ? policies : [
              {
                policyCode: 'ZVR-CORP-88912-ID',
                provider: 'Zavora Life Protection Corporate',
                cardNumber: '9920-4411-8891-0012',
                remainingLimit: 238500000,
              },
              {
                policyCode: 'ADM-HLTH-99412-JKT',
                provider: 'Admedika Healthcare',
                cardNumber: '0188-5522-3399-4411',
                remainingLimit: 142000000,
              },
            ]).map((p: any) => (
              <div
                key={p.policyCode}
                onClick={() => setChosenPolicyCode(p.policyCode)}
                style={{
                  border: chosenPolicyCode === p.policyCode ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: chosenPolicyCode === p.policyCode ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{p.provider}</span>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>{p.policyCode}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  No. Kartu: {p.cardNumber}
                </div>
                <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
                  Sisa Plafon: Rp {p.remainingLimit.toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Lanjutkan ke Unggah Berkas →
          </button>
        </div>
      )}

      {/* STEP 2: Unggah / Foto Dokumen (OCR Intake) */}
      {step === 2 && (
        <div>
          <h3 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
            2. Foto / Unggah Bukti Kuitansi Medis
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            AUTRA OCR secara otomatis mengekstrak diagnosa ICD-10, nama faskes, resep obat, dan total biaya.
          </p>

          <div style={{
            border: '2px dashed #94a3b8',
            borderRadius: '16px',
            padding: '32px 16px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              Pilih Dokumen Medis
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Mendukung Kuitansi Rawat Jalan, E-Resep Farmasi, atau Invoice RS (PDF/JPG)
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => setFileName('invoice_rs_citra_harapan.pdf')}
                style={{
                  backgroundColor: fileName.includes('citra') ? '#0284c7' : '#e2e8f0',
                  color: fileName.includes('citra') ? '#fff' : '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sample: Invoice RS Citra Harapan
              </button>
              <button
                onClick={() => setFileName('resep_apotek_k24.pdf')}
                style={{
                  backgroundColor: fileName.includes('apotek') ? '#0284c7' : '#e2e8f0',
                  color: fileName.includes('apotek') ? '#fff' : '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Sample: Resep Apotek K-24
              </button>
            </div>
          </div>

          <button
            onClick={handleOcrAnalysis}
            disabled={isAnalyzingOcr}
            style={{
              width: '100%',
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isAnalyzingOcr ? 'not-allowed' : 'pointer',
              opacity: isAnalyzingOcr ? 0.7 : 1,
            }}
          >
            {isAnalyzingOcr ? 'Memproses AUTRA OCR & Ekstraksi NLP...' : '🔍 Mulai Ekstraksi Dokumen AI'}
          </button>
        </div>
      )}

      {/* STEP 3: Review Ekstraksi Entitas AI & Normalisasi */}
      {step === 3 && (
        <div>
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 600 }}>
              Dokumen berhasil dianalisis (Akurasi AUTRA OCR 98%)
            </span>
          </div>

          <h3 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '14px' }}>
            3. Verifikasi Data Terdeteksi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>FASKES / RUMAH SAKIT</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  marginTop: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>NO. INVOICE</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  marginTop: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>KODE ICD-10</label>
                <input
                  type="text"
                  value={diagnosisCode}
                  onChange={(e) => setDiagnosisCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    boxSizing: 'border-box',
                    fontWeight: 700,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>TOTAL KLAIM (IDR)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    marginTop: '4px',
                    boxSizing: 'border-box',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            {extractedData?.detectedMedications && extractedData.detectedMedications.length > 0 && (
              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>RESEP OBAT TERDETEKSI:</span>
                <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '12px', color: '#334155' }}>
                  {extractedData.detectedMedications.map((m, idx) => (
                    <li key={idx}>{m.name} ({m.dosage || 'Sesuai Resep'})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(4)}
            style={{
              width: '100%',
              backgroundColor: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Lanjut ke Evaluasi Polis & FDS →
          </button>
        </div>
      )}

      {/* STEP 4: Pre-Approval Preview & FDS Evaluation */}
      {step === 4 && (
        <div>
          <h3 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '8px' }}>
            4. Evaluasi Klausul & Deteksi Anomali
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Engine AUTRA dan FDS melakukan audit kesesuaian diagnosis dan validasi kuota secara real-time.
          </p>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Status Pre-Approval</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                ✓ CASHLESS PRE-APPROVED
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Skor Risiko FDS</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                🛡️ 8.5 / 100 (LOW RISK)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Kesesuaian ICD-10 ({diagnosisCode})</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>VALID & COVERED</span>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Tanggungan Asuransi</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7' }}>
                Rp {claimAmount.toLocaleString('id-ID')} (100%)
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: '100%',
              backgroundColor: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Memproses Transaksi...' : '🚀 Kirim Klaim Resmi'}
          </button>
        </div>
      )}

      {/* STEP 5: Sukses & Pre-Auth Badge */}
      {step === 5 && submissionResult && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '50px', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ fontSize: '18px', color: '#065f46', margin: '0 0 6px' }}>
            Klaim Berhasil Disetujui!
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>
            Kode otorisasi pre-approval instan telah diterbitkan oleh AUTRA-AI.
          </p>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px solid #0284c7',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>KODE OTORISASI RESMI</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', margin: '4px 0 12px' }}>
              {submissionResult.claim?.preAuthCode || 'AUTRA-PREAUTH-88912-OK'}
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              Nomor Klaim: <strong>{submissionResult.claim?.claimNumber}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
              Total Ditanggung: <strong>Rp {claimAmount.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => onNavigate('ClaimsList')}
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Daftar Klaim
            </button>
            <button
              onClick={() => onNavigate('Home')}
              style={{
                flex: 1,
                backgroundColor: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
