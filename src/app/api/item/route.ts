import { NextResponse } from "next/server";
import { ZodError } from "zod";
import privateRoute from "../auth/privateRoute";
import { ItemSchema } from "./ItemSchema";
import { createItem, deleteItem, getItems, updateItem } from "./item.service";

// POST: Create Item
export async function POST(req: Request) {
  return privateRoute(async () => {
    try {
      const body = await req.json();
      const parsedBody = ItemSchema.parse(body); // Validate the request body with Zod

      const newItem = await createItem({
        data: { ...parsedBody, price: parseFloat(parsedBody.price) },
      });

      return NextResponse.json(newItem, { status: 201 });
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

// GET: Get Items
export async function GET() {
  return privateRoute(async () => {
    try {
      const items = await getItems({});

      return NextResponse.json(items);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}

// PUT: Update Item
export async function PUT(req: Request) {
  return privateRoute(async () => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      const body = await req.json();
      console.log({ body });
      const parsedBody = ItemSchema.parse(body); // Validate the request body

      const updatedItem = await updateItem({
        where: { id },
        data: { ...parsedBody, price: parseFloat(parsedBody.price) },
      });

      return NextResponse.json(updatedItem);
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

// DELETE: Delete Item
export async function DELETE(req: Request) {
  return privateRoute(async () => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      await deleteItem({
        where: { id },
      });

      return NextResponse.json(
        { message: "Item deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
