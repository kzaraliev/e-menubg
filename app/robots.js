export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/_next/*',
          '/admin',
          '/admin/*',
        ],
      },
    ],
    sitemap: 'https://www.e-menu.bg/sitemap.xml',
  }
}
