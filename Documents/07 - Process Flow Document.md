---
title: "07 - Process Flow Document"
project: ClinicFlow Pro
document_id: "07"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, process-flow, workflow, as-is, to-be, phase-1]
---

> [!abstract] 07 - Process Flow Document
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `07`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[06 - User Stories & Acceptance Criteria|06 - User Stories & Acceptance Criteria]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[08 - UAT Test Plan|08 - UAT Test Plan]] ➡

---

## 1. Purpose

This document describes the current (AS-IS) and future (TO-BE) process flows for the five core workflows in ClinicFlow Pro. Each process is described using structured step-by-step tables. Swim lane diagrams are to be produced by the design team using Lucidchart based on these specifications.

## 2. Process Flow 1: Patient Registration

### 2.1 AS-IS Process — Manual Registration

| Step | Action | Actor | Tool/Medium | Pain Points |
| --- | --- | --- | --- | --- |
| 1 | Patient arrives at clinic | Patient | Physical visit | Queuing, wait times |
| 2 | Receptionist manually writes patient details in register | Receptionist | Paper register | Illegible handwriting, errors |
| 3 | Assigns a serial number from daily list | Receptionist | Paper | No persistent patient ID |
| 4 | Patient waits for doctor | Patient | Manual queue management | No digital queue visibility |
| 5 | Doctor looks at handwritten slip — no prior history | Doctor | Paper slip | No patient history access |

### 2.2 TO-BE Process — Digital Registration (ClinicFlow Pro)

| Step | Action | Actor | System Trigger | Benefit |
| --- | --- | --- | --- | --- |
| 1 | Patient arrives; Receptionist opens ClinicFlow Pro | Receptionist | Login | Digital workflow starts |
| 2 | Search for existing patient by name/phone | Receptionist | Auto-search | Prevents duplicate records |
| 3 | If new patient: Fill digital form and submit | Receptionist | Form validation | Validated, error-free data |
| 4 | System auto-generates Patient ID (CFP-YYYY-XXXXX) | System | Auto-ID generation | Persistent unique identity |
| 5 | Patient added to today's queue; Doctor notified | System | Queue update | Real-time visibility |
| 6 | Doctor opens patient profile — sees full history | Doctor | Profile load | Informed clinical decision |

## 3. Process Flow 2: Prescription Generation

### 3.1 AS-IS Process — Handwritten Prescription

| Step | Action | Actor | Tool/Medium | Pain Points |
| --- | --- | --- | --- | --- |
| 1 | Doctor diagnoses patient verbally | Doctor | Memory/notes | No structured note-taking |
| 2 | Writes prescription on pre-printed paper slip | Doctor | Pen and paper | Illegibility, errors |
| 3 | Patient carries prescription to pharmacy | Patient | Physical paper | Loss, misinterpretation |
| 4 | Pharmacist interprets and dispenses medicines | Pharmacist | Manual reading | Dispensing errors |

### 3.2 TO-BE Process — Digital Prescription (ClinicFlow Pro)

| Step | Action | Actor | System Trigger | Benefit |
| --- | --- | --- | --- | --- |
| 1 | Doctor opens consultation screen for patient | Doctor | Patient queue tap | History pre-loaded |
| 2 | Doctor types diagnosis notes and clicks 'New Prescription' | Doctor | Form open | Structured data capture |
| 3 | Adds medicines using drug autocomplete | Doctor | Drug DB query | Accurate drug names |
| 4 | Sets dosage, frequency, duration per drug | Doctor | Form interaction | Eliminates ambiguity |
| 5 | Saves and signs prescription digitally | Doctor | Save event | Locked, non-editable record |
| 6 | PDF generated; sent to pharmacy and patient via WhatsApp | System | Auto-dispatch | Instant, accurate delivery |

## 4. Process Flow 3: Follow-Up Management

### 4.1 AS-IS Process

| Step | Action | Actor | **Medium** 🟡 | Issue |
| --- | --- | --- | --- | --- |
| 1 | Doctor verbally tells patient to return in X days | Doctor | Verbal | Patient forgets |
| 2 | No tracking mechanism; depends on patient memory | None | None | High drop-off |
| 3 | Patient either returns or doesn't — no follow-up possible | Patient | None | Treatment gaps |

### 4.2 TO-BE Process

| Step | Action | Actor | System Trigger | Benefit |
| --- | --- | --- | --- | --- |
| 1 | Doctor sets follow-up date in prescription screen | Doctor | Date picker | Digitally recorded |
| 2 | System stores follow-up date against patient record | System | Auto-save | No manual tracking needed |
| 3 | On follow-up date: SMS sent to patient automatically | System | Scheduled trigger | Patient reminded on time |
| 4 | Patient appears on 'Today Follow-Ups' dashboard | System | Dashboard update | Receptionist can call proactively |
| 5 | Patient visits; follow-up marked as completed | Receptionist | Status update | Compliance tracked |

## 5. Process KPI Improvement Summary

| Process | AS-IS Baseline | TO-BE Target | Expected Improvement |
| --- | --- | --- | --- |
| Patient registration time | 5–7 minutes (manual) | < 2 minutes (digital) | ~65% time reduction |
| Prescription generation time | 3–5 minutes (handwritten) | < 1 minute (digital) | ~75% time reduction |
| Follow-up compliance rate | ~30% (verbal reminders only) | > 75% (automated SMS) | +45 percentage points |
| Appointment no-show rate | ~35% (no reminder system) | < 15% (SMS reminders) | ~57% reduction |
| Revenue tracking accuracy | Manual cash book (error-prone) | 100% digital auto-capture | Near-zero leakage |

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
- [[08 - UAT Test Plan]]
- [[09 - Risk Register]]
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[12 - Business Glossary]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
