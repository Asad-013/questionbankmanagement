# Profile & Notifications Fix

## Issues Fixed

### 1. Backend Error When Saving Profile
The `users` table was missing the columns that the profile form tries to save:
- `full_name`
- `phone_number`
- `bio`
- `avatar_url`

**Solution**: A migration SQL script was created at `scripts/add-profile-columns.sql`.

### 2. Navbar Disappearing on Profile/Notifications Pages
The `/profile` and `/notifications` routes were at the root `app/` level, outside the `(main)` layout group that renders the `<Navbar />` component. This caused the navbar to disappear when navigating to these pages.

**Solution**: Moved both pages under `src/app/(main)/` so they inherit the shared layout with navbar and footer.

---

## How to Apply the Database Migration

Run the following SQL in your **Supabase Dashboard → SQL Editor**:

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

Or simply run the migration file:
```
scripts/add-profile-columns.sql
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/lib/supabase/schema.sql` | Added `full_name`, `phone_number`, `bio`, `avatar_url` columns to users table definition |
| `scripts/add-profile-columns.sql` | **New** - Migration script for existing databases |
| `src/app/(main)/profile/page.tsx` | **New** - Profile page moved under `(main)` layout with improved header |
| `src/app/(main)/notifications/page.tsx` | **New** - Notifications page moved under `(main)` layout with improved design |
| `src/components/features/profile/ProfileForm.tsx` | Redesigned form UI with better layout, avatar preview, icons, rounded inputs |
| `src/app/profile/` | **Deleted** - Old location |
| `src/app/notifications/` | **Deleted** - Old location |

---

## UI Improvements

### Profile Page
- Added a gradient header card showing avatar, name, email, and role badge
- Form fields arranged in a 2-column responsive grid
- Added live avatar preview next to the URL input
- Icons next to each field label
- Rounded-xl inputs with better spacing
- Save button aligned to the right with an icon

### Notifications Page
- Added a gradient header with Bell icon and update count badge
- Each notification card has a colored icon (green check / red X)
- Better typography hierarchy and spacing
- Improved empty state with illustration
- Timestamp with clock icon
- Smoother card hover effects
