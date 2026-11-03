# cancelled-or-woke
Helps sort out whether or not we like them


Enter the name of a celebrity, band, or TV show. The app runs one web search per
topic, keeps only hits from a list of credible outlets, and asks OpenAI to write a
short summary of what those outlets report. Under each summary it shows the top 3
links, with a control to show every outlet link.

Default topics: Misogyny, Racism, Domestic Violence, Drug Abuse. The page lists
them and lets you add custom searches (a label and search terms). The outlet list
is editable on the page too, one domain per line. Both are saved in the browser
you edit them in, not on the server.

The summaries report what sources say. They are not findings. Read the sources.

## Setup

Google's Custom Search JSON API refuses new projects, so this app uses Serper,
which returns Google results as JSON.

1. Sign up at https://serper.dev and copy your API key.
2. Get an OpenAI API key from https://platform.openai.com/api-keys.
3. Copy `.env.example` to `.env.local`. Fill in `SERPER_API_KEY`, `OPENAI_API_KEY`,
   and `APP_PASSWORD`. The page asks for `APP_PASSWORD` before each search.

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. In Vercel, Add New -> Project, then import `jennomics/cancelled-or-woke`.
2. Leave the framework as Next.js (auto-detected) and the root directory as `./`.
3. Under Environment Variables, add `SERPER_API_KEY`, `OPENAI_API_KEY`, and
   `APP_PASSWORD`, all for Production, then Deploy.
4. Open the deployed URL, enter the password and a test name, and check that all four
   categories return results. If the page shows a Serper error, check the
   key and your remaining Serper credits in the Serper dashboard first.
5. Every search requires `APP_PASSWORD`. There is no rate limit beyond
   that, and every lookup uses one Serper query and one OpenAI call per
   topic, so share the password only with people you intend to.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

## Cost

Each lookup uses one Serper query and one OpenAI call per topic, 4 of each
with the default topics. Serper's free allowance was
reported as 2,500 queries on signup, with no card required; after that,
prepaid credits were reported from $1.00 per 1,000 queries. Verify the
current pricing on serper.dev before paying, as Serper credits were also
reported to expire after 6 months.

OpenAI bills per token. With `gpt-4.1-mini` and ten short snippets per topic, a
lookup costs well under one cent. Verify on platform.openai.com.
