import { categories, articles } from "./_assets/content";
import CardArticle from "./_assets/components/CardArticle";
import CardCategory from "./_assets/components/CardCategory";
import Pagination from "./_assets/components/Pagination";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: `${config.appName} Блог | Дигитални решения за ресторанти`,
  description:
    "Научете как да модернизирате своя ресторант с дигитални менюта, да увеличите продажбите и да подобрите клиентското преживяване",
  canonicalUrlRelative: "/blog",
});

const ARTICLES_PER_PAGE = 6;

export default async function Blog({ searchParams }) {
  // Get current page from URL search params (default to 1)
  const currentPage = parseInt(searchParams?.page) || 1;
  
  // Sort articles by date (newest first)
  const sortedArticles = articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Calculate pagination
  const totalArticles = sortedArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  
  // Get articles for current page
  const articlesToDisplay = sortedArticles.slice(startIndex, endIndex);
  return (
    <>
      <section className="text-center max-w-xl mx-auto mt-12 mb-24 md:mb-32">
        <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-6">
          {config.appName} Блог
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Научете как да трансформирате своя ресторант с дигитални технологии. 
          Експертни съвети, практически ръководства и най-новите тенденции в ресторантьорството.
        </p>
      </section>

      <section className="grid lg:grid-cols-2 mb-12 md:mb-16 gap-8">
        {articlesToDisplay.map((article, i) => (
          <CardArticle
            article={article}
            key={article.slug}
            isImagePriority={i <= 2}
          />
        ))}
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/blog"
      />

      {/* Articles count info */}
      <div className="text-center text-sm text-base-content/70 mb-24 md:mb-32">
        Показани са {articlesToDisplay.length} от {totalArticles} статии
        {totalPages > 1 && ` (страница ${currentPage} от ${totalPages})`}
      </div>

      <section>
        <p className="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Разгледайте статии по категории
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CardCategory key={category.slug} category={category} tag="div" />
          ))}
        </div>
      </section>
    </>
  );
}
