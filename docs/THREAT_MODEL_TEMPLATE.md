# Threat Model Template

**Last Updated:** [DATE]
**Version:** [VERSION]
**Owner:** [TEAM/INDIVIDUAL]
**Reviewers:** [LIST OF REVIEWERS]

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture Overview](#system-architecture-overview)
3. [Assets and Data Classification](#assets-and-data-classification)
4. [Trust Boundaries](#trust-boundaries)
5. [Threat Analysis (STRIDE)](#threat-analysis-stride)
6. [Attack Vectors and Entry Points](#attack-vectors-and-entry-points)
7. [Existing Security Controls](#existing-security-controls)
8. [Threat Mitigation Recommendations](#threat-mitigation-recommendations)
9. [Review Cadence](#review-cadence)
10. [References](#references)

---

## Executive Summary

[Provide a high-level overview of the system being threat modeled, its purpose, and key security concerns. Include a brief summary of the most critical risks identified.]

**Key Risk Areas:**
- [Risk Area 1]
- [Risk Area 2]
- [Risk Area 3]
- [Risk Area 4]

---

## System Architecture Overview

### Component Description

[Describe the major components of the system, their responsibilities, and how they interact.]

1. **[Component Name 1]**
   - [Description]
   - [Responsibilities]

2. **[Component Name 2]**
   - [Description]
   - [Responsibilities]

3. **[Component Name 3]**
   - [Description]
   - [Responsibilities]

### Data Flow Diagram

[Include a diagram showing how data flows through the system. Use ASCII art, Mermaid, or reference an external diagram.]

```
┌─────────────┐
│  Component  │
│      A      │
└──────┬──────┘
       │
       │ [Description of data flow]
       ▼
┌─────────────┐
│  Component  │
│      B      │
└─────────────┘
```

---

## Assets and Data Classification

### Critical Assets

[List all critical assets that need protection, including data, credentials, and system resources.]

| Asset | Classification | Description | Sensitivity |
|-------|---------------|-------------|-------------|
| [Asset 1] | [SECRET/CONFIDENTIAL/INTERNAL/PUBLIC] | [Description] | [CRITICAL/HIGH/MEDIUM/LOW] |
| [Asset 2] | [Classification] | [Description] | [Sensitivity] |
| [Asset 3] | [Classification] | [Description] | [Sensitivity] |

### Data Flows

[Describe how data moves through the system.]

1. **Inbound Data:** [Description]
2. **Outbound Data:** [Description]
3. **Stored Data:** [Description]
4. **Logged Data:** [Description]

---

## Trust Boundaries

[Identify and describe the trust boundaries in your system - points where data crosses from one trust level to another.]

### Boundary 1: [Name] ↔ [Name]
- **Trust Level:** [Description]
- **Security Controls:** [List controls]
- **Risks:** [List key risks]

### Boundary 2: [Name] ↔ [Name]
- **Trust Level:** [Description]
- **Security Controls:** [List controls]
- **Risks:** [List key risks]

---

## Threat Analysis (STRIDE)

[Use the STRIDE model to categorize threats: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege]

### S - Spoofing

[Threats related to identity spoofing or impersonation]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| S-01 | [Description] | [HIGH/MEDIUM/LOW] | [HIGH/MEDIUM/LOW] | [CRITICAL/HIGH/MEDIUM/LOW] |
| S-02 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

### T - Tampering

[Threats related to data or system modification]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| T-01 | [Description] | [Impact] | [Likelihood] | [Risk Level] |
| T-02 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

### R - Repudiation

[Threats related to denying actions or events]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| R-01 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

### I - Information Disclosure

[Threats related to unauthorized data exposure]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| I-01 | [Description] | [Impact] | [Likelihood] | [Risk Level] |
| I-02 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

### D - Denial of Service

[Threats related to service availability]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| D-01 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

### E - Elevation of Privilege

[Threats related to unauthorized permission escalation]

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| E-01 | [Description] | [Impact] | [Likelihood] | [Risk Level] |

**Mitigations:**
- [Mitigation 1]
- [Mitigation 2]

---

## Attack Vectors and Entry Points

[Identify all potential attack vectors and entry points into the system.]

### 1. [Entry Point Name]

**Entry Point:** [Description/Path]
- **Attack Type:** [Type of attack possible]
- **Mitigation:** [How it's mitigated]

### 2. [Entry Point Name]

**Entry Point:** [Description/Path]
- **Attack Type:** [Type of attack possible]
- **Mitigation:** [How it's mitigated]

### 3. [Entry Point Name]

**Entry Point:** [Description/Path]
- **Attack Type:** [Type of attack possible]
- **Mitigation:** [How it's mitigated]

---

## Existing Security Controls

[Document all security controls currently in place.]

### Authentication & Authorization

| Control | Implementation | Status |
|---------|---------------|--------|
| [Control Name] | [How it's implemented] | ✅/⚠️/❌ |

### Data Protection

| Control | Implementation | Status |
|---------|---------------|--------|
| [Control Name] | [How it's implemented] | ✅/⚠️/❌ |

### Dependency Management

| Control | Implementation | Status |
|---------|---------------|--------|
| [Control Name] | [How it's implemented] | ✅/⚠️/❌ |

### Monitoring & Logging

| Control | Implementation | Status |
|---------|---------------|--------|
| [Control Name] | [How it's implemented] | ✅/⚠️/❌ |

### Code Quality

| Control | Implementation | Status |
|---------|---------------|--------|
| [Control Name] | [How it's implemented] | ✅/⚠️/❌ |

---

## Threat Mitigation Recommendations

[Provide prioritized, actionable recommendations to address identified threats.]

### Priority 1: Critical (Immediate Action Required)

1. **[Recommendation Title]**
   - **Risk:** [Threat ID] ([Risk Level])
   - **Action:** [Specific action to take]
   - **Implementation:** [How to implement]
   - **Timeline:** [When to complete]

2. **[Recommendation Title]**
   - **Risk:** [Threat ID] ([Risk Level])
   - **Action:** [Specific action to take]
   - **Implementation:** [How to implement]
   - **Timeline:** [When to complete]

### Priority 2: High (Address Within Quarter)

3. **[Recommendation Title]**
   - **Risk:** [Threat ID] ([Risk Level])
   - **Action:** [Specific action to take]
   - **Implementation:** [How to implement]
   - **Timeline:** [When to complete]

### Priority 3: Medium (Address Within 6 Months)

4. **[Recommendation Title]**
   - **Risk:** [Threat ID] ([Risk Level])
   - **Action:** [Specific action to take]
   - **Implementation:** [How to implement]
   - **Timeline:** [When to complete]

### Priority 4: Low (Continuous Improvement)

5. **[Recommendation Title]**
   - **Risk:** [Threat ID] ([Risk Level])
   - **Action:** [Specific action to take]
   - **Implementation:** [How to implement]
   - **Timeline:** [When to complete]

---

## Review Cadence

[Define when and how this threat model should be reviewed and updated.]

### Regular Reviews

- **Quarterly:** [What to review]
- **Bi-Annually:** [What to review]
- **Annually:** [What to review]

### Trigger-Based Reviews

Update this threat model when:

- ✅ [Trigger condition 1]
- ✅ [Trigger condition 2]
- ✅ [Trigger condition 3]
- ✅ [Trigger condition 4]

### Review Process

1. **Owner:** [Who schedules the review]
2. **Participants:** [Who should participate]
3. **Deliverable:** [What should be produced]
4. **Approval:** [Who approves changes]
5. **Distribution:** [Where to publish updates]

### Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [DATE] | [VERSION] | [Description of changes] | [AUTHOR] |

---

## References

### Security Documentation

- [Link to security documentation]
- [Link to compliance requirements]
- [Link to security standards]

### Internal Resources

- **Security Policies:** [Link]
- **Incident Response:** [Link]
- **Vulnerability Management:** [Link]
- **Security Contacts:** [Contact info]

### Related Documentation

- [Link to related docs]
- [Link to architecture docs]
- [Link to runbooks]

### Tools & Resources

- **[Tool 1]:** [Purpose]
- **[Tool 2]:** [Purpose]
- **[Tool 3]:** [Purpose]

---

**Document Classification:** [INTERNAL/CONFIDENTIAL/PUBLIC]
**Next Review Date:** [DATE]
**Contact:** [CONTACT INFO]

---

## Instructions for Use

This template is designed to help teams create comprehensive threat models for their systems. Follow these guidelines:

### Getting Started

1. **Scope Definition:** Clearly define what system or component you're threat modeling
2. **Stakeholder Involvement:** Include developers, security team, and operations in the process
3. **Asset Identification:** Start by identifying what needs protection
4. **Architecture Review:** Create or update architecture diagrams showing data flows

### STRIDE Analysis Tips

- **S (Spoofing):** Think about authentication and identity verification
- **T (Tampering):** Consider data integrity and authorization
- **R (Repudiation):** Focus on logging and audit trails
- **I (Information Disclosure):** Look at data exposure and encryption
- **D (Denial of Service):** Evaluate availability and rate limiting
- **E (Elevation of Privilege):** Examine authorization boundaries

### Risk Scoring

Use this matrix to determine risk levels:

| Impact/Likelihood | Low | Medium | High |
|------------------|-----|--------|------|
| **High** | Medium | High | Critical |
| **Medium** | Low | Medium | High |
| **Low** | Low | Low | Medium |

### Best Practices

- ✅ Keep the document concise and actionable
- ✅ Use specific examples relevant to your system
- ✅ Include measurable acceptance criteria for mitigations
- ✅ Link to related documentation and tickets
- ✅ Update regularly as the system evolves
- ✅ Make it accessible to all team members
- ❌ Avoid generic threats that don't apply to your system
- ❌ Don't make assumptions about security controls without verification
- ❌ Don't create the threat model in isolation

### Review and Maintenance

- Schedule regular reviews based on your development cycle
- Update after significant architectural changes
- Review after security incidents or near-misses
- Incorporate lessons learned from security assessments
- Track mitigation implementation progress
