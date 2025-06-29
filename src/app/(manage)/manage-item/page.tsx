"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";
import currencyFormatter from "@/utilities/currencyFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemInput, ItemSchema } from "../../api/item/ItemSchema";
import queryClient from "../../api/queryClient";
import useCreateItem from "../../apiHooks/item/useCreateItem";
import useDeleteItem from "../../apiHooks/item/useDeleteItem";
import useGetItems from "../../apiHooks/item/useGetItem";
import useUpdateItem from "../../apiHooks/item/useUpdateItem";

const Page = () => {
  const [item, setItem] = useState<Item | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ItemInput>({
    mode: "onSubmit",
    resolver: zodResolver(ItemSchema),
  });

  const { mutateAsync: createItem, isPending: isCreateItemLoading } =
    useCreateItem();

  const { mutateAsync: updateItem, isPending: isUpdateItemLoading } =
    useUpdateItem();

  const { mutateAsync: deleteItem, isPending: isDeleteLoading } =
    useDeleteItem();

  const { data: items, isPending: isItemsLoading } = useGetItems();

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        price: item.price.toString(),
        description: item.description || "",
        dealerEmail: item.dealerEmail,
      });
    } else {
      reset({
        name: "",
        dealerEmail: "",
        description: "",
        price: "",
      });
    }
  }, [item, reset]);

  return (
    <section className="w-full flex-1 flex flex-col overflow-hidden">
      <header className="w-full border-b mx-auto max-w-screen-xl py-5 px-3 flex items-center justify-between gap-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Siddha Inventory / Create item
          </h3>

        </div>
      </header>

      <div className="w-full mt-10 pb-10 flex flex-1 overflow-y-auto items-start justify-between mx-auto max-w-screen-xl px-3 gap-10">
        <div className="w-[60%] flex-1 h-full flex flex-col">
          {isItemsLoading && (
            <div className="w-full h-full flex-1 flex items-center justify-center">
              <p className="text-xs italic text-gray-600">loading...</p>
            </div>
          )}

          {!isItemsLoading && items && items.length > 0 && (
            <Table wrapperClass="max-h-[75dvh]">
              <Table.Thead className="bg-gray-800">
                <Table.Tr className="bg-gray-800">
                  <Table.Th className="text-xs">Name</Table.Th>
                  <Table.Th className="text-xs w-full">Description</Table.Th>
                  <Table.Th className="text-xs text-center">Price</Table.Th>
                  <Table.Th className="text-xs text-center">
                    Dealer name
                  </Table.Th>
                  <Table.Th className="text-xs text-center"></Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {(items as Item[]).map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td className="text-xs">{item.name}</Table.Td>

                    <Table.Td className="text-xs">{item.description}</Table.Td>

                    <Table.Td className="text-xs whitespace-nowrap text-right">
                      {currencyFormatter(item.price)}
                    </Table.Td>

                    <Table.Td className="text-xs whitespace-nowrap">
                      {item.dealerEmail}
                    </Table.Td>

                    {/* controls */}
                    <Table.Td className="text-xs text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          onClick={() => setItem(item)}
                          variant={"ghost"}
                          className={"hover:underline text-green-700"}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={async () => {
                            await deleteItem(item.id);
                            await queryClient.invalidateQueries({
                              queryKey: ["get-items"],
                            });
                          }}
                          variant={"ghost"}
                          className={"hover:underline text-red-700"}
                        >
                          {isDeleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </Table.Td>
                    {/* controls */}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}

          {!isItemsLoading && (!items || (items && items.length <= 0)) && (
            <div className="w-full h-full flex-1 flex items-center justify-center">
              <p className="text-xs italic text-gray-600">No items to show</p>
            </div>
          )}
        </div>
        <div className="w-[40%]">
          <div className="w-full max-w-xl mx-auto">
            <form
              onSubmit={handleSubmit(async (values) => {
                if (item) {
                  await updateItem({ id: item.id, payload: values });
                } else {
                  await createItem(values);
                }
                await queryClient.invalidateQueries({
                  queryKey: ["get-items"],
                });
                reset({
                  name: "",
                  price: "",
                  dealerEmail: "",
                  description: "",
                });
                setItem(null);
              })}
              className="w-full space-y-4"
            >
              <fieldset disabled={isCreateItemLoading || isUpdateItemLoading}>
                <Input
                  Label={"Name"}
                  description="Enter the name of the drug"
                  placeholder="Enter name"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <TextArea
                  Label={"Description"}
                  description="Enter the description of the drug"
                  placeholder="Enter Description"
                  rows={5}
                  {...register("description")}
                  error={errors.description?.message}
                />

                <div className="flex items-center justify-between gap-5 w-full">
                  <Input
                    type="number"
                    className={"w-full"}
                    Label={"Price"}
                    placeholder="Enter price"
                    {...register("price")}
                    error={errors.price?.message}
                  />
                  <Input
                    className={"w-full"}
                    Label={"Dealer email"}
                    placeholder="Enter dealer email"
                    {...register("dealerEmail")}
                    error={errors.dealerEmail?.message}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  {item && (
                    <Button
                      onClick={() => setItem(null)}
                      isLoading={isCreateItemLoading}
                      variant={"secondary"}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    isLoading={isCreateItemLoading || isUpdateItemLoading}
                    type="submit"
                    wrapperClass="w-full"
                    className={"w-full"}
                  >
                    {isCreateItemLoading || isUpdateItemLoading
                      ? "Loading..."
                      : item
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
