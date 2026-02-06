export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: 'jamforelse' | 'guide' | 'tips';
  keywords: string[];
  readTime: number;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mentimeter-alternativ',
    title: 'Mentimeter alternativ 2026 — Pollio vs Mentimeter jämförelse',
    description: 'Letar du efter ett Mentimeter alternativ? Vi jämför Pollio och Mentimeter — funktioner, pris och vilket som passar dig bäst.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'jamforelse',
    keywords: ['mentimeter alternativ', 'pollio vs mentimeter', 'interaktiva presentationer', 'live omröstningar'],
    readTime: 8,
    image: '/blog/mentimeter-alternativ.svg',
  },
  {
    slug: 'slido-alternativ',
    title: 'Slido alternativ — Pollio vs Slido för frågestunder och omröstningar',
    description: 'Jämförelse mellan Slido och Pollio. Vilket verktyg passar bäst för Q&A, omröstningar och interaktiva presentationer?',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'jamforelse',
    keywords: ['slido alternativ', 'pollio vs slido', 'frågestund', 'Q&A verktyg'],
    readTime: 6,
    image: '/blog/slido-alternativ.svg',
  },
  {
    slug: 'kahoot-alternativ-foretag',
    title: 'Kahoot alternativ för företag — professionella omröstningar',
    description: 'Kahoot är roligt men för barnsligt för jobbet? Här är professionella alternativ för företagsmöten och workshops.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'jamforelse',
    keywords: ['kahoot alternativ', 'kahoot för företag', 'professionella omröstningar', 'möten'],
    readTime: 5,
    image: '/blog/kahoot-alternativ-foretag.svg',
  },
  {
    slug: 'interaktiva-presentationer-guide',
    title: 'Interaktiva presentationer — så engagerar du deltagarna',
    description: 'Komplett guide till interaktiva presentationer. Lär dig tekniker och verktyg för att engagera din publik.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'guide',
    keywords: ['interaktiva presentationer', 'engagera publik', 'presentationstips', 'live feedback'],
    readTime: 10,
    image: '/blog/interaktiva-presentationer-guide.svg',
  },
  {
    slug: 'live-omrostningar-moten',
    title: 'Live omröstningar i möten — komplett guide 2026',
    description: 'Hur du använder live omröstningar för att fatta bättre beslut och engagera alla i mötet. Steg-för-steg guide.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'guide',
    keywords: ['live omröstningar', 'omröstningar möten', 'beslutsstöd', 'mötesverktyg'],
    readTime: 7,
    image: '/blog/live-omrostningar-moten.svg',
  },
  {
    slug: 'basta-verktyg-publikfragor',
    title: 'Bästa verktyget för publikfrågor 2026 — topplista',
    description: 'Vi har testat de populäraste verktygen för publikfrågor och Q&A. Här är vinnarna för svenska användare.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'guide',
    keywords: ['publikfrågor', 'Q&A verktyg', 'frågestund', 'konferens'],
    readTime: 8,
    image: '/blog/basta-verktyg-publikfragor.svg',
  },
  {
    slug: 'feedback-medarbetare-anonyma-omrostningar',
    title: 'Feedback från medarbetare med anonyma omröstningar',
    description: 'Så får du ärlig feedback från ditt team med anonyma omröstningar. Tips för HR och chefer.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'tips',
    keywords: ['medarbetarfeedback', 'anonyma omröstningar', 'HR verktyg', 'teamfeedback'],
    readTime: 6,
    image: '/blog/feedback-medarbetare-anonyma-omrostningar.svg',
  },
  {
    slug: 'workshops-live-omrostningar',
    title: 'Workshops med live-omröstningar — så gör du',
    description: 'Praktisk guide för att köra engagerande workshops med interaktiva omröstningar och frågor.',
    date: '2026-02-06',
    author: 'Henrik Ståhle',
    category: 'tips',
    keywords: ['workshop', 'live omröstningar', 'facilitering', 'grupparbete'],
    readTime: 7,
    image: '/blog/workshops-live-omrostningar.svg',
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
