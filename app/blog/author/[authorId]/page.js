import Image from "next/image";
import { authors, articles } from "../../_assets/content";
import CardArticle from "../../_assets/components/CardArticle";
import Pagination from "../../_assets/components/Pagination";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

const ARTICLES_PER_PAGE = 6;

export async function generateMetadata({ params }) {
  const author = authors.find((author) => author.slug === params.authorId);

  return getSEOTags({
    title: `${author.name} | ${config.appName} Блог`,
    description: `Статии от ${author.name} - ${author.job}. ${author.description}`,
    canonicalUrlRelative: `/blog/author/${author.slug}`,
  });
}

export default async function Author({ params, searchParams }) {
  const author = authors.find((author) => author.slug === params.authorId);
  
  // Get current page from URL search params (default to 1)
  const currentPage = parseInt(searchParams?.page) || 1;
  
  // Filter and sort articles by this author
  const allArticlesByAuthor = articles
    .filter((article) => article.author.slug === author.slug)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Calculate pagination
  const totalArticles = allArticlesByAuthor.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  
  // Get articles for current page
  const articlesByAuthor = allArticlesByAuthor.slice(startIndex, endIndex);

  return (
    <>
      <section className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 mt-12 mb-24 md:mb-32">
        <div>
          <p className="text-xs uppercase tracking-wide text-base-content/80 mb-2">
            Автор
          </p>
          <h1 className="font-extrabold text-3xl lg:text-5xl tracking-tight mb-2">
            {author.name}
          </h1>
          <p className="md:text-lg mb-6 md:mb-10 font-medium">{author.job}</p>
          <p className="md:text-lg text-base-content/80">
            {author.description}
          </p>
        </div>

        <div className="max-md:order-first flex md:flex-col gap-4 shrink-0">
          <Image
            src={author.avatar}
            width={256}
            height={256}
            alt={author.name}
            priority={true}
            className="rounded-box w-[12rem] md:w-[16rem] "
          />

          {author.socials?.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4">
              {author.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="btn btn-square"
                  // Using a dark theme? -> className="btn btn-square btn-neutral"
                  title={`Go to ${author.name} profile on ${social.name}`}
                  target="_blank"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-2xl lg:text-4xl tracking-tight text-center mb-8 md:mb-12">
          Статии от {author.name}
        </h2>

        {articlesByAuthor.length > 0 ? (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {articlesByAuthor.map((article) => (
                <CardArticle key={article.slug} article={article} />
              ))}
            </div>

            {/* Pagination for author */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/blog/author/${author.slug}`}
            />

            {/* Articles count info */}
            <div className="text-center text-sm text-base-content/70">
              Показани са {articlesByAuthor.length} от {totalArticles} статии от този автор
              {totalPages > 1 && ` (страница ${currentPage} от ${totalPages})`}
            </div>
          </>
        ) : (
          <div className="text-center text-base-content/70">
            Този автор все още няма публикувани статии.
          </div>
        )}
      </section>
    </>
  );
}
