/**
 * ClinicFlow Pro - Communication Utility
 * Abstracts SMS and WhatsApp messaging logic.
 * Support for Twilio, MSG91, and Mock modes.
 */

class CommunicationService {
    constructor() {
        this.mode = process.env.COMMUNICATION_MODE || 'MOCK';
        console.log(`[COMMUNICATION] Initialized in ${this.mode} mode`);
    }

    async sendMessage({ to, message, type = 'SMS' }) {
        if (!to || !message) {
            console.error('[COMMUNICATION] Missing "to" or "message" parameter');
            return false;
        }

        const logPrefix = `[COMMUNICATION] [${type}] [To: ${to}]`;

        if (this.mode === 'MOCK') {
            console.log(`${logPrefix} Logic: ${message}`);
            // In a real system, we might push this to a local notification log / database
            return true;
        }

        try {
            if (this.mode === 'TWILIO') {
                // Future implementation: Twilio client
                console.log(`${logPrefix} Sending via Twilio (Placeholder)`);
            } else if (this.mode === 'MSG91') {
                // Future implementation: MSG91 client
                console.log(`${logPrefix} Sending via MSG91 (Placeholder)`);
            }
            return true;
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.message);
            return false;
        }
    }

    /**
     * Triggered on Appointment Booking
     */
    async sendAppointmentConfirmation(patient, appointment) {
        const msg = `Hi ${patient.fullName}, your appointment at ClinicFlow Pro is confirmed for ${new Date(appointment.startTime).toLocaleString()}. Doctor: ${appointment.doctor?.name || 'Practitioner'}.`;
        return this.sendMessage({ to: patient.mobileNo, message: msg, type: 'WhatsApp' });
    }

    /**
     * Triggered on Lab Order Creation
     */
    async sendLabOrderNotification(patient, labOrder) {
        const msg = `Hi ${patient.fullName}, a new lab investigation (${labOrder.testNames}) has been ordered for you. You can view details in your Patient Portal.`;
        return this.sendMessage({ to: patient.mobileNo, message: msg, type: 'SMS' });
    }

    /**
     * Triggered on Appointment Completion
     */
    async sendVisitSummary(patient) {
        const msg = `Thank you for visiting ClinicFlow Pro, ${patient.fullName}. Your digital prescription and records are available in your portal. Get well soon!`;
        return this.sendMessage({ to: patient.mobileNo, message: msg, type: 'WhatsApp' });
    }
}

module.exports = new CommunicationService();
