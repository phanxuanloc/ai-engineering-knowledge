export type ContextKind = 'mandatory' | 'selectable';

export type ContextItem = {
  id: string;
  label: string;
  source: string;
  type: string;
  kind: ContextKind;
  relevance: number;
  priority: number;
  freshness: number;
  tokenCost: number;
};

export type SelectionReason =
  | 'mandatory'
  | 'selected'
  | 'stale'
  | 'low-relevance'
  | 'over-budget';

export type EvaluatedContextItem = ContextItem & {
  score: number;
  selected: boolean;
  reason: SelectionReason;
};

export type SelectionResult = {
  items: EvaluatedContextItem[];
  selected: EvaluatedContextItem[];
  rejected: EvaluatedContextItem[];
  usedTokens: number;
  budget: number;
};

export const defaultContextItems: ContextItem[] = [
  {
    id: 'user-request',
    label: 'User request',
    source: 'user',
    type: 'instruction',
    kind: 'mandatory',
    relevance: 1,
    priority: 1,
    freshness: 1,
    tokenCost: 120,
  },
  {
    id: 'coding-rules',
    label: 'Repository auth rules',
    source: 'AGENTS.md',
    type: 'constraint',
    kind: 'mandatory',
    relevance: 0.95,
    priority: 1,
    freshness: 1,
    tokenCost: 380,
  },
  {
    id: 'auth-service',
    label: 'AuthService.ts',
    source: 'src/auth/AuthService.ts',
    type: 'code',
    kind: 'selectable',
    relevance: 0.95,
    priority: 0.9,
    freshness: 0.95,
    tokenCost: 760,
  },
  {
    id: 'login-controller',
    label: 'LoginController.ts',
    source: 'src/auth/LoginController.ts',
    type: 'code',
    kind: 'selectable',
    relevance: 0.84,
    priority: 0.75,
    freshness: 0.95,
    tokenCost: 560,
  },
  {
    id: 'runtime-log',
    label: 'Latest 401 runtime log',
    source: 'runtime',
    type: 'evidence',
    kind: 'selectable',
    relevance: 0.9,
    priority: 0.85,
    freshness: 1,
    tokenCost: 310,
  },
  {
    id: 'previous-summary',
    label: 'Previous agent summary',
    source: 'working-state',
    type: 'working-state',
    kind: 'selectable',
    relevance: 0.72,
    priority: 0.68,
    freshness: 0.8,
    tokenCost: 280,
  },
  {
    id: 'old-auth-design',
    label: 'Old auth design note',
    source: 'docs/archive/auth-design.mdx',
    type: 'reference',
    kind: 'selectable',
    relevance: 0.68,
    priority: 0.4,
    freshness: 0.15,
    tokenCost: 820,
  },
  {
    id: 'payment-service',
    label: 'PaymentService.ts',
    source: 'src/payment/PaymentService.ts',
    type: 'code',
    kind: 'selectable',
    relevance: 0.12,
    priority: 0.2,
    freshness: 0.9,
    tokenCost: 690,
  },
];

export function scoreContextItem(item: ContextItem) {
  return Number(
    (item.relevance * 0.5 + item.priority * 0.3 + item.freshness * 0.2).toFixed(3),
  );
}

export function selectContext(items: ContextItem[], budget: number): SelectionResult {
  const mandatory = items.filter((item) => item.kind === 'mandatory');
  const selectable = items
    .filter((item) => item.kind === 'selectable')
    .map((item) => ({...item, score: scoreContextItem(item)}))
    .sort((a, b) => b.score - a.score || a.tokenCost - b.tokenCost);

  const selectedIds = new Set(mandatory.map((item) => item.id));
  const reasons = new Map<string, SelectionReason>(
    mandatory.map((item) => [item.id, 'mandatory'] as const),
  );
  let usedTokens = mandatory.reduce((sum, item) => sum + item.tokenCost, 0);

  for (const item of selectable) {
    if (item.freshness < 0.25) {
      reasons.set(item.id, 'stale');
      continue;
    }

    if (item.relevance < 0.3) {
      reasons.set(item.id, 'low-relevance');
      continue;
    }

    if (usedTokens + item.tokenCost > budget) {
      reasons.set(item.id, 'over-budget');
      continue;
    }

    selectedIds.add(item.id);
    reasons.set(item.id, 'selected');
    usedTokens += item.tokenCost;
  }

  const evaluated = items.map<EvaluatedContextItem>((item) => ({
    ...item,
    score: scoreContextItem(item),
    selected: selectedIds.has(item.id),
    reason: reasons.get(item.id) ?? 'over-budget',
  }));

  return {
    items: evaluated,
    selected: evaluated.filter((item) => item.selected),
    rejected: evaluated.filter((item) => !item.selected),
    usedTokens,
    budget,
  };
}
