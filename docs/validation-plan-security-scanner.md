# Validation Plan: Skills Security Scanner

**Status**: Pre-build Validation
**Timeline**: 1-2 days
**Goal**: Validate whether building a security scanner for AI Skills is worth pursuing

---

## Overview

Before investing 3 weeks building a Rust CLI security scanner, we need to validate:
1. The problem exists (skills have real security issues)
2. People care about the problem (demand exists)
3. No one else has solved it (no competition)
4. skills.sh would integrate it (partnership potential)
5. We can build credibility (audience exists)

**Decision Criteria**: If 3+ experiments show positive results → Build MVP. Otherwise → Pivot or wait.

---

## Experiment 1: Manual Security Audit

**Time**: 4 hours
**Owner**: [Assignable]
**Priority**: CRITICAL

### Objective
Prove that security vulnerabilities exist in real skills from skills.sh marketplace.

### Steps

1. **Sample Collection** (30 min)
   - Visit https://skills.sh
   - Randomly select 20 skills across different categories
   - Prioritize skills with:
     - Deployment/infrastructure operations
     - API integrations
     - File system operations
     - Network requests
   - Record skill names and URLs in a spreadsheet

2. **Security Review** (3 hours)
   For each skill, check for:

   **Critical Issues:**
   - [ ] Hardcoded credentials (API keys, tokens, passwords)
   - [ ] Command injection vulnerabilities (unsanitized user input in bash)
   - [ ] Path traversal risks (file operations without validation)
   - [ ] Arbitrary code execution (eval, curl | bash, base64 decode pipes)

   **Medium Issues:**
   - [ ] Excessive permissions requests
   - [ ] Unvalidated external network calls
   - [ ] Missing error handling on sensitive operations
   - [ ] Hardcoded URLs/endpoints (should be configurable)

   **Low Issues:**
   - [ ] Missing input validation
   - [ ] Poor documentation of required secrets
   - [ ] Overly broad file patterns

3. **Documentation** (30 min)
   Create `audit-results.md` with:
   ```markdown
   # Security Audit Results

   **Date**: YYYY-MM-DD
   **Skills Reviewed**: 20

   ## Summary
   - Critical issues found: X
   - Medium issues found: Y
   - Low issues found: Z
   - Clean skills: N

   ## Critical Findings

   ### Skill: [name] ([url])
   - **Issue**: Hardcoded AWS credentials
   - **Location**: Line 45 of SKILL.md
   - **Impact**: Full AWS account compromise
   - **Evidence**:
     ```bash
     export AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
     ```

   [Repeat for each finding]
   ```

### Pass Criteria
- ✅ Find at least 3 skills with legitimate critical security issues
- ✅ Issues are not false positives (actually exploitable)
- ✅ Issues represent patterns we could detect automatically

### Fail Criteria
- ❌ All 20 skills are safe and boring
- ❌ Issues found are too context-dependent to automate detection
- ❌ skills.sh already has built-in security validation

### Deliverable
- `docs/audit-results.md` with findings
- Spreadsheet: skill name, URL, issue type, severity, exploitability

---

## Experiment 2: Community Pulse Check

**Time**: 2 hours
**Owner**: [Assignable]
**Priority**: HIGH

### Objective
Validate that the target audience cares about skills security and would use a scanner tool.

### Steps

1. **Identify Communities** (15 min)
   Find where skills.sh users congregate:
   - skills.sh Discord/Slack
   - GitHub Discussions on skills.sh repo
   - Reddit: r/ChatGPTCoding, r/LocalLLaMA, r/opensource
   - Twitter/X: Follow skills.sh account, see who engages
   - Dev.to / Hashnode tags: #ai-coding, #github-copilot

2. **Craft Survey Post** (15 min)
   Template:
   ```markdown
   ## Question for Skills Users 🤔

   I'm researching security practices around AI Skills (like those on skills.sh).

   **Quick poll - have you ever worried about:**
   - 🔑 Hardcoded credentials in skills you install?
   - 💉 Malicious commands in community-contributed skills?
   - 🔓 Security risks from running untrusted skills?
   - 🤷 Not knowing if a skill is safe to use?

   **Would you use a tool that scans skills for security issues before you install them?**

   (Similar to `npm audit` for dependencies)

   Honest feedback appreciated! Trying to understand if this is a real pain point.
   ```

3. **Post to Communities** (30 min)
   - Post to 3-5 communities
   - Be genuine, not spammy
   - Engage with responses genuinely
   - Don't oversell or make promises

4. **Monitor & Engage** (1 hour over 24 hours)
   - Respond to questions
   - Collect feedback
   - Note objections and concerns
   - Ask follow-ups to understand depth of need

5. **Document Results** (15 min)
   Create `docs/community-feedback.md`:
   ```markdown
   # Community Pulse Check Results

   **Date**: YYYY-MM-DD
   **Communities Surveyed**: 5

   ## Quantitative Results
   - Total responses: X
   - "Yes, would use": Y
   - "Maybe": Z
   - "No": N

   ## Qualitative Feedback

   ### Positive Signals
   - Quote 1
   - Quote 2

   ### Objections/Concerns
   - Quote 1
   - Quote 2

   ### Insights
   - [What did we learn?]
   ```

### Pass Criteria
- ✅ 5+ people say "yes, this would be useful"
- ✅ People share specific security concerns they've had
- ✅ Engagement is genuine (not just politeness)

### Fail Criteria
- ❌ <3 positive responses
- ❌ Responses are "meh, seems overkill"
- ❌ People say "I just write my own skills, don't use marketplace"

### Deliverable
- `docs/community-feedback.md` with response summary
- Screenshots of key conversations
- List of community members interested in beta testing

---

## Experiment 3: Competition Check

**Time**: 1 hour
**Owner**: [Assignable]
**Priority**: MEDIUM

### Objective
Ensure no one has already built this tool or something very similar.

### Steps

1. **Search Existing Tools** (30 min)

   **GitHub searches:**
   - "skill security scanner"
   - "AI skill linter"
   - "skills.sh security"
   - "skill validator"
   - "copilot skill scanner"

   **Google searches:**
   - "scan skills for security"
   - "AI skill security tool"
   - "validate GitHub Copilot skills"

   **Check if general tools apply:**
   - Does shellcheck cover this?
   - Does hadolint cover this?
   - Does markdownlint have security rules?
   - Does Semgrep have skill-specific rules?

2. **Analyze Findings** (20 min)
   For each tool found, document:
   - Tool name and URL
   - What it does
   - Does it scan skills specifically?
   - What's missing?
   - Could we integrate/extend it vs. build new?

3. **Check skills.sh Roadmap** (10 min)
   - Visit skills.sh GitHub repo
   - Check issues for "security" mentions
   - Check PRs for security-related work
   - Review roadmap/milestones if public

4. **Document Results** (10 min)
   Create `docs/competition-analysis.md`:
   ```markdown
   # Competition Analysis

   **Date**: YYYY-MM-DD

   ## Existing Tools Found

   ### Tool: [name]
   - **URL**:
   - **What it does**:
   - **Covers skills?**: Yes/No
   - **Gap**: What's missing
   - **Decision**: Compete / Integrate / Ignore

   ## General Security Tools
   - shellcheck: [does it help?]
   - hadolint: [does it help?]
   - semgrep: [does it help?]

   ## skills.sh Built-in Security
   - Current state: [what exists]
   - Planned: [what's on roadmap]

   ## Conclusion
   [Is there a clear gap we can fill?]
   ```

### Pass Criteria
- ✅ No tool exists that specifically scans skills for security
- ✅ Existing tools (shellcheck, etc.) are insufficient for skill-specific patterns
- ✅ skills.sh has no built-in security validation

### Fail Criteria
- ❌ Someone already built this exact tool
- ❌ skills.sh is actively building their own solution
- ❌ General tools like shellcheck + markdownlint already cover 90% of cases

### Deliverable
- `docs/competition-analysis.md`
- List of tools to potentially integrate with

---

## Experiment 4: skills.sh Maintainer Outreach

**Time**: 30 min (+ waiting for response)
**Owner**: [Assignable]
**Priority**: HIGH

### Objective
Validate partnership potential with skills.sh and understand their perspective on security.

### Steps

1. **Research Maintainers** (10 min)
   - Find skills.sh GitHub repo
   - Identify core maintainers
   - Check if they have public contact info (email, Twitter, Discord)
   - Review their recent activity/comments on security topics

2. **Craft Outreach Message** (10 min)

   **Email Template:**
   ```
   Subject: Security scanning tool for skills.sh - interested in your thoughts

   Hi [Name],

   I'm [Your Name], maintainer of agentconfig.org (a reference guide for
   AI coding assistant configuration).

   I've been exploring the skills ecosystem and noticed the marketplace
   has grown to 11k+ skills - that's impressive growth!

   I'm considering building a security scanner specifically for AI skills
   (think `npm audit` but for skills). It would scan for:
   - Hardcoded credentials
   - Command injection vulnerabilities
   - Path traversal risks
   - Other security antipatterns

   Before investing time building this, I wanted to ask:

   1. Have you encountered security issues in submitted skills?
   2. Is security validation something you'd be interested in integrating?
   3. Are there plans to build security features into skills.sh itself?

   Would love to hear your perspective - either way, I respect whatever
   direction you're taking.

   Thanks for building a great platform!

   [Your Name]
   [agentconfig.org]
   ```

   **Adapt for:**
   - GitHub issue (if no direct contact)
   - Discord message (if they're active there)
   - Twitter DM (if that's their preferred channel)

3. **Send Outreach** (5 min)
   - Send via best available channel
   - Keep it professional and respectful
   - No pressure, genuine curiosity

4. **Document Response** (5 min)
   Create `docs/skills-sh-outreach.md`:
   ```markdown
   # skills.sh Maintainer Outreach

   **Date Sent**: YYYY-MM-DD
   **Channel**: Email/GitHub/Discord
   **Recipient**: [Name]

   ## Message Sent
   [Copy of message]

   ## Response
   **Date Received**: YYYY-MM-DD
   **Response**: [Copy response or summarize]

   ## Key Takeaways
   - Do they see security as a problem? Yes/No
   - Interest in integration? Yes/Maybe/No
   - Building their own? Yes/No/Unknown
   - Other insights: [notes]

   ## Decision Impact
   [How does this affect our go/no-go decision?]
   ```

### Pass Criteria
- ✅ They're enthusiastic about the idea
- ✅ They have examples of security issues they've encountered
- ✅ They'd consider integrating/partnering
- ✅ OR: No response (neutral - doesn't block us)

### Fail Criteria
- ❌ "We haven't had security issues and don't think it's needed"
- ❌ "We're building our own security validation"
- ❌ "This seems like overkill for our use case"

### Deliverable
- `docs/skills-sh-outreach.md`
- Updated partnership potential assessment

---

## Experiment 5: Write the Blog Post First

**Time**: 3 hours
**Owner**: [Assignable]
**Priority**: MEDIUM-HIGH

### Objective
Build credibility, validate audience interest, and create content that educates while testing demand.

### Steps

1. **Draft Blog Post** (2 hours)

   **Title Options:**
   - "Security Risks in AI Skills: What Could Go Wrong"
   - "The Hidden Dangers of AI Skill Marketplaces"
   - "Why AI Skills Need Security Scanning (Just Like npm Packages)"

   **Outline:**
   ```markdown
   # Security Risks in AI Skills: What Could Go Wrong

   ## Introduction
   - AI skills marketplaces are growing (11k+ skills)
   - Developers trust and run these scripts on their machines
   - But are we thinking about security?

   ## The Problem
   - Skills execute with your permissions
   - Access to your code, credentials, filesystem
   - One malicious skill = full compromise

   ## Real Vulnerability Examples

   ### 1. Credential Exposure
   [Example with code block showing hardcoded AWS key]
   **Risk**: Full account compromise
   **How to fix**: Use environment variables

   ### 2. Command Injection
   [Example with unsanitized user input]
   **Risk**: Arbitrary code execution
   **How to fix**: Input validation, quoting

   ### 3. Path Traversal
   [Example with unvalidated file operations]
   **Risk**: Unauthorized file access
   **How to fix**: Path validation, allowlists

   ### 4. Supply Chain Attacks
   [Example with curl | bash pattern]
   **Risk**: Remote code execution
   **How to fix**: Verify sources, review scripts

   ### 5. Excessive Permissions
   [Example with overly broad access]
   **Risk**: Unnecessary exposure
   **How to fix**: Principle of least privilege

   ## Best Practices for Writing Secure Skills
   1. Never hardcode credentials
   2. Validate all user input
   3. Limit filesystem access
   4. Document required permissions
   5. Review dependencies

   ## Best Practices for Using Skills
   1. Review code before running
   2. Check author reputation
   3. Use sandbox environments
   4. Audit installed skills regularly
   5. Report suspicious skills

   ## The Future: Security Scanning for Skills
   - npm has `npm audit`
   - Docker has image scanning
   - Skills need similar tooling
   - [Mention you're researching this]

   ## Conclusion
   - Skills are powerful, but with power comes risk
   - Security should be built in from the start
   - Community can help by being vigilant

   ## Call to Action
   - Share your security concerns in comments
   - Help improve skills ecosystem
   - [Link to survey or feedback form]
   ```

2. **Add Real Examples** (30 min)
   - Use findings from Experiment 1 (anonymized)
   - Create clear before/after code examples
   - Make it educational, not fear-mongering

3. **Review & Edit** (20 min)
   - Check tone (helpful, not preachy)
   - Verify technical accuracy
   - Add images/diagrams if helpful
   - Proofread

4. **Publish** (10 min)
   - Post to agentconfig.org blog (if exists)
   - Cross-post to Dev.to with canonical URL
   - Share on Hashnode
   - Post to relevant subreddits (follow rules)
   - Share on Twitter/X with relevant hashtags
   - Post in communities from Experiment 2

5. **Monitor Engagement** (ongoing, passive)
   - Track views/reads
   - Track comments/discussion
   - Note questions like "is there a tool for this?"
   - Engage genuinely with commenters

6. **Document Results** (after 48 hours)
   Create `docs/blog-post-results.md`:
   ```markdown
   # Blog Post Results

   **Published**: YYYY-MM-DD
   **Title**: [title]
   **URL**: [url]

   ## Metrics (48 hours)
   - Views: X
   - Comments: Y
   - Shares: Z
   - Upvotes/Likes: N

   ## Engagement Quality
   - Thoughtful discussions: [count]
   - "Is there a tool?" questions: [count]
   - Objections raised: [list]
   - Use cases shared: [list]

   ## Key Quotes
   - [Quote showing interest]
   - [Quote showing concern]
   - [Quote showing objection]

   ## Insights
   - [What did we learn about audience?]
   - [What resonated most?]
   - [What fell flat?]

   ## Conclusion
   [Does this validate demand for a security scanner?]
   ```

### Pass Criteria
- ✅ 100+ views in first 48 hours
- ✅ 5+ genuine comments/discussions
- ✅ People ask "is there a tool for this?" or "how can I check my skills?"
- ✅ Post gets shared/amplified by community

### Fail Criteria
- ❌ <50 views in 48 hours
- ❌ Zero comments or engagement
- ❌ Comments say "this seems overblown" or "not a real problem"

### Deliverable
- Published blog post with URL
- `docs/blog-post-results.md` after 48 hours
- List of engaged readers for potential beta testers

---

## Decision Framework

After completing all 5 experiments, tally results:

| Experiment | Pass | Fail | Weight |
|------------|------|------|--------|
| 1. Manual Audit | ✅/❌ | | 3x |
| 2. Community Pulse | ✅/❌ | | 3x |
| 3. Competition Check | ✅/❌ | | 1x |
| 4. skills.sh Outreach | ✅/❌ | | 2x |
| 5. Blog Post | ✅/❌ | | 2x |

**Scoring:**
- Experiment 1 Pass = 3 points
- Experiment 2 Pass = 3 points
- Experiment 3 Pass = 1 point
- Experiment 4 Pass = 2 points
- Experiment 5 Pass = 2 points

**Total Possible**: 11 points

### Decision Criteria

**Score 8-11 points: STRONG GO ✅**
- Problem validated
- Demand confirmed
- Build the MVP immediately
- Timeline: 3 weeks for v0.1.0

**Score 5-7 points: CAUTIOUS GO 🟡**
- Mixed signals
- Build a minimal MVP (1 week)
- Launch as experiment
- Be ready to pivot

**Score 0-4 points: NO GO / PIVOT ❌**
- Problem not validated OR
- Demand too weak OR
- Competition already solved it
- Options:
  - Wait 6-12 months, revisit
  - Pivot to different problem
  - Make it a side project (no time pressure)

---

## Parallel Execution Plan

These experiments can be run in parallel by multiple agents:

**Agent 1: Security Researcher**
- Experiment 1: Manual Security Audit
- Deliverable: `docs/audit-results.md`

**Agent 2: Community Manager**
- Experiment 2: Community Pulse Check
- Experiment 5: Write Blog Post
- Deliverables: `docs/community-feedback.md`, blog post, `docs/blog-post-results.md`

**Agent 3: Market Researcher**
- Experiment 3: Competition Check
- Experiment 4: skills.sh Outreach
- Deliverables: `docs/competition-analysis.md`, `docs/skills-sh-outreach.md`

**Timeline**: All agents work in parallel, sync after 24-48 hours for decision.

---

## Success Metrics Summary

At the end of validation, we should be able to answer:

1. ✅ **Do security issues exist in real skills?** (Experiment 1)
2. ✅ **Do people care about this problem?** (Experiments 2, 5)
3. ✅ **Is there a gap in the market?** (Experiment 3)
4. ✅ **Can we partner with skills.sh?** (Experiment 4)
5. ✅ **Can we build an audience?** (Experiment 5)

**If yes to 3+: Build it.**
**If no: Pivot or wait.**

---

## Next Steps After Validation

### If PASS → Build MVP
1. Create `agentconfig/scan` repository
2. Follow Rust TDD plan (see: `vision-skills-security-first.md`)
3. Timeline: 3 weeks to v0.1.0
4. Beta test with engaged community members from experiments

### If FAIL → Pivot Options
1. **Education instead of tooling**: Turn blog post into comprehensive guide
2. **Different primitive**: Focus on cross-provider compatibility instead of security
3. **Wait**: Bookmark idea, revisit in 6 months when ecosystem matures
4. **Side project**: Build for learning/portfolio, no pressure for adoption

---

## Appendix: Templates & Resources

### Survey Form Template (Optional)

Create a Google Form or Typeform:

**Skills Security Survey**

1. Do you use AI skills from marketplaces? (Yes/No)
2. Which platforms? (skills.sh, custom, other)
3. Have you ever worried about security when installing a skill? (Yes/No)
4. What concerns you most? (Open text)
5. Would you use a security scanner tool? (Yes/Maybe/No)
6. What features would be most valuable? (Checkboxes)
7. Email (optional, for beta testing)

### Example Violations to Look For

**Credential Exposure Patterns:**
```bash
AWS_ACCESS_KEY_ID="AKIA..."
ghp_[a-zA-Z0-9]{36}
bearer [a-z0-9]{32,}
password="..."
```

**Command Injection Patterns:**
```bash
curl $USER_URL
git commit -m $MESSAGE
eval "$COMMAND"
```

**Path Traversal Patterns:**
```bash
cat $FILE
rm -rf $PATH
tar -xzf $ARCHIVE
```

---

## Contact & Coordination

**Primary Owner**: [Your Name]
**Validation Deadline**: [Date]
**Decision Meeting**: [Date + 2 days]
**Location for Results**: `/docs/validation-results/`

All agents should commit results to the `strategy-and-vision` branch under `docs/validation-results/` directory.
