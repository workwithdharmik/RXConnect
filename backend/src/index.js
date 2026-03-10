require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files for audio playback
const path = require('path');
app.use('/uploads/audio', express.static(path.join(__dirname, '../../uploads/audio')));

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const prescriptionRoutes = require('./routes/prescriptions');
const appointmentRoutes = require('./routes/appointments');
const billingRoutes = require('./routes/billing');
const profileRoutes = require('./routes/profile');
const labRoutes = require('./routes/lab');
const publicRoutes = require('./routes/public');
const aiScribeRoutes = require('./routes/aiScribe');
const settingsRoutes = require('./routes/settings');

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/ai', aiScribeRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ClinicFlow Pro API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
