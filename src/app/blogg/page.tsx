import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog/posts'

export const metadata: Metadata = {
  title: 'Blogg — Pollio | Tips för interaktiva presentationer',
  description: 'Artiklar och guider om interaktiva presentationer, live omröstningar och hur du engagerar din publik. Jämförelser, tips och best practices.',
  keywords: ['interaktiva presentationer', 'live omröstningar', 'mentimeter alternativ', 'presentationstips'],
  openGraph: {
    title: 'Blogg — Pollio',
    description: 'Artiklar och guider om interaktiva presentationer och live omröstningar.',
    url: 'https://pollio.se/blogg',
    siteName: 'Pollio',
    locale: 'sv_SE',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-surface">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/">
            <Image src="/logo.svg" alt="Pollio" width={100} height={34} priority />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Blogg</h1>
          <p className="text-xl text-text-secondary">
            Tips, guider och jämförelser för bättre presentationer och möten.
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-surface pb-8 last:border-0">
              <Link href={`/blogg/${post.slug}`} className="group block">
                {/* Featured image */}
                <div className="relative aspect-[1200/630] rounded-xl overflow-hidden mb-4 bg-surface">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                    {categoryLabels[post.category]}
                  </span>
                  <span className="text-sm text-text-secondary">{post.readTime} min läsning</span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-text-secondary mb-3">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>{post.author}</span>
                  <span>•</span>
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('sv-SE', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Redo att testa?</h2>
          <p className="text-white/80 mb-6">
            Skapa din första interaktiva presentation gratis.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Kom igång gratis
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="Pollio" width={80} height={27} />
          </Link>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <Link href="/privacy" className="hover:text-text-primary">Integritet</Link>
            <Link href="/terms" className="hover:text-text-primary">Villkor</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
