"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getMoreDeployments(skip: number, take: number = 20, repoId?: string | null) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", data: [] };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      type: "DEPLOYMENT",
      repo: { userId: session.user.id },
    };

    if (repoId && repoId !== "all") {
      whereClause.repoId = repoId;
    }

    const deployments = await prisma.logs.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { repo: true },
    });

    return { data: deployments };
  } catch (error) {
    console.error("Error fetching more deployments:", error);
    return { error: "Failed to fetch deployments", data: [] };
  }
}

export async function getMoreRepoLogs(
  repoId: string,
  type: "COMMIT" | "PULL_REQUEST",
  skip: number,
  take: number = 20,
  branch?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", data: [] };
  }

  try {
    // Verify the repo belongs to the user
    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) {
      return { error: "Repository not found", data: [] };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      repoId,
      type,
    };

    if (branch && type === "COMMIT") {
      whereClause.metadata = {
        path: ["branch"],
        equals: branch,
      };
    }

    const logs = await prisma.logs.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });

    return { data: logs };
  } catch (error) {
    console.error("Error fetching more repo logs:", error);
    return { error: "Failed to fetch logs", data: [] };
  }
}
