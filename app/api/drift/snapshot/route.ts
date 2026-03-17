import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Repo, User } from "@/models";
import { getLatestCommitSHA, getRepoTree } from "@/lib/github";

// /api/drift/snapshot — mark current GitHub state as "deployed"
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { repoId } = await req.json();

  await connectDB();
  const [repo, user] = await Promise.all([
    Repo.findOne({ _id: repoId, userId: (session.user as any).id }),
    User.findById((session.user as any).id),
  ]);

  if (!repo) return NextResponse.json({ error: "Repo not found" }, { status: 404 });
  if (!user?.githubToken) return NextResponse.json({ error: "GitHub token missing" }, { status: 400 });

  // Take a snapshot of current main branch
  const commitSHA = await getLatestCommitSHA(user.githubToken, repo.owner, repo.name, repo.branch);
  const tree = await getRepoTree(user.githubToken, repo.owner, repo.name, commitSHA);

  await Repo.findByIdAndUpdate(repo._id, {
    driftStatus: "clean",
    lastChecked: new Date(),
    deployedSnapshot: {
      commitSHA,
      tree: tree.map((f) => ({ path: f.path, sha: f.sha })),
      snapshotAt: new Date(),
    },
  });

  return NextResponse.json({ message: "Snapshot saved. Repo marked as deployed.", commitSHA });
}
