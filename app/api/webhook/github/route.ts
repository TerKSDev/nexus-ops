import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-hub-signature-256");
    const eventType = req.headers.get("x-github-event");
    
    // 必須讀取 raw text 來驗證 HMAC，不能直接 await req.json()
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    if (!signature || !eventType) {
      return NextResponse.json({ error: "Missing headers" }, { status: 400 });
    }

    const repoFullName = payload.repository?.full_name;
    
    // 從資料庫找出對應的 Repo
    const dbRepo = await prisma.githubRepo.findFirst({
      where: { name: repoFullName },
    });

    if (!dbRepo || !dbRepo.webhookSecret) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    if (!dbRepo.isActive) {
      return NextResponse.json({ success: true, message: "Tracking paused" });
    }

    // 安全驗證：確保請求真的是 GitHub 發過來的
    const hmac = crypto.createHmac("sha256", dbRepo.webhookSecret);
    const digest = "sha256=" + hmac.update(rawBody).digest("hex");
    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 找出使用者的設定
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: dbRepo.userId },
    });

    // 定義發送通知的輔助函式
    const sendNotifications = async (
      type: "COMMIT" | "PULL_REQUEST" | "DEPLOYMENT",
      status: "HEALTHY" | "WARNING" | "CRITICAL",
      message: string
    ) => {
      if (!userSettings) return;

      // 檢查是否應該發送該事件
      let shouldSend = false;
      if (status === "CRITICAL" && userSettings.notifyErrors) shouldSend = true;
      if (type === "PULL_REQUEST" && userSettings.notifyPRs) shouldSend = true;
      if (type === "DEPLOYMENT" && userSettings.notifyDeployments) shouldSend = true;

      // Commit 預設不一定要發，除非有出錯
      if (!shouldSend) return;

      const discordWebhook = userSettings.enableDiscord && userSettings.discordWebhook ? decrypt(userSettings.discordWebhook) : null;
      const telegramBotToken = userSettings.enableTelegram && userSettings.telegramBotToken ? decrypt(userSettings.telegramBotToken) : null;
      const telegramChatId = userSettings.enableTelegram && userSettings.telegramChatId ? decrypt(userSettings.telegramChatId) : null;

      const emoji = status === "CRITICAL" ? "🚨" : status === "WARNING" ? "⚠️" : "✅";
      const title = `${emoji} Nexus Ops: [${repoFullName}]`;
      const body = `**Event:** ${type}\n**Status:** ${status}\n**Details:** ${message}`;

      const promises = [];

      // Discord
      if (discordWebhook) {
        promises.push(
          fetch(discordWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: `${title}\n${body}` }),
          }).catch((err) => console.error("Discord notification failed", err))
        );
      }

      // Telegram
      if (telegramBotToken && telegramChatId) {
        const tgUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        promises.push(
          fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: `${title}\n${body}`,
            }),
          }).catch((err) => console.error("Telegram notification failed", err))
        );
      }

      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    };

    // 處理 Git Push 事件
    if (eventType === "push") {
      const commit = payload.head_commit; // 抓取最新的一個 Commit
      if (commit) {
        const branch = payload.ref ? payload.ref.replace("refs/heads/", "") : "main";
        await prisma.logs.create({
          data: {
            repoId: dbRepo.id,
            type: "COMMIT",
            message: commit.message,
            metadata: {
              sha: commit.id.substring(0, 7),
              author: commit.author.name,
              time: commit.timestamp,
              branch: branch,
            },
          },
        });
        await sendNotifications("COMMIT", "HEALTHY", `New commit: ${commit.message} by ${commit.author.name}`);
      }
    } 
    // 處理 Pull Request 事件
    else if (eventType === "pull_request") {
      const pr = payload.pull_request;
      await prisma.logs.create({
        data: {
          repoId: dbRepo.id,
          type: "PULL_REQUEST",
          message: pr.title,
          metadata: {
            prNumber: pr.number,
            author: pr.user.login,
            time: pr.created_at,
            description: pr.body,
            state: pr.state,
            merged: pr.merged,
            action: payload.action,
          },
        },
      });
      await sendNotifications("PULL_REQUEST", "HEALTHY", `PR #${pr.number} ${payload.action}: ${pr.title} by ${pr.user.login}`);
    }
    // 處理 Deployment Status 事件 (支援 Vercel, Render 等外部部署工具回報給 GitHub 的狀態)
    else if (eventType === "deployment_status") {
      const deployStatus = payload.deployment_status;
      const deploy = payload.deployment;
      
      // 狀態轉換
      let mappedStatus: "HEALTHY" | "WARNING" | "CRITICAL" = "HEALTHY";
      if (["pending", "in_progress", "queued"].includes(deployStatus.state)) {
        mappedStatus = "WARNING";
      } else if (["failure", "error"].includes(deployStatus.state)) {
        mappedStatus = "CRITICAL";
      }

      await prisma.logs.create({
        data: {
          repoId: dbRepo.id,
          type: "DEPLOYMENT",
          message: deployStatus.description || `Deployment ${deployStatus.state}`,
          status: mappedStatus,
          metadata: {
            state: deployStatus.state,
            environment: deployStatus.environment || deploy.environment,
            url: deployStatus.environment_url || deployStatus.log_url,
            sha: deploy.sha?.substring(0, 7) || "unknown",
            branch: deploy.ref || "unknown",
            author: deployStatus.creator?.login || "system",
            time: deployStatus.created_at || new Date().toISOString(),
          },
        },
      });
      await sendNotifications("DEPLOYMENT", mappedStatus, deployStatus.description || `Deployment ${deployStatus.state}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}