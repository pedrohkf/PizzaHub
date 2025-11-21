import { NextResponse } from "next/server";

export async function ExitAccount() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // força expirar
  });

  return response;
}
