# cancelled-or-woke
Helps sort out whether or not we like them


Enter the name of a celebrity, band, or TV show. The app runs one web search per category and lists the raw hits.

Categories: Misogyny, Racism, Domestic Violence, Drug Abuse.

The output is search results, not findings. A hit does not mean the subject did anything. Read the sources.

## Setup

1. In Google Cloud, enable the Custom Search API on your project and create an API key.
2. Create a Programmable Search Engine at https://programmablesearchengine.google.com with "Search the entire web" turned on. Copy its ID.
3. Copy `.env.example` to `.env.local`. Fill in `GOOGLE_SEARCH_API_KEY`, `GOOGLE_SEARCH_ENGINE_ID`, and `APP_PASSWORD`.
   The page asks for `APP_PASSWORD` before each search.

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. In Vercel, Add New -> Project, then import `jennomics/cancelled-or-woke`.
2. Leave the framework as Next.js (auto-detected) and the root directory as `./`.
3. Under Environment Variables, add `GOOGLE_SEARCH_API_KEY`, `GOOGLE_SEARCH_ENGINE_ID`,
   and `APP_PASSWORD`, all for Production, then Deploy.
4. Open the deployed URL, enter the password and a test name, and check that all four
   categories return results.
5. Every search requires `APP_PASSWORD`. There is no rate limit beyond
   that, and every lookup uses 4 Google queries, so share the password
   only with people you intend to.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

## Cost

Each lookup uses 4 queries, one per category. Google allows 100 free queries
per day per project, then charges $5 per 1,000. Confirm current pricing on
Google's Custom Search JSON API page.
