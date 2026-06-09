"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "crypto";
import { auth } from "@/lib/auth";

type ActionState = {
  error?: string;
  success?: boolean;
  secret?: string | null;
  autoConfigured?: boolean;
} | null;

export async function addRepo(prevState: ActionState, formData: FormData) {
  const url = formData.get("url") as string;

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please log in first." };
  }

  if (!url) return { error: "URL is required" };

  let name = url;
  try {
    const parsed = new URL(url);
    name = parsed.pathname.substring(1);
  } catch {
    return { error: "Invalid or unsupported URL format." };
  }

  const webhookSecret = crypto.randomUUID();

  const repo = await prisma.githubRepo.create({
    data: {
      name,
      url,
      webhookSecret,
      userId: session.user.id,
    },
  });

  // Try to auto-configure webhook
  let autoConfigured = false;
  try {
    const { setupGithubWebhook } = await import("@/actions/github");
    const reqHeaders = await headers();
    const origin = reqHeaders.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${origin}/api/webhook/github`;
    
    const setupRes = await setupGithubWebhook(name, webhookUrl, webhookSecret);
    if (setupRes.success) {
      autoConfigured = true;
    }
  } catch (err) {
    console.error("Auto-configure webhook failed silently", err);
  }

  revalidatePath("repository");

  return { success: true, secret: repo.webhookSecret, autoConfigured };
}

export async function deleteRepo(repoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    await prisma.logs.deleteMany({ where: { repoId } });
    await prisma.githubRepo.delete({ where: { id: repoId } });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to delete repository." };
  }
}

export async function regenerateSecret(repoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    const webhookSecret = crypto.randomUUID();
    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { webhookSecret },
    });
    revalidatePath("/repository");
    return { success: true, secret: webhookSecret };
  } catch (error) {
    console.log(error);
    return { error: "Failed to regenerate secret." };
  }
}

export async function autoConfigureWebhook(repoId: string, baseUrl: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    const webhookSecret = crypto.randomUUID();
    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { webhookSecret },
    });

    const { setupGithubWebhook } = await import("@/actions/github");
    const webhookUrl = `${baseUrl}/api/webhook/github`;
    
    const setupRes = await setupGithubWebhook(repo.name, webhookUrl, webhookSecret);
    
    if (setupRes.error) {
      return { error: setupRes.error, secret: webhookSecret };
    }

    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.error("Auto configure webhook error:", error);
    return { error: "Failed to automatically configure webhook. Please try regenerating the secret manually." };
  }
}

export async function clearRepoLogs(repoId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    await prisma.logs.deleteMany({ where: { repoId } });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to clear logs." };
  }
}

export async function toggleRepoTracking(repoId: string, currentStatus: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to toggle tracking status." };
  }
}

export async function updateRepo(repoId: string, name: string, url: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    if (!name) return { error: "Name is required." };
    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { name, url },
    });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update repository." };
  }
}

export async function toggleAutoMerge(repoId: string, currentStatus: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const repo = await prisma.githubRepo.findUnique({
      where: { id: repoId, userId: session.user.id },
    });

    if (!repo) return { error: "Repository not found or unauthorized" };

    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { autoMergePR: !currentStatus },
    });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to toggle Auto Merge." };
  }
}

export async function importRepos(repos: { full_name: string; html_url: string }[], baseUrl: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { setupGithubWebhook } = await import("@/actions/github");

    let successCount = 0;
    let webhookFailedCount = 0;

    for (const repo of repos) {
      // Check if it already exists
      const existing = await prisma.githubRepo.findFirst({
        where: { name: repo.full_name, userId: session.user.id },
      });

      if (!existing) {
        const webhookSecret = crypto.randomUUID();
        await prisma.githubRepo.create({
          data: {
            name: repo.full_name,
            url: repo.html_url,
            webhookSecret,
            userId: session.user.id,
          },
        });

        // Try to setup webhook automatically
        const webhookUrl = `${baseUrl}/api/webhook/github`;
        const setupRes = await setupGithubWebhook(repo.full_name, webhookUrl, webhookSecret);
        if (setupRes.error) {
          webhookFailedCount++;
        }
        successCount++;
      }
    }

    revalidatePath("/repository");
    return { success: true, count: successCount, webhookFailedCount };
  } catch (error) {
    console.error("Import Repos Error:", error);
    return { error: "Failed to import repositories." };
  }
}
