export const featuredArticle = {
  title: 'Context Engineering',
  description:
    'Hiểu cách lựa chọn, tổ chức và duy trì thông tin để LLM hoặc AI agent đưa ra quyết định tốt hơn.',
  href: '/docs/ai-coding/context-engineering',
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
  {number: '01', title: 'Fundamentals', href: `${featuredArticle.href}#mental-model`},
  {number: '02', title: 'Context vs Context Window', href: `${featuredArticle.href}#context-và-context-window`},
  {number: '03', title: 'Retrieve vs Select', href: `${featuredArticle.href}#context-lifecycle--retrieve-vs-select`},
  {number: '04', title: 'Context Compression', href: `${featuredArticle.href}#context-compression`},
  {number: '05', title: 'Context Management', href: `${featuredArticle.href}#tách-context-manager-khỏi-model-adapter`},
];

