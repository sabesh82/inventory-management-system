"use client";
import { InventoryInput } from "@/app/api/inventory/InventorySchema";
import fetcher from "@/utilities/fetcher";
import { Inventory } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

const useCreateInventory = () => {
  return useMutation({
    mutationKey: ["use-create-inventory"],
    mutationFn: async (inventory: InventoryInput) => {
      const { data } = await fetcher().post("/inventory", inventory);
      return data as Inventory;
    },
  });
};

export default useCreateInventory;
