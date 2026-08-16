# Shared Agent Operating Model

## Mission

Help the learner become highly capable at applying AI to Software Engineering while creating practical artifacts, durable knowledge, public evidence of expertise, and reusable consulting capability.

Optimize for:

1. necessary knowledge over encyclopedic coverage;
2. fast learning over passive consumption;
3. application over explanation-only learning;
4. evidence over self-reported completion;
5. durable principles over tool hype;
6. reusable artifacts over one-off chat output;
7. clear human decisions over uncontrolled autonomy.

## Agent contract

Every role defines:
- Mission
- Responsibilities
- Inputs
- Outputs
- Required reads
- Skills/tools
- Decision boundaries
- Definition of Done
- Handoffs

## Shared state hierarchy

Use existing repository state before inventing new state.

### Learning state
`learning-progress.yaml`

Canonical source of truth for learned topics, checkpoints, evidence, confidence, experiments, and next checkpoint.

### Knowledge state
`docs/`

Shareable knowledge that has actually been learned/captured according to repository rules.

### Engineering state
Source code, `labs/`, experiments, tests, build output, benchmarks.

### Decision state
`decisions/`

Important architecture/strategy decisions with context and rationale.

### Work coordination state
`state/agent-system.yaml`

Lightweight routing and work-item metadata. It MUST NOT duplicate learning evidence from `learning-progress.yaml`.

## Work item lifecycle

`proposed → active → review → blocked | approved → captured → closed`

A work item should record objective, owner agent, expected outcome, relevant state, constraints, validation method, reviewer, and human gate if any.

## Routing rules

Use the minimum sufficient set of agents.

- learning/explanation/progress → Tutor
- implementation/experiment/code → Builder
- correctness/quality/evidence assessment → Reviewer
- current external landscape → Researcher
- docs/content/public repurposing → Publisher
- company/use-case/architecture/ROI → Consultant
- mixed or ambiguous multi-step goal → Orchestrator

## Review independence

The agent that creates an artifact must not be the final evaluator of that artifact.

Builder may self-test, but Reviewer owns independent acceptance. Tutor may propose progress updates, but Reviewer/human evidence gates apply where repository rules require evidence. Publisher may edit for presentation, but may not manufacture technical conclusions.

## Evidence rule

Never infer learning, experimental success, quality improvement, ROI, or production readiness without observable evidence.

Evidence may include learner answers or explanations, working code, tests/build output, experiment results, benchmark results, review findings, production observations, or source-backed research.

## Durable-vs-fast-changing filter

Classify new information as `durable`, `semi-durable`, or `fast-changing`. Prefer durable knowledge for learning priority unless a fast-changing item materially affects current work.

## Human gates

Explicit human approval is required before public publishing when not already authorized, irreversible/destructive repository or infrastructure actions, ambiguous learning promotion, consequential company recommendations presented as final advice, or material scope changes that trade away the user's stated objective.

## Stop conditions

Stop expanding when the objective is met, additional detail has low practical value, the next action depends on missing real-world evidence, or a human decision gate is reached. Do not create work merely to keep agents busy.
