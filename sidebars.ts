import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  knowledgeSidebar: [
    {
      type: 'category',
      label: 'AI Fundamentals',
      collapsible: false,
      link: {type: 'doc', id: 'ai-fundamentals/index'},
      items: [
        {
          type: 'category',
          label: 'Evaluation',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'ai-fundamentals/evaluation'},
          items: [
            'ai-fundamentals/evaluation-fundamentals',
            'ai-fundamentals/evaluation-methods-and-evaluators',
            'ai-fundamentals/evaluation-dataset-and-test-cases',
            'ai-fundamentals/evaluation-metrics-and-aggregation',
            'ai-fundamentals/evaluation-reliability-and-statistical-confidence',
            'ai-fundamentals/evaluation-regression-gates-and-production-workflow',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'AI Coding',
      collapsible: false,
      link: {type: 'doc', id: 'ai-coding/index'},
      items: [
        {
          type: 'category',
          label: 'Context Engineering',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'ai-coding/context-engineering-map'},
          items: [
            'ai-coding/context-engineering',
            'ai-coding/context-optimization',
            'ai-coding/context-operations',
            'ai-coding/practical-context-manager',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Software Engineering',
      collapsible: false,
      link: {type: 'doc', id: 'software-engineering/index'},
      items: [
        {
          type: 'category',
          label: 'Programming & Code Design',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'software-engineering/programming-and-code-design'},
          items: [
            'software-engineering/coupling-and-cohesion',
            'software-engineering/abstraction-and-encapsulation',
            'software-engineering/solid-design-lenses',
            'software-engineering/composition-vs-inheritance',
          ],
        },
        {
          type: 'category',
          label: 'Algorithms & Data Structures',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'software-engineering/algorithms-and-data-structures'},
          items: [
            'software-engineering/search-and-ranking-fundamentals',
            'software-engineering/hashing-and-hash-table-fundamentals',
            'software-engineering/stack-and-queue-fundamentals',
            'software-engineering/trees-graphs-and-traversal-fundamentals',
          ],
        },
        {
          type: 'category', label: 'Databases', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/databases'},
          items: ['software-engineering/database-design-foundations'],
        },
        {
          type: 'category', label: 'Networking & Web Fundamentals', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/networking-and-web-fundamentals'},
          items: ['software-engineering/network-addressing-and-routing','software-engineering/transport-tls-and-http','software-engineering/proxies-load-balancing-and-client-ip','software-engineering/cors-caching-and-cdn'],
        },
        {
          type: 'category', label: 'API & Integration', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/api-and-integration'},
          items: ['software-engineering/api-communication-fundamentals'],
        },
        {
          type: 'category',
          label: 'Testing & Quality Engineering',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'software-engineering/testing-and-quality-engineering'},
          items: [
            'software-engineering/testing-fundamentals',
            'software-engineering/test-doubles-and-mocking',
          ],
        },
        {
          type: 'category', label: 'Security Engineering', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/security-engineering'},
          items: ['software-engineering/threat-modeling-and-attack-surface','software-engineering/secrets-and-credential-security'],
        },
        {
          type: 'category', label: 'System Design', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/system-design'},
          items: [
            'software-engineering/system-design-fundamentals',
            'software-engineering/url-shortener-system-design',
            'software-engineering/distributed-rate-limiter-system-design',
            'software-engineering/notification-system-design',
            'software-engineering/chat-system-design',
            'software-engineering/feed-timeline-system-design',
            'software-engineering/distributed-cache-design',
          ],
        },
        {
          type: 'category', label: 'Development Workflows', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/development-workflows'},
          items: ['software-engineering/git-workflows','software-engineering/git-history-and-change-integration','software-engineering/release-safety-and-traceability'],
        },
        {type: 'category', label: 'DevOps, Cloud & Infrastructure', collapsible: true, collapsed: true, link: {type: 'doc', id: 'software-engineering/devops-cloud-and-infrastructure'}, items: []},
        {
          type: 'category',
          label: 'Observability & Reliability',
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'software-engineering/observability-and-reliability'},
          items: ['software-engineering/observability-and-reliability-fundamentals'],
        },
        {
          type: 'category', label: 'Operating Systems & Concurrency', collapsible: true, collapsed: true,
          link: {type: 'doc', id: 'software-engineering/operating-systems-and-concurrency'},
          items: ['software-engineering/process-thread-and-concurrency','software-engineering/synchronization-and-deadlocks','software-engineering/async-io-and-event-loop','software-engineering/memory-management','software-engineering/cpu-scheduling-and-context-switching'],
        },
      ],
    },
  ],
};

export default sidebars;
