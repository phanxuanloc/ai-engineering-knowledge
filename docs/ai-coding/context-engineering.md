---
title: Context Engineering
description: Designing the information available to an AI model so it can reliably complete a task.
sidebar_position: 2
tags: [context, prompting, ai-coding]
---

# Context Engineering

## TL;DR

Context engineering is the deliberate design of everything a model sees when it performs a task: instructions, examples, retrieved knowledge, tool descriptions, conversation state, and outputs from previous steps. Good context supplies the smallest set of clear, relevant evidence needed for the next decision.

## Mental Model

Treat the model as a capable developer joining a project for one short work session. Its performance depends less on receiving a giant briefing and more on receiving the right task, relevant files, constraints, and feedback at the right moment.

Context is a limited working surface. Every item placed on it competes for attention, so context quality is a signal-to-noise problem as well as a token-budget problem.

## Core Concepts

- **Instructions:** Define the goal, constraints, expected output, and success criteria.
- **State:** Capture what has happened, what remains, and decisions that must stay consistent.
- **Knowledge:** Supply relevant source code, documentation, schemas, examples, or retrieved passages.
- **Tools:** Describe available actions precisely enough that the model can choose and invoke them correctly.
- **Selection:** Retrieve or reveal information based on the current step instead of loading everything upfront.
- **Compression:** Summarize older information while preserving decisions, evidence, and unresolved questions.
- **Feedback:** Return test results, tool errors, and evaluation signals so the model can correct its approach.

## Example

Suppose a coding agent must add an API endpoint. A weak context says, “Add a user endpoint,” and attaches the entire repository. A stronger context provides:

```text
Goal: Add GET /users/:id using the existing service pattern.
Constraints: Return the shared NotFound error; do not expose email.
Relevant context:
- src/routes/projects.ts (routing pattern)
- src/services/users.ts (available lookup)
- src/http/errors.ts (error contract)
Validation: npm test -- users && npm run typecheck
```

The second version reduces ambiguity, demonstrates local conventions, and makes completion verifiable without flooding the model with unrelated files.

## When to Use

- When a task spans multiple model calls, tools, or agents.
- When outputs are inconsistent despite a seemingly clear prompt.
- When domain knowledge lives outside the model, such as private code or current documentation.
- When long conversations begin losing earlier constraints or repeating work.
- When an agent must decide which tool or source to use next.

## Common Mistakes

- **Stuffing the context window:** More text can bury the few details that determine the answer.
- **Using stale state:** Old plans or documentation can conflict with the current system.
- **Retrieving by similarity alone:** Semantically similar passages are not always useful for the decision at hand.
- **Leaving success implicit:** Without tests or acceptance criteria, the model cannot reliably know when it is done.
- **Mixing facts and instructions:** Untrusted retrieved content should not be allowed to override system or task rules.
- **Summarizing away evidence:** Compression should retain exact decisions, identifiers, errors, and open questions.

## My Understanding

Prompt engineering improves an individual request. Context engineering designs the surrounding system that continually assembles the best request for each step. The core job is deciding what the model needs now, where that information comes from, and how to verify that it was enough.

## My Experiment

**Hypothesis:** A small context selected from task dependencies will produce a more accurate patch than attaching every file in a repository.

**Setup:** Give the same implementation task to two fresh model sessions. Provide one with a full repository dump and the other with the task contract, dependency map, relevant files, and test command. Compare correctness, tokens used, and number of repair iterations.

**Result:** Not run yet.

**Conclusion:** Record whether targeted context improved correctness and which omitted information caused follow-up retrieval.

## Related Knowledge

- [AI Coding](./index.md) — context engineering is a core practice for reliable AI-assisted development.
- [Coding Agents](../coding-agents/index.md) — agents dynamically gather and update context as they work.
- [RAG](../rag/index.md) — retrieval is one mechanism for selecting external knowledge into context.

## Self-test

1. How is context engineering broader than prompt engineering?
2. Why can adding more relevant-looking text reduce model performance?
3. What information should survive when old context is compressed?
4. How would you evaluate two context-selection strategies for a coding task?

<details>
<summary>Answers</summary>

1. It manages the complete information environment across steps, including instructions, state, knowledge, tools, retrieval, and feedback—not only the wording of one prompt.
2. Extra text competes for limited attention, can introduce conflicts, and makes decisive evidence harder to identify.
3. Preserve goals, constraints, decisions, exact evidence, identifiers, observed results, and unresolved questions.
4. Hold the task and model constant, then compare correctness, resource use, and repair iterations under each strategy.

</details>
