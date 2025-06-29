import { NextResponse } from "next/server";
import privateRoute from "../../auth/privateRoute";
import { getItem } from "../item.service";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return privateRoute(async () => {
    const { id } = params;

    try {
      const item = await getItem({
        where: { id },
      });

      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      return NextResponse.json(item);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  });
}
