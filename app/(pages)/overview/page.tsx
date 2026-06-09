import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { subDays, format } from "date-fns";

import StatCards from "./components/StatCards";
import ActivityMatrix from "./components/ActivityMatrix";
import GlobalActivityFeed from "./components/GlobalActivityFeed";
import PendingActions from "./components/PendingActions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 1. Fetch Stats
  const activeReposCount = await prisma.githubRepo.count({
    where: { userId: session.user.id, isActive: true },
  });

  const totalCommitsCount = await prisma.logs.count({
    where: { repo: { userId: session.user.id }, type: "COMMIT" },
  });

  const inactiveReposCount = await prisma.githubRepo.count({
    where: { userId: session.user.id, isActive: false },
  });

  // 2. Fetch Global Recent Logs
  const recentLogs = await prisma.logs.findMany({
    where: { repo: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { repo: true },
  });

  // 3. Fetch Active PRs (Recent PR logs)
  const rawPRs = await prisma.logs.findMany({
    where: { repo: { userId: session.user.id }, type: "PULL_REQUEST" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { repo: true },
  });

  const uniquePRsMap = new Map();
  for (const pr of rawPRs) {
    const meta = pr.metadata as { prNumber?: number; state?: string; merged?: boolean };
    if (meta?.prNumber && !uniquePRsMap.has(meta.prNumber)) {
      uniquePRsMap.set(meta.prNumber, pr);
    }
  }
  const recentPRs = Array.from(uniquePRsMap.values())
    .filter((pr) => {
      const meta = pr.metadata as { state?: string; merged?: boolean };
      const isMerged = meta.merged === true;
      const isClosed = meta.state === "closed" && !isMerged;
      return meta.state === "open" || (!isMerged && !isClosed);
    })
    .slice(0, 6);

  // 4. Fetch Logs for Activity Matrix (last 14 days)
  const fourteenDaysAgo = subDays(new Date(), 14);
  const matrixLogs = await prisma.logs.findMany({
    where: { 
      repo: { userId: session.user.id },
      createdAt: { gte: fourteenDaysAgo }
    },
    select: { createdAt: true },
  });

  // Calculate Activity Matrix Data
  const activityMap: Record<string, number> = {};
  matrixLogs.forEach((log) => {
    const day = format(log.createdAt, "yyyy-MM-dd");
    activityMap[day] = (activityMap[day] || 0) + 1;
  });

  const matrixDays = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const dayStr = format(date, "yyyy-MM-dd");
    return { date, dayStr, count: activityMap[dayStr] || 0 };
  });

  return (
    <div className="p-8 px-12 w-full max-w-[1400px] mx-auto flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
              Overview
            </h1>
            <p className="text-neutral-400 tracking-wide text-base">
              View all of your system status and active alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards
        activeReposCount={activeReposCount}
        totalCommitsCount={totalCommitsCount}
        inactiveReposCount={inactiveReposCount}
      />

      {/* Main 2:1 Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* LEFT COLUMN (2/3) */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Activity Matrix */}
          <ActivityMatrix matrixDays={matrixDays} />

          {/* Recent Activity */}
          <GlobalActivityFeed recentLogs={recentLogs} />
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          {/* Active PRs */}
          <PendingActions recentPRs={recentPRs} />
        </div>
      </div>
    </div>
  );
}
