"use client";
import { InventoryInput } from "@/app/api/inventory/InventorySchema";
import fetcher from "@/utilities/fetcher";
import { Inventory } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

const useUpdateInventory = () => {
  return useMutation({
    mutationKey: ["use-update-inventory"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: InventoryInput;
    }) => {
      try {
        const { data } = await fetcher().put(`/inventory?id=${id}`, payload);
        return data as Inventory;
      } catch (error) {
        console.log({ error });
      }
    },
  });
};

export default useUpdateInventory;
