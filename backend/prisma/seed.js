const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Clean Seed...');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 0. Clear Existing Data to avoid constraint issues
    console.log('Clearing existing clinical data...');
    await prisma.invoiceItem.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.labOrder.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.prescriptionLine.deleteMany({});
    await prisma.prescription.deleteMany({});
    await prisma.patient.deleteMany({});

    // 1. Create Users
    const drRavi = await prisma.user.upsert({
        where: { mobile: '9999999999' },
        update: {},
        create: {
            name: 'Dr. Ravi K.',
            role: 'DOCTOR',
            mobile: '9999999999',
            password: passwordHash,
            qualification: 'MBBS, MD (Internal Medicine)',
            specialization: 'Physician',
            clinicName: 'RXConnect Main'
        }
    });

    const receptionist = await prisma.user.upsert({
        where: { mobile: '8888888888' },
        update: {},
        create: {
            name: 'Front Desk',
            role: 'RECEPTIONIST',
            mobile: '8888888888',
            password: passwordHash
        }
    });

    console.log('Seed: Users checked/created.');

    // 2. Create Patients
    const patientsData = [
        { fullName: 'Rahul Sharma', mobileNo: '9876543210', gender: 'Male', patientId: 'CFP-2026-00001' },
        { fullName: 'Priya Patel', mobileNo: '8765432109', gender: 'Female', patientId: 'CFP-2026-00002' },
        { fullName: 'Amit Verma', mobileNo: '7654321098', gender: 'Male', patientId: 'CFP-2026-00003' },
        { fullName: 'Sneha Gupta', mobileNo: '6543210987', gender: 'Female', patientId: 'CFP-2026-00004' },
        { fullName: 'Vikram Singh', mobileNo: '5432109876', gender: 'Male', patientId: 'CFP-2026-00005' },
        { fullName: 'Sunita Das', mobileNo: '9988776655', gender: 'Female', patientId: 'CFP-2026-00006' },
        { fullName: 'Rajesh Kumar', mobileNo: '8877665544', gender: 'Male', patientId: 'CFP-2026-00007' },
        { fullName: 'Anjali Mehra', mobileNo: '7766554433', gender: 'Female', patientId: 'CFP-2026-00008' },
        { fullName: 'Vijay Pratap', mobileNo: '6655443322', gender: 'Male', patientId: 'CFP-2026-00009' },
        { fullName: 'Meera Iyer', mobileNo: '5544332211', gender: 'Female', patientId: 'CFP-2026-00010' },
        { fullName: 'Karan Johar', mobileNo: '1122334455', gender: 'Male', patientId: 'CFP-2026-00011' },
        { fullName: 'Deepa Malik', mobileNo: '2233445566', gender: 'Female', patientId: 'CFP-2026-00012' },
        { fullName: 'Aditya Rao', mobileNo: '3344556677', gender: 'Male', patientId: 'CFP-2026-00013' },
        { fullName: 'Neha Kakkar', mobileNo: '4455667788', gender: 'Female', patientId: 'CFP-2026-00014' },
        { fullName: 'Sanjay Dutt', mobileNo: '5566778899', gender: 'Male', patientId: 'CFP-2026-00015' }
    ];

    for (const p of patientsData) {
        await prisma.patient.create({ data: p });
    }
    console.log('Seed: Patients created.');

    // 3. Create Appointments for Today
    const today = new Date().toISOString().split('T')[0];

    const appointmentsData = [
        { patientName: 'Rahul Sharma', date: today, timeSlot: '09:00', timeStr: '09:00 AM', status: 'COMPLETED', type: 'FOLLOW_UP', doctorId: drRavi.id },
        { patientName: 'Priya Patel', date: today, timeSlot: '09:30', timeStr: '09:30 AM', status: 'COMPLETED', type: 'NEW', doctorId: drRavi.id },
        { patientName: 'Sunita Das', date: today, timeSlot: '10:00', timeStr: '10:00 AM', status: 'COMPLETED', type: 'EMERGENCY', doctorId: drRavi.id },
        { patientName: 'Amit Verma', date: today, timeSlot: '11:00', timeStr: '11:00 AM', status: 'SCHEDULED', type: 'NEW', doctorId: drRavi.id },
        { patientName: 'Sneha Gupta', date: today, timeSlot: '11:30', timeStr: '11:30 AM', status: 'SCHEDULED', type: 'FOLLOW_UP', doctorId: drRavi.id },
        { patientName: 'Anjali Mehra', date: today, timeSlot: '12:00', timeStr: '12:00 PM', status: 'SCHEDULED', type: 'CONSULTATION', doctorId: drRavi.id },
        { patientName: 'Vikram Singh', date: today, timeSlot: '12:30', timeStr: '12:30 PM', status: 'SCHEDULED', type: 'NEW', doctorId: drRavi.id },
        { patientName: 'Meera Iyer', date: today, timeSlot: '14:00', timeStr: '02:00 PM', status: 'SCHEDULED', type: 'FOLLOW_UP', doctorId: drRavi.id },
        { patientName: 'Vijay Pratap', date: today, timeSlot: '15:00', timeStr: '03:00 PM', status: 'SCHEDULED', type: 'ROUTINE', doctorId: drRavi.id },
        { patientName: 'Rajesh Kumar', date: today, timeSlot: '15:30', timeStr: '03:30 PM', status: 'SCHEDULED', type: 'NEW', doctorId: drRavi.id }
    ];

    for (const a of appointmentsData) {
        await prisma.appointment.create({ data: a });
    }
    console.log('Seed: Today\'s Busy Schedule created.');

    // 4. Create Lab Orders (Pending)
    const pendingLabs = [
        { patientId: 'CFP-2026-00001', testNames: 'Complete Blood Count (CBC)', instructions: 'Fasting required' },
        { patientId: 'CFP-2026-00003', testNames: 'Lipid Profile, Hba1c', instructions: 'High priority' },
        { patientId: 'CFP-2026-00006', testNames: 'USG Whole Abdomen', instructions: 'Patient reports acute pain' },
        { patientId: 'CFP-2026-00008', testNames: 'Liver Function Test (LFT)', instructions: 'Alcoholic history' },
        { patientId: 'CFP-2026-00012', testNames: 'Kidney Function Test (KFT)', instructions: 'Check creatinine levels' }
    ];

    for (const lab of pendingLabs) {
        await prisma.labOrder.create({
            data: {
                ...lab,
                doctorId: drRavi.id,
                status: 'PENDING'
            }
        });
    }
    console.log('Seed: Pending Lab Orders created.');

    // 5. Create Invoices for last 7 days
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dailyTotal = 4500 + Math.floor(Math.random() * 10000);
        const invNum = `INV-SEED-${i}-${Date.now()}`;

        await prisma.invoice.create({
            data: {
                invoiceNumber: invNum,
                patientName: 'Seed Patient',
                date: dateStr,
                subtotal: dailyTotal * 0.82,
                cgst: dailyTotal * 0.09,
                sgst: dailyTotal * 0.09,
                total: dailyTotal,
                paymentMethod: 'UPI',
                items: {
                    create: [{ description: 'Consultation & Clinical Work', amount: dailyTotal * 0.82 }]
                }
            }
        });
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
