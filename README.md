# ILET - University Exam Question Repository

ILET is a fast, scalable, and clean university-focused web platform where students can upload and search exam questions.

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, TailwindCSS 4.x
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI**: shadcn/ui components, Lucide icons
- **State**: React Server Components + URL state

## Getting Started

1.  **Clone the repository** (if not already done).

2.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
    ```bash
    cp .env.example .env.local
    ```
    Required variables:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: UI components organized by scope (ui, features, layout).
- `src/lib`: Utilities, Supabase clients, and logic.
- `src/styles`: Global styles and Tailwind configuration.
- `src/types`: TypeScript definitions (Database, etc).

## Database

The project uses Supabase. Refer to `database_schema` in the documentation for the schema definition.
Local development types are in `src/types/database.ts`.

## Contributing

- Follow the clean code principles.
- Use `npm run lint` before committing.
- Ensure all new components are responsive and accessible.
