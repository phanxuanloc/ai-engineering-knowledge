---
title: Context Engineering
description: Cách chọn, truy xuất, tổ chức và duy trì thông tin phù hợp để LLM hoặc AI agent thực hiện một task.
tags: [context-engineering, context-window, ai-agent]
sidebar_position: 2
---

# Context Engineering

## TL;DR

`Context Engineering` là việc thiết kế và quản lý thông tin mà một LLM hoặc AI agent có tại thời điểm cần ra quyết định hay thực hiện task. Mục tiêu không phải đưa vào nhiều thông tin nhất, mà là xây dựng context liên quan nhất với task hiện tại: **Relevant context > More context**.

## Mental Model

- **Context Window = cái bàn:** sức chứa tối đa của một lần gọi model.
- **Context = thông tin đang được đặt trên bàn.**
- **Context Engineering = quyết định nên đặt gì lên bàn.**

Một chiếc bàn lớn hơn không tự quyết định được tài liệu nào cần thiết. Tương tự, Context Window lớn không loại bỏ nhu cầu chọn lọc context.

```text
Everything we know
        ↓
Select / Retrieve / Filter / Compress
        ↓
Best Context → Context Window → LLM → Decision / Action
```

## Core Concepts

### Context Engineering và Prompt Engineering

`Prompt Engineering` chủ yếu trả lời: **Nên hỏi hoặc chỉ dẫn model như thế nào?**

`Context Engineering` trả lời câu hỏi rộng hơn: **Model cần biết gì khi thực hiện task này?** Vì vậy context không chỉ có user prompt, mà có thể gồm:

- System instructions và user request.
- Conversation history và memory.
- Retrieved knowledge và kết quả RAG.
- Source code, files và project rules.
- Tool definitions và tool results.
- Trạng thái hiện tại của environment hoặc application.

Prompt là một phần của context; viết prompt tốt không thay thế việc cung cấp đúng thông tin.

### Context và Context Window

- **Context:** thông tin thực tế được cung cấp cho model.
- **Context Window:** lượng thông tin tối đa model có thể xử lý trong một lần invocation, thường được đo bằng token.
- **Context Engineering:** quyết định thông tin nào nên chiếm capacity đó.

Nhiều context hơn không tự động tốt hơn. Thông tin không liên quan tạo noise, tốn token và khiến model khó tập trung vào tín hiệu quan trọng. Chẳng hạn, 20K token gồm đúng source files, error logs, tests và instructions có thể hữu ích hơn hàng trăm nghìn token chứa toàn bộ repository.

### Context động trong AI agent

AI agent thường tự xây dựng context theo từng bước. Nó có thể dùng kết quả của search, file đã đọc, test và tool call trước đó để quyết định thông tin nào cần đưa vào lần gọi model tiếp theo. Vì vậy, context construction là một phần cốt lõi trong behavior của agent, không chỉ là dữ liệu đầu vào tĩnh do user cung cấp.

### Tách Context Manager khỏi Model Adapter

Khi thiết kế custom AI agent, có thể tách hai trách nhiệm:

```text
Agent
├── Context Manager / Context Builder
│   ├── Instructions
│   ├── Memory
│   ├── Retrieval / RAG
│   ├── Code retrieval
│   ├── Tool results
│   └── Current state
├── Model Adapter
│   ├── OpenAI
│   ├── Anthropic
│   └── Gemini
└── Tools
```

`Context Manager` quyết định thông tin nào liên quan với task hiện tại. `Model Adapter` xử lý khác biệt trong API của từng provider. Các model và coding agent như ChatGPT, Claude, Gemini, Codex-style agents, Claude Code hoặc Cursor có thể expose và assemble context khác nhau, nhưng vẫn giải cùng một bài toán: model cần biết gì tại thời điểm này?

## Example

Với task `Fix authentication bug`, một coding agent có thể:

1. Hiểu yêu cầu.
2. Search codebase thay vì đọc toàn bộ repository.
3. Xác định các file liên quan như `AuthService` và `JwtFilter`.
4. Đọc những file đó.
5. Chạy tests.
6. Thu thập error logs và tool output.
7. Kết hợp instructions, relevant code và test evidence thành context.
8. Đưa context này cho LLM để quyết định hành động tiếp theo.

Agent đang liên tục retrieve, filter và cập nhật context. Chất lượng quyết định phụ thuộc vào việc agent tìm được đúng tín hiệu, không chỉ vào kích thước Context Window.

## When to Use

- Khi xây AI agent cần kết hợp instructions, memory, Retrieval/RAG, tools và application state.
- Khi một task có nhiều nguồn thông tin nhưng chỉ một phần liên quan đến quyết định hiện tại.
- Khi cần giảm token cost, noise hoặc thông tin cũ trong conversation dài.
- Khi hỗ trợ nhiều model provider và muốn giữ logic xây dựng context độc lập với API integration.

## Common Mistakes

- **Đồng nhất Context với Context Window:** Một bên là thông tin thực tế, bên kia là capacity tối đa.
- **Cho rằng nhiều context luôn tốt hơn:** Context không liên quan có thể làm loãng tín hiệu quan trọng và tiêu tốn token.
- **Đưa toàn bộ repository cho coding agent:** Search và chọn đúng files, tests, logs thường hiệu quả hơn nhồi mọi thứ vào Context Window.
- **Chỉ tối ưu user prompt:** Prompt tốt vẫn thiếu hiệu quả nếu model không có source, state hoặc tool result cần thiết.
- **Trộn context construction với provider integration:** Thiết kế này làm logic retrieval và filtering khó tái sử dụng khi đổi model provider.

## My Understanding

Context Engineering rộng hơn việc viết prompt tốt.

Đây là bài toán engineering về chọn, truy xuất, tổ chức và duy trì thông tin mà LLM cần đúng tại thời điểm thực hiện một task. Model có Context Window rất lớn không có nghĩa application nên đưa mọi thứ vào; một AI system hoặc agent tốt cần xây dựng context chất lượng cao, liên quan với task một cách linh hoạt.

## My Experiment

Chưa thực hiện experiment trong learning session này.

## Related Knowledge

Chưa có learning note liên quan trong knowledge base. Khi có canonical note về `RAG`, `Memory` hoặc `Coding Agent`, cần bổ sung liên kết hai chiều thay vì lặp lại nội dung tại đây.

## Self-test

1. Context Engineering là gì?
2. Context khác Context Window như thế nào?
3. Prompt Engineering khác Context Engineering như thế nào?
4. Vì sao Context Window lớn hơn không thay thế Context Engineering?
5. Vì sao quá nhiều context có thể làm giảm hiệu quả của model?
6. Coding agent xây dựng context động như thế nào?
7. Vì sao custom agent nên tách Context Manager khỏi Model Adapter?

<details>
<summary>Answers</summary>

1. Là việc thiết kế và quản lý thông tin mà LLM hoặc AI agent cần tại thời điểm ra quyết định hay thực hiện task.
2. Context là thông tin thực tế được cung cấp; Context Window là capacity tối đa cho thông tin đó trong một model invocation.
3. Prompt Engineering tập trung vào cách hỏi hoặc chỉ dẫn; Context Engineering tập trung vào toàn bộ những gì model cần biết, trong đó prompt chỉ là một phần.
4. Capacity lớn hơn không tự chọn được thông tin liên quan và không loại bỏ noise.
5. Thông tin không liên quan tiêu tốn token, tạo noise và làm model khó tập trung vào tín hiệu quan trọng.
6. Agent search, retrieve, đọc relevant files, chạy tools/tests, rồi filter và kết hợp kết quả cho lần quyết định tiếp theo.
7. Việc tách trách nhiệm giúp logic chọn context độc lập với khác biệt API và có thể tái sử dụng khi đổi model provider.

</details>
