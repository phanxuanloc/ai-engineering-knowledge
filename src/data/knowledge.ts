export type KnowledgeArea = {
  title: string;
  description: string;
  href: string;
  accent: string;
  articleCount: number;
  paths: string[];
};

export const knowledgeStats = [
  {value: '22', label: 'indexed notes'},
  {value: '8', label: 'broad topics'},
  {value: '3', label: 'knowledge domains'},
];

export const knowledgeAreas: KnowledgeArea[] = [
  {
    title: 'AI Fundamentals',
    description: 'Định nghĩa quality, thiết kế evaluation và đưa AI systems qua production gates đáng tin cậy.',
    href: '/docs/ai-fundamentals',
    accent: '01',
    articleCount: 6,
    paths: ['Evaluation', 'Metrics & Aggregation', 'Reliability', 'Production Gates'],
  },
  {
    title: 'AI Coding',
    description: 'Thiết kế context để LLM và coding agents nhận đúng information cho từng decision.',
    href: '/docs/ai-coding',
    accent: '02',
    articleCount: 2,
    paths: ['Context Engineering', 'Optimization', 'Operations', 'Practical Context Manager'],
  },
  {
    title: 'Software Engineering',
    description: 'Nền tảng code design, data, API và distributed systems để xây AI-powered software vững chắc.',
    href: '/docs/software-engineering',
    accent: '03',
    articleCount: 14,
    paths: ['Programming & Code Design', 'System Design', 'API & Data', 'Development Workflows'],
  },
];

export const featuredPaths = [
  {
    eyebrow: 'AI Fundamentals',
    title: 'Evaluation',
    description: 'Từ success criteria và test cases tới metrics, statistical confidence và production gates.',
    href: '/docs/ai-fundamentals/evaluation-fundamentals',
    meta: '6 notes · Foundations → Production',
  },
  {
    eyebrow: 'AI Coding',
    title: 'Context Engineering',
    description: 'Chọn, tổ chức, tối ưu và vận hành context cho LLM hoặc AI agent theo một lifecycle rõ ràng.',
    href: '/docs/ai-coding/context-engineering-map',
    meta: '5 notes · Map → Experiment',
  },
  {
    eyebrow: 'Software Engineering',
    title: 'System Design',
    description: 'Đi từ design fundamentals tới URL shortener, rate limiter, notification và chat systems.',
    href: '/docs/software-engineering/system-design',
    meta: '5 notes · Fundamentals → Case studies',
  },
];

export const latestKnowledge = [
  {
    title: 'Programming & Code Design',
    description: 'Coupling, cohesion, abstraction, encapsulation, SOLID lenses và composition.',
    href: '/docs/software-engineering/programming-and-code-design',
    date: '18.08.2026',
  },
  {
    title: 'Evaluation: Reliability & Statistical Confidence',
    description: 'Đọc kết quả eval đúng mức certainty và practical significance.',
    href: '/docs/ai-fundamentals/evaluation-reliability-and-statistical-confidence',
    date: '16.08.2026',
  },
  {
    title: 'Context Engineering',
    description: 'Bản đồ end-to-end cho context lifecycle, optimization, operations và experiment.',
    href: '/docs/ai-coding/context-engineering-map',
    date: '13.08.2026',
  },
];
