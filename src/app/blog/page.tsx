import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Blogg | Pollio - Tips för interaktiva presentationer',
  description: 'Lär dig skapa engagerande presentationer med live-omröstningar, ordmoln och interaktivitet. Tips, guider och best practices.',
  keywords: ['interaktiva presentationer', 'live polling', 'presentation tips', 'mentimeter alternativ', 'ordmoln'],
  openGraph: {
    title: 'Blogg | Pollio',
    description: 'Tips och guider för interaktiva presentationer',
    url: 'https://pollio.se/blog',
    siteName: 'Pollio',
    locale: 'sv_SE',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blogg
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Tips, guider och inspiration för interaktiva presentationer och engagerande möten.
          </p>

          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-200 pb-12 last:border-0">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Läs mer →
                </Link>
              </article>
            ))}
          </div>

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
        </div>
      </main>
    </>
  );
}
