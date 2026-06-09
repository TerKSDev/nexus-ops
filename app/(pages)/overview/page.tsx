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

  const userId = session.user.id;
  const fourteenDaysAgo = subDays(new Date(), 14);

  // Execute queries sequentially to prevent connection pool exhaustion (Supabase pool limit)
  const activeReposCount = await prisma.githubRepo.count({
    where: { userId, isActive: true },
  });
  const totalCommitsCount = await prisma.logs.count({
    where: { repo: { userId }, type: "COMMIT" },
  });
  const inactiveReposCount = await prisma.githubRepo.count({
    where: { userId, isActive: false },
  });

  const rawRecentLogs = await prisma.logs.findMany({
    where: { repo: { userId } },
    orderBy: { createdAt: "desc" },
    take: 100, // Fetch more to sort accurately
    include: { repo: true },
  });
  const recentLogs = rawRecentLogs.sort((a, b) => {
    const timeA = new Date((a.metadata as Record<string, unknown>)?.time as string || a.createdAt).getTime();
    const timeB = new Date((b.metadata as Record<string, unknown>)?.time as string || b.createdAt).getTime();
    return timeB - timeA;
  }).slice(0, 20);

  const rawPRsData = await prisma.logs.findMany({
    where: { repo: { userId }, type: "PULL_REQUEST" },
    orderBy: { createdAt: "desc" },
    take: 100, // Fetch more to sort accurately
    include: { repo: true },
  });
  const rawPRs = rawPRsData.sort((a, b) => {
    const timeA = new Date((a.metadata as Record<string, unknown>)?.time as string || a.createdAt).getTime();
    const timeB = new Date((b.metadata as Record<string, unknown>)?.time as string || b.createdAt).getTime();
    return timeB - timeA;
  });

  const matrixLogs = await prisma.logs.findMany({
    where: {
      repo: { userId },
      createdAt: { gte: fourteenDaysAgo },
    },
    select: { createdAt: true },
  });

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
    select: { vercelToken: true },
  });

  const hasVercelToken = !!userSettings?.vercelToken;

  const uniquePRsMap = new Map();
  for (const pr of rawPRs) {
    const meta = pr.metadata as {
      prNumber?: number;
      state?: string;
      merged?: boolean;
    };
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
    <div className="py-8 px-4 md:px-12 w-full max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-10">
      {/* Page Header — HSR style */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1 self-stretch py-0.5">
          <div className="w-px flex-1 bg-linear-to-b from-healthy-500 via-healthy-500/40 to-transparent" />
          <span className="text-healthy-500 text-[7px] leading-none">◆</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-healthy-500/50 tracking-[0.3em] uppercase font-medium">
            System Dashboard
          </span>
          <h1 className="text-3xl font-bold text-neutral-50 tracking-widest uppercase leading-none">
            Overview
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-px w-8 bg-linear-to-r from-healthy-500/40 to-transparent" />
            <p className="text-neutral-400 text-sm">
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
          <ActivityMatrix matrixDays={matrixDays} />
          <GlobalActivityFeed recentLogs={recentLogs} hasVercelToken={hasVercelToken} />
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <PendingActions recentPRs={recentPRs} />
        </div>
      </div>
    </div>
  );
}
