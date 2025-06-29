import { NextResponse } from "next/server";
import privateRoute from "../../auth/privateRoute";
import { getInventory } from "../inventory.service";

// GET: Get a single Inventory
export async function GET(_: Request, { params }: { params: { id: string } }) {
  return privateRoute(async () => {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
      const inventory = await getInventory({
        where: { id },
        include: {
          item: true,
        },
      });

      if (!inventory) {
        return NextResponse.json(
          { error: "Inventory not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(inventory);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
