import fetcher from "@/utilities/fetcher";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const useGetSingleInventory = (id: string | undefined) => {
  return useQuery({
    queryKey: ["get-single-inventory", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await fetcher().get(`/inventory/${id}`);
      return data as Prisma.InventoryGetPayload<{
        include: {
          item: true;
        };
      }>;
    },
    retry: 1,
  });
};

export default useGetSingleInventory;
