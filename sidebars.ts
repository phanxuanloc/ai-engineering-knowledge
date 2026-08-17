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
        'software-engineering/api-communication-fundamentals',
        'software-engineering/database-design-foundations',
        'software-engineering/git-workflows',
        'software-engineering/search-and-ranking-fundamentals',
        'software-engineering/system-design-fundamentals',
      ],
    },
  ],
};

export default sidebars;
