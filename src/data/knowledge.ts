export const featuredArticle = {
  title: 'Context Engineering',
  description:
    'Hiểu cách lựa chọn, tổ chức và duy trì thông tin để LLM hoặc AI agent đưa ra quyết định tốt hơn.',
  href: '/docs/ai-coding/context-engineering-map',
  category: 'AI Coding',
};

export const knowledgeAreas = [
  {title: 'AI Fundamentals', description: 'Nền tảng để hiểu cách AI systems biểu diễn, suy luận và tạo đầu ra.', published: false},
  {title: 'AI Coding', description: 'Kỹ thuật sử dụng AI hiệu quả trong software development workflows.', href: '/docs/ai-coding', published: true},
  {title: 'Coding Agents', description: 'Agentic workflows dành cho khám phá, thay đổi và kiểm chứng software.', published: false},
  {title: 'AI Agents', description: 'Vòng lặp tự chủ kết hợp reasoning, tools, state và coordination.', published: false},
  {title: 'RAG', description: 'Ground model output bằng knowledge được retrieve từ nguồn bên ngoài.', published: false},
  {title: 'Experiments', description: 'Kiểm chứng thực tế các mental model và kỹ thuật AI Engineering.', published: false},
];

export const contextPath = [
  {number: '01', title: 'Bản đồ kiến thức', href: featuredArticle.href},
  {number: '02', title: 'Foundations & Lifecycle', href: '/docs/ai-coding/context-engineering'},
  {number: '03', title: 'Context Optimization', href: '/docs/ai-coding/context-optimization'},
  {number: '04', title: 'Context Operations', href: '/docs/ai-coding/context-operations'},
  {number: '05', title: 'Practical Context Manager', href: '/docs/ai-coding/practical-context-manager'},
];
