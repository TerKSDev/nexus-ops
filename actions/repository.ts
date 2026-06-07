"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

type ActionState = {
  error?: string;
  success?: boolean;
  secret?: string | null;
} | null;

export async function addRepo(prevState: ActionState, formData: FormData) {
  const url = formData.get("url") as string;

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
    },
  });

  revalidatePath("repository");

  return { success: true, secret: repo.webhookSecret };
}
