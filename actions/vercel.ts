"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

export async function redeployVercel(repoName: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    if (!userSettings?.vercelToken) {
      return { error: "Vercel API Token is not configured." };
    }

    const token = decrypt(userSettings.vercelToken);

    // Fetch the project details first to get the framework and git info if needed
    // or we can simply POST to create a deployment
    // We assume the Vercel project name matches the repository name exactly (without the owner prefix)
    const projectName = repoName.split("/").pop() || repoName;

    const deployRes = await fetch(`https://api.vercel.com/v13/deployments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: projectName,
        target: "production",
      })
    });

    if (!deployRes.ok) {
      const errorData = await deployRes.json().catch(() => ({}));
      console.error("Vercel Deploy Error:", errorData);
      return { error: errorData.error?.message || "Failed to trigger redeploy." };
    }

    revalidatePath("/overview");
    return { success: true };
  } catch (error) {
    console.error("Redeploy error:", error);
    return { error: "An unexpected error occurred." };
  }
}
