"use client";

import { Section } from "@/components/Section";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Contact Form Submission from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    
    window.location.href = `mailto:hello@ecoscan.app?subject=${subject}&body=${body}`;
    
    // Reset form after a short delay
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
    }, 100);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <main className="min-h-screen bg-background">
      <Section className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <a
                  href="mailto:hello@ecoscan.app"
                  className="text-primary hover:underline"
                >
                  hello@ecoscan.app
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <a
                  href="mailto:support@ecoscan.app"
                  className="text-primary hover:underline"
                >
                  support@ecoscan.app
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Available worldwide
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Your message..."
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-muted-foreground">
          <p>
            We typically respond within 24-48 hours. For urgent matters, please use the support email.
          </p>
        </div>
      </Section>
    </main>
  );
}




