"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { auth } from "@/lib/auth";

type ActionState = {
  error?: string;
  success?: boolean;
  secret?: string | null;
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

  revalidatePath("repository");

  return { success: true, secret: repo.webhookSecret };
}

export async function deleteRepo(repoId: string) {
  try {
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

export async function clearRepoLogs(repoId: string) {
  try {
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
    await prisma.githubRepo.update({
      where: { id: repoId },
      data: { autoMergePR: !currentStatus },
    });
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to toggle Auto Merge." };
  }
}
