---
title: "06 - User Stories & Acceptance Criteria"
project: ClinicFlow Pro
document_id: "06"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, user-stories, agile, acceptance-criteria, gherkin, phase-1]
---

> [!abstract] 06 - User Stories & Acceptance Criteria
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `06`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[05 - Gap Analysis Report|05 - Gap Analysis Report]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[07 - Process Flow Document|07 - Process Flow Document]] ➡

---

## 1. Personas

| Persona | Description | Primary Goals |
| --- | --- | --- |
| Dr. Ravi (Doctor) | General physician with 10 years experience, semi-tech-savvy, sees 30+ patients daily | Quick prescriptions, patient history access, clean dashboard |
| Sunita (Receptionist) | Clinic front desk staff, manages appointments, collects fees, 3 years experience | Fast patient registration, appointment management, invoicing |
| Mr. Kapoor (Clinic Owner) | Owner of 2 clinics, business-focused, monitors revenue and staff performance | Revenue visibility, report downloads, multi-doctor management |
| Meena (Patient) | Middle-aged patient with diabetes, visits clinic monthly, uses basic Android phone | Receive reminders, get digital prescription copy, easy follow-up booking |

## 2. Epic Summary

| Epic ID | Epic Name | Description | BR Links |
| --- | --- | --- | --- |
| EP-01 | Patient Management | Full patient registration, profile, and history | BR-PM-001 to 004 |
| EP-02 | Prescription Engine | Digital Rx creation, drug DB, PDF, pharmacy dispatch | BR-RX-001 to 005 |
| EP-03 | Appointment Management | Scheduling, calendar, reminders | BR-AP-001 to 003 |
| EP-04 | Follow-Up Tracking | Follow-up scheduling, automated reminders | BR-FU-001 to 003 |
| EP-05 | Revenue & Billing | Invoicing, revenue dashboard, report exports | BR-RV-001 to 003 |
| EP-06 | User Management | Authentication, roles, audit logging | FR-AUTH-001 to 004 |

## 3. User Stories

### EP-01: Patient Management

| Story ID | US-PM-001 |
| --- | --- |
| Epic | EP-01 — Patient Management |
| Title | Register a new patient |
| User Role | Receptionist (Sunita) |
| Story | As a Receptionist, I want to register a new patient with their demographic details, so that their visit can be recorded and their medical history tracked over time. |
| Priority | **Must Have** 🔴 |
| Story Points | 5 |
| Sprint | Sprint 1 |
| BR Link | BR-PM-001 |

Acceptance Criteria:
- Given I am logged in as Receptionist, When I click 'New Patient', Then a registration form opens with fields: Full Name, DOB, Gender, Mobile, Address, Blood Group, Allergies.
- Given I submit the form with valid data, Then a unique Patient ID (format: CFP-YYYY-XXXXX) is generated and displayed.
- Given I submit the form with a duplicate mobile number, Then the system displays 'Patient with this mobile number already exists' and prevents duplicate registration.
- Given the form is submitted successfully, Then the patient profile is accessible within 2 seconds.

| Story ID | US-PM-002 |
| --- | --- |
| Epic | EP-01 — Patient Management |
| Title | Search for existing patient |
| User Role | Doctor (Dr. Ravi) / Receptionist |
| Story | As a Doctor, I want to quickly search for a patient by name or phone number, so that I can access their profile and history before consultation. |
| Priority | **Must Have** 🔴 |
| Story Points | 3 |
| Sprint | Sprint 1 |
| BR Link | BR-PM-002 |

Acceptance Criteria:
- Given I type at least 3 characters in the search bar, Then matching patients appear in a dropdown within 2 seconds.
- Given I search by a valid 10-digit mobile number, Then the exact matching patient is returned.
- Given no matching patient exists, Then 'No patient found. Register new patient?' is shown with a quick-register link.

### EP-02: Prescription Engine

| Story ID | US-RX-001 |
| --- | --- |
| Epic | EP-02 — Prescription Engine |
| Title | Create digital prescription |
| User Role | Doctor (Dr. Ravi) |
| Story | As a Doctor, I want to create a digital prescription with drug name, dosage, frequency, and duration, so that patients receive accurate, legible, and professional prescriptions. |
| Priority | **Must Have** 🔴 |
| Story Points | 8 |
| Sprint | Sprint 2 |
| BR Link | BR-RX-001, BR-RX-002 |

Acceptance Criteria:
- Given I am on a patient consultation screen, When I click 'New Prescription', Then a prescription form opens pre-filled with patient name, date, and my doctor details.
- Given I type a drug name, Then autocomplete suggestions from the 5,000+ drug database appear within 500ms.
- Given I add a drug entry, Then I can set: Dosage (mg), Frequency (Morning/Afternoon/Evening/Night toggles), Duration (days), and Special Instructions.
- Given I save the prescription, Then it is locked from further edits and a PDF is available for download within 5 seconds.
- Given I save the prescription and pharmacy integration is active, Then the PDF is dispatched to the linked pharmacy within 60 seconds.

### EP-03: Appointment Management

| Story ID | US-AP-001 |
| --- | --- |
| Epic | EP-03 — Appointment Management |
| Title | Book a patient appointment |
| User Role | Receptionist (Sunita) |
| Story | As a Receptionist, I want to book an appointment slot for a patient, so that the doctor's schedule is managed efficiently and patients are seen on time. |
| Priority | **Must Have** 🔴 |
| Story Points | 5 |
| Sprint | Sprint 2 |
| BR Link | BR-AP-001 |

Acceptance Criteria:
- Given I open the appointment scheduler, Then available time slots are shown in a calendar view (today and next 7 days).
- Given I select a slot and search for a patient, Then I can confirm the booking and an appointment confirmation SMS is sent to the patient within 2 minutes.
- Given I attempt to book an already-occupied slot, Then the system prevents the booking and shows 'Slot already booked'.

### EP-04: Follow-Up Tracking

| Story ID | US-FU-001 |
| --- | --- |
| Epic | EP-04 — Follow-Up Tracking |
| Title | Set follow-up reminder for patient |
| User Role | Doctor (Dr. Ravi) |
| Story | As a Doctor, I want to set a follow-up date at the end of consultation, so that the patient is automatically reminded to return on the scheduled date. |
| Priority | **Must Have** 🔴 |
| Story Points | 5 |
| Sprint | Sprint 3 |
| BR Link | BR-FU-001, BR-FU-002 |

Acceptance Criteria:
- Given I am completing a consultation, Then I can set a follow-up date using a date picker (minimum 1 day, maximum 365 days from today).
- Given a follow-up date is set, Then on that date the system automatically sends an SMS to the patient with clinic name and follow-up instruction.
- Given the follow-up date arrives, Then the patient name appears on the receptionist's 'Today's Follow-Ups' dashboard.

### EP-05: Revenue & Billing

| Story ID | US-RV-001 |
| --- | --- |
| Epic | EP-05 — Revenue & Billing |
| Title | Generate patient invoice |
| User Role | Receptionist (Sunita) |
| Story | As a Receptionist, I want to generate a digital invoice after consultation, so that the patient receives a formal receipt and clinic revenue is recorded automatically. |
| Priority | **Must Have** 🔴 |
| Story Points | 5 |
| Sprint | Sprint 4 |
| BR Link | BR-RV-001 |

Acceptance Criteria:
- Given a consultation is marked as complete, When I click 'Generate Invoice', Then an itemized invoice is created with: Clinic details, Patient name, Services with fees, GST breakdown, Total amount, Payment mode.
- Given the invoice is generated, Then it is downloadable as PDF and a copy is stored against the patient record.
- Given the invoice is saved, Then today's revenue total on the dashboard updates immediately.

## Revision History

| Version | Date | Changes | Author |
| --- | --- | --- | --- |
| 1.0 | March 2024 | Initial document creation | Dharmik Moradiya, Sr. BA |



---

## 🔗 Related Documents

- [[01 - Project Charter]]
- [[02 - Business Requirements Document]]
- [[03 - Functional Requirements Document]]
- [[04 - Stakeholder Analysis]]
- [[05 - Gap Analysis Report]]
- [[07 - Process Flow Document]]
- [[08 - UAT Test Plan]]
- [[09 - Risk Register]]
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[12 - Business Glossary]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
