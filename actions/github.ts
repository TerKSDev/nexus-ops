"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function syncRepoHistory(repoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const dbRepo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!dbRepo || !dbRepo.name) {
      return { error: "Repository not found" };
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!userSettings?.githubToken) {
      return { error: "GitHub Personal Access Token not configured. Please add it in Settings." };
    }

    const token = decrypt(userSettings.githubToken);
    const repoFullName = dbRepo.name;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Fetch Commits
    const commitsRes = await fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=30`, { headers });
    if (!commitsRes.ok) {
      console.error(`GitHub API Commits Error: ${commitsRes.status} ${commitsRes.statusText}`);
      if (commitsRes.status === 401 || commitsRes.status === 403) {
        return { error: "Invalid GitHub Personal Access Token or missing permissions." };
      }
    }
    const commitsData = commitsRes.ok ? await commitsRes.json() : [];

    // Fetch PRs
    const prsRes = await fetch(`https://api.github.com/repos/${repoFullName}/pulls?state=all&per_page=30`, { headers });
    if (!prsRes.ok) {
      console.error(`GitHub API PRs Error: ${prsRes.status} ${prsRes.statusText}`);
    }
    const prsData = prsRes.ok ? await prsRes.json() : [];

    let newLogsCount = 0;

    // Process Commits
    if (Array.isArray(commitsData)) {
      for (const commit of commitsData.reverse()) {
        const sha = commit.sha.substring(0, 7);
        const existingLog = await prisma.logs.findFirst({
          where: { repoId, type: "COMMIT", metadata: { path: ["sha"], equals: sha } },
        });

        if (!existingLog) {
          const branch = "main"; // Not easily available in /commits API without looking at parent branches, default to main
          await prisma.logs.create({
            data: {
              repoId,
              type: "COMMIT",
              message: commit.commit.message,
              metadata: {
                sha,
                author: commit.commit.author.name,
                time: commit.commit.author.date,
                branch,
              },
            },
          });
          newLogsCount++;
        }
      }
    }

    // Process PRs
    if (Array.isArray(prsData)) {
      for (const pr of prsData.reverse()) {
        const prNumber = pr.number;
        const existingLog = await prisma.logs.findFirst({
          where: { repoId, type: "PULL_REQUEST", metadata: { path: ["prNumber"], equals: prNumber } },
        });

        if (!existingLog) {
          await prisma.logs.create({
            data: {
              repoId,
              type: "PULL_REQUEST",
              message: pr.title,
              metadata: {
                prNumber,
                author: pr.user.login,
                time: pr.created_at,
                description: pr.body,
                state: pr.state,
                merged: !!pr.merged_at,
                action: pr.state === "open" ? "opened" : (pr.merged_at ? "merged" : "closed"),
              },
            },
          });
          newLogsCount++;
        }
      }
    }

    revalidatePath("/repository");
    revalidatePath("/overview");

    return { success: true, count: newLogsCount };
  } catch (error) {
    console.error("Sync Repo History Error:", error);
    return { error: "Internal server error while syncing history." };
  }
}

export async function mergePullRequest(repoId: string, prNumber: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const dbRepo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!dbRepo || !dbRepo.name) {
      return { error: "Repository not found" };
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!userSettings?.githubToken) {
      return { error: "GitHub Personal Access Token not configured. Please add it in Settings." };
    }

    const token = decrypt(userSettings.githubToken);
    const repoFullName = dbRepo.name;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const res = await fetch(`https://api.github.com/repos/${repoFullName}/pulls/${prNumber}/merge`, {
      method: "PUT",
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`GitHub API Merge Error: ${res.status}`, errorData);
      return { error: errorData.message || "Failed to merge PR. It might have conflicts or missing permissions." };
    }

    // Successfully merged. Update our database logs to reflect this immediately.
    // It will also be captured by the webhook later, but this gives instant feedback.
    const existingLog = await prisma.logs.findFirst({
      where: { repoId, type: "PULL_REQUEST", metadata: { path: ["prNumber"], equals: prNumber } },
    });

    if (existingLog) {
      const currentMeta = existingLog.metadata as any;
      await prisma.logs.update({
        where: { id: existingLog.id },
        data: {
          metadata: {
            ...currentMeta,
            merged: true,
            state: "closed",
            action: "merged",
          },
        },
      });
    }

    revalidatePath("/repository");
    revalidatePath("/overview");

    return { success: true };
  } catch (error) {
    console.error("Merge PR Error:", error);
    return { error: "Internal server error while merging PR." };
  }
}
