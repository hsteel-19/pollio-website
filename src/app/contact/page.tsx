import { Header } from "@/components/Header";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact - Pollio",
  description: "Get in touch with the Pollio team",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2 text-center">
            Contact us
          </h1>
          <p className="text-text-secondary mb-8 text-center">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>

          <ContactForm />

          <div className="mt-12 pt-8 border-t border-text-secondary/10 text-center">
            <p className="text-text-secondary mb-4">
              You can also reach us directly at:
            </p>
            <a
              href="mailto:henrik.staahle@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              henrik.staahle@gmail.com
            </a>

            <div className="mt-8 text-sm text-text-secondary">
              <p>Studio FRIHÄVA AB</p>
              <p>Grev Turegatan 54</p>
              <p>114 38 Stockholm, Sweden</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
