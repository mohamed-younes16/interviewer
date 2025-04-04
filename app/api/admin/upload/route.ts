import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Interview } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const adminUid: string = process.env.ADMIN_UID!;

export async function POST(req: NextRequest) {
  try {
    const { token, data }: { token: string; data: Interview[] } = await req.json();

    console.log(token);

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.uid !== adminUid) {
      return NextResponse.json(
        { message: "Unauthorized admin" },
        { status: 403 }
      );
    }

    const collectionRef = adminDb.collection("templates");
    await Promise.all(data.map((interview) => collectionRef.add(interview)));

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Auth Error:", error);

    const err = error as { code?: string; message?: string };

    if (err.code === "auth/argument-error" || err.code === "auth/id-token-expired") {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
