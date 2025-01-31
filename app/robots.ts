import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || '';

  return {
    rules: [
      // Allow OpenAI bots
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },

      // Allow ClaudeBot
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-web', allow: '/' },
      { userAgent: 'Claude-ai', allow: '/' },

      // General rule for all other crawlers
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
