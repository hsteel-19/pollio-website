import Image from "next/image";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
            Get instant feedback from your audience
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Create interactive polls and questions that your audience answers from their phones.
            See results update live on screen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Get started free
            </a>
          </div>
          <p className="text-sm text-text-secondary">
            No credit card required. Free plan includes 10 participants.
          </p>
        </div>
      </section>

      {/* 2. Problem Agitation */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Tired of talking to a silent room?
          </h2>
          <div className="space-y-6">
            <ProblemItem>
              You ask "Any questions?" and get awkward silence
            </ProblemItem>
            <ProblemItem>
              Only the loudest voices speak up, while others stay quiet
            </ProblemItem>
            <ProblemItem>
              You finish without knowing if anyone actually understood
            </ProblemItem>
          </div>
        </div>
      </section>

      {/* 3. Transformation - How It Works */}
      <section id="how-it-works" className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            Turn passive listeners into active participants
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            With Pollio, everyone gets a voice — not just the extroverts.
          </p>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <BenefitCard
              number="1"
              title="Create in seconds"
              description="Add polls, scales, or open questions. No design skills needed."
            />
            <BenefitCard
              number="2"
              title="Everyone joins instantly"
              description="Your audience scans a QR code or enters a short code. No app, no login."
            />
            <BenefitCard
              number="3"
              title="See results live"
              description="Responses appear in real-time. Word clouds form as people answer."
            />
          </div>
        </div>
      </section>

      {/* 4. Social Proof - Testimonials */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
            Trusted by presenters like you
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Finally, I can hear from everyone in the room — not just the usual few. The anonymous responses give me honest feedback."
              name="Erik Lindqvist"
              role="Team Leader"
            />
            <TestimonialCard
              quote="Setup took 2 minutes. My workshop participants loved how easy it was to join. Real engagement, not just nodding heads."
              name="Anna Bergström"
              role="Consultant"
            />
            <TestimonialCard
              quote="We replaced our old survey tool with Pollio. The live results keep people engaged throughout the entire meeting."
              name="Marcus Johansson"
              role="COO"
            />
          </div>
        </div>
      </section>

      {/* 5. Features */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            Four ways to engage your audience
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Each question type is designed to surface different insights.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title="Multiple Choice"
              benefit="Quick pulse checks and decisions"
              description="Perfect for voting, prioritizing options, or checking understanding. Results display as clear bar charts."
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h10v2H4v-2z" />
                  <circle cx="19" cy="17" r="3" />
                </svg>
              }
            />
            <FeatureCard
              title="Scale Questions"
              benefit="Measure agreement or satisfaction"
              description="Let your audience rate from 1-5 or 1-10. See the average and distribution instantly."
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="14" width="4" height="6" rx="1" />
                  <rect x="10" y="10" width="4" height="10" rx="1" />
                  <rect x="17" y="4" width="4" height="16" rx="1" />
                </svg>
              }
            />
            <FeatureCard
              title="Word Clouds"
              benefit="Surface themes and ideas"
              description="Collect short responses that form a visual word cloud. Popular answers appear larger."
              icon={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              }
            />
            <FeatureCard
              title="Open Ended"
              benefit="Get detailed feedback"
              description="When you need more than a vote. Collect longer text responses displayed in a clean list."
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
            Why I built Pollio
          </h2>
          <div className="bg-background rounded-2xl p-8 md:p-10">
            <div className="text-text-secondary space-y-4">
              <p>
                Pollio started from a pattern I couldn&apos;t ignore: the meetings that mattered most were often the least interactive.
                Even when the presentation was good, the room stayed passive — and valuable perspectives got lost.
              </p>
              <p>
                As work became more digital, it got harder to read the room. Cameras off. People multitasking.
                And as a manager, I didn&apos;t just want to &ldquo;present&rdquo; — I needed to know what people actually thought.
                Were we aligned? Did this land? What are we missing?
              </p>
              <p>
                So I built Pollio. I first used it in my own team and in our monthly company meetings as a COO.
                The shift was immediate: people engaged, answered, voted, and asked questions they wouldn&apos;t raise out loud in a big group.
                Meetings became clearer, more open, and honestly more fun — and the input made decisions better.
              </p>
              <p className="text-text-primary font-medium">
                That&apos;s the mission behind Pollio: help teams and hosts turn presentations into conversations,
                so more voices are heard and every meeting creates real momentum.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-text-secondary/10 flex items-center gap-4">
              <Image
                src="/henrik-founder.png"
                alt="Henrik Ståhle"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-text-primary font-medium">Henrik Ståhle</p>
                <p className="text-text-secondary text-sm">Founder, Pollio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-4">
            Simple pricing, no surprises
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-text-secondary/10">
              <h3 className="text-xl font-bold text-text-primary mb-2">Free</h3>
              <p className="text-text-secondary mb-4">Try it out, no commitment</p>
              <div className="text-3xl font-bold text-text-primary mb-6">
                0 kr
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
                Try it out free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary rounded-2xl p-6 md:p-8 text-white relative">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-white/80 mb-4">For professionals with unlimited use</p>
              <div className="text-3xl font-bold mb-1">
                129 kr<span className="text-base font-normal text-white/80">/month</span>
              </div>
              <p className="text-white/60 text-sm mb-6">or 990 kr/year (save 36%)</p>
              <ul className="space-y-3 mb-8">
                <PricingFeature light>Unlimited presentations</PricingFeature>
                <PricingFeature light>Unlimited participants</PricingFeature>
                <PricingFeature light>Session history & reports</PricingFeature>
                <PricingFeature light>Export results to CSV</PricingFeature>
              </ul>
              <a
                href="/signup?plan=pro"
                className="block text-center bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go Pro
              </a>
              <p className="text-white/60 text-xs text-center mt-3">Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-16 md:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text-primary mb-12">
            Common questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Do participants need to download an app?"
              answer="No. Participants join by scanning a QR code or entering a short code in their phone browser. No app download, no sign-up required."
            />
            <FAQItem
              question="How many people can join a session?"
              answer="The free plan supports up to 10 participants per session. Pro plan has no limit — we've tested sessions with hundreds of people."
            />
            <FAQItem
              question="What counts as a presentation?"
              answer="One Pollio deck/session you create and run. The free plan lets you create 1 presentation, Pro gives you unlimited."
            />
            <FAQItem
              question="Can I upgrade later?"
              answer="Yes. You can switch to Pro anytime from your account settings. Your existing presentations and data stay intact."
            />
            <FAQItem
              question="Are responses anonymous?"
              answer="Yes, by default all responses are anonymous. Participants don't need to enter their name or create an account."
            />
            <FAQItem
              question="Can I use Pollio for webinars or remote meetings?"
              answer="Absolutely. Share your screen to show the presentation, and participants join from wherever they are using the code or QR."
            />
            <FAQItem
              question="What happens to my data?"
              answer="Your data is stored securely in the EU. We never sell your data or share it with third parties. You can export or delete your data anytime."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes. No long-term contracts. Cancel your subscription anytime and you'll keep access until the end of your billing period."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to hear from your audience?
          </h2>
          <p className="text-text-secondary mb-8">
            Create your first interactive presentation in minutes.
          </p>
          <a
            href="/signup"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-surface">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/">
            <Image src="/logo.svg" alt="Pollio" width={100} height={34} />
          </a>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
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
            © {new Date().getFullYear()} Pollio
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

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
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
      <div>
        <p className="font-medium text-text-primary">{name}</p>
        <p className="text-sm text-text-secondary">{role}</p>
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
    <div className="bg-background rounded-xl p-6 border border-text-secondary/10">
      <h3 className="font-semibold text-text-primary mb-2">{question}</h3>
      <p className="text-text-secondary">{answer}</p>
    </div>
  );
}
