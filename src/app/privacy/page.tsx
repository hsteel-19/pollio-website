import { Header } from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Pollio",
  description: "How Pollio handles and protects your data",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Privacy Policy
          </h1>
          <p className="text-text-secondary mb-8">
            Last updated: January 28, 2026
          </p>

          <div className="prose prose-slate max-w-none">
            <Section title="1. Introduction">
              <p>
                This Privacy Policy explains how Studio FRIHÄVA AB, org.nr 559393-2733
                (&quot;Pollio&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects
                your personal data when you use our service at pollio.se.
              </p>
              <p>
                We are committed to protecting your privacy and complying with the
                EU General Data Protection Regulation (GDPR).
              </p>
            </Section>

            <Section title="2. Data Controller">
              <p>The data controller for your personal data is:</p>
              <p className="pl-4">
                Studio FRIHÄVA AB<br />
                Grev Turegatan 54<br />
                114 38 Stockholm<br />
                Sweden<br />
                Email: henrik.staahle@gmail.com
              </p>
            </Section>

            <Section title="3. What Data We Collect">
              <h4 className="font-semibold text-text-primary mt-4">For Presenters (Account Holders)</h4>
              <ul>
                <li>Email address (required for account creation)</li>
                <li>Name (optional, if provided)</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Presentation content you create</li>
                <li>Session history and response data</li>
              </ul>

              <h4 className="font-semibold text-text-primary mt-4">For Audience Participants</h4>
              <ul>
                <li>Anonymous responses to presentation questions</li>
                <li>A random participant ID stored in your browser (no personal identification)</li>
              </ul>
              <p>
                <strong>Note:</strong> Audience participants do not need to create an account
                or provide any personal information. All responses are anonymous by default.
              </p>
            </Section>

            <Section title="4. How We Use Your Data">
              <p>We use your data to:</p>
              <ul>
                <li>Provide and operate the Pollio service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service-related communications</li>
                <li>Improve our service and fix issues</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>
                We do <strong>not</strong> sell your data to third parties or use it for
                advertising purposes.
              </p>
            </Section>

            <Section title="5. Legal Basis for Processing">
              <p>We process your personal data based on:</p>
              <ul>
                <li><strong>Contract:</strong> To provide the service you signed up for</li>
                <li><strong>Legitimate interest:</strong> To improve our service and ensure security</li>
                <li><strong>Legal obligation:</strong> To comply with applicable laws (e.g., accounting)</li>
                <li><strong>Consent:</strong> Where explicitly requested (e.g., marketing emails)</li>
              </ul>
            </Section>

            <Section title="6. Data Sharing">
              <p>We share data only with trusted service providers who help us operate Pollio:</p>
              <ul>
                <li><strong>Supabase</strong> (EU) - Database and authentication</li>
                <li><strong>Stripe</strong> (US, with EU data processing) - Payment processing</li>
                <li><strong>Vercel</strong> (US, with EU edge) - Website hosting</li>
                <li><strong>Google</strong> - OAuth login (only if you choose Google sign-in)</li>
              </ul>
              <p>
                All providers are bound by data processing agreements and comply with GDPR requirements.
              </p>
            </Section>

            <Section title="7. Data Retention">
              <ul>
                <li><strong>Active accounts:</strong> Data is retained while your account is active</li>
                <li><strong>Deleted accounts:</strong> Personal data is deleted within 30 days of account deletion</li>
                <li><strong>Payment records:</strong> Retained for 7 years as required by Swedish accounting law</li>
                <li><strong>Audience responses:</strong> Retained as long as the presentation exists</li>
              </ul>
            </Section>

            <Section title="8. Your Rights">
              <p>Under GDPR, you have the right to:</p>
              <ul>
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Rectification</strong> - Correct inaccurate data</li>
                <li><strong>Erasure</strong> - Request deletion of your data</li>
                <li><strong>Portability</strong> - Receive your data in a portable format</li>
                <li><strong>Object</strong> - Object to certain processing activities</li>
                <li><strong>Withdraw consent</strong> - Where processing is based on consent</li>
              </ul>
              <p>
                To exercise these rights, contact us at henrik.staahle@gmail.com.
                We will respond within 30 days.
              </p>
            </Section>

            <Section title="9. Cookies">
              <p>
                We use essential cookies only to keep you logged in and remember your preferences.
                We do not use tracking or advertising cookies.
              </p>
            </Section>

            <Section title="10. Data Security">
              <p>
                We implement appropriate technical and organizational measures to protect your data,
                including encryption in transit (HTTPS) and at rest, secure authentication,
                and regular security reviews.
              </p>
            </Section>

            <Section title="11. International Transfers">
              <p>
                Your data is primarily stored in the EU. Where data is transferred outside the EU
                (e.g., to US-based processors), we ensure appropriate safeguards are in place,
                such as Standard Contractual Clauses.
              </p>
            </Section>

            <Section title="12. Changes to This Policy">
              <p>
                We may update this policy from time to time. We will notify you of significant
                changes via email or a notice on our website.
              </p>
            </Section>

            <Section title="13. Contact & Complaints">
              <p>
                For questions about this policy or to exercise your rights, contact us at:
              </p>
              <p className="pl-4">
                Email: henrik.staahle@gmail.com
              </p>
              <p>
                You also have the right to lodge a complaint with the Swedish Authority
                for Privacy Protection (IMY) at <a href="https://www.imy.se" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.imy.se</a>.
              </p>
            </Section>
          </div>

          <div className="mt-12 pt-8 border-t border-text-secondary/10">
            <Link href="/" className="text-primary hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-text-primary mb-4">{title}</h2>
      <div className="text-text-secondary space-y-3">{children}</div>
    </div>
  );
}
