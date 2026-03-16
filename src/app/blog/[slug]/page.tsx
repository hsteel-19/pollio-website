import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { Header } from '@/components/Header';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artikel hittades inte | Pollio',
    };
  }

  return {
    title: `${post.title} | Pollio`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pollio.se/blog/${slug}`,
      siteName: 'Pollio',
      locale: 'sv_SE',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // JSON-LD for article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pollio',
      url: 'https://pollio.se',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pollio.se/blog/${slug}`,
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="min-h-screen bg-white pt-20">
        <article className="max-w-3xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700">
              ← Tillbaka till bloggen
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{post.author}</span>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900 prose-li:text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />

          {/* CTA */}
          <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Redo att testa själv?
            </h2>
            <p className="text-gray-600 mb-6">
              Skapa din första interaktiva presentation på minuter. Gratis att börja.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Kom igång gratis
            </Link>
          </div>

          {/* Related posts or share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Fler artiklar
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
