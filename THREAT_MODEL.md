# Threat Model - OpsLevel Backstage Maturity Plugin

**Last Updated:** 2024-01-19
**Version:** 1.0
**Owner:** Security Team
**Reviewers:** Development Team, Platform Engineering

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

The OpsLevel Backstage Maturity Plugin is a frontend Backstage plugin that integrates OpsLevel's service maturity and health metrics into the Backstage developer portal. This threat model identifies security risks associated with the plugin's architecture, data flows, and external integrations, providing actionable mitigation strategies to protect sensitive organizational data and maintain system integrity.

**Key Risk Areas:**
- API token exposure and credential management
- GraphQL injection vulnerabilities
- Cross-Site Scripting (XSS) through rendered content
- Unauthorized access to service maturity data
- Dependency supply chain risks

---

## System Architecture Overview

### Component Description

The plugin consists of the following key components:

1. **Frontend Components**
   - `OverallMaturity`: Displays organization-wide maturity metrics
   - `EntityOpsLevelMaturityContent`: Shows service-specific maturity information
   - React components for data visualization (ApexCharts)

2. **API Clients**
   - `OpsLevelGraphqlAPI`: GraphQL client for OpsLevel API communication
   - `OpsLevelPluginAPI`: REST client for backend plugin communication

3. **Backstage Integration Points**
   - Proxy endpoint configuration (`/api/proxy/opslevel`)
   - Backend API integration (`/api/opslevel`)
   - Catalog entity integration

4. **External Dependencies**
   - OpsLevel SaaS platform (app.opslevel.com)
   - Backstage core APIs
   - Third-party npm packages (GraphQL client, UI libraries)

### Data Flow Diagram

```
┌─────────────────┐
│   Backstage     │
│   Frontend      │
│   (Browser)     │
└────────┬────────┘
         │
         │ 1. User requests maturity data
         ▼
┌─────────────────┐
│  Plugin         │
│  Components     │
└────────┬────────┘
         │
         │ 2. API calls via GraphQL/REST
         ▼
┌─────────────────┐
│  Backstage      │
│  Proxy/Backend  │
└────────┬────────┘
         │
         │ 3. Proxied requests with API token
         ▼
┌─────────────────┐
│   OpsLevel      │
│   Platform      │
│ (External SaaS) │
└─────────────────┘
```

---

## Assets and Data Classification

### Critical Assets

| Asset | Classification | Description | Sensitivity |
|-------|---------------|-------------|-------------|
| OpsLevel API Token | **SECRET** | Bearer token for OpsLevel API authentication | **CRITICAL** |
| Service Maturity Data | **INTERNAL** | Check results, rubric scores, campaign data | **HIGH** |
| Service Metadata | **INTERNAL** | Service names, aliases, owners, teams | **MEDIUM** |
| User Session Data | **INTERNAL** | Backstage user authentication context | **HIGH** |
| Configuration Files | **CONFIDENTIAL** | app-config.yaml with endpoints and tokens | **CRITICAL** |

### Data Flows

1. **Inbound Data:** Service maturity metrics, check results, team information from OpsLevel
2. **Outbound Data:** Service aliases, GraphQL queries to OpsLevel
3. **Stored Data:** None (plugin is stateless, data cached by browser)
4. **Logged Data:** API requests, error messages (may contain sensitive metadata)

---

## Trust Boundaries

### Boundary 1: User Browser ↔ Backstage Frontend
- **Trust Level:** Authenticated internal users only
- **Security Controls:** Backstage authentication, HTTPS, CSP headers
- **Risks:** XSS, session hijacking, unauthorized data access

### Boundary 2: Backstage Backend ↔ OpsLevel API
- **Trust Level:** Trusted integration via API token
- **Security Controls:** Bearer token authentication, proxy configuration
- **Risks:** Token exposure, MITM attacks, API abuse

### Boundary 3: Plugin Code ↔ Third-Party Dependencies
- **Trust Level:** Semi-trusted (public npm packages)
- **Security Controls:** Dependency scanning (Grype), npm audit
- **Risks:** Supply chain attacks, vulnerable dependencies

---

## Threat Analysis (STRIDE)

### S - Spoofing

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| S-01 | Attacker spoofs OpsLevel API responses via MITM | HIGH | LOW | MEDIUM |
| S-02 | Malicious actor impersonates legitimate user in Backstage | HIGH | MEDIUM | HIGH |
| S-03 | Forged GraphQL responses manipulate displayed metrics | MEDIUM | LOW | LOW |

**Mitigations:**
- Enforce HTTPS/TLS for all OpsLevel communications
- Rely on Backstage's authentication mechanisms
- Validate API response schemas

### T - Tampering

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| T-01 | Modification of GraphQL queries to access unauthorized data | HIGH | MEDIUM | HIGH |
| T-02 | Tampering with proxy configuration to redirect API calls | CRITICAL | LOW | MEDIUM |
| T-03 | Injection of malicious code through dependency compromise | CRITICAL | LOW | MEDIUM |

**Mitigations:**
- Implement GraphQL query validation and sanitization
- Protect app-config.yaml with appropriate file permissions
- Use dependency pinning and integrity checks (lock files)

### R - Repudiation

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| R-01 | User denies viewing sensitive maturity data | LOW | MEDIUM | LOW |
| R-02 | API calls not logged, preventing audit trail | MEDIUM | MEDIUM | MEDIUM |

**Mitigations:**
- Implement comprehensive logging at proxy/backend level
- Correlate user actions with backend API calls
- Enable OpsLevel API audit logs

### I - Information Disclosure

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| I-01 | OpsLevel API token exposed in browser/logs | CRITICAL | MEDIUM | **CRITICAL** |
| I-02 | Sensitive maturity data visible to unauthorized users | HIGH | MEDIUM | HIGH |
| I-03 | Error messages leak internal system information | MEDIUM | HIGH | MEDIUM |
| I-04 | Service metadata exposed through verbose GraphQL errors | MEDIUM | MEDIUM | MEDIUM |

**Mitigations:**
- **Never expose API tokens to frontend** - use backend proxy only
- Implement role-based access control (RBAC) in Backstage
- Sanitize error messages before displaying to users
- Configure minimal error details in production

### D - Denial of Service

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| D-01 | Excessive GraphQL queries exhaust OpsLevel API rate limits | MEDIUM | MEDIUM | MEDIUM |
| D-02 | Large maturity datasets cause browser performance issues | LOW | LOW | LOW |
| D-03 | Malicious queries overwhelm Backstage proxy | MEDIUM | LOW | LOW |

**Mitigations:**
- Implement rate limiting on frontend API calls
- Paginate large data responses
- Configure proxy request timeouts
- Monitor API usage patterns

### E - Elevation of Privilege

| Threat ID | Threat Description | Impact | Likelihood | Risk Level |
|-----------|-------------------|--------|------------|------------|
| E-01 | User accesses admin-level OpsLevel data without authorization | HIGH | MEDIUM | HIGH |
| E-02 | Privilege escalation through GraphQL query manipulation | HIGH | LOW | MEDIUM |
| E-03 | Backstage plugin gains unintended permissions | MEDIUM | LOW | LOW |

**Mitigations:**
- Use least-privilege API tokens in OpsLevel
- Validate user permissions before rendering sensitive data
- Regular access control reviews

---

## Attack Vectors and Entry Points

### 1. API Integration Points

**Entry Point:** `/api/proxy/opslevel/graphql`
- **Attack Type:** GraphQL injection, query complexity attacks
- **Mitigation:** Query validation, depth/complexity limits, parameterized queries

**Entry Point:** `/api/opslevel/*` (Backend plugin endpoints)
- **Attack Type:** Unauthorized access, parameter tampering
- **Mitigation:** Authentication checks, input validation

### 2. User Interface Components

**Entry Point:** Rendered Markdown content from OpsLevel
- **Attack Type:** XSS via malicious check messages or descriptions
- **Mitigation:** DOMPurify sanitization (already implemented), CSP headers

**Entry Point:** User-controlled service aliases in URLs
- **Attack Type:** Path traversal, injection
- **Mitigation:** Alias validation, encoding/escaping

### 3. Configuration Files

**Entry Point:** `app-config.yaml`
- **Attack Type:** Configuration injection, token theft
- **Mitigation:** File system permissions, secret management solutions, environment variable injection

### 4. Third-Party Dependencies

**Entry Point:** npm packages (graphql-request, apexcharts, etc.)
- **Attack Type:** Supply chain attacks, known vulnerabilities
- **Mitigation:** Weekly Grype scans, npm audit, dependency updates, SCA tools

### 5. Browser Storage

**Entry Point:** LocalStorage/SessionStorage (browser cache)
- **Attack Type:** Sensitive data exposure, XSS-based data theft
- **Mitigation:** Avoid storing sensitive data client-side, use HttpOnly cookies

---

## Existing Security Controls

### Authentication & Authorization

| Control | Implementation | Status |
|---------|---------------|--------|
| Backstage Authentication | Inherited from Backstage core (configurable providers) | ✅ Implemented |
| OpsLevel API Token Auth | Bearer token in proxy headers | ✅ Implemented |
| Internal-Only Access | Documented VPN requirement | ⚠️ Documentation Only |

### Data Protection

| Control | Implementation | Status |
|---------|---------------|--------|
| HTTPS/TLS | Required for OpsLevel API calls | ✅ Assumed |
| Content Sanitization | DOMPurify for Markdown rendering | ✅ Implemented |
| Token Proxy Pattern | API token hidden from frontend | ✅ Implemented |

### Dependency Management

| Control | Implementation | Status |
|---------|---------------|--------|
| Vulnerability Scanning | Grype workflow (weekly, Mondays) | ✅ Implemented |
| Lock File Management | yarn.lock for dependency pinning | ✅ Implemented |
| Automated Updates | Not implemented | ❌ Missing |

### Monitoring & Logging

| Control | Implementation | Status |
|---------|---------------|--------|
| Error Handling | Try-catch blocks in API clients | ✅ Implemented |
| Audit Logging | Relies on OpsLevel/Backstage logs | ⚠️ Partial |
| Security Monitoring | No dedicated monitoring | ❌ Missing |

### Code Quality

| Control | Implementation | Status |
|---------|---------------|--------|
| TypeScript | Strong typing throughout codebase | ✅ Implemented |
| Linting | ESLint with security rules | ✅ Implemented |
| Testing | Jest unit tests | ✅ Implemented |
| Code Review | Required via pull requests | ✅ Process |

---

## Threat Mitigation Recommendations

### Priority 1: Critical (Immediate Action Required)

1. **Secure API Token Management**
   - **Risk:** I-01 (Critical)
   - **Action:** Implement secret scanning in CI/CD to prevent token commits
   - **Implementation:** Add tools like TruffleHog, GitGuardian, or GitHub Secret Scanning
   - **Timeline:** Within 1 sprint

2. **Validate API Token Permissions**
   - **Risk:** E-01 (High)
   - **Action:** Audit OpsLevel API token permissions to ensure least privilege
   - **Implementation:** Use a read-only token with minimal scopes required
   - **Timeline:** Within 2 weeks

3. **Implement RBAC for Maturity Data**
   - **Risk:** I-02 (High)
   - **Action:** Restrict maturity data visibility based on Backstage user roles
   - **Implementation:** Add permission checks before rendering sensitive components
   - **Timeline:** Within 2 sprints

### Priority 2: High (Address Within Quarter)

4. **Add Rate Limiting**
   - **Risk:** D-01 (Medium)
   - **Action:** Implement client-side request throttling and backend rate limits
   - **Implementation:** Use libraries like `p-limit` or backend middleware
   - **Timeline:** Q1 2024

5. **Enhance Error Handling**
   - **Risk:** I-03, I-04 (Medium)
   - **Action:** Sanitize error messages and implement structured error responses
   - **Implementation:** Create error boundary components, filter stack traces
   - **Timeline:** Q1 2024

6. **GraphQL Query Validation**
   - **Risk:** T-01, E-02 (High)
   - **Action:** Implement query complexity analysis and depth limiting
   - **Implementation:** Use GraphQL validation middleware
   - **Timeline:** Q1 2024

### Priority 3: Medium (Address Within 6 Months)

7. **Automated Dependency Updates**
   - **Risk:** T-03 (Medium)
   - **Action:** Set up Dependabot or Renovate for automated dependency PRs
   - **Implementation:** Configure GitHub Dependabot with security-only updates
   - **Timeline:** Q2 2024

8. **Security Audit Logging**
   - **Risk:** R-02 (Medium)
   - **Action:** Implement comprehensive audit logging for all API calls
   - **Implementation:** Log user ID, timestamp, endpoint, and response status
   - **Timeline:** Q2 2024

9. **Content Security Policy (CSP)**
   - **Risk:** S-01, XSS (Medium)
   - **Action:** Define and enforce strict CSP headers for the plugin
   - **Implementation:** Configure CSP in Backstage app configuration
   - **Timeline:** Q2 2024

### Priority 4: Low (Continuous Improvement)

10. **Security Training**
    - **Risk:** General awareness
    - **Action:** Provide secure coding training for plugin developers
    - **Timeline:** Ongoing

11. **Penetration Testing**
    - **Risk:** Validation of security controls
    - **Action:** Conduct annual penetration testing of the plugin
    - **Timeline:** Annually

12. **Incident Response Plan**
    - **Risk:** Preparedness
    - **Action:** Document incident response procedures for security events
    - **Timeline:** Q3 2024

---

## Review Cadence

This threat model should be reviewed and updated according to the following schedule:

### Regular Reviews

- **Quarterly:** Review and update threat scenarios and mitigations
- **Bi-Annually:** Full threat model refresh with stakeholder input
- **Annually:** Comprehensive security assessment with external audit

### Trigger-Based Reviews

Update this threat model when:

- ✅ New features are added to the plugin
- ✅ Integration with new external services
- ✅ Significant architectural changes
- ✅ Security incidents or near-misses occur
- ✅ New vulnerabilities discovered in dependencies
- ✅ Changes to OpsLevel API authentication or authorization
- ✅ Backstage platform major version upgrades

### Review Process

1. **Owner:** Security team schedules review meeting
2. **Participants:** Development team, platform engineering, security team
3. **Deliverable:** Updated threat model document with changelog
4. **Approval:** Security lead and engineering manager sign-off
5. **Distribution:** Publish to internal security documentation portal

### Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2024-01-19 | 1.0 | Initial threat model created | Security Team |

---

## References

### Security Documentation

- [Backstage Security Best Practices](https://backstage.io/docs/overview/security/)
- [OpsLevel API Documentation](https://docs.opslevel.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

### Internal Resources

- **Security Policies:** [Internal Security Policy Portal]
- **Incident Response:** [Incident Response Runbook]
- **Vulnerability Management:** [Vulnerability Disclosure Process]
- **Security Contacts:** security@opslevel.com

### Related Documentation

- [README.md](./README.md) - Plugin installation and usage
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [.github/workflows/security.yml](./.github/workflows/security.yml) - Security scanning workflow

### Tools & Resources

- **Grype:** Vulnerability scanner (scheduled weekly)
- **ESLint:** Code quality and security linting
- **DOMPurify:** XSS prevention library
- **TypeScript:** Type safety

---

**Document Classification:** INTERNAL
**Next Review Date:** April 2024
**Contact:** security-team@example.com
