import { Octokit } from "octokit";

// Fetch the latest commit SHA from the main branch of a repo
export async function getLatestCommitSHA(
  token: string,
  owner: string,
  repo: string,
  branch: string = "main"
): Promise<string> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.repos.getBranch({ owner, repo, branch });
  return data.commit.sha;
}

// Get the file tree of a repo at a specific commit
export async function getRepoTree(
  token: string,
  owner: string,
  repo: string,
  sha: string
): Promise<{ path: string; sha: string; type: string }[]> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: sha,
    recursive: "1",
  });
  return data.tree.filter((f) => f.type === "blob") as any;
}

// Get the raw content of a specific file
export async function getFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref });
  if ("content" in data) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return "";
}

// List recent commits
export async function getRecentCommits(
  token: string,
  owner: string,
  repo: string,
  branch: string = "main",
  per_page: number = 10
) {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page,
  });
  return data.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author?.name,
    date: c.commit.author?.date,
    url: c.html_url,
  }));
}
