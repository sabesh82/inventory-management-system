"use client";
import { ItemInput } from "@/app/api/item/ItemSchema";
import fetcher from "@/utilities/fetcher";
import { useMutation } from "@tanstack/react-query";

export type UpdateItemOptions = {
  id: string;
  payload: ItemInput;
};
const useUpdateItem = () => {
  return useMutation({
    mutationKey: ["use-update-item"],
    mutationFn: async ({ id, payload }: UpdateItemOptions) => {
      const { data } = await fetcher().put(`/item?id=${id}`, payload);
      return data;
    },
  });
};

export default useUpdateItem;
