import { Header } from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Pollio",
  description: "Terms and conditions for using Pollio",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            Terms of Service
          </h1>
          <p className="text-text-secondary mb-8">
            Last updated: January 28, 2026
          </p>

          <div className="prose prose-slate max-w-none">
            <Section title="1. Introduction">
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your use of Pollio, an interactive
                presentation service operated by Studio FRIHÄVA AB, org.nr 559393-2733
                (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By creating an account or using Pollio, you agree to these Terms.
                If you do not agree, please do not use our service.
              </p>
            </Section>

            <Section title="2. Eligibility">
              <p>
                You must be at least 18 years old to create an account and use Pollio.
                By using our service, you represent that you meet this age requirement.
              </p>
            </Section>

            <Section title="3. Account Registration">
              <ul>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized access to your account</li>
                <li>One person or entity may not maintain multiple free accounts</li>
              </ul>
            </Section>

            <Section title="4. Service Description">
              <p>
                Pollio is a web-based platform that allows you to create interactive presentations
                with live audience participation. Features include:
              </p>
              <ul>
                <li>Creating presentations with various question types</li>
                <li>Running live sessions where audiences respond from their devices</li>
                <li>Viewing real-time results and analytics</li>
              </ul>
            </Section>

            <Section title="5. Free and Paid Plans">
              <h4 className="font-semibold text-text-primary mt-4">Free Plan</h4>
              <ul>
                <li>1 presentation</li>
                <li>Up to 10 participants per session</li>
                <li>2 sessions per presentation</li>
              </ul>

              <h4 className="font-semibold text-text-primary mt-4">Pro Plan</h4>
              <ul>
                <li>Unlimited presentations</li>
                <li>Unlimited participants</li>
                <li>Session history and analytics</li>
                <li>Price: 129 SEK/month or 990 SEK/year</li>
              </ul>
            </Section>

            <Section title="6. Payment Terms">
              <ul>
                <li>Payments are processed securely through Stripe</li>
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>Prices are in Swedish Kronor (SEK) and include applicable taxes</li>
                <li>You can cancel your subscription at any time from your account settings</li>
                <li>Upon cancellation, you retain access until the end of your billing period</li>
              </ul>
            </Section>

            <Section title="7. Refund Policy">
              <p>
                We offer refunds under the following conditions:
              </p>
              <ul>
                <li>
                  <strong>Full refund within 14 days</strong> if you have not used the paid features
                  (i.e., no presentations created or sessions run after subscribing)
                </li>
                <li>
                  <strong>No refund</strong> if you have actively used the paid features
                </li>
              </ul>
              <p>
                To request a refund, contact us at henrik.staahle@gmail.com within 14 days
                of your purchase.
              </p>
            </Section>

            <Section title="8. Acceptable Use">
              <p>You agree not to use Pollio to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Distribute malware, spam, or harmful content</li>
                <li>Harass, abuse, or harm others</li>
                <li>Collect personal data from participants without proper consent</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Create content that is illegal, hateful, or explicitly harmful</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </Section>

            <Section title="9. Your Content">
              <ul>
                <li>You retain ownership of content you create on Pollio</li>
                <li>You grant us a license to host, display, and transmit your content as needed to provide the service</li>
                <li>You are responsible for ensuring you have the rights to any content you upload</li>
                <li>We do not monitor content but may remove content that violates these Terms</li>
              </ul>
            </Section>

            <Section title="10. Intellectual Property">
              <p>
                The Pollio service, including its design, code, and branding, is owned by
                Studio FRIHÄVA AB and protected by intellectual property laws. You may not
                copy, modify, or distribute any part of our service without permission.
              </p>
            </Section>

            <Section title="11. Service Availability">
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted service.
                We may temporarily suspend access for maintenance, updates, or circumstances
                beyond our control.
              </p>
            </Section>

            <Section title="12. Limitation of Liability">
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul>
                <li>
                  Pollio is provided &quot;as is&quot; without warranties of any kind
                </li>
                <li>
                  We are not liable for any indirect, incidental, or consequential damages
                </li>
                <li>
                  Our total liability shall not exceed the amount you paid us in the
                  12 months prior to the claim
                </li>
              </ul>
              <p>
                These limitations do not affect your statutory rights under applicable consumer protection laws.
              </p>
            </Section>

            <Section title="13. Account Termination">
              <ul>
                <li>You may delete your account at any time from your account settings</li>
                <li>We may suspend or terminate accounts that violate these Terms</li>
                <li>Upon termination, your data will be deleted in accordance with our Privacy Policy</li>
              </ul>
            </Section>

            <Section title="14. Changes to Terms">
              <p>
                We may update these Terms from time to time. We will notify you of significant
                changes via email or a notice on our website. Continued use after changes
                constitutes acceptance of the new Terms.
              </p>
            </Section>

            <Section title="15. Governing Law">
              <p>
                These Terms are governed by the laws of Sweden. Any disputes shall be resolved
                in the courts of Stockholm, Sweden.
              </p>
            </Section>

            <Section title="16. Contact">
              <p>
                For questions about these Terms, contact us at:
              </p>
              <p className="pl-4">
                Studio FRIHÄVA AB<br />
                Grev Turegatan 54<br />
                114 38 Stockholm<br />
                Sweden<br />
                Email: henrik.staahle@gmail.com
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
