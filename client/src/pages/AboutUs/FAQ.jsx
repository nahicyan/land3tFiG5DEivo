import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="w-full bg-[#FDF8F2] py-16">
      <div className="mx-auto max-w-screen-xl px-4 md:flex md:items-start">
        {/* LEFT COLUMN: FAQ Heading */}
        <div className="w-full md:w-1/3">
          <p className="mb-2 text-sm uppercase tracking-wide text-[#0F4C5C]">
            FAQ
          </p>
          <h2 className="text-4xl font-bold leading-tight text-black">
            Frequently Asked Questions
          </h2>
        </div>

        {/* RIGHT COLUMN: FAQ Questions */}
        <div className="w-full md:w-2/3">
          <Accordion type="single" collapsible className="w-full">
            
            {/* Question 1 */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-black">
                How does seller financing work at Landivo?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Seller financing allows you to purchase land directly from us 
                with flexible terms—no bank required. Most deals require low 
                down payments, and some may include a quick credit check to 
                offer you the best terms.
              </AccordionContent>
            </AccordionItem>

            {/* Question 2 */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-black">
                Do I need a credit check to buy land?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Most of our properties do not require credit checks. However, 
                for certain deals, we may conduct a brief credit check to 
                tailor the best financing terms for you.
              </AccordionContent>
            </AccordionItem>

            {/* Question 3 */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-black">
                What are the payment options?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                We offer multiple payment plans, including monthly installments 
                starting as low as $200/month, making land ownership accessible 
                for everyone.
              </AccordionContent>
            </AccordionItem>

            {/* Question 4 */}
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-black">
                How soon can I take ownership of my land?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Once the down payment is processed and paperwork is completed, 
                you can take control of your land immediately. Full ownership 
                is granted upon completion of payments.
              </AccordionContent>
            </AccordionItem>

            {/* Question 5 */}
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-black">
                Can I visit the land before buying?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base">
                Yes! We encourage buyers to visit the property before making a 
                purchase. Contact us for location details and access information.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </section>
  );
}
