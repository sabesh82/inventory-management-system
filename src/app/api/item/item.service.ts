import { Prisma } from "@prisma/client";
import prisma from "@/configs/prisma.configs";

export const createItem = async (args: Prisma.ItemCreateArgs) => {
  return await prisma.item.create(args);
};

export const updateItem = async (args: Prisma.ItemUpdateArgs) => {
  return await prisma.item.update(args);
};

export const getItems = async (where: Prisma.ItemFindManyArgs) => {
  return await prisma.item.findMany(where);
};

export const getItem = async (where: Prisma.ItemFindUniqueArgs) => {
  return await prisma.item.findUnique(where);
};

export const deleteItem = async (where: Prisma.ItemDeleteArgs) => {
  return await prisma.item.delete(where);
};
