# Pull Request

## Scope

Brief description of what this PR does and why it's needed.

**Type of change:**
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] CI/CD changes

## Contracts touched

**Are any contracts, types, or API interfaces modified?** [ ] Yes / [ ] No

If yes, list the specific files:
- [ ] `packages/contracts/**`
- [ ] `packages/types/**`
- [ ] API route definitions (`**/routes/**`)
- [ ] Database schema (`supabase/migrations/**`)
- [ ] Other: _________________

**Breaking changes:** [ ] Yes / [ ] No

If breaking changes, describe the migration path:

## Endpoints added/changed

**Are any API endpoints added or modified?** [ ] Yes / [ ] No

If yes, list the endpoints:
- [ ] `GET /endpoint` - Description
- [ ] `POST /endpoint` - Description
- [ ] `PUT /endpoint` - Description
- [ ] `DELETE /endpoint` - Description

**Authentication required:** [ ] Yes / [ ] No  
**Rate limiting applied:** [ ] Yes / [ ] No / [ ] N/A

## Tests added

**Testing checklist:**
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] Edge cases covered
- [ ] Error scenarios tested

**Test coverage:** ____%

**Commands to test:**
```bash
# Add specific commands reviewers should run
npm test
npm run test:integration
```

## Screenshots

**UI changes:** [ ] Yes / [ ] No

If yes, add before/after screenshots:

### Before
<!-- Add screenshot or describe current behavior -->

### After
<!-- Add screenshot or describe new behavior -->

**Mobile responsive:** [ ] Yes / [ ] No / [ ] N/A  
**Dark mode tested:** [ ] Yes / [ ] No / [ ] N/A  
**Accessibility checked:** [ ] Yes / [ ] No / [ ] N/A

## Risk & Rollout

**Risk level:** [ ] Low / [ ] Medium / [ ] High

**Rollout strategy:**
- [ ] Feature flag controlled
- [ ] Gradual rollout planned
- [ ] Can be deployed immediately
- [ ] Requires coordination with other teams
- [ ] Database migration required

**Rollback plan:**
- [ ] Can be rolled back safely
- [ ] Requires data migration rollback
- [ ] Feature flag can disable
- [ ] Manual rollback steps: _________________

**Monitoring:**
- [ ] Metrics/alerts added
- [ ] Error tracking configured
- [ ] Performance impact measured
- [ ] User impact tracked

## Agent metadata

**Was this PR created/assisted by an AI agent?** [ ] Yes / [ ] No

If yes, provide details:
- **Agent:** Claude Code / GPT-4 / Custom / Other: _________________
- **Budget used:** $_______ (estimated cost)
- **Steps taken:** _____ (number of AI interactions)
- **Human oversight level:** [ ] Full review / [ ] Spot checks / [ ] Minimal
- **Confidence level:** [ ] High / [ ] Medium / [ ] Low

**Agent-generated files:** (list any files created primarily by AI)
- [ ] All code reviewed by human
- [ ] Security implications considered
- [ ] Performance implications reviewed

---

## Checklist

- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Related Issues

- Closes #___
- Related to #___
- Blocks #___
- Blocked by #___

## Additional Notes

<!-- Any additional information, concerns, or context for reviewers -->

---

**Review Instructions:**
1. Check all required sections are completed
2. Verify test coverage is adequate  
3. Confirm security and performance implications
4. Validate breaking changes are properly documented
5. Ensure rollback plan is feasible