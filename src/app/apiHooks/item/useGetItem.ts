import fetcher from "@/utilities/fetcher";
import { Item } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useGetItems = () => {
  return useQuery({
    queryKey: ["get-items"],
    queryFn: async () => {
      const { data } = await fetcher().get(`/item`);
      return data as Item[];
    },
    retry: 1,
  });
};

export default useGetItems;
