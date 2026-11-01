# cancelled-or-woke
Helps sort out whether or not we like them 


Enter the name of a celebrity, band, or TV show. The app runs one Google web search per category and lists the raw hits.

Categories: Misogyny, Racism, Domestic Violence, Drug Abuse.

The output is search results, not findings. A hit does not mean the subject did anything. Read the sources.

## Setup

1. Create a Google API key with the Custom Search API enabled.
2. Create a Programmable Search Engine set to search the entire web and copy its ID.
3. Copy `.env.example` to `.env.local` and fill in both values.

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run typecheck
npm run build
```

## Cost

Google allows 100 free queries per day. Each lookup uses 4 queries, one per category. Beyond the free tier Google charges $5 per 1,000 queries.
