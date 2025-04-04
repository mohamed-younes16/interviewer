import { adminAuth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ user: decodedToken }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
