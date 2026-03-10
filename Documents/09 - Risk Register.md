---
title: "09 - Risk Register"
project: ClinicFlow Pro
document_id: "09"
version: "1.0"
status: Approved
date: 2024-03-01
author: Dharmik Moradiya
tags: [clinicflow-pro, risk-register, risk, mitigation, phase-1]
---

> [!abstract] 09 - Risk Register
> **Project:** ClinicFlow Pro  ·  **Doc ID:** `09`  ·  **Version:** 1.0  ·  **Status:** ✅ Approved
> **Author:** Dharmik Moradiya, Senior Business Analyst  ·  **Date:** March 2024

⬅ [[08 - UAT Test Plan|08 - UAT Test Plan]]  🏠 [[00 - ClinicFlow Pro — Index]]  [[10 - Change Management Plan|10 - Change Management Plan]] ➡

---

## 1. Risk Management Approach

This Risk Register captures all identified project, technical, and business risks for ClinicFlow Pro Phase 1. Risks are assessed using a 5x5 Probability × Impact matrix. The register is a living document — reviewed bi-weekly in steering committee meetings and updated by the Business Analyst and Project Manager.

Risk Score = Probability (1–5) × Impact (1–5). Score 15–25: HIGH | Score 8–14: MEDIUM | Score 1–7: LOW

## 2. Risk Register

| ID | Risk Description | Category | Prob. | Impact | Score | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | Doctor resistance to technology adoption — low usage rates post-launch | People | 4 | 5 | 20 - HIGH | User workshops pre-launch; champion doctor program; super-simple UX; on-site training | PM + BA |
| R-02 | Inconsistent internet connectivity at semi-urban clinics disrupting usage | Technical | 4 | 4 | 16 - HIGH | Design offline mode for core features (patient search, Rx) in Phase 2; notify users upfront | Tech Lead |
| R-03 | Patient data breach or unauthorized access — regulatory and reputational risk | Security | 2 | 5 | 10 - MED | AES-256 encryption; RBAC; OTP login for doctors; penetration test before go-live; DPDP Act compliance | Tech Lead |
| R-04 | Scope creep from stakeholder requests during development | Project | 4 | 3 | 12 - MED | Formal change control process; all new features require PM + sponsor approval and sprint replanning | PM |
| R-05 | Pharmacy API integration not ready by Phase 1 deadline | Integration | 3 | 3 | 9 - MED | Manual PDF/WhatsApp dispatch as fallback; pharmacy integration moved to Phase 2 if needed | BA + Dev |
| R-06 | Drug database licensing takes longer than expected | Procurement | 3 | 4 | 12 - MED | Pre-negotiate with 2 providers (1mg API, Practo DB); begin procurement in Month 1 | PM |
| R-07 | Key developer resignation mid-project | People | 2 | 4 | 8 - MED | Code documentation standards enforced; pair programming; bus factor reviews monthly | Tech Lead |
| R-08 | SMS gateway delivery failure for reminders and OTPs | Technical | 2 | 3 | 6 - LOW | Dual SMS gateway setup (MSG91 primary, Twilio fallback); delivery receipt monitoring | Dev Team |
| R-09 | Non-compliance with India's DPDP Act 2023 at launch | Compliance | 2 | 5 | 10 - MED | Legal review of data handling policies; consent collection feature; Indian data residency on AWS Mumbai | CEO + Legal |
| R-10 | Budget overrun due to extended development timeline | Financial | 3 | 3 | 9 - MED | 15% contingency budget reserved; weekly burn rate tracking; scope de-prioritization plan ready | PM |

## 3. Risk Heat Map Summary

| Risk Level | Score Range | Count | Risks |
| --- | --- | --- | --- |
| **HIGH** 🔴 | 15–25 | 2 | R-01, R-02 |
| **MEDIUM** 🟡 | 8–14 | 6 | R-03, R-04, R-05, R-06, R-07, R-09, R-10 |
| **LOW** 🟢 | 1–7 | 1 | R-08 |

## 4. Risk Review Cadence

- Weekly: BA reviews new risks; updates probability/impact for active risks
- Bi-weekly: Risk Register reviewed in Steering Committee meeting
- Sprint End: Any new risks from sprint retrospective added to register
- Go-Live: Full risk review and sign-off by all stakeholders

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
- [[10 - Change Management Plan]]
- [[11 - Product Roadmap]]
- [[12 - Business Glossary]]
- [[13 - Compliance Requirements]]

---
*ClinicFlow Pro BA Documentation Suite  ·  Dharmik Moradiya, Senior BA  ·  March 2024*
