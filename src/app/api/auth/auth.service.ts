import { Prisma } from "@prisma/client";
import prisma from "@/configs/prisma.configs";

export const createUser = async (args: Prisma.UserCreateArgs) => {
  return await prisma.user.create(args);
};

export const updateUser = async (args: Prisma.UserUpdateArgs) => {
  return await prisma.user.update(args);
};

export const getUser = async (where: Prisma.UserFindUniqueArgs) => {
  return await prisma.user.findUnique(where);
};
