"use client";
import fetcher from "@/utilities/fetcher";
import { useMutation } from "@tanstack/react-query";

const useDeleteInventory = () => {
  return useMutation({
    mutationKey: ["use-delete-inventory"],
    mutationFn: async (id: string) => {
      const { data } = await fetcher().delete(`/inventory?id=${id}`);
      return data;
    },
  });
};

export default useDeleteInventory;
