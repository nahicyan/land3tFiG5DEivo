import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Support() {
  return (
    <div className="bg-[#FDF8F2] min-h-screen text-[#4b5b4d]">
      {/* Hero / Header Section */}
      <section className="bg-[#3f4f24] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Need Help?</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            We’re here to support you every step of the way. Whether you have
            questions about land ownership, financing, or just need guidance,
            our team is ready to help.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="mt-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#3f4f24] text-center">
          Contact Our Support Team
        </h2>
        <p className="mt-4 text-lg text-[#324c48] text-center max-w-3xl mx-auto">
          We offer multiple channels to ensure your questions are answered
          promptly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {supportChannels.map((channel, idx) => (
            <Card
              key={idx}
              className="bg-white shadow-md border border-[#D4A017] hover:shadow-lg transition rounded-lg"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#D4A017]">
                  {channel.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#324c48]">{channel.description}</p>
                <Button
                  className="mt-4 bg-[#324c48] text-white hover:bg-[#2c3b18]"
                  onClick={() => window.location.href = channel.link}
                >
                  {channel.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#3f4f24] text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-[#324c48] text-center max-w-2xl mx-auto">
          Find quick answers to common questions below.
        </p>
        <Accordion type="single" collapsible className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-[#D4A017] rounded-lg">
              <AccordionTrigger className="px-4 py-2 text-[#3f4f24] text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 text-[#324c48]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact CTA */}
      <section className="mt-16 bg-[#D4A017] py-12 text-center text-[#3f4f24]">
        <h2 className="text-3xl font-bold">Still Have Questions?</h2>
        <p className="mt-4 text-lg max-w-3xl mx-auto">
          Our dedicated support team is ready to assist. Reach out and we’ll get
          back to you as soon as possible.
        </p>
        <Button
          className="mt-6 bg-[#324c48] text-white px-6 py-3 text-lg font-semibold rounded-lg hover:bg-[#3f4f24]"
          onClick={() => (window.location.href = "mailto:support@landivo.com")}
        >
          Email Us
        </Button>
      </section>
    </div>
  );
}

// Support Channels Data
const supportChannels = [
  {
    title: "Live Chat",
    description: "Chat with a real agent to get instant support and answers.",
    cta: "Chat Now",
    link: "https://landivo.com/chat",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our land experts for personalized help.",
    cta: "Call Us",
    link: "tel:+18001234567",
  },
  {
    title: "Email",
    description: "Send us an email and we’ll respond within 24 hours.",
    cta: "Email Us",
    link: "mailto:support@landivo.com",
  },
];

// FAQ Data
const faqs = [
  {
    question: "How do I finance my land purchase?",
    answer: "We offer multiple financing options, including low-interest loans and flexible payment plans. Visit our Financing page for more details.",
  },
  {
    question: "What if I have bad credit?",
    answer: "We provide owner financing with no credit check required. Everyone deserves a chance to own land.",
  },
  {
    question: "How long does it take to close on land?",
    answer: "Closing can be as quick as 7-14 days once all paperwork is in order. Our team will guide you through each step.",
  },
];
