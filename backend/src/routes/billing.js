const express = require('express');
const { authMiddleware } = require('../utils/jwt');
const prisma = require('../utils/prisma');
const router = express.Router();

// GET all invoices
router.get('/', authMiddleware, async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(invoices);
    } catch (error) {
        console.error('Fetch invoices error:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// GET dashboard revenue stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Today's Revenue
        const todayInvoices = await prisma.invoice.findMany({
            where: { date: today }
        });
        const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // 2. Total Registered Patients
        const totalPatients = await prisma.patient.count();

        // 3. Prescriptions Today
        const prescriptionsToday = await prisma.prescription.count({
            where: { date: today }
        });

        // 4. Last 7 Days Trend
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            last7Days.push(dateStr);
        }

        const trendDataRaw = await prisma.invoice.findMany({
            where: {
                date: { in: last7Days }
            }
        });

        const trendData = last7Days.map(date => {
            return trendDataRaw
                .filter(inv => inv.date === date)
                .reduce((sum, inv) => sum + inv.total, 0);
        });

        res.json({
            todayRevenue,
            totalPatients,
            prescriptionsToday,
            trendData
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to generate stats' });
    }
});

// POST new invoice
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { patientName, patientMobile, items, paymentMethod } = req.body;

        if (!patientName || !items || items.length === 0) {
            return res.status(400).json({ error: 'Patient Name and at least one item are required' });
        }

        const subtotal = items.reduce((sum, item) => sum + Number(item.amount), 0);
        const cgst = Math.round(subtotal * 0.09);
        const sgst = Math.round(subtotal * 0.09);
        const total = subtotal + cgst + sgst;

        const count = await prisma.invoice.count();
        const invoiceNumber = `INV-2026-${(count + 1).toString().padStart(3, '0')}`;

        const newInvoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                patientName,
                patientMobile: patientMobile || '',
                date: new Date().toISOString().split('T')[0],
                subtotal,
                cgst,
                sgst,
                total,
                status: 'PAID',
                paymentMethod: paymentMethod || 'CASH',
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        amount: Number(item.amount)
                    }))
                }
            },
            include: { items: true }
        });

        res.status(201).json({ message: 'Invoice generated successfully', invoice: newInvoice });

    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
});

module.exports = router;
