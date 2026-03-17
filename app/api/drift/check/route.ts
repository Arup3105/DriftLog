import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Repo, DriftLog, User } from "@/models";
import { detectDrift } from "@/lib/drift";

// /api/drift/check — run a drift check
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { repoId } = await req.json();
  if (!repoId) return NextResponse.json({ error: "repoId required" }, { status: 400 });

  await connectDB();

  const [repo, user] = await Promise.all([
    Repo.findOne({ _id: repoId, userId: (session.user as any).id }),
    User.findById((session.user as any).id),
  ]);

  if (!repo) return NextResponse.json({ error: "Repo not found" }, { status: 404 });
  if (!user?.githubToken) return NextResponse.json({ error: "GitHub token missing" }, { status: 400 });

  if (!repo.deployedSnapshot?.commitSHA) {
    return NextResponse.json({ error: "No deployed snapshot found. Mark a deployment first." }, { status: 400 });
  }

  // Run the drift detection
  const report = await detectDrift(
    user.githubToken,
    repo.owner,
    repo.name,
    repo.branch,
    repo.deployedSnapshot
  );

  // Save the drift log
  await DriftLog.create({
    repoId: repo._id,
    userId: user._id,
    ...report,
  });

  // Update the repo status
  await Repo.findByIdAndUpdate(repo._id, {
    driftStatus: report.status,
    lastChecked: new Date(),
  });

  return NextResponse.json(report);
}
