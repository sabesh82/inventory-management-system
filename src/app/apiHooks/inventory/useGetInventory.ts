import fetcher from "@/utilities/fetcher";
import { Inventory, Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useGetInventory = () => {
  return useQuery({
    queryKey: ["get-inventory"],
    queryFn: async () => {
      const { data } = await fetcher().get(`/inventory`);
      return data as Prisma.InventoryGetPayload<{
        include: {
          item: true;
        };
      }>[];
    },
    retry: 1,
  });
};

export default useGetInventory;
