import React, { useContext, useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getProperty, getAllProperties } from "../../utils/api";
import { UserContext } from "../../utils/UserContext";
import PropertyDetails from "../../components/PropertyDetails/PropertyDetails";
import PropertyHeaderLeft from "../../components/PropertyHeaderLeft/PropertyHeaderLeft";
import NearbySimilarProperties from "../../components/NearbySimilarProperties/NearbySimilarProperties";

const Property = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [propertyData, setPropertyData] = useState(null);
  const { currentUser } = useContext(UserContext);
  
  // Extract property ID from the URL
  const propertyId = pathname.split("/").slice(-1)[0];
  
  // Fetch property data using React Query
  const { data, isLoading, isError } = useQuery(
    ["resd", propertyId],
    () => getProperty(propertyId),
    { retry: 1, refetchOnWindowFocus: false }
  );
  
  // Fetch all properties for similar properties component
  const { data: allProperties } = useQuery(
    "allProperties",
    getAllProperties,
    { 
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      enabled: !!data // Only run this query after we have the current property data
    }
  );
  
  useEffect(() => {
    if (data) {
      setPropertyData(data);
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Error while fetching the property details. Please try again.
        </Typography>
      </Box>
    );
  }
  
  if (!propertyData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No property data available.</Typography>
      </Box>
    );
  }
  
  return (
    <div className="bg-[#FDF8F2] min-h-screen p-4 text-[#4b5b4d] flex justify-center">
      {/* Outer wrapper ensures content is centered */}
      <div className="max-w-screen-xl w-full bg-white rounded-lg shadow-md">
        {/* Property Header Sections Inline */}
        <div className="flex flex-col lg:flex-row w-full bg-[#FFF]">
          {/* Left Section */}
          <div className="w-full px-4">
            <div className="bg-[#FFF]">
              <PropertyHeaderLeft propertyData={propertyData} />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-[#FFF]">
          <PropertyDetails propertyData={propertyData} />
        </div>
        
        {/* Only render Nearby Similar Properties if we have all properties data */}
        {allProperties && allProperties.length > 0 && (
          <NearbySimilarProperties 
            currentProperty={propertyData}
            allProperties={allProperties}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

export default Property;