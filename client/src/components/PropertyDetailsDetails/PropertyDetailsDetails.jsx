"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Lucide Icons (https://lucide.dev/icons)
import {
  CarFront,
  UtilityPole,
  MapPinned,
  UmbrellaOff,
  NotebookPen,
  DollarSign,
  Home,
  Info,
} from "lucide-react";
import PropertyMap from "../PropertyMap/PropertyMap";
import PaymentCalculatorFront from "@/components/PaymentCalculator/PaymentCalculatorFront";
import PreQualification from "@/components/PreQualification/PreQualification";

export default function PropertyDetailsDetails({ propertyData }) {
  return (
    <div className="bg-[FFF] text-[var(--text)]">
      {/* Two columns: "Location" & "Property details" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Location */}
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4 tracking-tight">
            Location
          </h2>
          <Table className="w-full text-lg">
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Street Address
                </TableCell>
                <TableCell>{propertyData.streetAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  County
                </TableCell>
                <TableCell>{propertyData.county}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  State
                </TableCell>
                <TableCell>{propertyData.state}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">Zip</TableCell>
                <TableCell>{propertyData.zip}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Coordinates
                </TableCell>
                <TableCell>
                  <span className="flex justify-between items-center w-full">
                    {/* Display Coordinates */}
                    <span>
                      {propertyData.latitude}, {propertyData.longitude}
                    </span>

                    {/* Car Icon as a Button */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${propertyData.latitude},${propertyData.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2"
                    >
                      <CarFront className="w-6 h-6 text-gray-600" />
                    </a>
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Right Column: Property details */}
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4 tracking-tight">
            Property Details
          </h2>
          <Table className="w-full text-lg">
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Size
                </TableCell>
                <TableCell>{propertyData.sqft?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Acreage
                </TableCell>
                <TableCell>{propertyData.acre}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Zoning
                </TableCell>
                <TableCell>{propertyData.zoning}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Parcel
                </TableCell>
                <TableCell>{propertyData.apnOrPin}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Legal Description
                </TableCell>
                <TableCell>{propertyData.legalDescription}</TableCell>
              </TableRow>
              {/* Add more property fields as needed */}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Accordion sections (sample items with icons) */}
      <Accordion type="single" collapsible className="mt-8 space-y-2">
        <AccordionItem value="Direction" className="border-b border-[#c1d7d3]">
          <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
            <div className="flex items-center gap-2">
              <CarFront className="w-6 h-6 text-gray-600" />
              <span>Direction</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <span className="flex items-center gap-2 text-base">
              {propertyData.direction && <span>{propertyData.direction}.</span>}
              <p>For driving directions,</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${propertyData.latitude},${propertyData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link" className="text-primary px-0 text-base">
                  Click here
                </Button>
              </a>
            </span>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Untilities" className="border-b border-[#c1d7d3]">
          <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
            <div className="flex items-center gap-2">
              <UtilityPole className="w-6 h-6 text-gray-600" />
              <span>Utilites & Infrastructure</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Table className="w-[70%] text-lg">
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Water
                  </TableCell>
                  <TableCell>{propertyData.water}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Sewer
                  </TableCell>
                  <TableCell>{propertyData.sewer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Electricity
                  </TableCell>
                  <TableCell>{propertyData.electric}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Road Condition
                  </TableCell>
                  <TableCell>{propertyData.roadCondition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Mobile Home Friendly
                  </TableCell>
                  <TableCell>{propertyData.mobileHomeFriendly}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>

        <Accordion
          type="single"
          collapsible
          defaultValue="Map"
          className="mt-8 space-y-2"
        >
          <AccordionItem value="Map" className="border-b border-[#c1d7d3]">
            <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
              <div className="flex items-center gap-2">
                <MapPinned className="w-6 h-6 text-gray-600" />
                <span>Map</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PropertyMap propertyData={propertyData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {propertyData.financing === "Available" && (
          <Accordion
            type="single"
            collapsible
            defaultValue="MonthlyPayment"
            className="mt-8 space-y-2"
          >
            <AccordionItem
              value="MonthlyPayment"
              className="border-b border-[#c1d7d3]"
            >
              <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-gray-600" />
                  <span>Monthly Payment</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <PaymentCalculatorFront propertyData={propertyData} />
                <PreQualification />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {propertyData.hoaPoa === "Yes" && (
          <AccordionItem value="HOA" className="border-b border-[#c1d7d3]">
            <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
              <div className="flex items-center gap-2">
                <Home className="w-6 h-6 text-gray-600" />
                <span>Homeowners Association</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-base tracking-tight">
                Total {propertyData.hoaPaymentTerms} Association Fee: $
                {propertyData.hoaFee}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        {propertyData.floodplain !== "No" && (
          <AccordionItem
            value="Enviromental Risk"
            className="border-b border-[#c1d7d3]"
          >
            <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
              <div className="flex items-center gap-2">
                <UmbrellaOff className="w-6 h-6 text-gray-600" />
                <span>Enviromental Risk</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table className="w-[50%] text-base tracking-tight">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-gray-700">
                      Floodplain
                    </TableCell>
                    <TableCell>{propertyData.floodplain}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        )}
        {propertyData.notes && (
          <AccordionItem value="Notes" className="border-b border-[#c1d7d3]">
            <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
              <div className="flex items-center gap-2">
                <Info className="w-6 h-6 text-gray-600" />
                <span>Additional Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="text-base"
                dangerouslySetInnerHTML={{ __html: propertyData.notes }}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        <Accordion type="single" collapsible defaultValue="Notes">
          <AccordionItem value="Notes" className="border-b border-[#c1d7d3]">
            <AccordionTrigger className="flex items-center justify-between w-full text-left text-xl font-medium text-gray-800 tracking-tight">
              <div className="flex items-center gap-2">
                <NotebookPen className="w-6 h-6 text-gray-600" />
                <span>Buyer Guidelines</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-base w-[75%]">
                <p> Buyer pays ALL closing costs.</p>
                <p> Cash OR Hard Money Only.</p>
                <p>
                  {" "}
                  A $395 transaction fee applies to each contract and is payable
                  by the buyer.
                </p>
                <p> This Property is being sold AS-IS.</p>
                <p> No Daisy Chaining – No Option Period.</p>
                <p> Due diligence required before submitting an offer.</p>
                <p>
                  {" "}
                  Agents, please add your commission to the buyer's sales price.
                </p>
                <p> Earnest money deposit varies per property.</p>
                <p> Closing ASAP.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Accordion>
    </div>
  );
}
