import connectMongo from "@/libs/mongoose";
import Restaurant from "@/models/Restaurant";
import { articles } from "@/app/blog/_assets/content";

export default async function sitemap() {
  const baseUrl = 'https://www.e-menu.bg';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/tos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/restaurants`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Blog posts
  const blogPosts = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Get restaurant menus
  let restaurantPages = [];
  try {
    await connectMongo();
    const restaurants = await Restaurant.find({
      isActive: true,
      isPublished: true
    }).select('slug updatedAt').lean();

    restaurantPages = restaurants.map((restaurant) => ({
      url: `${baseUrl}/${restaurant.slug}`,
      lastModified: restaurant.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Error fetching restaurants for sitemap:', error);
  }

  return [
    ...staticPages,
    ...blogPosts,
    ...restaurantPages,
  ];
}
