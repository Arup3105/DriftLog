import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";

// /api/settings — get current settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById((session.user as any).id).select("name email githubToken");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    name: user.name,
    email: user.email,
    hasGithubToken: !!user.githubToken,
    githubTokenPreview: user.githubToken
      ? `${user.githubToken.slice(0, 8)}${"•".repeat(20)}`
      : null,
  });
}

// /api/settings — update GitHub token
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { githubToken } = await req.json();
  if (!githubToken) return NextResponse.json({ error: "Token is required" }, { status: 400 });

  await connectDB();
  await User.findByIdAndUpdate((session.user as any).id, { githubToken });

  return NextResponse.json({ message: "GitHub token saved successfully" });
}
