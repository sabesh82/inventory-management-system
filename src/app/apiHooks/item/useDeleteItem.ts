"use client";
import fetcher from "@/utilities/fetcher";
import { useMutation } from "@tanstack/react-query";

const useDeleteItem = () => {
  return useMutation({
    mutationKey: ["use-delete-item"],
    mutationFn: async (id: string) => {
      const { data } = await fetcher().delete(`/item?id=${id}`);
      return data;
    },
  });
};

export default useDeleteItem;
