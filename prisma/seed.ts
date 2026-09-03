import { PrismaClient, RoleType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Zavora Life database with official roles and accounts...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: RoleType.ADMIN },
    update: {},
    create: { name: RoleType.ADMIN, description: 'System Administrator' },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: RoleType.STAFF },
    update: {},
    create: { name: RoleType.STAFF, description: 'Clinic Staff & Receptionist' },
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: RoleType.DOCTOR },
    update: {},
    create: { name: RoleType.DOCTOR, description: 'Medical Doctor / Specialist' },
  });

  const patientRole = await prisma.role.upsert({
    where: { name: RoleType.PATIENT },
    update: {},
    create: { name: RoleType.PATIENT, description: 'Registered Patient' },
  });

  // Default hashed password for "Password123!"
  const defaultPasswordHash = await argon2.hash('Password123!');

  // 2. Clinics
  const clinic1 = await prisma.clinic.upsert({
    where: { id: 'clinic-pusat' },
    update: {
      name: 'Klinik Zavora Life Pusat Jakarta',
      address: 'Jl. Jenderal Sudirman No. 45, Jakarta Pusat',
      phone: '+62215551234',
      email: 'jakarta@zavoralife.id',
    },
    create: {
      id: 'clinic-pusat',
      name: 'Klinik Zavora Life Pusat Jakarta',
      address: 'Jl. Jenderal Sudirman No. 45, Jakarta Pusat',
      phone: '+62215551234',
      email: 'jakarta@zavoralife.id',
    },
  });

  const clinic2 = await prisma.clinic.upsert({
    where: { id: 'clinic-selatan' },
    update: {
      name: 'Klinik Zavora Life Cabang Selatan',
      address: 'Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan',
      phone: '+62217775678',
      email: 'selatan@zavoralife.id',
    },
    create: {
      id: 'clinic-selatan',
      name: 'Klinik Zavora Life Cabang Selatan',
      address: 'Jl. TB Simatupang No. 88, Cilandak, Jakarta Selatan',
      phone: '+62217775678',
      email: 'selatan@zavoralife.id',
    },
  });

  // 3. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: adminRole.id,
      name: 'Administrator Zavora Life',
    },
    create: {
      email: 'admin@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'Administrator Zavora Life',
      phone: '+628111111111',
      roleId: adminRole.id,
    },
  });

  // 4. Staff User
  await prisma.user.upsert({
    where: { email: 'staff@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: staffRole.id,
    },
    create: {
      email: 'staff@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'Staff Frontdesk Zavora Life',
      phone: '+628112222222',
      roleId: staffRole.id,
    },
  });

  // 5. Official Project Doctors
  // Doctor 1: dr. Andi Setiawan, Sp.PD
  const docUser1 = await prisma.user.upsert({
    where: { email: 'andi@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: doctorRole.id,
      name: 'dr. Andi Setiawan, Sp.PD',
    },
    create: {
      email: 'andi@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Andi Setiawan, Sp.PD',
      phone: '+6281234567890',
      roleId: doctorRole.id,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: docUser1.id },
    update: {
      specialization: 'Spesialis Penyakit Dalam',
      clinicId: clinic1.id,
      isAvailable: true,
    },
    create: {
      userId: docUser1.id,
      clinicId: clinic1.id,
      specialization: 'Spesialis Penyakit Dalam',
      licenseNumber: 'STR-3171-8892-2024',
      bio: 'Dokter spesialis penyakit dalam berpengalaman menangani diabetes, hipertensi, dan metabolik.',
      experienceYears: 10,
      education: 'Sp.PD - Universitas Indonesia',
      isAvailable: true,
    },
  });

  // Doctor 2: dr. Amanda Kartika, Sp.A
  const docUser2 = await prisma.user.upsert({
    where: { email: 'amanda.kartika@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: doctorRole.id,
      name: 'dr. Amanda Kartika, Sp.A',
    },
    create: {
      email: 'amanda.kartika@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Amanda Kartika, Sp.A',
      phone: '+6281298765432',
      roleId: doctorRole.id,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: docUser2.id },
    update: {
      specialization: 'Spesialis Anak (Pediatri)',
      clinicId: clinic2.id,
      isAvailable: true,
    },
    create: {
      userId: docUser2.id,
      clinicId: clinic2.id,
      specialization: 'Spesialis Anak (Pediatri)',
      licenseNumber: 'STR-3273-5519-2023',
      bio: 'Dokter spesialis anak berdedikasi pada tumbuh kembang optimal dan imunisasi.',
      experienceYears: 5,
      education: 'Sp.A - Universitas Padjadjaran',
      isAvailable: true,
    },
  });

  // Doctor 3: dr. Budi Setiawan, Sp.JP
  const docUser3 = await prisma.user.upsert({
    where: { email: 'budi.setiawan@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: doctorRole.id,
      name: 'dr. Budi Setiawan, Sp.JP',
    },
    create: {
      email: 'budi.setiawan@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Budi Setiawan, Sp.JP',
      phone: '+6281255566677',
      roleId: doctorRole.id,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: docUser3.id },
    update: {
      specialization: 'Spesialis Jantung & Pembuluh Darah',
      clinicId: clinic1.id,
      isAvailable: true,
    },
    create: {
      userId: docUser3.id,
      clinicId: clinic1.id,
      specialization: 'Spesialis Jantung & Pembuluh Darah',
      licenseNumber: 'STR-3171-1120-2022',
      bio: 'Dokter spesialis jantung dan kardiovaskular pencegahan.',
      experienceYears: 12,
      education: 'Sp.JP - Universitas Indonesia',
      isAvailable: true,
    },
  });

  // Doctor 4: dr. Hendra Pratama, Sp.PD
  const docUser4 = await prisma.user.upsert({
    where: { email: 'hendra.pratama@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: doctorRole.id,
      name: 'dr. Hendra Pratama, Sp.PD',
    },
    create: {
      email: 'hendra.pratama@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Hendra Pratama, Sp.PD',
      phone: '+6281233399988',
      roleId: doctorRole.id,
    },
  });

  await prisma.doctor.upsert({
    where: { userId: docUser4.id },
    update: {
      specialization: 'Spesialis Penyakit Dalam',
      clinicId: clinic1.id,
      isAvailable: true,
    },
    create: {
      userId: docUser4.id,
      clinicId: clinic1.id,
      specialization: 'Spesialis Penyakit Dalam',
      licenseNumber: 'STR-3171-8892-2024',
      bio: 'Dokter spesialis penyakit dalam dengan fokus gastroenterohepatologi.',
      experienceYears: 8,
      education: 'Sp.PD - Universitas Gadjah Mada',
      isAvailable: true,
    },
  });

  // 6. Registered Patients
  const patientUser1 = await prisma.user.upsert({
    where: { email: 'budi@pasien.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: patientRole.id,
      name: 'Budi Santoso',
    },
    create: {
      email: 'budi@pasien.id',
      passwordHash: defaultPasswordHash,
      name: 'Budi Santoso',
      phone: '+628567890123',
      roleId: patientRole.id,
      latitude: -6.2088,
      longitude: 106.8456,
    },
  });

  await prisma.patient.upsert({
    where: { userId: patientUser1.id },
    update: {
      emergencyContact: '+628123333444',
      bloodType: 'O+',
    },
    create: {
      userId: patientUser1.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Laki-laki',
      address: 'Jl. Tebet Barat No. 12, Jakarta Selatan',
      emergencyContact: '+628123333444',
      bloodType: 'O+',
    },
  });

  // 7. Insurance & Provider Roles
  const hospitalProviderRole = await prisma.role.upsert({
    where: { name: RoleType.HOSPITAL_PROVIDER },
    update: {},
    create: { name: RoleType.HOSPITAL_PROVIDER, description: 'Hospital / Healthcare Provider Staff' },
  });

  const insuranceAgentRole = await prisma.role.upsert({
    where: { name: RoleType.INSURANCE_AGENT },
    update: {},
    create: { name: RoleType.INSURANCE_AGENT, description: 'Field Insurance Agent & Advisor' },
  });

  const claimsOfficerRole = await prisma.role.upsert({
    where: { name: RoleType.CLAIMS_OFFICER },
    update: {},
    create: { name: RoleType.CLAIMS_OFFICER, description: 'Senior AUTRA Claims Adjudicator' },
  });

  // 8. Claims Officer User
  const claimsOfficerUser = await prisma.user.upsert({
    where: { email: 'claims.officer@zavoralife.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: claimsOfficerRole.id,
      name: 'Rian Pradana, AAIJ (Claims Officer)',
    },
    create: {
      email: 'claims.officer@zavoralife.id',
      passwordHash: defaultPasswordHash,
      name: 'Rian Pradana, AAIJ (Claims Officer)',
      phone: '+62811444555',
      roleId: claimsOfficerRole.id,
    },
  });

  // 9. Hospital Provider User
  await prisma.user.upsert({
    where: { email: 'provider@citraharapan.id' },
    update: {
      passwordHash: defaultPasswordHash,
      roleId: hospitalProviderRole.id,
      name: 'RS Citra Harapan Provider Portal',
    },
    create: {
      email: 'provider@citraharapan.id',
      passwordHash: defaultPasswordHash,
      name: 'RS Citra Harapan Provider Portal',
      phone: '+62811777888',
      roleId: hospitalProviderRole.id,
    },
  });

  // 10. Insurance Policies (Linked to Patient Budi Santoso)
  const patientBudi = await prisma.patient.findUnique({
    where: { userId: patientUser1.id },
  });

  const policy1 = await prisma.insurancePolicy.upsert({
    where: { policyCode: 'ZVR-CORP-88912-ID' },
    update: {
      patientId: patientBudi?.id,
      remainingLimit: 238500000,
    },
    create: {
      patientId: patientBudi?.id,
      provider: 'Zavora Life Protection Corporate',
      policyCode: 'ZVR-CORP-88912-ID',
      holderName: 'Budi Santoso',
      cardNumber: '9920-4411-8891-0012',
      status: 'ACTIVE',
      isCashless: true,
      annualLimit: 250000000,
      remainingLimit: 238500000,
      inpatientRoomLimitPerDay: 2000000,
      outpatientCoveragePct: 100,
      validUntil: '31 Des 2026',
      network: ['Klinik Zavora Life', 'RS Citra Harapan', 'RS Ananda', 'RSUPN RSCM'],
    },
  });

  await prisma.insurancePolicy.upsert({
    where: { policyCode: 'ADM-HLTH-99412-JKT' },
    update: {
      patientId: patientBudi?.id,
    },
    create: {
      patientId: patientBudi?.id,
      provider: 'Admedika Healthcare',
      policyCode: 'ADM-HLTH-99412-JKT',
      holderName: 'Budi Santoso',
      cardNumber: '0188-5522-3399-4411',
      status: 'ACTIVE',
      isCashless: true,
      annualLimit: 150000000,
      remainingLimit: 142000000,
      inpatientRoomLimitPerDay: 1500000,
      outpatientCoveragePct: 90,
      validUntil: '15 Okt 2026',
      network: ['Seluruh RS & Apotek Rekanan Admedika Indonesia'],
    },
  });

  await prisma.insurancePolicy.upsert({
    where: { policyCode: 'FLR-2026-77890-INA' },
    update: {
      patientId: patientBudi?.id,
    },
    create: {
      patientId: patientBudi?.id,
      provider: 'Fullerton Health Indonesia',
      policyCode: 'FLR-2026-77890-INA',
      holderName: 'Budi Santoso',
      cardNumber: '4488-1122-9900-5566',
      status: 'ACTIVE',
      isCashless: true,
      annualLimit: 180000000,
      remainingLimit: 175000000,
      inpatientRoomLimitPerDay: 1750000,
      outpatientCoveragePct: 95,
      validUntil: '20 Nov 2026',
      network: ['Jaringan Fullerton Health & Laboratorium Prodia'],
    },
  });

  // 11. Sample Historical Claim with AUTRA OCR and FDS Analysis
  if (patientBudi) {
    const sampleClaim = await prisma.claim.upsert({
      where: { claimNumber: 'CLM-2026-00891' },
      update: {},
      create: {
        claimNumber: 'CLM-2026-00891',
        policyId: policy1.id,
        patientId: patientBudi.id,
        providerName: 'Klinik Zavora Life Pusat Jakarta',
        diagnosisCode: 'E11.9',
        diagnosisDescription: 'Type 2 diabetes mellitus without complications',
        procedureCode: '99213',
        treatmentDate: new Date('2026-08-20'),
        invoiceNumber: 'INV/2026/08/ZVR-4412',
        invoiceAmount: 1850000,
        claimAmount: 1850000,
        coveredAmount: 1850000,
        patientPayableAmount: 0,
        status: 'PAID',
        autraConfidenceScore: 0.98,
        fdsRiskScore: 8.5,
        fdsDecision: 'AUTO_APPROVE',
        preAuthCode: 'AUTRA-PREAUTH-88912-OK',
        notes: 'Pre-approval klaim cashless disetujui 100% oleh Autra-AI Agentic Policy Engine.',
        metadata: {
          icd10Match: true,
          cashlessApproved: true,
          processedBy: 'AUTRA-Agent-v2.4',
        },
      },
    });

    const doc1 = await prisma.claimDocument.create({
      data: {
        claimId: sampleClaim.id,
        documentType: 'MEDICAL_INVOICE',
        fileName: 'invoice_klinik_zavora_aug2026.pdf',
        fileUrl: 'https://storage.zavoralife.id/claims/CLM-2026-00891/invoice.pdf',
        fileSize: 452100,
        mimeType: 'application/pdf',
        checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        ocrRawText: 'KLINIK ZAVORA LIFE PUSAT. No Invoice: INV/2026/08/ZVR-4412. Pasien: Budi Santoso. Diagnosa: E11.9 Diabetes Melitus. Biaya Konsultasi & Obat: Rp 1.850.000. Lunas.',
        classification: 'INVOICE_OFFICIAL',
        confidenceScore: 0.99,
        securityScanStatus: 'CLEAN',
      },
    });

    await prisma.claimExtractionTrace.createMany({
      data: [
        {
          claimId: sampleClaim.id,
          documentId: doc1.id,
          entityKey: 'invoiceNumber',
          entityValue: 'INV/2026/08/ZVR-4412',
          sourceSnippet: 'No Invoice: INV/2026/08/ZVR-4412',
          confidence: 0.99,
        },
        {
          claimId: sampleClaim.id,
          documentId: doc1.id,
          entityKey: 'diagnosisCode',
          entityValue: 'E11.9',
          sourceSnippet: 'Diagnosa: E11.9 Diabetes Melitus',
          confidence: 0.98,
        },
        {
          claimId: sampleClaim.id,
          documentId: doc1.id,
          entityKey: 'totalAmount',
          entityValue: '1850000',
          sourceSnippet: 'Biaya Konsultasi & Obat: Rp 1.850.000',
          confidence: 0.97,
        },
      ],
    });

    await prisma.fdsRiskAssessment.create({
      data: {
        claimId: sampleClaim.id,
        riskScore: 8.5,
        decision: 'AUTO_APPROVE',
        reasonCodes: ['VELOCITY_NORMAL', 'INVOICE_AUTHENTIC', 'ICD10_COVERED', 'IN_NETWORK_PROVIDER'],
        factors: {
          velocityScore: 5.0,
          documentAuthenticity: 98.0,
          providerReputation: 100.0,
          amountConsistency: 95.0,
        },
        velocitySummary: {
          claimsInLast24h: 1,
          totalAmountLast24h: 1850000,
          claimsInLast7d: 1,
        },
      },
    });
  }

  console.log('✅ Zavora Life PostgreSQL database successfully seeded and verified with AUTRA policies and FDS data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
