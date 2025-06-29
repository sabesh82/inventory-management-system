"use client";

import Button, { ButtonVariants } from "@/components/Button";
import Table from "@/components/Table";
import { cn } from "@/utilities/cn";
import Link from "next/link";
import useGetInventory from "../apiHooks/inventory/useGetInventory";
import currencyFormatter from "@/utilities/currencyFormatter";
import useDeleteInventory from "../apiHooks/inventory/useDeleteInventory";
import queryClient from "../api/queryClient";
import { Inventory } from "@prisma/client";
import { useState } from "react";
import useUpdateInventory from "../apiHooks/inventory/useUpdateInventory";

export default function Home() {
  const { data: inventoryList, isPending: isInventoryLoading } =
    useGetInventory();

  const { mutateAsync: deleteInventory, isPending: isInventoryDeleteLoading } =
    useDeleteInventory();

  const { mutateAsync: updateInventory, isPending: isUpdateInventoryLoading } =
    useUpdateInventory();

  const [rerender, setRerender] = useState(0);

  return (
    <section className="w-full flex-1 flex flex-col overflow-hidden">
      <header className="w-full border-b mx-auto max-w-screen-xl py-5 px-3 flex items-center justify-between gap-10">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Siddha Inventory
          </h3>

          
        </div>

        <div className="flex items-center justify-end gap-5">
          <Link
            href={"/manage-item"}
            className={cn(ButtonVariants({ variant: "primary" }))}
          >
            Manage Item
          </Link>
          <Link
            href={"/add-to-inventory"}
            className={cn(ButtonVariants({ variant: "primary" }))}
          >
            Add Item to inventory
          </Link>
        </div>
      </header>

      <div className="mt-10 w-full max-w-screen-xl mx-auto px-3 flex flex-col flex-1">
        {(!isInventoryLoading && !inventoryList) ||
          (inventoryList && inventoryList.length <= 0 && (
            <div className="w-full h-full flex-1 flex items-center justify-center">
              <p className="text-xs italic text-gray-600">
                No items in inventory
              </p>
            </div>
          ))}

        {!isInventoryLoading && inventoryList && inventoryList.length > 0 && (
          <Table key={rerender} wrapperClass="max-h-[75dvh]">
            <Table.Thead className="bg-gray-800">
              <Table.Tr className="bg-gray-800">
                <Table.Th className="text-xs w-full">Item</Table.Th>
                <Table.Th className="text-xs">Dealer</Table.Th>
                <Table.Th className="text-xs text-center">Price</Table.Th>
                <Table.Th className="text-xs text-center">Quantity</Table.Th>
                <Table.Th className="text-xs text-center"></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {inventoryList.map((inventory) => (
                <Table.Tr key={inventory.id}>
                  <Table.Td className="text-xs">
                    <div className="">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {inventory.item.name}
                      </h2>

                      <p className="text-xs text-gray-600">
                        {inventory.item.description}
                      </p>
                    </div>
                  </Table.Td>

                  <Table.Td className="text-xs whitespace-nowrap">
                    {inventory.item.dealerEmail}
                  </Table.Td>

                  <Table.Td className="text-xs whitespace-nowrap text-right">
                    {currencyFormatter(inventory.item.price)}
                  </Table.Td>

                  <Table.Td className="text-xs text-center">
                    <div className="w-full flex items-center justify-center gap-3">
                      <Button
                        disabled={inventory.quantity <= 0}
                        onClick={() => {
                          let q = inventory.quantity;

                          queryClient.setQueryData<Inventory[]>(
                            ["get-inventory"],
                            (values) => {
                              if (values && inventory.quantity > 0) {
                                const temp = [...values];
                                temp.map((i) => {
                                  if (i.id === inventory.id) {
                                    i.quantity = i.quantity - 1;
                                    q--;
                                  }
                                  return i;
                                });
                                setRerender((pv) => pv + 1);
                                return temp;
                              }
                            }
                          );

                          updateInventory({
                            id: inventory.id,
                            payload: {
                              itemId: inventory.item.id,
                              quantity: q.toString(),
                            },
                          });
                        }}
                        variant={"unstyled"}
                        className={
                          "rounded-full aspect-square flex items-center justify-center p-1 md:p-1 hover:bg-red-200 bg-red-100 text-red-600"
                        }
                      >
                        -
                      </Button>
                      {inventory.quantity}
                      <Button
                        onClick={() => {
                          let q = inventory.quantity;

                          queryClient.setQueryData<Inventory[]>(
                            ["get-inventory"],
                            (values) => {
                              if (values) {
                                const temp = [...values];
                                temp.map((i) => {
                                  if (i.id === inventory.id) {
                                    i.quantity = i.quantity + 1;
                                    q++;
                                  }
                                  return i;
                                });
                                setRerender((pv) => pv + 1);
                                return temp;
                              }
                            }
                          );

                          updateInventory({
                            id: inventory.id,
                            payload: {
                              itemId: inventory.item.id,
                              quantity: q.toString(),
                            },
                          });
                        }}
                        variant={"unstyled"}
                        className={
                          "rounded-full aspect-square hover:bg-green-200 flex items-center justify-center p-1 md:p-1 bg-green-100 text-green-600"
                        }
                      >
                        +
                      </Button>
                    </div>
                  </Table.Td>

                  {/* controls */}
                  <Table.Td className="text-xs text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/add-to-inventory/${inventory.id}`}
                        className="text-sm font-medium text-green-700 hover:underline block"
                      >
                        Edit
                      </Link>
                      <Button
                        onClick={async () => {
                          await deleteInventory(inventory.id);
                          await queryClient.invalidateQueries({
                            queryKey: ["get-inventory"],
                          });
                        }}
                        variant={"ghost"}
                        className={"hover:underline text-red-700"}
                      >
                        {isInventoryDeleteLoading ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </Table.Td>
                  {/* controls */}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </div>
    </section>
  );
}
