# Setup Guide

## Workspace Requirements
*   **Node.js**: v18 or higher.
*   **npm** or **pnpm**.
*   **Git**: For version control.

## Initializing the E-Learning Platform (`slides-app`)

*Note: The `slides-app` directory is currently a placeholder for the implementation. Follow these steps to initialize it.*

### 1. Create Next.js App
Run the following command in the root of `FPvsOOP`:

```bash
npx create-next-app@latest slides-app --typescript --tailwind --eslint
```

### 2. Install Dependencies
Navigate to the new directory and install core libraries:

```bash
cd slides-app
npm install @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge
```

### 3. Environment Setup
Create a `.env.local` file in `slides-app/` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup
1.  Go to your Supabase Dashboard.
2.  Open the SQL Editor.
3.  Copy the content from `elearning_nextjs_supabase.md` (Schema section) or `docs/slides-app-spec.md`.
4.  Run the SQL to create the tables.

### 5. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Running Prototypes
To view the static prototypes in `stitch_course_catalog_listing`:

1.  Open the HTML files directly in your browser (e.g., `stitch_course_catalog_listing/course_catalog_listing/code.html`).
2.  Or use a simple HTTP server:
    ```bash
    npx serve stitch_course_catalog_listing
    ```
