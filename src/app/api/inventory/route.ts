import OutOfStock from "@/email/OutOfStock";
import { sendEmail } from "@/configs/nodemailer.config";
import { Prisma } from "@prisma/client";
import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import privateRoute from "../auth/privateRoute";
import { InventorySchema } from "./InventorySchema";
import {
  createInventory,
  deleteInventory,
  getInventoryList,
  updateInventory,
} from "./inventory.service";

// POST: Create Inventory
export async function POST(req: Request) {
  return privateRoute(async () => {
    try {
      const body = await req.json();
      const parsedBody = InventorySchema.parse(body); // Validate the request body with Zod

      const newInventory = await createInventory({
        data: {
          item: {
            connect: {
              id: parsedBody.itemId,
            },
          },
          quantity: parseInt(parsedBody.quantity),
        },
      });

      return NextResponse.json(newInventory, { status: 201 });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 }); // Handle Zod validation errors
      }
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}

// GET: Get Inventory
export async function GET() {
  return privateRoute(async () => {
    try {
      const inventories = await getInventoryList({
        include: {
          item: true,
        },
      });

      return NextResponse.json(inventories);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}

// PUT: Update Inventory
export async function PUT(req: Request) {
  return privateRoute(async () => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      const body = await req.json();
      const parsedBody = InventorySchema.parse(body); // Validate the request body

      const updatedInventory = (await updateInventory({
        where: { id },
        data: { ...parsedBody, quantity: parseInt(parsedBody.quantity) },
        include: {
          item: true,
        },
      })) as Prisma.InventoryGetPayload<{
        include: {
          item: true;
        };
      }>;

      if (updatedInventory.quantity < 5) {
        sendEmail({
          to: updatedInventory.item.dealerEmail,
          subject: `OUT OF STOCK : ${updatedInventory.item.name}.`,
          template: await render(
            OutOfStock({
              dealer: updatedInventory.item.dealerEmail,
              item: updatedInventory.item.name,
            })
          ),
        });
      }

      return NextResponse.json(updatedInventory);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({ errors: error.errors }, { status: 400 }); // Handle Zod validation errors
      }
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}

// DELETE: Delete Inventory
export async function DELETE(req: Request) {
  return privateRoute(async () => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      await deleteInventory({
        where: { id },
      });

      return NextResponse.json(
        { message: "Inventory deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
