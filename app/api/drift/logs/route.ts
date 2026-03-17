import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { DriftLog } from "@/models";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const repoId = searchParams.get("repoId");
    if (!repoId) return NextResponse.json({ error: "repoId required" }, { status: 400 });

    await connectDB();

    // Get the latest drift log for repo
    const log = await DriftLog.findOne({
        repoId,
        userId: (session.user as any).id,
    }).sort({ checkedAt: -1 });

    return NextResponse.json(log);
}