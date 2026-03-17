import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Repo, User } from "@/models";
import { getLatestCommitSHA, getRepoTree } from "@/lib/github";

// /api/repos — list all repos for the logged in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const repos = await Repo.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
  return NextResponse.json(repos);
}

// /api/repos — add a new repo to monitor
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owner, name, branch = "main" } = await req.json();
  if (!owner || !name) return NextResponse.json({ error: "owner and name required" }, { status: 400 });

  await connectDB();

  const user = await User.findById((session.user as any).id);
  if (!user?.githubToken) {
    return NextResponse.json({ error: "Please add a GitHub token in settings first" }, { status: 400 });
  }

  // For initial snapshot (deployed baseline)
  const commitSHA = await getLatestCommitSHA(user.githubToken, owner, name, branch);
  const tree = await getRepoTree(user.githubToken, owner, name, commitSHA);

  const repo = await Repo.create({
    userId: user._id,
    owner,
    name,
    branch,
    fullName: `${owner}/${name}`,
    driftStatus: "clean",
    lastChecked: new Date(),
    deployedSnapshot: {
      commitSHA,
      tree: tree.map((f) => ({ path: f.path, sha: f.sha })),
      snapshotAt: new Date(),
    },
  });

  return NextResponse.json(repo, { status: 201 });
}
