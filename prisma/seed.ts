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

  console.log('✅ Zavora Life PostgreSQL database successfully seeded and verified!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
