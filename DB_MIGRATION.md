# Database Migration - Applications Table

## Purpose
Creates the `applications` table for the Admin/Moderator hiring flow.

## Instructions

### Option 1: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy the contents of `scripts/create_applications_table.sql`
5. Paste into the SQL Editor and click **Run**

### Option 2: CLI
```bash
psql $SUPABASE_DB_URL -f scripts/create_applications_table.sql
```

## What This Creates

### Table: `public.applications`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | VARCHAR(200) | Applicant's full name |
| address | TEXT | Current address |
| whatsapp | VARCHAR(30) | WhatsApp number |
| university | VARCHAR(200) | University name |
| department | VARCHAR(200) | Department |
| session | VARCHAR(50) | Academic session |
| id_card_url | TEXT | URL to uploaded ID card |
| status | VARCHAR(20) | pending/approved/rejected |
| created_at | TIMESTAMPTZ | Submission timestamp |
| updated_at | TIMESTAMPTZ | Last update |

### Storage Bucket: `id-cards`
- Public read access
- Authenticated upload access
- Max file size: 10MB
- Allowed types: JPEG, PNG, WebP, PDF

### RLS Policies
- Anyone can submit applications
- Only admins can view/update applications
