import { NextResponse } from "next/server";
import privateRoute from "../privateRoute";

export async function GET() {
  return privateRoute(async (user) => {
    return NextResponse.json({
      message: "User info",
      user,
    });
  });
}
