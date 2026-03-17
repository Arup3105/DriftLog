import { getLatestCommitSHA, getRepoTree } from "./github";

export type DriftStatus = "clean" | "drifted" | "unknown";

export interface FileDiff {
  path: string;
  status: "added" | "removed" | "modified" | "unchanged";
  currentSHA?: string;   
  deployedSHA?: string;  
}

export interface DriftReport {
  status: DriftStatus;
  driftedFiles: FileDiff[];
  totalFiles: number;
  checkedAt: Date;
  currentCommitSHA: string;
  deployedCommitSHA: string;
  behindBy: number; 
}

/**
 * Compare the current GitHub main branch tree against a stored "deployed" snapshot.
 */
export async function detectDrift(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  deployedSnapshot: { commitSHA: string; tree: { path: string; sha: string }[] }
): Promise<DriftReport> {
  // Get the latest commit from GitHub
  const currentSHA = await getLatestCommitSHA(token, owner, repo, branch);

  // If already on the same commit — no drift
  if (currentSHA === deployedSnapshot.commitSHA) {
    return {
      status: "clean",
      driftedFiles: [],
      totalFiles: deployedSnapshot.tree.length,
      checkedAt: new Date(),
      currentCommitSHA: currentSHA,
      deployedCommitSHA: deployedSnapshot.commitSHA,
      behindBy: 0,
    };
  }

  // Get the current tree from GitHub
  const currentTree = await getRepoTree(token, owner, repo, currentSHA);

  // Build lookup maps
  const currentMap = new Map(currentTree.map((f) => [f.path, f.sha]));
  const deployedMap = new Map(deployedSnapshot.tree.map((f) => [f.path, f.sha]));

  const driftedFiles: FileDiff[] = [];

  // Files in current that differ from deployed
  Array.from(currentMap.entries()).forEach(([path, currentFileSHA]) => {
    const deployedFileSHA = deployedMap.get(path);
    if (!deployedFileSHA) {
      driftedFiles.push({ path, status: "added", currentSHA: currentFileSHA });
    } else if (deployedFileSHA !== currentFileSHA) {
      driftedFiles.push({
        path,
        status: "modified",
        currentSHA: currentFileSHA,
        deployedSHA: deployedFileSHA,
      });
    }
  });

  // Files that were removed from current but existed in deployed
  Array.from(deployedMap.entries()).forEach(([path, deployedFileSHA]) => {
    if (!currentMap.has(path)) {
      driftedFiles.push({ path, status: "removed", deployedSHA: deployedFileSHA });
    }
  });

  return {
    status: driftedFiles.length > 0 ? "drifted" : "clean",
    driftedFiles,
    totalFiles: currentTree.length,
    checkedAt: new Date(),
    currentCommitSHA: currentSHA,
    deployedCommitSHA: deployedSnapshot.commitSHA,
    behindBy: driftedFiles.length,
  };
}