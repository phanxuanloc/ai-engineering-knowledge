import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  knowledgeSidebar: [
    {
      type: 'category',
      label: 'AI Fundamentals',
      link: {type: 'doc', id: 'ai-fundamentals/index'},
      items: ['ai-fundamentals/evaluation-fundamentals'],
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
  ],
};

export default sidebars;
