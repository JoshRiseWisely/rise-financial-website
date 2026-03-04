# Instructions for Rise Website Architecture — Claude Code

You are architecting a refreshed Rise Financial Partners website and admin application for Josh Elmore, a financial advisor building a multi-advisor platform.

## Current State
- Existing codebase lives in GitHub (you have access)
- Current site is functional but needs significant new features
- Team: Josh (primary), Jeff (co-advisor), Thomas (founder), Josiah (CTO/CCO, handles compliance)
- Mission: Help clients transition smoothly to retirement with excellence, partnership, stewardship, and generosity

## Core Features (MVP)

### 1. Multi-Advisor Admin Panel
- Each advisor (Josh, Jeff, others) logs in with personal credentials
- Each advisor manages their own profile page, bio, services, testimonials
- Permission model: Advisors edit only their own content (no cross-editing)
- Owner/admin can edit all pages and manage users
- Role-based access control (Advisor, Admin, Compliance Officer)

### 2. Blog System
- Rich-text blog posts with metadata (title, excerpt, category, featured image)
- Multiple advisors can author posts
- Posts are author-attributed and searchable
- Draft/Pending Approval/Published states
- Scheduling posts for future publication (optional MVP feature)

### 3. Compliance Workflow
- **Critical**: When an advisor publishes a post or updates their page, it enters "Pending Approval"
- Josiah (compliance officer) reviews in-app and approves/rejects with comments
- Approved content goes live automatically
- Rejected content returns to draft with feedback for revision
- Full audit trail of who changed what and when (required for SEC compliance)

### 4. AI Advisor Assistant (MVP Feature — Critical)
- **In-app AI chat interface** accessible from advisor dashboard
- Advisors can request AI-generated landing pages, forms, content blocks in natural language
- **Examples of advisor requests:**
  - "Create a landing page for estate planning strategies"
  - "Build a form that lets visitors download my guide to retirement"
  - "Generate a case study page about successful transition planning"
  - "Create a testimonials carousel component"
- **AI generation workflow:**
  - Advisor submits request via chat interface
  - Backend AI agent (Claude Opus) generates code + copy
  - Generated code appears as a **draft in the Compliance Queue** (not live)
  - Advisor reviews the generated output; can ask AI to revise
  - Once advisor approves, it enters **Pending Compliance Review**
  - Josiah (compliance) reviews the code diff and copy for SEC compliance
  - Only **approved changes** are merged to production
- **Strict gates:**
  - AI cannot directly write to production code
  - All AI-generated code must pass through compliance queue
  - Full audit trail (who requested, what was generated, who approved, when deployed)
  - Rate limiting per advisor (prevent API abuse)
- **Tech stack for AI feature:**
  - Frontend: Chat interface with markdown preview of generated code
  - Backend: API endpoint that calls Claude Opus for code generation
  - Database: Store generation history, prompts, approvals
  - Integration: Tie into existing compliance workflow

### 5. Client-Facing Content
- Public advisor profile pages (read-only for visitors)
- Blog archive with filtering/search by advisor, category, date
- Firm info pages (About, Services, Values, Team, Contact)
- Client testimonials section (optional Phase 2)

## Technical Requirements

### Must-Haves
- Responsive design (works on desktop, tablet, mobile)
- Fast performance (< 2s page load)
- SEO-friendly (proper meta tags, structured data)
- Accessible (WCAG 2.1 AA compliance)
- Security: SSL/TLS, secure password hashing, CSRF protection, rate limiting
- Audit logging for all admin actions (compliance requirement)

## Questions to Answer

1. **Tech Stack**: What should we keep from the existing codebase? Should we modernize?
   - Frontend: React, Vue, or something else?
   - Backend: Node.js, Python (FastAPI/Django), or?
   - Database: PostgreSQL, MongoDB, or?
   - Hosting/Deployment: Vercel, Railway, AWS, or?

2. **Authentication & Authorization**:
   - JWT tokens, session-based, or OAuth?
   - How do advisors reset passwords?
   - How do we manage role permissions (Advisor, Admin, Compliance)?

3. **Database Schema**: Design the complete schema
   - users (id, email, name, role, password_hash, created_at, etc.)
   - advisors (user_id, bio, profile_image, services, etc.)
   - pages (id, advisor_id, slug, title, content, status, etc.)
   - blog_posts (id, author_id, title, slug, content, status, created_at, updated_at, etc.)
   - compliance_queue (id, content_id, content_type, submitted_by, status, reviewer_notes, etc.)
   - audit_logs (id, user_id, action, resource, changes, timestamp, etc.)
   - [Add any other tables needed]

4. **API Endpoints**: List all necessary endpoints with auth/permission requirements
   - Example: POST /api/blog/posts (requires Advisor role, creates in Draft state)
   - Example: GET /api/blog/posts/:id/pending (requires Compliance role)
   - [Be comprehensive]

5. **Compliance Workflow Diagram**: Show the state machine
   - Draft → Pending Approval → Approved → Published
   - Draft → Pending Approval → Rejected → Draft (with comments)

6. **User Permission Matrix**: Who can do what?
   - Can advisors see each other's drafts? (No, probably)
   - Can admins edit advisor pages directly? (Yes)
   - Can compliance officer edit content? (No, only approve/reject)

7. **Deployment Strategy**:
   - Staging environment for testing?
   - How do we deploy to production? (CI/CD pipeline?)
   - How do we handle database migrations?
   - Rollback strategy?

8. **AI Advisor Assistant Architecture**:
   - How should the AI code generation API be designed? (Claude Opus backend)
   - How are advisor requests validated before sending to Claude?
   - How is generated code reviewed/edited before compliance submission?
   - Rate limiting strategy per advisor (prevent abuse)?
   - How is the generation history stored and audited?
   - What safeguards prevent AI from generating non-compliant code?
   - Should there be a "code review" step between AI generation and compliance queue?

9. **Risk & Dependencies**:
   - What could go wrong?
   - Are there external integrations needed? (Email, CDN, etc.)
   - Scalability concerns?
   - What are the security/compliance risks with the AI feature? (Generated code quality, liability, etc.)

## Deliverable Format

Create a **RISE_WEBSITE_ARCHITECTURE.md** file with these sections:

### 1. Executive Summary
- 2-3 sentence overview of the architecture

### 2. Tech Stack Rationale
- Frontend choice + why
- Backend choice + why
- Database choice + why
- Hosting choice + why
- Any other tools/services

### 3. Database Schema
- Full schema with table definitions, column types, relationships
- Include indexes and constraints
- Use SQL or pseudo-SQL format

### 4. API Endpoints
- Organize by resource (Users, Posts, Pages, Compliance, etc.)
- For each endpoint: method, path, required auth, required permissions, request body (if POST), response format
- Example:
  ```
  POST /api/blog/posts
  - Auth: JWT token required
  - Permission: Advisor role or higher
  - Body: { title, content, excerpt, featured_image_url }
  - Response: { id, status: "draft", created_at, ... }
  ```

### 5. Compliance Workflow
- State machine diagram (text-based is fine)
- Who does what at each stage
- How approval is triggered and completed

### 6. User Permission Matrix
- Table format: Roles (Advisor, Admin, Compliance) × Actions (Create, Read Own, Read All, Edit Own, Edit All, Approve, Delete)
- Mark each cell: ✅ allowed, ❌ not allowed

### 7. Authentication & Authorization Strategy
- How users log in (form, password reset, etc.)
- How tokens are issued and refreshed
- Where auth is enforced (API middleware, frontend guards)

### 8. Code Organization & File Structure
- Proposed folder structure for the project
- Example: /frontend, /backend, /database, /docs, etc.
- What can we reuse from existing codebase?
- What needs to be refactored?
- What's new code?

### 9. Deployment Architecture
- Development → Staging → Production pipeline
- CI/CD steps (tests, linting, build)
- Database migration strategy
- Rollback plan
- Environment variables needed

### 10. AI Advisor Assistant — Detailed Design
- Chat interface wireframe / UX flow
- API endpoint design for generation requests
- Claude Opus prompt engineering strategy (what instructions does the AI get?)
- Generated code storage & version control
- Integration with compliance workflow (how does generated code enter the queue?)
- Rate limiting & quota management per advisor
- Error handling (what if AI generates bad code? How does advisor handle it?)
- Security considerations (prompt injection, code injection risks?)
- Audit logging (track every generation, revision, approval)

### 11. Phase 2 & Beyond (Optional)
- Nice-to-have features not in MVP
- Examples: Client portal, testimonials, appointment booking, email newsletters, analytics dashboard, advisor-to-AI conversation history/templates, etc.

### 12. Implementation Roadmap
- Break MVP into 5-15 concrete tasks in priority order (AI feature is likely several tasks)
- Estimate effort for each (small/medium/large)
- Identify dependencies (Task B depends on Task A being done first)
- **Note:** AI Advisor Assistant is high-complexity; may warrant its own sub-project timeline

### 13. Open Questions / Risks
- Anything unclear or concerning?
- Potential blockers?
- What needs Josh's input before implementation starts?
- **Specific to AI feature:** What are the compliance/liability implications of auto-generating advisor content? Should there be additional guardrails?

---

## Context for Silas (the implementation agent)

At the end of your document, add a section called **"HANDOFF TO SILAS"** with:

```markdown
## HANDOFF TO SILAS

**When you receive this plan, Silas will:**
1. Review the architecture for completeness and technical soundness
2. Use Claude Opus reasoning to validate decisions and flag risks
3. Break the implementation roadmap into parallel work streams for sub-agents
4. Request GitHub access (PAT token) and deployment credentials
5. Spawn sub-agents to work on:
   - Backend API development (Sonnet + Haiku)
   - Frontend components (Sonnet + Haiku)
   - Database schema/migrations (Haiku)
   - Compliance workflow logic (Sonnet)
   - Testing & QA (Haiku)
6. Monitor all PRs, run code reviews, and post merge decisions to #silas-approvals
7. Track progress in Monday.com and report blockers in #silas-audit

**Questions for Josh before Silas starts:**
- [ ] GitHub PAT token for repo access (read + write)
- [ ] Deployment credentials (Vercel/Railway/AWS/etc.)
- [ ] Which existing code should we preserve vs. rewrite?
- [ ] Preferred deployment schedule (continuous, weekly, manual?)
- [ ] Who needs to sign off on PRs before merge? (Just Josh, or Josiah too?)
```

---

## Your Task

Using this brief and the existing codebase you have access to, produce **RISE_WEBSITE_ARCHITECTURE.md** with all 12 sections above fully fleshed out.

Be thorough. Be specific. Make decisions and explain your reasoning. This document will guide my implementation work.

Ready to dig in!
