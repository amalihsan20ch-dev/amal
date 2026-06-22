import { SITE } from "@/lib/site";
export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/volunteer/register`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
