import { NextResponse } from "next/server";

import { createUser, getUserByEmail } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
  }

  if (await getUserByEmail(body.email)) {
    return NextResponse.json({ message: "A user with that email already exists." }, { status: 409 });
  }

  const user = await createUser({
    name: body.name,
    email: body.email,
    password: body.password
  });

  return NextResponse.json({
    message: "Registration successful.",
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}
