import { useQuery } from "react-query";
import { getAllBuyers } from "../../utils/api";

const useBuyers = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allBuyers",
    getAllBuyers,
    { refetchOnWindowFocus: false }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useBuyers;