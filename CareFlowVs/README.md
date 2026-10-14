# CareFlow — Hospital Workflow Prototype

A front-end MVP starter for a hospital workflow web application. It includes a responsive dashboard, role-based demo views, patient list, workflow queue, staff profiles, pharmacy, billing, analytics, and an admin staff-import screen.

## Run locally

1. Install **Node.js LTS** from https://nodejs.org/
2. Extract this folder and open it in VS Code.
3. In VS Code, open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL Vite prints (usually `http://localhost:5173`).

## What's implemented

- Responsive sidebar and top bar
- Demo role switcher: Admin, Reception, Nurse, Doctor, Pharmacist
- Dashboard metrics and charts using fictional data
- Patient directory with search
- Workflow queue with status changes
- Staff directory and CSV import preview
- Pharmacy and billing prototype screens
- Profile card and notifications
- Supabase client setup placeholder

## Important prototype limitations

- This is a **front-end demo**, not a production-ready medical system.
- The role switcher is for preview only. It is not real authentication or authorization.
- Data is stored in browser memory and resets on refresh.
- Supabase is not connected until you configure `.env.local` and implement the schema, sign-in, and server/database permissions.
- Do not enter real patient information or upload real medical records.
- AI predictions are intentionally not presented as clinical advice. Add AI only after governance, validation, privacy, and clinical review.
- Before real-world use, implement and test Supabase Row Level Security (RLS), audit logs, secure account provisioning, backups, consent and retention policies, and applicable Nigerian data-protection/healthcare requirements.

## Connect Supabase next

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Never put a Supabase `service_role` key in frontend code.
5. Create tables and RLS policies before enabling real records.

The current app has a `src/lib/supabase.js` client helper ready for the public anon key. It does not yet write data to Supabase.
