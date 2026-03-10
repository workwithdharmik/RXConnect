---
title: "08 - UAT Test Plan"
project: ClinicFlow Pro
document_id: "08"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, uat, testing, qa, phase-1]
---

> [!abstract] 08 - UAT Test Plan
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `08`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[07 - Process Flow Document|07 - Process Flow Document]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[09 - Risk Register|09 - Risk Register]] ➡

---

## 1. UAT Overview

This UAT Test Plan defines the test scope, objectives, entry/exit criteria, test cases, defect classification, and sign-off process for ClinicFlow Pro Phase 1. UAT will be conducted by representative end users (doctors and receptionist) at 2 pilot clinics before production go-live.

## 2. Entry & Exit Criteria

> [!success] 🏁 Exit Criteria
### 2.1 Entry Criteria (Must All Be Met)

> [!check] ✅ Entry Criteria
> - All **Must Have** 🔴 features developed and passed unit + integration tests
> - QA/SIT completed with zero Critical and zero High open defects
> - UAT test environment is stable and all test data is loaded
> - UAT participants (2 doctors, 2 receptionists) confirmed and trained
> - This UAT Test Plan approved by Product Manager

### 2.2 Exit Criteria (Must All Be Met for Sign-Off)

> [!success] 🏁 Exit Criteria
> - 100% of Critical and High priority test cases executed and passed
> - **Should Have** 🟡 test cases: >90% pass rate
> - Zero Critical or High severity defects open at exit
> - Medium defects reviewed and accepted or deferred with business sign-off
> - UAT Sign-off form completed and signed by clinic owners / doctors

## 3. Test Cases

### 3.1 Patient Management

| TC-ID | Scenario | Steps | Expected Result | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| TC-PM-001 | Register new patient with valid data | 1. Login as Receptionist 2. Click 'New Patient' 3. Fill all fields 4. Submit | Patient registered; unique ID generated; profile accessible in < 2 sec | **Critical** 🔴 | ⬜ Not Tested |
| TC-PM-002 | Attempt duplicate mobile number registration | 1. Register patient with existing mobile 2. Submit form | Error: 'Patient already exists' shown; form not submitted | **High** 🟠 | ⬜ Not Tested |
| TC-PM-003 | Search patient by name (partial) | 1. Type 3+ chars in search 2. Observe results | Matching results within 2 seconds; correct patient shown | **Critical** 🔴 | ⬜ Not Tested |
| TC-PM-004 | View patient visit history | 1. Open existing patient profile 2. Navigate to 'Visit History' | All visits shown chronologically with date, diagnosis, prescription link | **High** 🟠 | ⬜ Not Tested |

### 3.2 Prescription Management

| TC-ID | Scenario | Steps | Expected Result | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| TC-RX-001 | Create prescription with drug autocomplete | 1. Open patient consultation 2. New Prescription 3. Type drug name 4. Select from autocomplete | Drug name auto-populated; dosage fields enabled; prescription saved correctly | **Critical** 🔴 | ⬜ Not Tested |
| TC-RX-002 | Generate and download prescription PDF | 1. Save a prescription 2. Click 'Download PDF' | PDF downloaded in < 5 sec; contains: clinic logo, doctor name, patient info, drugs, date | **Critical** 🔴 | ⬜ Not Tested |
| TC-RX-003 | Attempt to edit a saved prescription | 1. Open completed prescription 2. Try to modify drug entry | Edit fields disabled; message: 'Prescription is locked. Create amendment.' | **High** 🟠 | ⬜ Not Tested |

### 3.3 Appointment & Follow-Up

| TC-ID | Scenario | Steps | Expected Result | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| TC-AP-001 | Book appointment and verify SMS | 1. Open scheduler 2. Select slot 3. Assign patient 4. Confirm | Booking confirmed; SMS delivered to patient mobile within 2 minutes | **Critical** 🔴 | ⬜ Not Tested |
| TC-AP-002 | Double booking prevention | 1. Book slot X 2. Attempt to book same slot again | 'Slot already booked' error; second booking prevented | **High** 🟠 | ⬜ Not Tested |
| TC-FU-001 | Set and trigger follow-up reminder | 1. Set follow-up date in consultation 2. Advance test date to follow-up day | SMS sent to patient; patient appears on 'Today's Follow-Ups' dashboard | **Critical** 🔴 | ⬜ Not Tested |

### 3.4 Revenue & Billing

| TC-ID | Scenario | Steps | Expected Result | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| TC-RV-001 | Generate and download invoice | 1. Complete consultation 2. Click Generate Invoice 3. Enter fee 4. Save | Invoice generated with GST; PDF downloadable; revenue dashboard updated in real time | **Critical** 🔴 | ⬜ Not Tested |
| TC-RV-002 | View daily revenue dashboard | 1. Login as Admin 2. Navigate to Revenue Dashboard | Today's total, weekly trend chart, and monthly summary all visible and accurate | **High** 🟠 | ⬜ Not Tested |

## 4. Defect Severity Classification

| Severity | Definition | Example |
| --- | --- | --- |
| **Critical** 🔴 | System unusable; core function broken; data loss possible | Cannot log in; patient records not saving |
| **High** 🟠 | Major functionality broken; no viable workaround | Prescription PDF not generating; SMS not sending |
| **Medium** 🟡 | Functionality impaired; workaround exists | Revenue report shows wrong date format |
| **Low** 🟢 | Minor; cosmetic; minimal user impact | Button color inconsistency; minor typo in label |

## 5. UAT Sign-Off Form

| Name & Role | Signature | Date |
| --- | --- | --- |
| Pilot Doctor — Clinic 1 |   |   |
| Pilot Doctor — Clinic 2 |   |   |
| Product Manager |   |   |
| QA Lead |   |   |

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
- [[06 - User Stories & Acceptance Criteria]]
- [[07 - Process Flow Document]]
- [[09 - Risk Register]]
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[12 - Business Glossary]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
