"use client";

import {
  InventoryInput,
  InventorySchema,
} from "@/app/api/inventory/InventorySchema";
import queryClient from "@/app/api/queryClient";
import useGetSingleInventory from "@/app/apiHooks/inventory/useGetSingleInventory";
import useUpdateInventory from "@/app/apiHooks/inventory/useUpdateInventory";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm<InventoryInput>({
    mode: "onSubmit",
    resolver: zodResolver(InventorySchema),
  });
  const { id } = useParams<{ id: string }>();

  const { data: inventoryDetails, isPending: isInventoryDetailsLoading } =
    useGetSingleInventory(id);

  const { mutateAsync: updateInventory, isPending: isUpdateInventoryLoading } =
    useUpdateInventory();

  useEffect(() => {
    if (inventoryDetails) {
      setTimeout(() => {
        reset({
          itemId: inventoryDetails.itemId,
          quantity: inventoryDetails.quantity.toString(),
        });
      }, 50);
    }
  }, [inventoryDetails, reset]);

  return (
    <section className="w-full flex-1 flex flex-col overflow-hidden">
      <header className="w-full border-b mx-auto max-w-screen-xl py-5 px-3 flex items-center justify-between gap-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Siddha Inventory / Add to inventory
          </h3>

        </div>
      </header>

      {!isInventoryDetailsLoading && (
        <div className="mt-10 w-full max-w-xl mx-auto">
          <form
            onSubmit={handleSubmit(async (values) => {
              await updateInventory({ id, payload: values });
              await queryClient.invalidateQueries({
                queryKey: ["get-inventory"],
              });
              router.push("/");
            })}
            className="w-full space-y-4"
          >
            <fieldset disabled={isUpdateInventoryLoading}>
              <div className="flex items-start justify-between gap-5 w-full">
                <Input
                  type="number"
                  className={"w-full"}
                  Label={"Quantity"}
                  placeholder="Enter quantity"
                  {...register("quantity")}
                  error={errors.quantity?.message}
                />
              </div>

              <Button
                type="submit"
                isLoading={isUpdateInventoryLoading}
                wrapperClass="w-full mt-5"
                className={"w-full"}
              >
                {isUpdateInventoryLoading ? "Loading..." : "Add"}
              </Button>
            </fieldset>
          </form>
        </div>
      )}
    </section>
  );
};

export default Page;
