import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { createUser, getUser } from "../auth.service";
import { UserSchema } from "../UserSchema";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request body using Zod schema
    const body = await request.json();
    const userInput = UserSchema.parse(body);

    const { name, email, password } = userInput;

    // Check if the user already exists
    const existingUser = await getUser({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await createUser({
      data: {
        name,
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // Token will expire in 1 hour
    );

    return NextResponse.json(
      { message: "User registered successfully", token, user: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If validation error, return detailed message
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
