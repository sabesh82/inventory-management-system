import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Ensure to set your JWT secret in an environment variable
const JWT_SECRET = process.env.JWT_SECRET as string; // Make sure this is set in your .env file

export default async function privateRoute(
  fn: (
    user: { id: string; email: string; name: string },
    token: string
  ) => Promise<NextResponse<unknown>> | NextResponse<unknown>
): Promise<NextResponse<unknown>> {
  const authorization = headers().get("Authorization");
  let token: string | null = null;

  // Check for Bearer token
  if (authorization?.startsWith("Bearer ")) {
    token = authorization.split("Bearer ")[1];
  }

  // If no token is found, return an unauthorized response
  if (!token) {
    return NextResponse.json(
      { error: "invalid-token", message: "Invalid token" },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };

    // Call the provided function with the decoded token data
    return await fn(decodedToken, token);
  } catch (error: any) {
    console.error({ error });

    // Handle JWT specific errors
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "not-authorized", message: "Invalid token" },
        { status: 401 }
      );
    }
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "token-expired", message: "Token Expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "not-authorized", message: "Not Authorized" },
      { status: 401 }
    );
  }
}
