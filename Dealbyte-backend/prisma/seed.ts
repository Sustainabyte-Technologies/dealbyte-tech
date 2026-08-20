import 'dotenv/config';
import { PrismaClient, Role } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Default Admin User ─────────────────────────────────────────────────────
  const adminEmail = 'admin@dealbyte.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log('  ✅ Created admin user (admin@dealbyte.com / admin123)');
  } else {
    console.log('  ⏭️  Admin user already exists');
  }

  // ─── Default System Config ──────────────────────────────────────────────────
  const defaultConfigs = [
    {
      key: 'DEFAULT_MARGIN_PCT',
      value: '40',
      label: 'Default margin percentage applied to quotes',
    },
    {
      key: 'DEFAULT_BUFFER_PCT',
      value: '10',
      label: 'Default buffer percentage applied on top of margin',
    },
    {
      key: 'APPROVAL_MARGIN_THRESHOLD',
      value: '25',
      label: 'Margin below this percentage triggers mandatory approval',
    },
    {
      key: 'APPROVAL_VALUE_THRESHOLD',
      value: '5000000',
      label: 'Final quote above this value (INR) triggers mandatory approval',
    },
    {
      key: 'NEGOTIATION_MARGIN_FLOOR',
      value: '15',
      label: 'Minimum margin percentage allowed during negotiation',
    },
  ];

  for (const config of defaultConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log('  ✅ System config defaults seeded');

  // ─── Sample Services ────────────────────────────────────────────────────────
  const sampleServices = [
    {
      name: 'Air Audit',
      category: 'Energy Audit Services',
      description: 'Compressed Air Audit, leak detection, flow measurement, and efficiency analysis.',
      hasCostingTemplate: true,
    },
    {
      name: 'Energy Audit',
      category: 'Energy Audit Services',
      description: 'Comprehensive electrical, thermal, and utility energy audit.',
      hasCostingTemplate: true,
    },
    {
      name: 'BMS',
      category: 'Energy Audit Services',
      description: 'Building Management System (BMS) - automation, HVAC controls, and energy monitoring.',
      hasCostingTemplate: true,
    },
    {
      name: 'Electrical Safety Audit',
      category: 'Audit & Compliance',
      description: 'Comprehensive inspection of electrical installations, thermography, and NFPA/IS compliance.',
      hasCostingTemplate: true,
    },
    {
      name: 'Fire Safety Audit',
      category: 'Audit & Compliance',
      description: 'Evaluation of fire suppression systems, alarms, and emergency evacuation readiness.',
      hasCostingTemplate: true,
    },
    {
      name: 'MEP Due Diligence Audit',
      category: 'Engineering & Maintenance',
      description: 'Detailed mechanical, electrical, and plumbing infrastructure condition assessment.',
      hasCostingTemplate: true,
    },
    {
      name: 'Structural Health Audit',
      category: 'Civil & Structural',
      description: 'Non-destructive testing and structural integrity report for industrial facilities.',
      hasCostingTemplate: false,
    },
    {
      name: 'IR Blaster',
      category: 'Projects - Hardware & Automation',
      description: 'Infrared & Thermal Blasting / High-intensity Infrared Automation System.',
      hasCostingTemplate: true,
    },
    {
      name: 'Digiweld',
      category: 'Projects - Industrial Machinery',
      description: 'Digital Welding Automation & Weld Quality Diagnostics System.',
      hasCostingTemplate: true,
    },
    {
      name: 'Optibyte',
      category: 'Projects - Software & IoT',
      description: 'Optical Fiber & High-bandwidth Byte Communications Infrastructure.',
      hasCostingTemplate: true,
    },
    {
      name: 'Tec Byte',
      category: 'Projects - Software & IoT',
      description: 'Technology & Digital Byte Solutions Platform.',
      hasCostingTemplate: false,
    },
    {
      name: 'Welding IoT',
      category: 'IoT & Controls',
      description: 'Welding IoT diagnostics, real-time current/voltage monitoring, gas flow tracking, and weld quality analysis.',
      hasCostingTemplate: true,
    },
    {
      name: 'Welding IoT & Kit',
      category: 'IoT & Controls',
      description: 'Welding IoT hardware kit, sensor modules, diagnostic gateways, and complete setup.',
      hasCostingTemplate: true,
    },
    {
      name: 'Chiller Digitization',
      category: 'Welding IoT',
      description: 'Chiller digitization and real-time operational monitoring.',
      hasCostingTemplate: true,
    },
    {
      name: 'Cold Storage Temperature',
      category: 'Welding IoT',
      description: 'Cold storage temperature monitoring and alert system.',
      hasCostingTemplate: true,
    },
    {
      name: 'Device Parameter Interlocking',
      category: 'Welding IoT',
      description: 'Device parameter interlocking and safety automation.',
      hasCostingTemplate: true,
    },
    {
      name: 'Weld Data Digitalized',
      category: 'Welding IoT',
      description: 'Digitized welding parameters, arc time, voltage and current tracking.',
      hasCostingTemplate: true,
    },
    {
      name: 'Welding IoT Kit',
      category: 'Welding IoT',
      description: 'Complete Welding IoT kit with microcontrollers and sensors.',
      hasCostingTemplate: true,
    },
    {
      name: 'Welding Machine IoT',
      category: 'Welding IoT',
      description: 'Welding machine IoT telemetry, cloud connectivity, and diagnostics.',
      hasCostingTemplate: true,
    },
    {
      name: 'Weld Data Microsoft Azure',
      category: 'Welding IoT',
      description: 'Weld data cloud integration and analytics pipeline on Microsoft Azure.',
      hasCostingTemplate: true,
    },
  ];

  for (const s of sampleServices) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: { hasCostingTemplate: s.hasCostingTemplate },
      create: s,
    });
  }
  console.log('  ✅ Sample services seeded');

  // ─── Sample Manpower Rates ──────────────────────────────────────────────────
  const manpowerData = [
    { role: 'Senior Energy Engineer', ratePerDay: 6000, currency: 'INR' },
    { role: 'Junior Energy Engineer', ratePerDay: 3000, currency: 'INR' },
    { role: 'IoT Engineer', ratePerDay: 3500, currency: 'INR' },
    { role: 'Trainee Energy Engineer', ratePerDay: 2000, currency: 'INR' },
    { role: 'Energy Auditor', ratePerDay: 10000, currency: 'INR' },
  ];

  for (const m of manpowerData) {
    const existing = await prisma.manpowerRate.findFirst({ where: { role: m.role } });
    if (!existing) {
      await prisma.manpowerRate.create({ data: m });
    } else {
      await prisma.manpowerRate.update({ where: { id: existing.id }, data: { ratePerDay: m.ratePerDay } });
    }
  }
  console.log('  ✅ Sample manpower rates seeded');

  // ─── Sample Instrument Rates ────────────────────────────────────────────────
  await prisma.instrumentRate.deleteMany({});

  const instrumentData = [
    { instrumentName: 'Power Logger', rentalRatePerDay: 3500 },
    { instrumentName: 'Ultrasonic flow meter', rentalRatePerDay: 7000 },
    { instrumentName: 'Aquastic Ultrasonic leakage detector', rentalRatePerDay: 4000 },
    { instrumentName: 'Air Flow Meter', rentalRatePerDay: 4500 },
    { instrumentName: 'Thermal Camera', rentalRatePerDay: 1000 },
    { instrumentName: 'Digital Clamp Meter', rentalRatePerDay: 1000 },
    { instrumentName: 'Earth Meggar', rentalRatePerDay: 1000 },
    { instrumentName: 'Lux Meter', rentalRatePerDay: 500 },
    { instrumentName: 'Thermometer', rentalRatePerDay: 500 },
    { instrumentName: 'Temperature data logger', rentalRatePerDay: 500 },
    { instrumentName: 'Anemometer', rentalRatePerDay: 500 },
    { instrumentName: 'Differential Manometer', rentalRatePerDay: 1000 },
    { instrumentName: 'Flue Gas analyser', rentalRatePerDay: 5000 },
    { instrumentName: 'Others / Custom', rentalRatePerDay: 1000 },
  ];

  for (const inst of instrumentData) {
    await prisma.instrumentRate.create({ data: inst });
  }
  console.log('  ✅ Updated instrument rates seeded');

  // ─── Sample Users (for testing) ─────────────────────────────────────────────
  const sampleUsers = [
    {
      name: 'Estimation Lead',
      email: 'estimation@dealbyte.com',
      role: Role.ESTIMATION_LEAD,
    },
    {
      name: 'Sales Executive',
      email: 'sales@dealbyte.com',
      role: Role.SALES_EXECUTIVE,
    },
    {
      name: 'Manager',
      email: 'manager@dealbyte.com',
      role: Role.MANAGER,
    },
  ];

  for (const userData of sampleUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!existing) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          ...userData,
          passwordHash,
        },
      });
      console.log(`  ✅ Created ${userData.role} user (${userData.email})`);
    }
  }

  console.log('\n🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
