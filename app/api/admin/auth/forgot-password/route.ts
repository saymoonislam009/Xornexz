import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          email: cleanEmail,
          token,
          expires,
        },
      });

      // Token is only written to private server logs (no email provider configured for admins).
      console.log(`[Password Reset] Link generated for ${cleanEmail}: /admin/login/reset-password?token=${token}`);
    }

    return NextResponse.json({ message: "Password reset link sent if email exists." });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
