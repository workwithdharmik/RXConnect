const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPrescriptions() {
    try {
        console.log('Fetching users and patients...');
        const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
        const patient = await prisma.patient.findFirst();

        if (!doctor || !patient) {
            console.log('Need at least one DOCTOR and one PATIENT in the DB to seed prescriptions.');
            return;
        }

        console.log(`Seeding prescriptions for Doctor: ${doctor.name}, Patient: ${patient.fullName}`);

        const draftPrescription = await prisma.prescription.create({
            data: {
                patientId: patient.patientId,
                patientName: patient.fullName,
                doctorId: doctor.id,
                date: new Date().toISOString().split('T')[0],
                diagnosis: 'Seasonal Influenza',
                status: 'COMPLETED',
                medicines: {
                    create: [
                        {
                            drugName: 'Paracetamol 650mg',
                            dosage: '1 Tab',
                            frequency: '1-0-1',
                            durationDays: 5,
                            instructions: 'After meals'
                        },
                        {
                            drugName: 'Azithromycin 500mg',
                            dosage: '1 Tab',
                            frequency: '1-0-0',
                            durationDays: 3,
                            instructions: 'After lunch'
                        }
                    ]
                }
            }
        });

        const completedPrescription = await prisma.prescription.create({
            data: {
                patientId: patient.patientId,
                patientName: patient.fullName,
                doctorId: doctor.id,
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
                diagnosis: 'Acute Gastroenteritis',
                status: 'COMPLETED',
                instructions: 'Drink plenty of fluids.',
                medicines: {
                    create: [
                        {
                            drugName: 'Ondansetron 4mg',
                            dosage: '1 Tab',
                            frequency: 'SOS',
                            durationDays: 2,
                            instructions: 'Before meals if nauseous'
                        },
                        {
                            drugName: 'ORS Sachets',
                            dosage: '1 Sachet',
                            frequency: 'As needed',
                            durationDays: 3,
                            instructions: 'Mix with 1L water'
                        }
                    ]
                }
            }
        });

        const anotherPrescription = await prisma.prescription.create({
            data: {
                patientId: patient.patientId,
                patientName: patient.fullName,
                doctorId: doctor.id,
                date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // 2 days ago
                diagnosis: 'Hypertension Follow-up',
                status: 'COMPLETED',
                followUpDate: new Date(Date.now() + 15 * 86400000), // 15 days from now
                medicines: {
                    create: [
                        {
                            drugName: 'Telmisartan 40mg',
                            dosage: '1 Tab',
                            frequency: '1-0-0',
                            durationDays: 30,
                            instructions: 'Morning before breakfast'
                        },
                        {
                            drugName: 'Amlodipine 5mg',
                            dosage: '1 Tab',
                            frequency: '0-0-1',
                            durationDays: 30,
                            instructions: 'At bedtime'
                        }
                    ]
                }
            }
        });

        console.log('Successfully seeded 3 prescriptions:', draftPrescription.id, completedPrescription.id, anotherPrescription.id);
    } catch (error) {
        console.error('Error seeding prescriptions:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedPrescriptions();
