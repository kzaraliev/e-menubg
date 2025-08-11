module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.e-menu.bg",
  generateRobotsTxt: true,
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: [
    "/twitter-image.*", 
    "/opengraph-image.*", 
    "/icon.*",
    "/dashboard",
    "/dashboard/*",
    "/api/*",
  ],
  robotsTxtOptions: {
    policies: [
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
      {
        userAgent: '*',
        allow: [
          '/blog',
          '/blog/*',
          '/restaurants',
          '/about',
          '/contact',
          '/privacy-policy',
          '/tos',
        ],
      },
    ],
    additionalSitemaps: [
      'https://www.e-menu.bg/sitemap.xml',
    ],
  },
};
