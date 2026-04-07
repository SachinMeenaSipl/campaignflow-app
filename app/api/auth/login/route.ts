import { NextResponse } from "next/server";

import { getUserByEmail } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const user = await getUserByEmail(body.email);

  if (!user || user.password !== body.password) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({
    message: "Login successful.",
    token: `mock-session-${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}
