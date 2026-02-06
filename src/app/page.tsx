"use client";

import Image from "next/image";
import Script from "next/script";
import { Header } from "@/components/Header";
import { useLanguage } from "@/lib/i18n";

// JSON-LD structured data for SEO
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pollio",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Skapa interaktiva omröstningar och frågor som din publik svarar på direkt från mobilen. Se resultaten live.",
  "url": "https://pollio.se",
  "author": {
    "@type": "Person",
    "name": "Henrik Ståhle"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Gratis",
      "price": "0",
      "priceCurrency": "SEK",
      "description": "1 presentation, upp till 10 deltagare"
    },
    {
      "@type": "Offer", 
      "name": "Pro",
      "price": "129",
      "priceCurrency": "SEK",
      "priceValidUntil": "2027-12-31",
      "description": "Obegränsade presentationer och deltagare"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "3"
  }
};

// FAQ Schema for rich snippets
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Behöver deltagarna ladda ner en app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nej. Deltagarna går med genom att skanna en QR-kod eller skriva in en kort kod i sin mobilwebbläsare. Ingen app, ingen registrering."
      }
    },
    {
      "@type": "Question", 
      "name": "Hur många kan delta i en session?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gratisplanen stöder upp till 10 deltagare per session. Pro-planen har ingen gräns."
      }
    },
    {
      "@type": "Question",
      "name": "Är svaren anonyma?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, som standard är alla svar anonyma. Deltagarna behöver inte ange sitt namn eller skapa ett konto."
      }
    },
    {
      "@type": "Question",
      "name": "Var lagras min data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Din data lagras säkert i Sverige. Vi säljer aldrig din data eller delar den med tredje part. Fullt GDPR-kompatibelt."
      }
    }
  ]
};

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="software-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* 1. Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute -top-20 -left-20 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(13, 148, 136, 0.12)' }}
          />
          <div
            className="absolute top-0 -right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
          />
          <div
            className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)' }}
          />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {t.hero.cta}
            </a>
          </div>
          <p className="text-sm text-text-secondary">
            {t.hero.noCreditCard}
          </p>
          <p className="text-sm text-primary font-medium mt-3">
            {t.hero.trustBadge}
          </p>
        </div>
      </section>

      {/* 2. Problem Agitation */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            {t.problem.title}
          </h2>
          <div className="space-y-6">
            <ProblemItem>{t.problem.item1}</ProblemItem>
            <ProblemItem>{t.problem.item2}</ProblemItem>
            <ProblemItem>{t.problem.item3}</ProblemItem>
          </div>
        </div>
      </section>

      {/* 3. Transformation - How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <BenefitCard
              number="1"
              title={t.howItWorks.step1Title}
              description={t.howItWorks.step1Desc}
            />
            <BenefitCard
              number="2"
              title={t.howItWorks.step2Title}
              description={t.howItWorks.step2Desc}
            />
            <BenefitCard
              number="3"
              title={t.howItWorks.step3Title}
              description={t.howItWorks.step3Desc}
            />
          </div>
        </div>
      </section>

      {/* 4. Social Proof - Testimonials */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
            {t.testimonials.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote={t.testimonials.quote1}
              name={t.testimonials.name1}
              role={t.testimonials.role1}
              image="/testimonial-erika.jpg"
            />
            <TestimonialCard
              quote={t.testimonials.quote2}
              name={t.testimonials.name2}
              role={t.testimonials.role2}
              image="/testimonial-anna.jpg"
            />
            <TestimonialCard
              quote={t.testimonials.quote3}
              name={t.testimonials.name3}
              role={t.testimonials.role3}
              image="/testimonial-marcus.jpg"
            />
          </div>
        </div>
      </section>

      {/* 5. Features */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            {t.features.title}
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title={t.features.multipleChoice}
              benefit={t.features.multipleChoiceBenefit}
              description={t.features.multipleChoiceDesc}
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />
                  <circle cx="19" cy="17" r="3" />
                </svg>
              }
            />
            <FeatureCard
              title={t.features.scale}
              benefit={t.features.scaleBenefit}
              description={t.features.scaleDesc}
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="14" width="4" height="6" rx="1" />
                  <rect x="10" y="10" width="4" height="10" rx="1" />
                  <rect x="17" y="4" width="4" height="16" rx="1" />
                </svg>
              }
            />
            <FeatureCard
              title={t.features.wordCloud}
              benefit={t.features.wordCloudBenefit}
              description={t.features.wordCloudDesc}
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              }
            />
            <FeatureCard
              title={t.features.openEnded}
              benefit={t.features.openEndedBenefit}
              description={t.features.openEndedDesc}
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6.5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-11zm-3 3H6v-1h12v1zm0 3H6v-1h12v1zm-6 3H6v-1h6v1z"/>
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* 6. About / Founder Story */}
      <section id="about" className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            {t.about.title}
          </h2>
          <div className="bg-background rounded-2xl p-8 md:p-10">
            <div className="text-text-secondary space-y-4">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
              <p className="text-text-primary font-medium">{t.about.p4}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-text-secondary/10 flex items-center gap-4">
              <Image
                src="/henrik-founder.png"
                alt={t.about.founder}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-text-primary font-medium">{t.about.founder}</p>
                <p className="text-text-secondary text-sm">{t.about.founderRole}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-text-secondary text-center mb-12">
            {t.pricing.subtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-text-secondary/10">
              <h3 className="text-xl font-bold text-text-primary mb-2">{t.pricing.free}</h3>
              <p className="text-text-secondary mb-4">{t.pricing.freeDesc}</p>
              <div className="text-3xl font-bold text-text-primary mb-6">
                {t.pricing.freePrice}
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>{t.pricing.freeFeature1}</PricingFeature>
                <PricingFeature>{t.pricing.freeFeature2}</PricingFeature>
                <PricingFeature>{t.pricing.freeFeature3}</PricingFeature>
              </ul>
              <a
                href="/signup"
                className="block text-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t.pricing.freeCta}
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary rounded-2xl p-6 md:p-8 text-white relative">
              <h3 className="text-xl font-bold mb-2">{t.pricing.pro}</h3>
              <p className="text-white/80 mb-4">{t.pricing.proDesc}</p>
              <div className="text-3xl font-bold mb-1">
                {t.pricing.proPrice}<span className="text-base font-normal text-white/80">{t.pricing.proPriceUnit}</span>
              </div>
              <p className="text-white/60 text-sm mb-6">{t.pricing.proYearly}</p>
              <ul className="space-y-3 mb-8">
                <PricingFeature light>{t.pricing.proFeature1}</PricingFeature>
                <PricingFeature light>{t.pricing.proFeature2}</PricingFeature>
                <PricingFeature light>{t.pricing.proFeature3}</PricingFeature>
                <PricingFeature light>{t.pricing.proFeature4}</PricingFeature>
              </ul>
              <a
                href="/signup?plan=pro"
                className="block text-center bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t.pricing.proCta}
              </a>
              <p className="text-white/60 text-xs text-center mt-3">{t.pricing.cancelAnytime}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
            {t.faq.title}
          </h2>
          <div className="space-y-6">
            <FAQItem question={t.faq.q1} answer={t.faq.a1} />
            <FAQItem question={t.faq.q2} answer={t.faq.a2} />
            <FAQItem question={t.faq.q3} answer={t.faq.a3} />
            <FAQItem question={t.faq.q4} answer={t.faq.a4} />
            <FAQItem question={t.faq.q5} answer={t.faq.a5} />
            <FAQItem question={t.faq.q6} answer={t.faq.a6} />
            <FAQItem question={t.faq.q7} answer={t.faq.a7} />
            <FAQItem question={t.faq.q8} answer={t.faq.a8} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            {t.finalCta.title}
          </h2>
          <p className="text-text-secondary mb-8">
            {t.finalCta.subtitle}
          </p>
          <a
            href="/signup"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {t.finalCta.cta}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-surface">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <a href="/">
              <Image src="/logo.svg" alt="Pollio" width={100} height={34} />
            </a>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <a href="/blogg" className="hover:text-text-primary transition-colors">
                Blogg
              </a>
              <a href="/privacy" className="hover:text-text-primary transition-colors">
                {t.footer.privacy}
              </a>
              <a href="/terms" className="hover:text-text-primary transition-colors">
                {t.footer.terms}
              </a>
              <a href="/contact" className="hover:text-text-primary transition-colors">
                {t.footer.contact}
              </a>
            </div>
            <div className="text-text-secondary text-sm">
              © {new Date().getFullYear()} Pollio
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-surface text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span>🇸🇪</span>
              {t.footer.hosting}
            </span>
            <span className="text-text-secondary/30">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t.footer.gdpr}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProblemItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
      <div className="w-6 h-6 bg-error/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-text-primary">{children}</p>
    </div>
  );
}

function BenefitCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, image }: { quote: string; name: string; role: string; image: string }) {
  return (
    <div className="bg-background rounded-2xl p-6 border border-text-secondary/10">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className="text-text-primary mb-4">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <Image
          src={image}
          alt={name}
          width={44}
          height={44}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-text-primary">{name}</p>
          <p className="text-sm text-text-secondary">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, benefit, description, icon }: { title: string; benefit: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-text-secondary/10">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-primary font-medium text-sm mb-2">{benefit}</p>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}

function PricingFeature({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className={`flex items-center gap-3 ${light ? "text-white/90" : "text-text-secondary"}`}>
      <svg
        className={`w-5 h-5 flex-shrink-0 ${light ? "text-white" : "text-primary"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </li>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-background rounded-xl border border-text-secondary/10 overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-text-primary hover:bg-surface/50 transition-colors">
        {question}
        <svg
          className="w-5 h-5 text-text-secondary flex-shrink-0 ml-4 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-6 pt-0 text-text-secondary">
        {answer}
      </div>
    </details>
  );
}
