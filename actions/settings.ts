"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/encryption";

export async function updateAccount(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email) {
      return { error: "Email is required" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { error: "User not found" };
    }

    const updateData: { email: string; password?: string; isGuest?: boolean } = {
      email,
    };

    if (password && password.length >= 6) {
      updateData.password = await hash(password, 12);
    }

    // Upgrade guest to standard account if they provide credentials
    if (user.isGuest && updateData.password) {
      updateData.isGuest = false;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return { error: "Email already in use" };
    }
    console.error("Update account error:", error);
    return { error: "Failed to update account" };
  }
}

export async function updateNotifications(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const rawDiscordWebhook = formData.get("discordWebhook")?.toString() || null;
    const rawTelegramBotToken = formData.get("telegramBotToken")?.toString() || null;
    const rawTelegramChatId = formData.get("telegramChatId")?.toString() || null;
    
    const discordWebhook = rawDiscordWebhook ? encrypt(rawDiscordWebhook) : null;
    const telegramBotToken = rawTelegramBotToken ? encrypt(rawTelegramBotToken) : null;
    const telegramChatId = rawTelegramChatId ? encrypt(rawTelegramChatId) : null;
    const enableDiscord = formData.get("enableDiscord") === "true";
    const enableTelegram = formData.get("enableTelegram") === "true";

    const notifyErrors = formData.get("notifyErrors") === "true";
    const notifyPRs = formData.get("notifyPRs") === "true";
    const notifyDeployments = formData.get("notifyDeployments") === "true";

    await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        discordWebhook,
        telegramBotToken,
        telegramChatId,
        enableDiscord,
        enableTelegram,
        notifyErrors,
        notifyPRs,
        notifyDeployments,
      },
      create: {
        userId: session.user.id,
        discordWebhook,
        telegramBotToken,
        telegramChatId,
        enableDiscord,
        enableTelegram,
        notifyErrors,
        notifyPRs,
        notifyDeployments,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Update notifications error:", error);
    return { error: "Failed to update notification settings" };
  }
}

export async function testDiscordWebhook(url: string) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "🚀 **Nexus Ops**: Connection successfully established! Your Discord notifications are active.",
      }),
    });
    if (!res.ok) throw new Error("Discord API rejected the payload.");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send test message to Discord." };
  }
}

export async function testTelegramWebhook(botToken: string, chatId: string) {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🚀 *Nexus Ops*: Connection successfully established! Your Telegram notifications are active.",
        parse_mode: "Markdown",
      }),
    });
    if (!res.ok) throw new Error("Telegram API rejected the payload.");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send test message to Telegram." };
  }
}

export async function updateAdvancedSettings(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const rawGithubToken = formData.get("githubToken")?.toString() || null;
    const githubToken = rawGithubToken ? encrypt(rawGithubToken) : null;
    const dataRetentionDays = parseInt(formData.get("dataRetentionDays")?.toString() || "30", 10);

    await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: { githubToken, dataRetentionDays },
      create: {
        userId: session.user.id,
        githubToken,
        dataRetentionDays,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update advanced settings." };
  }
}

export async function deleteAllLogs() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await prisma.logs.deleteMany({
      where: {
        repo: { userId: session.user.id },
      },
    });

    revalidatePath("/settings");
    revalidatePath("/overview");
    revalidatePath("/repository");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete logs." };
  }
}

export async function deleteAccount() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    // Cascade deletes handle the rest
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete account." };
  }
}
