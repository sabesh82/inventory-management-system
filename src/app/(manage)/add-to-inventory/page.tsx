"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { Option, Select } from "@/components/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inventory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  InventoryInput,
  InventorySchema,
} from "../../api/inventory/InventorySchema";
import queryClient from "../../api/queryClient";
import useCreateInventory from "../../apiHooks/inventory/useCreateInventory";
import useGetItems from "../../apiHooks/item/useGetItem";

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

  const { data: items, isPending: isItemsLoading } = useGetItems();

  const { mutateAsync: createInventory, isPending: isCreateInventoryLoading } =
    useCreateInventory();

  return (
    <section className="w-full flex-1 flex flex-col overflow-hidden">
      <header className="w-full border-b mx-auto max-w-screen-xl py-5 px-3 flex items-center justify-between gap-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Siddha Inventory / Add to inventory
          </h3>

          
        </div>
      </header>

      {!isItemsLoading && (
        <div className="mt-10 w-full max-w-xl mx-auto">
          <form
            onSubmit={handleSubmit(async (values) => {
              await createInventory(values);
              await queryClient.invalidateQueries({
                queryKey: ["get-inventory"],
              });
              router.push("/");
            })}
            className="w-full space-y-4"
          >
            <fieldset disabled={isCreateInventoryLoading}>
              <div className="flex items-start justify-between gap-5 w-full">
                <Select
                  value={watch("itemId")}
                  onValueChange={(v) => setValue("itemId", v)}
                  label="Item"
                  placeholder="Select an item"
                >
                  {items &&
                    items.map((item) => {
                      const data = queryClient.getQueryData<Inventory[]>([
                        "get-inventory",
                      ]);

                      return !data?.some((d) => d.itemId === item.id) ? (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ) : null;
                    })}
                </Select>
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
                isLoading={isCreateInventoryLoading}
                wrapperClass="w-full mt-5"
                className={"w-full"}
              >
                {isCreateInventoryLoading ? "Loading..." : "Add"}
              </Button>
            </fieldset>
          </form>
        </div>
      )}
    </section>
  );
};

export default Page;
