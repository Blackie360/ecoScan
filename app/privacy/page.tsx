import { Section } from "@/components/Section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to EcoScan. We are committed to protecting your privacy and ensuring you have a positive experience
                on our website and in using our products and services. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Location data (when you grant permission)</li>
                <li>Search queries and preferences</li>
                <li>Device information and usage data</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Personalize your experience and provide recommendations</li>
                <li>Process your requests and respond to your inquiries</li>
                <li>Send you technical notices and support messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Service Disclaimer and Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">Important:</strong> EcoScan is a recommendation service only. We provide suggestions for places to hike, walk, or spend time in nature ("touch grass"). 
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">EcoScan does not take responsibility for:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
                <li>Any activities you engage in at suggested locations</li>
                <li>Safety conditions, hazards, or dangers at any location</li>
                <li>Weather conditions or natural disasters</li>
                <li>Accidents, injuries, or health issues that may occur</li>
                <li>Property damage or loss</li>
                <li>Any other problems or issues that may arise from visiting suggested locations</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                By using EcoScan, you acknowledge that you are solely responsible for your own safety and well-being when visiting 
                any suggested location. Always exercise caution, check current conditions, follow local regulations, and use your 
                best judgment when exploring outdoor spaces. EcoScan provides information only and does not guarantee the accuracy, 
                safety, or suitability of any location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information.
                However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. You can also opt out
                of certain data collection practices. To exercise these rights, please contact us using the information
                provided in the Contact section.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="/contact" className="text-primary hover:underline">our contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}

