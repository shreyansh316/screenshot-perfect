import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, MessageSquare, Send, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/site/common";
import { supabase } from "@/integrations/supabase/client";
import { isValidEmail } from "@/lib/resume";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta(
      "Contact Growvia",
      "Questions, feedback or partnership ideas — we'd like to hear from you.",
    ),
  }),
  component: ContactPage,
});

const TOPICS = [
  { value: "general", label: "General inquiry" },
  { value: "candidate-feedback", label: "Candidate feedback" },
  { value: "employer-listing", label: "Employer or listing verification" },
  { value: "partnership", label: "University or community partnership" },
  { value: "bug-report", label: "Bug report or technical issue" },
];

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedMessage.length < 10) {
      setError("Message must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: trimmedName,
        email: trimmedEmail,
        topic,
        message: trimmedMessage,
      });

      if (insertError) {
        throw insertError;
      }

      setSubmitted(true);
      toast.success("Message sent successfully", {
        description: "Thank you for reaching out. We will get back to you soon.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(msg);
      toast.error("Couldn't send message", {
        description: "Please check your network and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setTopic("general");
    setMessage("");
    setError(null);
    setSubmitted(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Growvia"
        description="Whether you have questions about listings, feedback on our tools, or partnership inquiries, we are here to help."
      />

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <div className="surface-card p-6 md:p-8 rounded-xl border bg-surface">
            {submitted ? (
              <div className="py-8 text-center" role="status">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-teal-soft text-teal">
                  <CheckCircle2 className="size-6" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-navy">Message Received</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Thank you for contacting us, {name.trim() || "there"}. Your message has been
                  safely recorded, and we will follow up at {email} if needed.
                </p>
                <Button className="mt-6" variant="outline" onClick={handleReset}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-name">Your Name</Label>
                  <Input
                    id="contact-name"
                    autoComplete="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-surface"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-surface"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="contact-topic">Topic</Label>
                  <Select value={topic} onValueChange={setTopic} disabled={loading}>
                    <SelectTrigger id="contact-topic" className="h-11 bg-surface">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="bg-surface resize-y"
                  />
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Sending message…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Context Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-navy">Direct Communication</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We review submissions regularly. If you are an employer looking to verify your
                company's internship or job post, please include your official company domain email
                address so we can authenticate your listing quickly.
              </p>
            </div>

            <div className="divide-y rounded-lg border bg-surface">
              <div className="flex items-start gap-3.5 p-4">
                <Mail className="size-5 text-teal shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Listing Verification</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    We do not charge employers to list verified early-career opportunities that meet
                    our fairness standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-4">
                <MessageSquare className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Candidate Support</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Have feedback about the resume builder, roadmaps, or discovery filters? We
                    actively refine features based on real candidate experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
