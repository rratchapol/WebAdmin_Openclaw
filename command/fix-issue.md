---
description: How to fix an issue in this codebase
---

## Fix Issue Workflow

1. **Identify** the error message and affected file
2. **Reproduce** the issue locally with `npm run dev`
3. **Trace** the issue:
   - Check route → controller → model
   - Check middleware (auth, validation)
4. **Fix** the code following `rule/code-style.md` and `rule/error-handling.md`
5. **Test** the fix:
   - API: test with REST client or `curl`
   - Frontend: verify in browser
6. **Commit** following `rule/git-workflow.md`
