// inventory.service.ts
import { Prisma } from "@prisma/client";
import prisma from "@/configs/prisma.configs";

export const createInventory = async (args: Prisma.InventoryCreateArgs) => {
  return await prisma.inventory.create(args);
};

export const updateInventory = async (args: Prisma.InventoryUpdateArgs) => {
  return await prisma.inventory.update(args);
};

export const getInventory = async (where: Prisma.InventoryFindUniqueArgs) => {
  return await prisma.inventory.findUnique(where);
};

export const getInventoryList = async (where: Prisma.InventoryFindManyArgs) => {
  return await prisma.inventory.findMany(where);
};

export const deleteInventory = async (where: Prisma.InventoryDeleteArgs) => {
  return await prisma.inventory.delete(where);
};
