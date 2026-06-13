"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Mail, MessageCircle, Truck } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container px-4 md:px-6 py-10 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">How can we help?</h1>
        <p className="text-muted-foreground text-lg">
          Got questions? We've got answers. If not, slide into our DMs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-secondary/20 flex flex-col items-center text-center cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => window.location.href='/dashboard/customer'}>
          <div className="p-3 bg-background rounded-full mb-4">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Track Order</h3>
          <p className="text-sm text-muted-foreground">Go to your dashboard to track.</p>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/20 flex flex-col items-center text-center cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => window.open('https://wa.me/919998887777', '_blank')}>
          <div className="p-3 bg-background rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="font-bold mb-2">WhatsApp Support</h3>
          <p className="text-sm text-muted-foreground">Talk to a real human instantly.</p>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/20 flex flex-col items-center text-center cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => window.location.href='mailto:support@urbanz.in'}>
          <div className="p-3 bg-background rounded-full mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold mb-2">Email Us</h3>
          <p className="text-sm text-muted-foreground">support@urbanz.in</p>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

        {/* Simple FAQ List (Simulating Accordion if component is missing, or static list) */}
        <div className="space-y-4">
          <div className="border border-border rounded-xl p-4">
            <h3 className="font-bold mb-2 text-lg">How long does shipping take?</h3>
            <p className="text-muted-foreground">
              For local orders (within 10km), we offer same-day delivery via our Hyperlocal network. Standard shipping takes 2-4 business days.
            </p>
          </div>

          <div className="border border-border rounded-xl p-4">
            <h3 className="font-bold mb-2 text-lg">Can I return my custom design?</h3>
            <p className="text-muted-foreground">
              Custom designs are unique to you, so they can't be returned unless there's a manufacturing defect. If it doesn't fit the vibe, hit us up and we'll see what we can do.
            </p>
          </div>

          <div className="border border-border rounded-xl p-4">
            <h3 className="font-bold mb-2 text-lg">Do you ship internationally?</h3>
            <p className="text-muted-foreground">
              Currently we are focused on major cities in India, but we are expanding to the moon soon. Stay tuned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
