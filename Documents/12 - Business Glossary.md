---
title: "12 - Business Glossary"
project: ClinicFlow Pro
document_id: "12"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, glossary, terminology, reference]
---

> [!abstract] 12 - Business Glossary
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `12`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[11 - Product Roadmap|11 - Product Roadmap]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[13 - Compliance Requirements|13 - Compliance Requirements]] ➡

---

## 1. Purpose

This glossary establishes a common vocabulary for all project stakeholders — business users, developers, QA engineers, and project managers. All documents produced for ClinicFlow Pro use these standardized definitions.

## 2. Business Terms

| Term | Definition | Context / Source |
| --- | --- | --- |
| Clinic | A small, independently operated medical practice in India with 1–3 doctors, not affiliated to a hospital network. | Business |
| Patient | An individual who visits the clinic for medical consultation. May be a first-time (new) or returning (existing) patient. | Business |
| Patient ID | A system-generated unique identifier for each registered patient. Format: CFP-YYYY-XXXXX. Persists across all visits. | System |
| Consultation | A single doctor-patient interaction during which diagnosis is made, notes are recorded, and a prescription may be issued. | Business |
| Prescription (Rx) | A doctor's written or digital instruction for the patient listing medicines, dosages, frequency, and duration of treatment. | Medical |
| Drug Database | The curated digital repository of approved Indian medicines (generic and branded) used for prescription autocomplete. | System |
| Follow-Up | A scheduled return visit by a patient, set at the time of consultation, to review treatment progress. | Medical |
| Appointment Slot | A discrete time block (15/30/60 minutes) in a doctor's daily schedule that can be reserved for one patient. | System |
| Revenue Leakage | Untracked or lost income due to undocumented consultations, fee waivers without recording, or billing errors. | Business |
| Invoice | A formal digital document issued after consultation listing services rendered, fees charged, GST breakdown, and total amount. | Business/Finance |
| Pharmacy Integration | The digital connection between ClinicFlow Pro and a pharmacy partner, enabling prescription to be dispatched electronically. | Integration |
| Pilot Clinic | One of the 2–3 early adopter clinics chosen to deploy and test ClinicFlow Pro before the broader rollout. | Business |

## 3. Technical Terms

| Term | Definition | Context |
| --- | --- | --- |
| RBAC | Role-Based Access Control. A security model where user permissions are assigned based on their role (Doctor, Receptionist, Admin). | Security |
| OTP | One-Time Password. A single-use numeric code sent via SMS for authentication verification. | Security |
| API | Application Programming Interface. A defined method by which two software systems communicate and exchange data. | Technical |
| PWA | Progressive Web Application. A web-based application that behaves like a native mobile app, supports offline usage, and can be installed on a device home screen. | Technical |
| AES-256 | Advanced Encryption Standard with 256-bit key. The industry standard for encrypting sensitive data at rest. | Security |
| TLS 1.3 | Transport Layer Security version 1.3. The protocol for encrypting data in transit between client and server. | Security |
| REST API | Representational State Transfer API. The standard web service architecture used for all ClinicFlow Pro backend communications. | Technical |
| UUID | Universally Unique Identifier. A 36-character string used as a primary key for prescriptions and session identifiers. | Database |
| SLA | Service Level Agreement. A commitment between the product provider and clinic regarding uptime, support response times, and availability. | Operational |
| SMS Gateway | A third-party service (e.g., MSG91, Twilio) that routes SMS messages from the application to patient mobile numbers. | Integration |

## 4. BA & Project Management Terms

| Term | Definition | Context |
| --- | --- | --- |
| BRD | Business Requirements Document. Captures what the business needs the system to do, written for business stakeholders. | BA |
| FRD | Functional Requirements Document. Describes how the system will implement business requirements, written for technical teams. | BA / Tech |
| UAT | User Acceptance Testing. The final testing phase where business users validate the system meets their requirements. | QA |
| MoSCoW | Prioritization framework: **Must Have** 🔴 / **Should Have** 🟡 / **Could Have** 🟢 / **Won't Have** ⚪. Used to prioritize requirements by business value. | BA |
| MVP | Minimum Viable Product. The smallest set of features that delivers core value to users and meets Phase 1 business objectives. | Product |
| Sprint | A fixed time-box (2 weeks) in Agile/Scrum during which a defined set of user stories is developed and tested. | Agile |
| Story Points | A relative unit of estimation (using Fibonacci: 1, 2, 3, 5, 8, 13) used by development team to size user stories. | Agile |
| AS-IS | The current state of a process before the new system is implemented. | BA |
| TO-BE | The desired future state of a process after the new system is fully implemented and adopted. | BA |
| RACI | Responsibility Assignment Matrix: Responsible, Accountable, Consulted, Informed. Defines who does what on each activity. | Project Mgmt |

## 5. Regulatory & Compliance Terms

| Term | Definition | Relevance |
| --- | --- | --- |
| DPDP Act 2023 | Digital Personal Data Protection Act 2023 (India). Governs collection, storage, and processing of personal data of Indian citizens. | Patient Data |
| IT Act 2000 | Information Technology Act 2000 (India). Provides legal framework for electronic records, digital signatures, and cybercrime. | Legal |
| MCI Guidelines | Medical Council of India guidelines governing prescription format, doctor registration, and medical practice standards. | Rx Compliance |
| GST | Goods and Services Tax. India's unified indirect tax applied on services. Clinics may be liable for 18% GST on non-exempted services. | Billing |
| Data Residency | Requirement that patient data be stored on servers physically located within India (AWS Mumbai region for ClinicFlow Pro). | Infrastructure |

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
- [[08 - UAT Test Plan]]
- [[09 - Risk Register]]
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
