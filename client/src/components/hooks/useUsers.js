import { useQuery } from "react-query";
import { getAllUsers } from "../../utils/api";

const useUsers = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "allUsers",
    getAllUsers,
    { refetchOnWindowFocus: false }
  );

  return {
    data,
    isError,
    isLoading,
    refetch,
  };
};

export default useUsers;