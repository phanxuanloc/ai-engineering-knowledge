// Presentation data synchronized with learning-progress.yaml. Never infer completion here.
export const currentLearning = {
  title: 'Context Engineering',
  href: '/docs/ai-coding/context-engineering',
  status: 'Learning',
  confidence: 3,
  learnedAt: '2026-08-08',
  checkpoints: [
    {title: 'Context fundamentals', state: 'learned' as const},
    {title: 'Context sources', state: 'learned' as const},
    {title: 'Retrieve vs Select', state: 'learned' as const},
    {title: 'Iterative context lifecycle', state: 'learned' as const},
    {title: 'Context compression', state: 'learned' as const},
    {title: 'Context budgeting', state: 'next' as const},
  ],
};

export const knowledgeAreas = [
  {title: 'AI Fundamentals', description: 'Foundations for reasoning about AI systems.', href: '/docs/ai-fundamentals', available: false},
  {title: 'AI Coding', description: 'AI-assisted software development and context.', href: '/docs/ai-coding', available: true},
  {title: 'Coding Agents', description: 'Agentic workflows for software engineering.', href: '/docs/coding-agents', available: false},
  {title: 'AI Agents', description: 'Autonomous loops, tools, state, and coordination.', href: '/docs/ai-agents', available: false},
  {title: 'RAG', description: 'Retrieval-grounded generation systems.', href: '/docs/rag', available: false},
  {title: 'Experiments', description: 'Practical evidence from hands-on learning.', href: '/docs/experiments', available: false},
];

