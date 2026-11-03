/** Domains whose links count as credible sources. Subdomains match. */
export const DEFAULT_OUTLETS: readonly string[] = [
  "apnews.com",
  "reuters.com",
  "bbc.com",
  "bbc.co.uk",
  "nytimes.com",
  "washingtonpost.com",
  "wsj.com",
  "theguardian.com",
  "latimes.com",
  "npr.org",
  "cnn.com",
  "nbcnews.com",
  "abcnews.go.com",
  "cbsnews.com",
  "pbs.org",
  "bloomberg.com",
  "usatoday.com",
  "time.com",
  "theatlantic.com",
  "newyorker.com",
  "propublica.org",
  "variety.com",
  "hollywoodreporter.com",
  "deadline.com",
  "rollingstone.com",
  "billboard.com",
  "justice.gov",
  "courtlistener.com",
  "wikipedia.org",
];

export const MAX_OUTLETS = 200;

const DOMAIN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})+$/;

/** Validates a user-supplied domain list. Lower-cases and drops duplicates. Throws on a bad domain. */
export function normalizeOutlets(input: unknown): string[] {
  if (!Array.isArray(input) || input.length > MAX_OUTLETS) {
    throw new Error(`Outlets must be a list of at most ${MAX_OUTLETS} domains`);
  }
  const domains = input.map((d) => (typeof d === "string" ? d.trim().toLowerCase() : ""));
  for (const d of domains) {
    if (!DOMAIN.test(d)) throw new Error(`Outlet "${d}" is not a domain name like example.com`);
  }
  return [...new Set(domains)];
}

export function hostnameOf(link: string): string | null {
  try {
    return new URL(link).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** True when the link's host is one of the outlets or a subdomain of one. */
export function isFromOutlet(link: string, outlets: readonly string[]): boolean {
  const host = hostnameOf(link);
  if (!host) return false;
  return outlets.some((d) => host === d || host.endsWith(`.${d}`));
}
