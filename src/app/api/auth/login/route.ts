import { NextResponse } from "next/server";
import { getUser } from "../auth.service";
import { LoginSchema } from "../UserSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request body
    const body = await request.json();
    const loginInput = LoginSchema.parse(body);

    const { email, password } = loginInput;

    // Find the user in the database by email
    const user = await getUser({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // Token will expire in 1 hour
    );

    // Return the token
    return NextResponse.json(
      { message: "Login successful", user, token },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If validation error, return detailed message
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
