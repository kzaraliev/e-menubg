import { categories, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import CardCategory from "../../_assets/components/CardCategory";
import Pagination from "../../_assets/components/Pagination";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const ARTICLES_PER_PAGE = 6;

export async function generateMetadata({ params }) {
  const category = categories.find(
    (category) => category.slug === params.categoryId
  );

  return getSEOTags({
    title: `${category.title} | ${config.appName} Блог`,
    description: category.description,
    canonicalUrlRelative: `/blog/category/${category.slug}`,
  });
}

export default async function Category({ params, searchParams }) {
  const category = categories.find(
    (category) => category.slug === params.categoryId
  );
  
  // Get current page from URL search params (default to 1)
  const currentPage = parseInt(searchParams?.page) || 1;
  
  // Filter and sort articles for this category
  const allArticlesInCategory = articles
    .filter((article) =>
      article.categories.map((c) => c.slug).includes(category.slug)
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Calculate pagination
  const totalArticles = allArticlesInCategory.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  
  // Get articles for current page
  const articlesInCategory = allArticlesInCategory.slice(startIndex, endIndex);

  return (
    <>
      <section className="mt-12 mb-24 md:mb-32 max-w-3xl mx-auto text-center">
        <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6 md:mb-12">
          {category.title}
        </h1>
        <p className="md:text-lg opacity-80 max-w-xl mx-auto">
          {category.description}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Статии в категория {category.title}
        </h2>

        {articlesInCategory.length > 0 ? (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {articlesInCategory.map((article) => (
                <CardArticle
                  key={article.slug}
                  article={article}
                  tag="h3"
                  showCategory={false}
                />
              ))}
            </div>

            {/* Pagination for category */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/blog/category/${category.slug}`}
            />

            {/* Articles count info */}
            <div className="text-center text-sm text-base-content/70 mb-24">
              Показани са {articlesInCategory.length} от {totalArticles} статии в тази категория
              {totalPages > 1 && ` (страница ${currentPage} от ${totalPages})`}
            </div>
          </>
        ) : (
          <div className="text-center text-base-content/70 mb-24">
            Все още няма статии в тази категория.
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Други категории, които може да ви харесат
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((category) => (
              <CardCategory key={category.slug} category={category} tag="h3" />
            ))}
        </div>
      </section>
    </>
  );
}
