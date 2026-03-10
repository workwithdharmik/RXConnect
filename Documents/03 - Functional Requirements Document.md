---
title: "03 - Functional Requirements Document"
project: ClinicFlow Pro
document_id: "03"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, frd, technical-spec, requirements, phase-1]
---

> [!abstract] 03 - Functional Requirements Document
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `03`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[02 - Business Requirements Document|02 - Business Requirements Document]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[04 - Stakeholder Analysis|04 - Stakeholder Analysis]] ➡

---

## 1. Document Purpose

This Functional Requirements Document (FRD) defines the detailed functional and non-functional requirements for ClinicFlow Pro. It serves as the primary technical specification for the development team. Every requirement in this document traces back to the Business Requirements Document (BRD-CFPRO-2024-001).

## 2. System Architecture Overview

### 2.1 Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| Frontend | React.js + PWA | Cross-platform support, offline-capable, fast rendering |
| Backend | Node.js + Express | Lightweight, scalable, real-time capable via WebSockets |
| Database | PostgreSQL + Redis | Relational data for patients/prescriptions, Redis for session caching |
| Cloud | AWS (Mumbai Region) | Data residency in India, compliance with DPDP Act 2023 |
| SMS Gateway | Twilio / MSG91 | Indian SMS delivery for reminders and OTPs |

## 3. Functional Requirements

### 3.1 User Authentication & Access Control

| FR ID | BR Link | Feature | Functional Description | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| FR-AUTH-001 | — | Role-Based Login | System SHALL support three roles: Doctor, Receptionist, Admin with distinct access permissions. | **Must Have** 🔴 | ✅ Approved |
| FR-AUTH-002 | — | OTP Authentication | Doctor role SHALL require OTP verification via registered mobile number at every login. | **Must Have** 🔴 | ✅ Approved |
| FR-AUTH-003 | — | Session Timeout | System SHALL auto-logout any user session after 15 minutes of inactivity. | **Must Have** 🔴 | ✅ Approved |
| FR-AUTH-004 | — | Audit Log | System SHALL log all login events, prescription writes, and patient record modifications with timestamp and IP. | **Must Have** 🔴 | ✅ Approved |

### 3.2 Patient Management Module

| FR ID | BR Link | Feature | Functional Description | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| FR-PM-001 | BR-PM-001 | New Patient Form | Registration form SHALL capture: Full Name, DOB, Gender, Mobile, Address, Blood Group, Allergies, Chronic Conditions. | **Must Have** 🔴 | ✅ Approved |
| FR-PM-002 | BR-PM-002 | Patient Search | Search engine SHALL query by name (partial), mobile number, or patient ID. Results returned in < 2 seconds. Max 20 results per page. | **Must Have** 🔴 | ✅ Approved |
| FR-PM-003 | BR-PM-003 | Visit Timeline | Patient profile SHALL display chronological visit history with date, diagnosis, doctor name, and prescription link. | **Must Have** 🔴 | ✅ Approved |
| FR-PM-004 | BR-PM-004 | Patient ID Generation | System SHALL auto-generate a unique Patient ID (format: CFP-YYYY-XXXXX) upon registration. | **Must Have** 🔴 | ✅ Approved |

### 3.3 Prescription Module

| FR ID | BR Link | Feature | Functional Description | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| FR-RX-001 | BR-RX-001 | Prescription Form | Doctor SHALL be able to add multiple medicine entries. Each entry: Drug Name (autocomplete), Dosage, Frequency (morning/afternoon/evening/night), Duration (days), Instructions. | **Must Have** 🔴 | ✅ Approved |
| FR-RX-002 | BR-RX-002 | Drug Autocomplete | Drug name field SHALL provide autocomplete from a database of 5,000+ Indian medicines within 500ms of typing. | **Must Have** 🔴 | ✅ Approved |
| FR-RX-003 | BR-RX-003 | PDF Generation | System SHALL generate PDF prescription with: Clinic Name/Logo, Doctor Name, Patient Info, Date, Medicines, Signature space. Compliant with MCI guidelines. | **Must Have** 🔴 | ✅ Approved |
| FR-RX-004 | BR-RX-004 | Pharmacy Dispatch | System SHOULD send prescription PDF to linked pharmacy via WhatsApp Business API or email within 60 seconds of prescription save. | **Should Have** 🟡 | ✅ Approved |

### 3.4 Appointment Module

| FR ID | BR Link | Feature | Functional Description | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| FR-AP-001 | BR-AP-001 | Appointment Scheduler | Scheduler SHALL offer 15/30/60-minute time slots, configurable per doctor. Prevent double-booking. | **Must Have** 🔴 | ✅ Approved |
| FR-AP-002 | BR-AP-002 | Calendar Dashboard | Doctor dashboard SHALL show daily/weekly appointment calendar with patient name, time, and visit type. | **Must Have** 🔴 | ✅ Approved |
| FR-AP-003 | BR-AP-003 | SMS Reminder | System SHALL trigger SMS reminder 24 hours before appointment. Message template configurable by clinic. | **Must Have** 🔴 | ✅ Approved |

### 3.5 Revenue & Billing Module

| FR ID | BR Link | Feature | Functional Description | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| FR-RV-001 | BR-RV-001 | Invoice Generation | System SHALL generate itemized invoices for consultation fees, procedures, and medicines with GST calculation. | **Must Have** 🔴 | ✅ Approved |
| FR-RV-002 | BR-RV-002 | Revenue Dashboard | Admin dashboard SHALL display: Today's revenue, Weekly trend chart, Monthly total, Top services by revenue. | **Must Have** 🔴 | ✅ Approved |
| FR-RV-003 | BR-RV-003 | Report Export | System SHOULD allow export of revenue reports in PDF and Excel (XLSX) format for any date range. | **Should Have** 🟡 | ✅ Approved |

## 4. System Interface Specifications

| INT ID | System Name | Direction | Protocol | Data Format | Frequency | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| INT-001 | MSG91 SMS Gateway | Outbound | REST API | JSON | Real-time | Dev Team |
| INT-002 | WhatsApp Business API | Outbound | REST API | JSON | Real-time | Dev Team |
| INT-003 | Pharmacy Partner API | Outbound | REST API / Email | JSON / PDF | On Demand | BA + Dev |
| INT-004 | Payment Gateway (Razorpay) | Bidirectional | REST API | JSON | Real-time | Dev Team |

## 5. Data Dictionary (Key Entities)

| Field Name | Entity | Data Type | Length | Nullable | Validation | Description |
| --- | --- | --- | --- | --- | --- | --- |
| patient_id | Patient | VARCHAR | 15 | No | Format: CFP-YYYY-XXXXX | Unique patient identifier |
| full_name | Patient | VARCHAR | 100 | No | Min 2 chars, letters only | Patient full name |
| mobile_no | Patient | VARCHAR | 10 | No | 10-digit Indian number | Primary contact number |
| prescription_id | Prescription | UUID | 36 | No | Auto-generated UUID v4 | Unique prescription ID |
| drug_name | Prescription Line | VARCHAR | 200 | No | Must match drug DB | Medicine name |
| appointment_date | Appointment | TIMESTAMP | — | No | Future date only | Scheduled appointment time |

## 6. Error Handling Standards

| Error Type | Trigger | User Message | System Action |
| --- | --- | --- | --- |
| Validation Error | Invalid form input | Inline field-level error message in red | Prevent form submission; highlight field |
| Network Error | API timeout > 10s | 'Connection issue. Please try again.' | Retry up to 3 times; log to error monitoring |
| Session Expired | 15 min inactivity | 'Your session has expired. Please log in again.' | Redirect to login page; preserve unsaved data in localStorage |
| Permission Error | Unauthorized access attempt | 'You do not have permission to perform this action.' | Log access attempt; redirect to home |
| Integration Error | SMS / Pharmacy API failure | 'Notification could not be sent. Please follow up manually.' | Alert operations team; log failure; fallback to manual |

## 7. Reporting Requirements

| ID | Report Name | Description | Frequency | Recipients | Format | Source |
| --- | --- | --- | --- | --- | --- | --- |
| RPT-001 | Daily Revenue Summary | Total consultations, revenue, top service | Daily | Admin, Doctor | Dashboard | DB |
| RPT-002 | Monthly Revenue Report | Month-wise revenue with trend | Monthly | Admin | PDF/Excel | DB |
| RPT-003 | Follow-Up Compliance Report | Scheduled vs. completed follow-ups | Weekly | Doctor | Dashboard | DB |
| RPT-004 | Patient Activity Report | New vs. returning patients, no-shows | Monthly | Admin | PDF | DB |

## 8. Open Questions & Assumptions

> [!info] 💡 Assumptions
> [!question] ❓ Open Questions
### 8.1 Open Questions

> [!question] ❓ Open Questions
| ID | Question | Owner | Due Date |
| --- | --- | --- | --- |
| OQ-001 | Which pharmacy chains will be pilot integration partners in Phase 1? | Product Manager | Month 2 |
| OQ-002 | Will the drug database be licensed from an existing provider or built in-house? | Tech Lead | Month 1 |
| OQ-003 | What is the target device specification for clinics — smartphone only or desktop? | BA Team | Month 1 |

## Revision History

| Version | Date | Changes | Author |
| --- | --- | --- | --- |
| 1.0 | March 2024 | Initial document creation | Dharmik Moradiya, Sr. BA |



---

## 🔗 Related Documents

- [[01 - Project Charter]]
- [[02 - Business Requirements Document]]
- [[04 - Stakeholder Analysis]]
- [[05 - Gap Analysis Report]]
- [[06 - User Stories & Acceptance Criteria]]
- [[07 - Process Flow Document]]
- [[08 - UAT Test Plan]]
- [[09 - Risk Register]]
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[12 - Business Glossary]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
