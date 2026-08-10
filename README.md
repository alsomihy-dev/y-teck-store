<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/55cab9de-f8ef-4071-b633-49916ce62474

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Database Integration Setup

We have integrated Supabase to handle Y-Teck's database (laptops, orders). If you run the app without setting it up, it will gracefully fall back to `localStorage` and static initial data, so the app will never crash!

To connect to your cloud Supabase database:

1. **Create a Supabase Project:**
   Go to [Supabase](https://supabase.com) and create a new project.

2. **Run the Database Schema:**
   Open the **SQL Editor** in your Supabase dashboard, paste the contents of [supabase_schema.sql](file:///c:/Users/UNITED/Desktop/y.tech/supabase_schema.sql), and run it. This will create the `laptops` and `orders` tables and setup RLS rules.

3. **Configure Environment Variables:**
   Open the [.env](file:///c:/Users/UNITED/Desktop/y.tech/.env) file in the root of your project and replace the placeholders with your actual API credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   You can find these in your Supabase Project Settings under **API**.

4. **Migrate existing laptops to Supabase:**
   Run the migration script to upload the current website products automatically:
   `npm run db:seed`
