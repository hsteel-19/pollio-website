import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts'
import { blogContent } from '@/lib/blog/content'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) return {}

  return {
    title: `${post.title} | Pollio Blogg`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://pollio.se/blogg/${post.slug}`,
      siteName: 'Pollio',
      locale: 'sv_SE',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: `https://pollio.se${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`https://pollio.se${post.image}`],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const content = blogContent[slug]

  if (!post || !content) {
    notFound()
  }

  const categoryLabels = {
    jamforelse: 'Jämförelse',
    guide: 'Guide',
    tips: 'Tips',
  }

  const categoryColors = {
    jamforelse: 'bg-blue-100 text-blue-700',
    guide: 'bg-green-100 text-green-700',
    tips: 'bg-purple-100 text-purple-700',
  }

  // JSON-LD for article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `https://pollio.se${post.image}`,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pollio',
      url: 'https://pollio.se',
    },
    datePublished: post.date,
    mainEntityOfPage: `https://pollio.se/blogg/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-surface">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Pollio" width={100} height={34} priority />
          </Link>
          <Link href="/blogg" className="text-text-secondary hover:text-primary transition-colors">
            ← Alla artiklar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
              {categoryLabels[post.category]}
            </span>
            <span className="text-sm text-text-secondary">{post.readTime} min läsning</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            {post.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-text-secondary border-t border-b border-surface py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">HS</span>
              </div>
              <div>
                <div className="font-medium text-text-primary">{post.author}</div>
                <div>Grundare, Pollio</div>
              </div>
            </div>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('sv-SE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </div>

        {/* Featured image */}
        <div className="relative aspect-[1200/630] rounded-xl overflow-hidden mb-10 bg-surface">
          <Image 
            src={post.image} 
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article content */}
        <article className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Testa Pollio gratis</h2>
          <p className="text-white/80 mb-6">
            Skapa interaktiva presentationer med omröstningar, ordmoln och öppna frågor.
            <br />Din data lagras säkert i Sverige 🇸🇪
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Kom igång gratis
          </Link>
        </div>

        {/* Related posts would go here */}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Pollio" width={80} height={27} />
          </Link>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <Link href="/blogg" className="hover:text-text-primary">Blogg</Link>
            <Link href="/privacy" className="hover:text-text-primary">Integritet</Link>
            <Link href="/terms" className="hover:text-text-primary">Villkor</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
