export type ContextItemState =
  | 'candidate'
  | 'pinned'
  | 'selected'
  | 'preserved'
  | 'compressed'
  | 'evicted'
  | 'rejected';

export type ContextItemSnapshot = {
  id: string;
  label: string;
  source: string;
  tokenCost: number;
  state: ContextItemState;
  reason: string;
  score?: number;
};

export type LifecycleStep = {
  id: string;
  phase: string;
  decision: string;
  narration: string;
  action: string;
  call?: string;
  budget: number;
  usedTokens: number;
  items: ContextItemSnapshot[];
  workingState: string[];
  event?: {
    tone: 'info' | 'warning' | 'success';
    title: string;
    detail: string;
  };
};

const baseItems = {
  request: {id: 'request', label: 'Fix login 401', source: 'user request', tokenCost: 180},
  rules: {id: 'rules', label: 'Repository auth rules', source: 'AGENTS.md', tokenCost: 420},
  auth: {id: 'auth', label: 'AuthService.ts', source: 'src/auth/AuthService.ts', tokenCost: 1250},
  controller: {id: 'controller', label: 'LoginController.ts', source: 'src/auth/LoginController.ts', tokenCost: 780},
  log401: {id: 'log401', label: 'Latest 401 runtime log', source: 'runtime', tokenCost: 620},
  oldDesign: {id: 'old-design', label: 'Old auth design note', source: 'docs/archive/auth-design.mdx', tokenCost: 900},
  payment: {id: 'payment', label: 'PaymentService.ts', source: 'src/payment/PaymentService.ts', tokenCost: 860},
  jwt: {id: 'jwt', label: 'JWT config + validator', source: 'src/auth/jwt/*', tokenCost: 1450},
  decode: {id: 'decode', label: 'Decoded failing token', source: 'tool output', tokenCost: 540},
  search: {id: 'search', label: 'Repository search results', source: 'ripgrep', tokenCost: 1180},
  tests: {id: 'tests', label: 'Focused auth test output', source: 'test runner', tokenCost: 1680},
  diff: {id: 'diff', label: 'Current patch diff', source: 'git diff', tokenCost: 720},
  summary: {id: 'summary', label: 'Compressed investigation summary', source: 'working state', tokenCost: 430},
  verify: {id: 'verify', label: 'Fresh verification result', source: 'test + runtime', tokenCost: 710},
} as const;

function item(
  key: keyof typeof baseItems,
  state: ContextItemState,
  reason: string,
  score?: number,
  tokenCost?: number,
): ContextItemSnapshot {
  return {...baseItems[key], state, reason, score, tokenCost: tokenCost ?? baseItems[key].tokenCost};
}

export const lifecycleSteps: LifecycleStep[] = [
  {
    id: 'retrieve',
    phase: '1 · Retrieve',
    decision: '401 xảy ra ở đâu?',
    narration: 'Retrieval mở rộng candidate pool. Chưa có nghĩa tất cả candidate sẽ vào Context Window.',
    action: 'Retrieve candidates',
    budget: 8000,
    usedTokens: 600,
    items: [
      item('request', 'pinned', 'Task goal phải tồn tại xuyên suốt.'),
      item('rules', 'pinned', 'Critical repository constraints.'),
      item('auth', 'candidate', 'Semantic/code search match cao.', 0.94),
      item('controller', 'candidate', 'Nằm trên login request path.', 0.82),
      item('log401', 'candidate', 'Fresh evidence từ failure hiện tại.', 0.91),
      item('oldDesign', 'candidate', 'Có liên quan auth nhưng freshness thấp.', 0.58),
      item('payment', 'candidate', 'Search hit nhưng current-decision usefulness thấp.', 0.16),
    ],
    workingState: ['Goal: fix login 401', 'Constraint: preserve repository auth rules'],
    event: {
      tone: 'info',
      title: 'Retrieval ≠ selection',
      detail: '7 items được nhìn thấy, nhưng mới chỉ 2 pinned items đang chiếm Context Window.',
    },
  },
  {
    id: 'select-call-1',
    phase: '2 · Select',
    decision: '401 xảy ra ở đâu?',
    narration: 'Context Manager giữ pinned context, chọn evidence đủ cho quyết định đầu tiên và bỏ noise/stale candidates.',
    action: 'Select for current decision',
    call: 'LLM call #1',
    budget: 8000,
    usedTokens: 3250,
    items: [
      item('request', 'pinned', 'Mandatory task goal.'),
      item('rules', 'pinned', 'Mandatory constraints.'),
      item('auth', 'selected', 'Relevance + priority cao.', 0.94),
      item('controller', 'selected', 'Giúp trace request path.', 0.82),
      item('log401', 'selected', 'Fresh failure evidence.', 0.91),
      item('oldDesign', 'rejected', 'Stale: dễ đưa reasoning về kiến trúc cũ.', 0.58),
      item('payment', 'rejected', 'Low relevance cho current decision.', 0.16),
    ],
    workingState: ['Goal: fix login 401', 'Constraint: preserve repository auth rules'],
    event: {
      tone: 'success',
      title: 'Context is sufficient at 41%',
      detail: 'Budget là ceiling, không phải quota. Không cần lấp đầy 8k tokens trước LLM call #1.',
    },
  },
  {
    id: 'preserve-retrieve',
    phase: '3 · Update state',
    decision: 'JWT bị reject vì sao?',
    narration: 'Sau call #1, decision thay đổi. Context cũ được đánh giá lại: giữ finding quan trọng, evict source không còn cần, rồi retrieve evidence mới.',
    action: 'Preserve → evict → retrieve',
    budget: 8000,
    usedTokens: 4040,
    items: [
      item('request', 'pinned', 'Task goal vẫn áp dụng.'),
      item('rules', 'pinned', 'Constraint vẫn áp dụng.'),
      item('auth', 'preserved', 'Vẫn cần để inspect validator path.'),
      item('controller', 'evicted', 'Request path đã được xác định; raw file không còn cần.'),
      item('log401', 'preserved', 'Observed evidence vẫn hữu ích.'),
      item('jwt', 'selected', 'New current-decision evidence.', 0.97),
      item('decode', 'selected', 'Cho biết issuer/audience/expiry thực tế.', 0.95),
      item('search', 'candidate', 'Useful để mở rộng investigation nếu evidence chưa đủ.', 0.72),
    ],
    workingState: [
      'Goal: fix login 401',
      'Finding: failure occurs inside JWT validation',
      'Open question: config mismatch or token invalid?',
    ],
    event: {
      tone: 'info',
      title: 'Useful does not mean simultaneous',
      detail: 'LoginController từng hữu ích nhưng đã bị evict; finding của nó được preserve trong Working State.',
    },
  },
  {
    id: 'pressure',
    phase: '4 · Budget pressure',
    decision: 'Fix đã đúng chưa?',
    narration: 'Tool/test output mới làm window gần đầy. Context Manager phải phản ứng trước khi thêm context cho verification.',
    action: 'Detect low remaining capacity',
    budget: 8000,
    usedTokens: 7420,
    items: [
      item('request', 'pinned', 'Task goal.'),
      item('rules', 'pinned', 'Critical constraints.'),
      item('auth', 'preserved', 'Still relevant to patch.'),
      item('log401', 'preserved', 'Original failure evidence.'),
      item('jwt', 'selected', 'Root-cause evidence.'),
      item('decode', 'selected', 'Observed mismatch evidence.'),
      item('search', 'selected', 'Large investigation output accumulated.'),
      item('tests', 'selected', 'Fresh but large test output.'),
      item('diff', 'selected', 'Current patch must be verified.'),
    ],
    workingState: [
      'Finding: JWT issuer mismatch confirmed',
      'Decision: normalize issuer before validation',
      'Change: minimal patch applied',
      'Next: verify focused tests + fresh runtime result',
    ],
    event: {
      tone: 'warning',
      title: 'Context Window 93% full',
      detail: 'Chỉ còn 580 tokens. Không đủ chỗ an toàn để thêm fresh verification evidence và model output.',
    },
  },
  {
    id: 'compact',
    phase: '5 · Compact / Evict',
    decision: 'Fix đã đúng chưa?',
    narration: 'Không reset toàn bộ context. Manager giữ state quan trọng, compress investigation history và evict raw evidence đã superseded.',
    action: 'Free capacity deliberately',
    budget: 8000,
    usedTokens: 3900,
    items: [
      item('request', 'pinned', 'Goal remains mandatory.'),
      item('rules', 'pinned', 'Constraints remain mandatory.'),
      item('auth', 'evicted', 'Patch diff giờ là representation mới hơn.'),
      item('log401', 'evicted', 'Original failure captured in structured finding.'),
      item('jwt', 'compressed', 'Key root-cause facts moved into summary.', undefined, 240),
      item('decode', 'compressed', 'Observed issuer mismatch preserved as fact.', undefined, 150),
      item('search', 'evicted', 'Large exploratory output no longer useful.'),
      item('tests', 'compressed', 'Keep only failing/passing assertions relevant to fix.', undefined, 760),
      item('diff', 'preserved', 'Current patch is required for verification.'),
      item('summary', 'selected', 'Compact state replaces several large raw items.'),
    ],
    workingState: [
      'Verified fact: token issuer differs only by trailing slash',
      'Decision: normalize configured issuer',
      'Change: minimal patch applied',
      'Need: fresh focused test + runtime verification',
    ],
    event: {
      tone: 'success',
      title: '3,520 tokens freed',
      detail: 'Capacity giảm từ 93% xuống 49% mà goal, constraints, verified root cause và patch decision vẫn còn.',
    },
  },
  {
    id: 'verify-call-2',
    phase: '6 · Re-assemble',
    decision: 'Fix đã đúng chưa?',
    narration: 'Window được assemble lại cho một quyết định mới. Fresh evidence thay thế history cũ thay vì cộng dồn mọi thứ.',
    action: 'Retrieve fresh evidence → LLM',
    call: 'LLM call #2',
    budget: 8000,
    usedTokens: 4610,
    items: [
      item('request', 'pinned', 'Goal remains mandatory.'),
      item('rules', 'pinned', 'Constraints remain mandatory.'),
      item('summary', 'preserved', 'Compact root cause + decision state.'),
      item('diff', 'preserved', 'Patch under verification.'),
      item('verify', 'selected', 'Fresh focused tests + runtime result.'),
      item('search', 'evicted', 'Exploration no longer needed.'),
      item('log401', 'evicted', 'Superseded by fresh verification.'),
    ],
    workingState: [
      'Root cause: issuer normalization mismatch',
      'Patch: normalize configured issuer',
      'Verification: focused tests pass; login no longer returns 401',
    ],
    event: {
      tone: 'success',
      title: 'Fresh evidence replaces old evidence',
      detail: 'LLM call #2 receives only what is useful for verification, not the full investigation history.',
    },
  },
  {
    id: 'complete',
    phase: '7 · Complete',
    decision: 'Task complete',
    narration: 'Task kết thúc với compact final state. Raw exploratory context đã biến mất nhưng decision trail quan trọng vẫn inspect được.',
    action: 'Persist final state',
    budget: 8000,
    usedTokens: 1740,
    items: [
      item('request', 'preserved', 'Final task record.'),
      item('rules', 'evicted', 'No longer needed after task completion.'),
      item('summary', 'preserved', 'Root cause + decision trail.'),
      item('diff', 'preserved', 'Final change record.'),
      item('verify', 'preserved', 'Fresh proof that fix works.'),
    ],
    workingState: [
      'Completed: login 401 fixed',
      'Root cause: issuer normalization mismatch',
      'Change: minimal issuer normalization patch',
      'Evidence: focused tests + runtime login pass',
    ],
    event: {
      tone: 'success',
      title: 'Task completed without carrying the whole history',
      detail: 'Thông tin hữu ích đã xuất hiện đúng lúc; chỉ important state được giữ xuyên suốt.',
    },
  },
];

export function getUsagePercent(step: LifecycleStep) {
  return Math.min(100, Math.round((step.usedTokens / step.budget) * 100));
}
