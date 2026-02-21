# CÁC CHỦ ĐỀ ĐÀO TẠO E-LEARNING (Fullstack & AI)

Dưới đây là tài liệu tổng hợp những chủ đề hot nhất và thực tiễn nhất dành cho Team Fullstack Developers (tham chiếu từ Stack Node.js, Next.js, AI Integration):

## 1. Tích hợp AI vào Ứng dụng (AI Integration)
- **Làm chủ LLM APIs:** Cách kết nối và prompt kỹ thuật với OpenAPI (ChatGPT), Anthropic (Claude), Gemini, hoặc DeepSeek. Xử lý Streaming response (Server-Sent Events) trên Frontend.
- **Xây dựng ứng dụng RAG (Retrieval-Augmented Generation):**
  - Cách vector hoá dữ liệu chuyên ngành với Embedding Models.
  - Sử dụng Vector Database: Pinecone, Qdrant, hoặc pgvector (trên PostgreSQL/Supabase).
- **Framework AI:** Nhập môn LangChain (Python/JS) hoặc LlamaIndex để xâu chuỗi flow xử lý của AI.
- **AI Agents Cơ Bản:** Cách tạo một AI Agent tự động dùng các Tool/Function Calling bằng LangGraph.
- **Self-hosted AI (Local):** Sử dụng Ollama để chạy các open-source AI models nội bộ mà không lo rò rỉ dữ liệu.

## 2. Công cụ Trợ lý Lập trình AI (AI Tooling)
- **IDE Mới:** Cách sử dụng Cursor IDE hoặc Windsurf (AI-first Code Editors) để tự động hóa: refactor code, viết unit test, giải thích codebase.
- **Prompt Engineering cho Developer:** Kỹ thuật viết prompt để AI sinh code chuẩn kiến trúc (Microservices, DDD).
- **AI Code Reviewer:** Tích hợp AI vào GitHub Actions/GitLab CI để tự động review Pull Requests phát hiện lỗi bảo mật và code smell.

## 3. Fullstack Architecture & Scale (Backend)
- **Event-Driven Architecture:** Giao tiếp giữa các server phi đồng bộ bằng Message Queues (RabbitMQ, Kafka) hoặc Pub/Sub (Redis).
- **Chiến thuật Caching:** Tối ưu hiệu năng với Memory Cache (Redis) và Caching phía Edge (CDN, Cloudflare).
- **Serverless & Edge Computing:** Triển khai API siêu nhẹ, auto-scale vô hạn với Vercel Functions, Cloudflare Workers.
- **Database Mastery:** Tối ưu hóa truy vấn SQL, đánh Index, Partitioning, và sử dụng Connection Pooling (PgBouncer) khi query lượng lớn.

## 4. Frontend Tiên Tiến (Modern Next.js & React)
- **React Server Components (RSC):** Hiểu sâu về luồng render của Next.js App Router (khi nào dùng "use client", khi nào dùng Server Component).
- **State Management Hiện Đại:** Quản lý state nhẹ nhàng với Zustand hoặc Jotai thay vì Redux cồng kềnh. Quản lý Data fetching với React Query / SWR.
- **Micro-frontends:** Cách chia một app frontend khổng lồ thành nhiều project nhỏ chạy độc lập (sử dụng Webpack Module Federation).
- **Web Performance Optimization:** Phân tích bundle size, Core Web Vitals, Lazy loading components/images.

## 5. DevOps, Testing & Observability
- **Docker Thực chiến:** Đóng gói app Node.js/Python thành container tối ưu (Multi-stage build) để chạy mọi nơi không lỗi.
- **CI/CD Cơ bản:** Xây dựng pipeline với GitHub Actions. Tự động chạy test (Playwright/Jest), lint code và deploy khi merge nhánh.
- **Observability (Giám sát ứng dụng):**
  - Bắt lỗi và crash real-time với Sentry.
  - Quản lý Logs tập trung và đo lường uptime (Prometheus/Grafana).

## 6. Xây Dựng AI Agents & Workflows (Antigravity)
*Dành riêng cho việc tinh chỉnh và tối ưu trải nghiệm AI nội bộ với Antigravity (Gemini Code Assist).*

- **Nguyên lý của Antigravity Agent:** Hiểu về kiến trúc Agent-based, vòng lặp OODA (Observe, Orient, Decide, Act) mà Antigravity sử dụng để tự động phân tích codebase và thực thi task.
- **Phát triển System Skills (Kỹ năng hệ thống):**
  - Cách tạo các cấu trúc thư mục `{.agent}/workflows/` hoặc `{.agent}/skills/` chứa file YAML/Markdown.
  - Viết hướng dẫn (Instructions) chi tiết, định nghĩa ranh giới (Boundaries), và cung cấp Context (file path, project structure) cho AI.
- **Viết Custom Workflows (Quy trình tự động hóa):**
  - Xây dựng workflow tạo Boilerplate chuẩn công ty (tự động setup Next.js, cấu hình linter, Tailwind).
  - Workflow Deploy tự động: Xây dựng instruction bắt AI tự động build, test và đẩy lệnh Docker/Vercel.
  - Sử dụng Annotation `// turbo` hoặc `// turbo-all` để cấp quyền chạy lệnh bash script liên tục không cần chờ review.
- **Usecase Cụ thể cho Developer:**
  - **Tự động viết Unit Test:** Skill tự động phân tích coverage và xin quyền chạy lệnh test (VD: `jest --coverage`).
  - **Code Review & Refactoring:** Workflow phân tích Pull Request, tìm ra code "bốc mùi" (code smell) và đề xuất Clean Code.
  - **Dịch Thuật và Document (i18n):** Workflow scan các file JSON ngôn ngữ, format lại UI và cập nhật markdown documentation tự động.
