import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  knowledgeSidebar: [
    {
      type: 'category',
      label: 'AI Fundamentals',
      link: {type: 'doc', id: 'ai-fundamentals/index'},
      items: [
        {
          type: 'category',
          label: 'Evaluation',
          link: {type: 'doc', id: 'ai-fundamentals/evaluation-fundamentals'},
          items: [
            'ai-fundamentals/evaluation-fundamentals',
            'ai-fundamentals/evaluation-methods-and-evaluators',
            'ai-fundamentals/evaluation-dataset-and-test-cases',
            'ai-fundamentals/evaluation-metrics-and-aggregation',
            'ai-fundamentals/evaluation-reliability-and-statistical-confidence',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'AI Coding',
      link: {type: 'doc', id: 'ai-coding/index'},
      items: [
        {
          type: 'category',
          label: 'Context Engineering',
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
      link: {type: 'doc', id: 'software-engineering/index'},
      items: [
        {
          type: 'category',
          label: 'Algorithms & Data Structures',
          link: {
            type: 'generated-index',
            title: 'Algorithms & Data Structures',
            description:
              'Các mental model và kỹ thuật nền tảng để tổ chức, tìm kiếm và xử lý dữ liệu hiệu quả.',
            slug: '/software-engineering/algorithms-and-data-structures',
          },
          items: ['software-engineering/search-and-ranking-fundamentals'],
        },
        {
          type: 'category',
          label: 'API & Integration',
          link: {
            type: 'generated-index',
            title: 'API & Integration',
            description:
              'Cách các client và services giao tiếp qua những communication boundary khác nhau.',
            slug: '/software-engineering/api-and-integration',
          },
          items: ['software-engineering/api-communication-fundamentals'],
        },
        {
          type: 'category',
          label: 'Databases',
          link: {
            type: 'generated-index',
            title: 'Databases',
            description:
              'Data modeling, indexing, transactions và các cơ chế giữ correctness cho persistent state.',
            slug: '/software-engineering/databases',
          },
          items: ['software-engineering/database-design-foundations'],
        },
        {
          type: 'category',
          label: 'System Design',
          link: {
            type: 'generated-index',
            title: 'System Design',
            description:
              'Learning path từ fundamentals tới các design chuyên sâu đã được checkpoint.',
            slug: '/software-engineering/system-design',
          },
          items: [
            'software-engineering/system-design-fundamentals',
            'software-engineering/url-shortener-system-design',
            'software-engineering/distributed-rate-limiter-system-design',
            'software-engineering/notification-system-design',
            'software-engineering/chat-system-design',
          ],
        },
        {
          type: 'category',
          label: 'Development Workflows',
          link: {
            type: 'generated-index',
            title: 'Development Workflows',
            description:
              'Các workflow giúp team tích hợp, kiểm thử và release software an toàn.',
            slug: '/software-engineering/development-workflows',
          },
          items: ['software-engineering/git-workflows'],
        },
      ],
    },
  ],
};

export default sidebars;
