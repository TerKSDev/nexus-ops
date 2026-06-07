import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

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

    // 安全驗證：確保請求真的是 GitHub 發過來的
    const hmac = crypto.createHmac("sha256", dbRepo.webhookSecret);
    const digest = "sha256=" + hmac.update(rawBody).digest("hex");
    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 處理 Git Push 事件
    if (eventType === "push") {
      const commit = payload.commits?.[0]; // 抓取最新的一個 Commit
      if (commit) {
        await prisma.logs.create({
          data: {
            repoId: dbRepo.id,
            type: "COMMIT",
            message: commit.message,
            metadata: {
              sha: commit.id.substring(0, 7),
              author: commit.author.name,
              time: commit.timestamp,
            },
          },
        });
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
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}