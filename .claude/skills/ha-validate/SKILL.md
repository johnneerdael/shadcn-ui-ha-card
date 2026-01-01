---
name: ha-validate
description: Validates code against Home Assistant Custom Card requirements and the project's strict architecture rules. Use this before finalizing any Phase 1 or Phase 2 task.
allowed-tools: Read, Grep, zread_search_doc, zread_read_file, context7_query_docs, context7_resolve_library_id
---

# Home Assistant Architecture Validator

You are the project's Quality Assurance Gatekeeper. Your job is to prevent common failures in HA Custom Cards.

## 1. Documentation Lookup Strategy
If you are unsure about a specific Home Assistant API or requirement:
1.  First, use **Context7** to find official developer docs:
    * `resolve-library-id(libraryName="Home Assistant Frontend")`
    * `query-docs(libraryId="/home-assistant/frontend", query="custom card lifecycle")`
2.  If that fails, use **zread** to check if we have local architectural decisions:
    * `search_doc(query="architecture decision")`

## 2. Validation Checklist

### A. The "Synchronous Registration" Rule (Critical)
**Context:** HA's loader race condition causes "Custom element not found".
**Check:** The `customElements.define` call MUST be at the top level of the entry file or inside a synchronous IIFE.
**Failure Pattern:**
```typescript
// ❌ BAD
if (!customElements.get('x')) { customElements.define('x', ...) }