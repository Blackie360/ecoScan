import { Section } from "@/components/Section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Section className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using EcoScan, you agree to be bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Permission is granted to temporarily use EcoScan for personal, non-commercial use. This is the grant of a license,
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software contained in EcoScan</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on EcoScan are provided on an 'as is' basis. EcoScan makes no warranties, expressed or implied,
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation
                of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall EcoScan or its suppliers be liable for any damages (including, without limitation, damages for
                loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
                on EcoScan, even if EcoScan or an authorized representative has been notified orally or in writing of the possibility
                of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on EcoScan could include technical, typographical, or photographic errors. EcoScan does not
                warrant that any of the materials on its website are accurate, complete, or current. EcoScan may make changes to the
                materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                EcoScan may revise these terms of service for its website at any time without notice. By using this website you
                are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="/contact" className="text-primary hover:underline">our contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}

