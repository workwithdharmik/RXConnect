---
title: "02 - Business Requirements Document"
project: ClinicFlow Pro
document_id: "02"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, brd, requirements, moscow, phase-1]
---

> [!abstract] 02 - Business Requirements Document
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `02`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[01 - Project Charter|01 - Project Charter]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[03 - Functional Requirements Document|03 - Functional Requirements Document]] ➡

---

## 1. Executive Summary

ClinicFlow Pro is a digital clinic management solution designed to modernize operations at small Indian clinics. This Business Requirements Document (BRD) captures the complete business needs, objectives, constraints, and success criteria that the solution must satisfy. India has over 1.2 million registered small clinics; more than 85% operate on manual processes. This document defines the requirements to automate and streamline the most critical workflows.

## 2. Business Context

### 2.1 Current State (AS-IS)

The current operational model in small Indian clinics is characterized by:
- Patient registration done manually using paper registers
- Prescriptions handwritten on paper slips, prone to errors and illegibility
- No centralized patient history — doctors must rely on memory or patient-carried papers
- Appointment scheduling managed by verbal communication or personal registers
- Revenue tracked manually via cash books — no digital visibility
- Follow-up reminders communicated verbally — high drop-off rate
- Pharmacy communication done by patient physically carrying prescription

### 2.2 Future State (TO-BE)

ClinicFlow Pro will establish the following future state:
- Digital patient registration with searchable history and profiles
- Digital prescription generation with drug database and dosage guidance
- Automated SMS/WhatsApp follow-up reminders to patients
- Real-time revenue dashboard accessible from any device
- Pharmacy prescription dispatch via integrated digital channel
- Appointment calendar with automated reminders

## 3. Business Requirements

### 3.1 Patient Management

| ID | Requirement | Description | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| BR-PM-001 | Patient Registration | The system SHALL allow staff to register new patients with name, age, gender, contact, address, and medical history. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-PM-002 | Patient Search | The system SHALL enable search of existing patients by name, phone number, or patient ID within 2 seconds. | **Must Have** 🔴 | Receptionist | ✅ Approved |
| BR-PM-003 | Visit History | The system SHALL maintain a complete chronological history of all patient visits, diagnoses, and prescriptions. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-PM-004 | Patient Profile Update | The system SHALL allow authorized users to update patient demographic and medical information at any time. | **Must Have** 🔴 | Receptionist | ✅ Approved |

### 3.2 Prescription Management

| ID | Requirement | Description | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| BR-RX-001 | Digital Prescription | The system SHALL enable doctors to create digital prescriptions with medicine name, dosage, frequency, and duration. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-RX-002 | Drug Database | The system SHALL provide a searchable drug database with auto-complete functionality containing at least 5,000 Indian generic and branded medicines. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-RX-003 | Prescription Print/PDF | The system SHALL generate a printable and downloadable PDF prescription with clinic letterhead. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-RX-004 | Pharmacy Dispatch | The system SHOULD transmit digital prescriptions to linked pharmacy partners via API or WhatsApp. | **Should Have** 🟡 | Pharmacy Partners | ✅ Approved |
| BR-RX-005 | Prescription History | The system SHALL maintain a searchable history of all prescriptions issued to a patient. | **Must Have** 🔴 | Doctor Users | ✅ Approved |

### 3.3 Appointment Management

| ID | Requirement | Description | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| BR-AP-001 | Appointment Booking | The system SHALL allow staff to schedule, modify, and cancel patient appointments. | **Must Have** 🔴 | Receptionist | ✅ Approved |
| BR-AP-002 | Calendar View | The system SHALL display a daily and weekly appointment calendar view for the doctor. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-AP-003 | Appointment Reminders | The system SHALL send automated SMS reminders to patients 24 hours before scheduled appointments. | **Must Have** 🔴 | Doctor Users | ✅ Approved |

### 3.4 Follow-Up Tracking

| ID | Requirement | Description | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| BR-FU-001 | Follow-Up Scheduling | The system SHALL allow doctors to set follow-up dates at the time of consultation. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-FU-002 | Automated Patient Reminders | The system SHALL automatically send SMS/WhatsApp reminders to patients on the day of scheduled follow-up. | **Must Have** 🔴 | Doctor Users | ✅ Approved |
| BR-FU-003 | Follow-Up Dashboard | The system SHALL provide a daily list of patients due for follow-up to the doctor/receptionist. | **Should Have** 🟡 | Receptionist | ✅ Approved |

### 3.5 Revenue & Reporting

| ID | Requirement | Description | Priority | Source | Status |
| --- | --- | --- | --- | --- | --- |
| BR-RV-001 | Billing & Invoicing | The system SHALL generate digital invoices/receipts for consultation fees and services. | **Must Have** 🔴 | Clinic Owner | ✅ Approved |
| BR-RV-002 | Revenue Dashboard | The system SHALL display daily, weekly, and monthly revenue summaries on the clinic dashboard. | **Must Have** 🔴 | Clinic Owner | ✅ Approved |
| BR-RV-003 | Revenue Reports | The system SHALL generate exportable revenue reports in PDF and Excel format. | **Should Have** 🟡 | Clinic Owner | ✅ Approved |

## 4. Business Rules

| Rule ID | Condition | Action / Restriction |
| --- | --- | --- |
| RULE-001 | Doctor attempts to prescribe a drug | System SHALL validate drug name against the drug database before saving |
| RULE-002 | Appointment slot is already booked | System SHALL prevent double-booking and alert the receptionist |
| RULE-003 | Patient follow-up date arrives | System SHALL send reminder automatically; no manual trigger required |
| RULE-004 | Prescription is marked as complete | System SHALL lock the prescription from further edits; amendments require new prescription |
| RULE-005 | User is inactive for 15 minutes | System SHALL automatically log out the user session |

## 5. Non-Functional Requirements

| Category     | Requirement      | Specification                                                           | Priority           |
| ------------ | ---------------- | ----------------------------------------------------------------------- | ------------------ |
| Performance  | Page Load Time   | All pages load within 3 seconds on 4G connectivity                      | **Must Have** 🔴   |
| Performance  | Search Response  | Patient search results return within 2 seconds                          | **Must Have** 🔴   |
| Security     | Authentication   | Role-based login with OTP-based 2FA for doctors                         | **Must Have** 🔴   |
| Security     | Data Encryption  | All patient data encrypted using AES-256 at rest and TLS 1.3 in transit | **Must Have** 🔴   |
| Availability | Uptime SLA       | 99.5% monthly uptime (excluding scheduled maintenance windows)          | **Must Have** 🔴   |
| Scalability  | Concurrent Users | Support up to 50 concurrent users per clinic deployment                 | **Should Have** 🟡 |
| Usability    | Mobile Support   | Fully functional on mobile browsers (Android Chrome, iOS Safari)        | **Must Have** 🔴   |
| Compliance   | Data Privacy     | Compliant with IT Act 2000 and DPDP Act 2023 (India)                    | **Must Have** 🔴   |

## 6. Assumptions & Constraints

> [!warning] ⚠️ Constraints
> [!info] 💡 Assumptions
### 6.1 Assumptions

> [!info] 💡 Assumptions
> - It is assumed that clinic staff have access to at least one Android/iOS smartphone or computer.
> - It is assumed that clinics have minimum 2G internet connectivity for core features.
> - It is assumed that doctors consent to use the application after a one-time onboarding session.
> - It is assumed that pharmacy partners will provide API credentials for integration.

### 6.2 Constraints

> [!warning] ⚠️ Constraints
> - The application must support Hindi and English languages in Phase 1.
> - Total Phase 1 development budget is capped at INR 22,43,000.
> - All patient data must be stored on Indian servers to comply with data localization requirements.
> - Phase 1 delivery deadline is 7 months from project kickoff.

## 7. Success Criteria

| ID | Success Criterion | Measurement Method | Target |
| --- | --- | --- | --- |
| SC-01 | Doctor adoption rate within 30 days of go-live | % of active daily users | > 80% |
| SC-02 | Reduction in consultation time per patient | Doctor time-tracking survey | ≥ 25% reduction |
| SC-03 | Follow-up compliance rate improvement | Follow-up visits completed / scheduled | > 70% |
| SC-04 | Revenue visibility — daily reports accessible | Feature availability audit | 100% availability |
| SC-05 | System availability during clinic hours | Uptime monitoring dashboard | > 99.5% |

## Revision History

| Version | Date | Changes | Author |
| --- | --- | --- | --- |
| 1.0 | March 2024 | Initial document creation | Dharmik Moradiya, Sr. BA |



---

## 🔗 Related Documents

- [[01 - Project Charter]]
- [[03 - Functional Requirements Document]]
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
