---
title: "13 - Compliance Requirements"
project: ClinicFlow Pro
document_id: "13"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, compliance, dpdp, security, mci, phase-1]
---

> [!abstract] 13 - Compliance Requirements
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `13`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[12 - Business Glossary|12 - Business Glossary]]  🏠 [[00 - ClinicFlow Pro — Index]]

---

## 1. Purpose

This Compliance Requirements Document identifies all regulatory, legal, and industry standards that ClinicFlow Pro must adhere to. Non-compliance in the healthcare data domain can result in significant legal penalties and loss of user trust. All compliance items in this document are classified as **Must Have** 🔴 for go-live.

## 2. Compliance Framework

| ID | Regulation / Standard | Scope / Description | Applicability | Compliance Owner |
| --- | --- | --- | --- | --- |
| C-01 | DPDP Act 2023 (India) | Governs collection, storage, use, and deletion of digital personal data of Indian residents | Full Platform | CEO + Legal + Tech Lead |
| C-02 | IT Act 2000 (India) | Legal validity of electronic records, digital signatures, and data protection requirements | Full Platform | Legal + Tech Lead |
| C-03 | MCI Prescription Guidelines | Medical Council of India requirements: doctor name, registration number, patient name, date, drug details on prescriptions | Prescription Module | Product Manager + BA |
| C-04 | GST Act (India) | Correct GST calculation and invoicing for applicable clinic services (18% on non-exempt medical services) | Billing Module | Finance + Dev Team |
| C-05 | Indian Data Localization Policy | Patient data must be stored on servers physically located in India | Infrastructure | Tech Lead + DevOps |
| C-06 | OWASP Top 10 (Application Security) | Web application security standard covering injection, broken auth, XSS, and other vulnerabilities | Full Platform | Tech Lead + Security |

## 3. DPDP Act 2023 — Detailed Compliance Requirements

| ID | Requirement | Implementation Approach | Priority |
| --- | --- | --- | --- |
| C-01-01 | Obtain explicit consent from patients before collecting personal data | Digital consent form displayed during patient registration; stored with timestamp | **Must Have** 🔴 |
| C-01-02 | Inform patients of purpose of data collection | Privacy notice displayed at registration; purpose stated (medical care, communication) | **Must Have** 🔴 |
| C-01-03 | Right to access personal data — patient can request their data | Admin panel allows data export in PDF for any patient on request | **Must Have** 🔴 |
| C-01-04 | Right to erasure — patient can request data deletion | Soft-delete mechanism with 90-day retention before permanent deletion; hard delete on explicit request | **Must Have** 🔴 |
| C-01-05 | Data breach notification within 72 hours of discovery | Incident response plan in place; automated breach detection alerts to CEO + Tech Lead | **Must Have** 🔴 |

## 4. MCI Prescription Compliance Requirements

| ID | MCI Requirement | ClinicFlow Pro Implementation | Status |
| --- | --- | --- | --- |
| C-03-01 | Doctor name and MCI registration number on prescription | Auto-populated from doctor profile on all prescription PDFs | ✅ In Scope |
| C-03-02 | Patient name, age, and gender on prescription | Auto-populated from patient profile | ✅ In Scope |
| C-03-03 | Date of prescription | Auto-set to current date; cannot be backdated | ✅ In Scope |
| C-03-04 | Clinic name and address on prescription letterhead | Clinic profile configured during onboarding; appears on all PDFs | ✅ In Scope |
| C-03-05 | Drug generic name alongside brand name | Drug database includes both generic and brand name fields; generic name displayed by default | ✅ In Scope |

## 5. Security Compliance Checklist

| Security Control | Compliance Standard | Status |
| --- | --- | --- |
| AES-256 encryption for all patient data at rest | DPDP Act / IT Act | 🔵 In Design |
| TLS 1.3 encryption for all data in transit | OWASP Top 10 | 🔵 In Design |
| RBAC with principle of least privilege | OWASP / DPDP | 🔵 In Design |
| OTP-based multi-factor authentication for doctors | OWASP / IT Act | 🔵 In Design |
| Audit log of all data access and modification events | DPDP Act / IT Act | 🔵 In Design |
| Automatic session expiry after 15 minutes of inactivity | OWASP / DPDP | 🔵 In Design |
| Input validation and SQL injection prevention (ORM) | OWASP Top 10 | 🔵 In Design |
| Penetration testing by external vendor before go-live | OWASP / Best Practice | 📋 Planned — Month 6 |
| Data stored only on AWS Mumbai (ap-south-1) region | India Data Localization | 📋 Planned — DevOps |

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
- [[12 - Business Glossary]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
