export const siteConfig = {
  name: "Zlyzer",
  description: "Advanced TikTok Video Analysis Platform",
  url: "https://zlyzer.vercel.app",
  ogImage: "/og-image.png",
  getStartedUrl: "/dashboard", // Internal dashboard route for authenticated users
  links: {
    github: "https://github.com/Abuzaid911/Zlyzer",
    twitter: "#",
    docs: "#",
  },
  author: {
    name: "Zlyzer",
    url: "https://zlyzer.vercel.app",
  },
} as const;

export type SiteConfig = typeof siteConfig;
