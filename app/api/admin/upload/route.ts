import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Interview } from "@/types";
import next from "next";
import { NextRequest, NextResponse } from "next/server";
const adminUid: string = process.env.ADMIN_UID!;
export async function POST(req: Request) {
  try {
    const { token, data }: { token: string; data: Interview[] } =
      await req.json();
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
    return NextResponse.json(
      { message: "success" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("Auth Error:", error.message);

    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/id-token-expired"
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 } // Unauthorized
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 } // Internal Server Error
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { isAdmin: false, message: "No token provided" },
        { status: 401 }
      );
    }
    console.log(authHeader);
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json(
        { isAdmin: false, message: "Invalid token format" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.uid !== adminUid) {
      return NextResponse.json(
        { isAdmin: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { isAdmin: true, message: "hello admin" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json(
      { isAdmin: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
