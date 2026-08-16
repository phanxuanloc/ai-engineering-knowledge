# Using the 7-Agent Team

## Natural-language entry

You do not need slash commands. State the outcome.

Examples:

- `Học tiếp Evaluation`
- `Build một experiment để kiểm chứng phần này`
- `Review xem lab này đã đủ evidence chưa`
- `Research xem Agent Harness hiện tại có đáng học ngay không`
- `Chốt kiến thức`
- `Biến phần đã validated thành docs + nội dung chia sẻ`
- `Đóng vai consultant, đánh giá use case AI này cho công ty`

The Orchestrator should route automatically when multiple roles are needed.

## Optional explicit role calls

- `@tutor ...`
- `@builder ...`
- `@reviewer ...`
- `@researcher ...`
- `@publisher ...`
- `@consultant ...`
- `@orchestrator ...`

These are conventions, not framework-specific commands.

## First real smoke test

Use the current real learning state with `Học tiếp Evaluation`.

Expected behavior:
1. Tutor reads `learning-progress.yaml`.
2. Tutor identifies the existing next checkpoint rather than inventing a new syllabus.
3. Tutor runs one concise Learning Pack.
4. If the checkpoint requires empirical/practical evidence, Builder creates the smallest useful artifact.
5. Reviewer validates evidence independently.
6. Only when the learner says `Chốt kiến thức` does the repository learning-checkpoint flow capture actual learned material.
7. Publisher updates shareable knowledge only under existing repository rules.

## What v1 intentionally does not include

- autonomous long-running agents;
- framework lock-in;
- duplicated memory/database;
- automatic public posting;
- automatic broad-topic completion;
- a separate agent for every tool or output format.

Those should be added only after repeated real usage exposes a concrete need.
