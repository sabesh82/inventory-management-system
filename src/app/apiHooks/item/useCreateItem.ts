"use client";
import { ItemInput } from "@/app/api/item/ItemSchema";
import fetcher from "@/utilities/fetcher";
import { useMutation } from "@tanstack/react-query";

const useCreateItem = () => {
  return useMutation({
    mutationKey: ["use-create-item"],
    mutationFn: async (item: ItemInput) => {
      const { data } = await fetcher().post("/item", item);
      return data;
    },
  });
};

export default useCreateItem;
