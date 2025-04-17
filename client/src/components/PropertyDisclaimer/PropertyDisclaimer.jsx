import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function PropertyDisclaimer() {
  return (
    <Card className="bg-white text-gray-400 text-xs w-full border-none shadow-none rounded-none">
      <CardContent className="leading-tight p-0 text-justify">
        <p className="font-semibold text-gray-500">Disclaimer:</p>
        <p>
          Dear Visitor, This is a broker price opinion or comparative market
          analysis and should not be considered an appraisal or opinion of
          value. In making any decision that relies upon our work, you should
          know that we have not followed the guidelines for the development of
          an appraisal or analysis contained in the Uniform Standards of
          Professional Appraisal Practice of the Appraisal Foundation. Always
          perform your due diligence to verify any numbers presented before
          signing a contract to purchase. Landers Investment LLC has an
          equitable interest in this property and does not claim to be the
          owner. Managing Members of Landers Investment LLC holds active real
          estate licenses in the state of Texas. We do NOT represent you as your
          real estate agent in any capacity whatsoever unless agreed upon by all
          parties in writing. Selling through an assignment of contract. LANDERS
          INVESTMENT is selling an option or assigning an interest in a contract
          and does not represent, warrant, or claim to be the owner of or
          currently possess legal title to this, or any of the properties we
          market for sale. All properties are subject to errors, omissions,
          deletions, additions, and cancellations. All properties are sold as
          is, where is, with absolutely no representations written or oral.
          Buyer is to do their own independent due diligence. The property will
          not be considered under contract until the signed contract and earnest
          money are received with all contingencies removed. - Landivo Team
        </p>
      </CardContent>
    </Card>
  );
}
