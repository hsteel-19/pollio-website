import Image from "next/image";
import { RotatingText } from "@/components/RotatingText";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/">
            <Image src="/logo.svg" alt="Pollio" width={120} height={40} priority />
          </a>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </a>
            <a
              href="/login"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Get started free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Playful background shapes */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Large gradient blurs */}
          <div
            className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(13, 148, 136, 0.15)' }}
          />
          <div
            className="absolute top-0 -right-20 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)' }}
          />
          <div
            className="absolute -bottom-40 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(13, 148, 136, 0.1)' }}
          />
          {/* Geometric shapes */}
          <svg className="absolute top-32 right-[15%] w-16 h-16 opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#0D9488" />
          </svg>
          <svg className="absolute top-48 left-[10%] w-12 h-12 opacity-15" viewBox="0 0 100 100">
            <rect x="5" y="5" width="90" height="90" rx="20" fill="#0D9488" />
          </svg>
          <svg className="absolute bottom-20 right-[20%] w-20 h-20 opacity-15" viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" fill="#14B8A6" />
          </svg>
          <svg className="absolute bottom-32 left-[18%] w-10 h-10 opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#14B8A6" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
            Turn your presentation into a conversation
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-10">
            Interactive live polls and questions
            <br />
            — perfect for <RotatingText words={["meetings", "workshops", "events"]} />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Create a presentation
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-text-secondary/20 hover:border-primary text-text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            Simple as 1, 2, 3
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {/* Magic wand with sparkles */}
                  <path d="M15 4l-1 1m0 0l-1-1m1 1v-1m4 6l1-1m0 0l1 1m-1-1v1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 20l12-12m0 0l2.5-2.5a1 1 0 011.5 0l.5.5a1 1 0 010 1.5L18 10m-2-2l2 2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="6" cy="6" r="1" fill="currentColor" />
                  <circle cx="10" cy="3" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Create your presentation
              </h3>
              <p className="text-text-secondary">
                Add polls, scales, word clouds, and open-ended questions in minutes. AI helps you get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {/* QR code / phone share */}
                  <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" />
                  <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" />
                  <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" />
                  <path d="M14 14h3v3h-3zm4 0h3v3h-3zm-4 4h3v3h-3zm4 0h3v3h-3z" strokeLinecap="round" />
                  <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  <circle cx="6.5" cy="17.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Share with your audience
              </h3>
              <p className="text-text-secondary">
                Participants join with a simple code or QR scan. No app download, no sign-up required.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {/* Live chart with pulse */}
                  <path d="M3 12h2l2-4 3 8 3-6 2 4h6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="14" r="2" fill="currentColor" className="animate-pulse" />
                  <path d="M4 4v16h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">
                Engage in real time
              </h3>
              <p className="text-text-secondary">
                See responses appear instantly. Word clouds form live. Charts update as votes come in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-16">
            Everything you need, nothing you don't
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Multiple Choice"
              description="Classic polls with instant bar chart results"
            />
            <FeatureCard
              title="Scale Questions"
              description="Rate from 1-5 or 1-10 with beautiful visualizations"
            />
            <FeatureCard
              title="Word Clouds"
              description="Collect short responses, display as a live word cloud"
            />
            <FeatureCard
              title="Open Ended"
              description="Gather detailed feedback and display responses"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-text-secondary text-center mb-16 text-lg">
            Start free. Upgrade when you're ready.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-background rounded-2xl p-8 border border-text-secondary/10">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Free</h3>
              <p className="text-text-secondary mb-6">Perfect for trying it out</p>
              <div className="text-4xl font-bold text-text-primary mb-6">
                0 kr<span className="text-lg font-normal text-text-secondary">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>1 presentation</PricingFeature>
                <PricingFeature>Up to 10 participants</PricingFeature>
                <PricingFeature>All question types</PricingFeature>
              </ul>
              <a
                href="/signup"
                className="block text-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Get started free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/80 mb-6">For professionals and teams</p>
              <div className="text-4xl font-bold mb-1">
                49 kr<span className="text-lg font-normal text-white/80">/month</span>
              </div>
              <p className="text-white/60 text-sm mb-6">or 429 kr/year (save 27%)</p>
              <ul className="space-y-3 mb-8">
                <PricingFeature light>Unlimited presentations</PricingFeature>
                <PricingFeature light>Unlimited participants</PricingFeature>
                <PricingFeature light>Export results to CSV</PricingFeature>
                <PricingFeature light>Session history & analytics</PricingFeature>
              </ul>
              <a
                href="/signup?plan=pro"
                className="block text-center bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start free trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Ready to engage your audience?
          </h2>
          <p className="text-xl text-text-secondary mb-10">
            Join thousands of presenters who make their meetings more interactive.
          </p>
          <a
            href="/signup"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Create a presentation — it's free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-surface">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/">
            <Image src="/logo.svg" alt="Pollio" width={100} height={34} />
          </a>
          <div className="flex items-center gap-8 text-text-secondary">
            <a href="/privacy" className="hover:text-text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-text-primary transition-colors">
              Terms
            </a>
            <a href="mailto:hello@pollio.se" className="hover:text-text-primary transition-colors">
              Contact
            </a>
          </div>
          <div className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Pollio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-surface hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
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
