import { PrismaClient, RoleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  // Pre-hashed Argon2id password for "Password123!"
  const defaultPasswordHash = '$argon2id$v=19$m=65536,t=3,p=4$K8bJpC8X+mP8uY7n4x9w6A$e1HqI0S4F+x3G9w2R8k4Y+v5M7q2P8z1A3b4C5d6E7f';

  // 2. Clinics
  const clinic1 = await prisma.clinic.create({
    data: {
      name: 'Klinik Sehat Pusat Jakarta',
      address: 'Jl. Sudirman No. 45, Jakarta Pusat',
      phone: '+62215551234',
      email: 'jakarta@kliniksehat.id',
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      name: 'Klinik Sehat Bandung',
      address: 'Jl. Ir. H. Juanda No. 88, Bandung',
      phone: '+62224445678',
      email: 'bandung@kliniksehat.id',
    },
  });

  // 3. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@kliniksehat.id' },
    update: {},
    create: {
      email: 'admin@kliniksehat.id',
      passwordHash: defaultPasswordHash,
      name: 'Admin Utama',
      phone: '+628111111111',
      roleId: adminRole.id,
    },
  });

  // 4. Staff User
  await prisma.user.upsert({
    where: { email: 'staff@kliniksehat.id' },
    update: {},
    create: {
      email: 'staff@kliniksehat.id',
      passwordHash: defaultPasswordHash,
      name: 'Staff Frontdesk',
      phone: '+628112222222',
      roleId: staffRole.id,
    },
  });

  // 5. Doctors
  const doctorUser1 = await prisma.user.upsert({
    where: { email: 'dr.budi@kliniksehat.id' },
    update: {},
    create: {
      email: 'dr.budi@kliniksehat.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Budi Santoso, Sp.PD',
      phone: '+6281234567890',
      roleId: doctorRole.id,
    },
  });

  const doctor1 = await prisma.doctor.upsert({
    where: { userId: doctorUser1.id },
    update: {},
    create: {
      userId: doctorUser1.id,
      clinicId: clinic1.id,
      specialization: 'Spesialis Penyakit Dalam',
      licenseNumber: 'SIP.123/DKI/2022',
      bio: 'Dokter spesialis penyakit dalam dengan pengalaman lebih dari 10 tahun menangani diabetes, hipertensi, dan gangguan metabolik.',
      experienceYears: 10,
      education: 'Sp.PD - Universitas Indonesia',
      isAvailable: true,
    },
  });

  const doctorUser2 = await prisma.user.upsert({
    where: { email: 'dr.siti@kliniksehat.id' },
    update: {},
    create: {
      email: 'dr.siti@kliniksehat.id',
      passwordHash: defaultPasswordHash,
      name: 'dr. Siti Rahma, Sp.A',
      phone: '+6281298765432',
      roleId: doctorRole.id,
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { userId: doctorUser2.id },
    update: {},
    create: {
      userId: doctorUser2.id,
      clinicId: clinic1.id,
      specialization: 'Spesialis Anak',
      licenseNumber: 'SIP.456/DKI/2023',
      bio: 'Dokter spesialis anak ramah yang berdedikasi pada tumbuh kembang optimal anak dan imunisasi lengkap.',
      experienceYears: 7,
      education: 'Sp.A - Universitas Padjadjaran',
      isAvailable: true,
    },
  });

  // 6. Schedules for Doctors
  await prisma.doctorSchedule.createMany({
    data: [
      { doctorId: doctor1.id, dayOfWeek: 1, startTime: '09:00', endTime: '13:00', maxPatients: 15 },
      { doctorId: doctor1.id, dayOfWeek: 3, startTime: '09:00', endTime: '13:00', maxPatients: 15 },
      { doctorId: doctor1.id, dayOfWeek: 5, startTime: '14:00', endTime: '18:00', maxPatients: 15 },
      { doctorId: doctor2.id, dayOfWeek: 2, startTime: '10:00', endTime: '15:00', maxPatients: 20 },
      { doctorId: doctor2.id, dayOfWeek: 4, startTime: '10:00', endTime: '15:00', maxPatients: 20 },
      { doctorId: doctor2.id, dayOfWeek: 6, startTime: '08:00', endTime: '12:00', maxPatients: 12 },
    ],
  });

  // 7. Patients
  const patientUser1 = await prisma.user.upsert({
    where: { email: 'andi@example.com' },
    update: {},
    create: {
      email: 'andi@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Andi Pratama',
      phone: '+628567890123',
      roleId: patientRole.id,
      latitude: -6.2088,
      longitude: 106.8456,
    },
  });

  const patient1 = await prisma.patient.upsert({
    where: { userId: patientUser1.id },
    update: {},
    create: {
      userId: patientUser1.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Laki-laki',
      address: 'Jl. Tebet Barat No. 12, Jakarta Selatan',
      emergencyContact: '+628123333444',
      bloodType: 'O+',
    },
  });

  const patientUser2 = await prisma.user.upsert({
    where: { email: 'dewi@example.com' },
    update: {},
    create: {
      email: 'dewi@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Dewi Lestari',
      phone: '+628578901234',
      roleId: patientRole.id,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { userId: patientUser2.id },
    update: {},
    create: {
      userId: patientUser2.id,
      dateOfBirth: new Date('1995-11-20'),
      gender: 'Perempuan',
      address: 'Jl. Dago No. 40, Bandung',
      emergencyContact: '+628135555666',
      bloodType: 'A+',
    },
  });

  const patientUser3 = await prisma.user.upsert({
    where: { email: 'rina@example.com' },
    update: {},
    create: {
      email: 'rina@example.com',
      passwordHash: defaultPasswordHash,
      name: 'Rina Kusuma',
      phone: '+628589012345',
      roleId: patientRole.id,
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { userId: patientUser3.id },
    update: {},
    create: {
      userId: patientUser3.id,
      dateOfBirth: new Date('2000-02-10'),
      gender: 'Perempuan',
      address: 'Jl. Kebon Jeruk No. 8, Jakarta Barat',
      emergencyContact: '+628147777888',
      bloodType: 'B+',
    },
  });

  // 8. Sample Appointment & Queue
  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      clinicId: clinic1.id,
      appointmentDate: new Date(),
      appointmentTime: '09:30',
      status: 'CONFIRMED',
      notes: 'Konsultasi rutin kadar gula darah',
    },
  });

  await prisma.queue.create({
    data: {
      clinicId: clinic1.id,
      doctorId: doctor1.id,
      patientId: patient1.id,
      appointmentId: appointment1.id,
      queueNumber: 1,
      status: 'WAITING',
      date: new Date(),
    },
  });

  // 9. Sample Medical Record & Prescription
  const medicalRecord1 = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      chiefComplaint: 'Sering merasa haus dan cepat lelah',
      clinicalNotes: 'Pasien tampak stabil, tekanan darah 120/80 mmHg, GDS 180 mg/dL.',
      treatment: 'Diet rendah karbohidrat, olahraga teratur 30 menit sehari.',
      followUpNotes: 'Kontrol kembali dalam 2 minggu.',
    },
  });

  await prisma.diagnosis.create({
    data: {
      medicalRecordId: medicalRecord1.id,
      code: 'E11.9',
      name: 'Type 2 diabetes mellitus without complications',
      description: 'Diabetes Melitus Tipe 2 Terkontrol',
    },
  });

  const prescription1 = await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      medicalRecordId: medicalRecord1.id,
      notes: 'Minum obat teratur setelah makan',
      status: 'ACTIVE',
    },
  });

  await prisma.prescriptionItem.createMany({
    data: [
      {
        prescriptionId: prescription1.id,
        medicineName: 'Metformin 500mg',
        dosage: '500mg',
        frequency: '2x sehari setelah makan',
        duration: '14 hari',
        instructions: 'Sesudah makan pagi dan malam',
        quantity: 28,
      },
      {
        prescriptionId: prescription1.id,
        medicineName: 'Vitamin B Kompleks',
        dosage: '1 tablet',
        frequency: '1x sehari',
        duration: '14 hari',
        instructions: 'Pagi hari setelah sarapan',
        quantity: 14,
      },
    ],
  });

  console.log('✅ Seed data successfully inserted into Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
