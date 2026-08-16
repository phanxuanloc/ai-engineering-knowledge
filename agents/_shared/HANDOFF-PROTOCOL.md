# Agent Handoff Protocol

Use concise handoffs. Do not pass the entire conversation when a structured summary is enough.

## Handoff packet

```yaml
objective: ""
from: ""
to: ""
why_this_agent: ""
current_state:
  topic: null
  checkpoint: null
artifacts: []
constraints: []
known_evidence: []
open_questions: []
expected_output: ""
acceptance_criteria: []
human_gate: null
```

## Reviewer verdict

```yaml
verdict: pass | revise | fail
findings:
  - severity: critical | high | medium | low
    issue: ""
    evidence: ""
required_changes: []
learning_evidence:
  sufficient: false
  rationale: ""
recommended_next_action: ""
```

## Research signal

```yaml
topic: ""
classification: durable | semi-durable | fast-changing
impact:
  learning: low | medium | high
  engineering: low | medium | high
  consulting: low | medium | high
recommendation: learn_now | apply_now | backlog | monitor | ignore
reason: ""
sources: []
```

## Consultant recommendation

```yaml
problem: ""
business_outcome: ""
assumptions: []
constraints: []
options: []
recommended_option: ""
evidence: []
risks: []
evaluation_plan: []
rollout: []
roi_hypothesis: ""
confidence: low | medium | high
human_decisions_needed: []
```
