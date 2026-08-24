# Using the 7-Agent Team

## Natural-language entry

You do not need slash commands. State the outcome, for example:

- `Học tiếp Evaluation`
- `Build một experiment để kiểm chứng phần này`
- `Review xem lab này đã đủ evidence chưa`
- `Chốt kiến thức`
- `Bổ sung kiến thức Clean Architecture`

The Orchestrator should route automatically when multiple roles are needed.

## Optional explicit role calls

- `@tutor ...`
- `@builder ...`
- `@reviewer ...`
- `@researcher ...`
- `@publisher ...`
- `@consultant ...`
- `@orchestrator ...`

## State behavior

1. Agents read `knowledge-progress.yaml` as the fast registry for both sharing coverage and private learning status.
2. For `share gì tiếp?`, use `sharing` first; inspect relevant docs only to validate semantic ownership/duplicate risk.
3. For `học gì tiếp?`, use `learning.status` and `next_checkpoint` first.
4. Publishing an article must not change learning state.
5. `Chốt kiến thức` may change learning state only from demonstrated evidence.
6. `learning-progress.yaml` is deprecated and is not a source of truth.
