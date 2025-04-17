import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Example icons from lucide-react (used in shadcn)
import { Map, DollarSign, Handshake, Sprout } from "lucide-react";

export default function AboutUsContent() {
  return (
    <section className="bg-[#FDF8F2] py-16">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Main Heading */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          {/* Left Column: Label + Heading */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#3f4f24]">
              Why Landivo?
            </p>
            <h2 className="mt-3 text-4xl font-medium leading-tight text-[#384620] sm:text-4xl">
            What Sets Us Apart
            </h2>
          </div>

          {/* Right Column: Paragraph */}
          <div className="flex items-center">
            <p className="text-lg leading-relaxed text-gray-600">
              At Landivo, we’re passionate about connecting buyers with
              exclusive land opportunities you won’t find anywhere else. As a
              dedicated land wholesaling company, we specialize in sourcing
              off-market properties and making them accessible to you through
              flexible, buyer-friendly solutions.
            </p>
          </div>
        </div>

        {/* 4-Card Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* CARD 1 */}
          <Card className="rounded-lg border border-gray-200 bg-[#e8efdc] p-6 shadow-sm">
            <CardHeader className="p-0">
              {/* Icon circle with gold color */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(212,160,23,0.1)] shadow-md shadow-[rgba(212,160,23,0.2)]">
                <Map className="h-6 w-6 text-[#D4A017]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Off-Market Expertise
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                We uncover hidden land deals, giving you first access to unique
                properties.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* CARD 2 */}
          <Card className="rounded-lg border border-gray-200 bg-[#e8efdc] p-6 shadow-sm">
            <CardHeader className="p-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(212,160,23,0.1)] shadow-md shadow-[rgba(212,160,23,0.2)]">
                <DollarSign className="h-6 w-6 text-[#D4A017]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Flexible Financing
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                Most deals include seller financing, tailored to your budget,
                with minimal credit checks.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* CARD 3 */}
          <Card className="rounded-lg border border-gray-200 bg-[#e8efdc] p-6 shadow-sm">
            <CardHeader className="p-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(212,160,23,0.1)] shadow-md shadow-[rgba(212,160,23,0.2)]">
                <Handshake className="h-6 w-6 text-[#D4A017]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Buyer-First Approach
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                From start to finish, we streamline your path to ownership with
                clear terms and fast closings.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* CARD 4 */}
          <Card className="rounded-lg border border-gray-200 bg-[#e8efdc] p-6 shadow-sm">
            <CardHeader className="p-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(212,160,23,0.1)] shadow-md shadow-[rgba(212,160,23,0.2)]">
                <Sprout className="h-6 w-6 text-[#D4A017]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Let’s Build Your Future
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-gray-600">
                Whether you’re a first-time buyer or investor, we’ll help you
                find and own the perfect lot.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
