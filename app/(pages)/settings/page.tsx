import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountSettings from "./components/AccountSettings";
import NotificationSettings from "./components/NotificationSettings";
import AdvancedSettings from "./components/AdvancedSettings";
import DangerZone from "./components/DangerZone";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";
import { decrypt } from "@/lib/encryption";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { settings: true, accounts: true },
  });

  if (!user) {
    redirect("/login");
  }

  const decryptedSettings = user.settings
    ? {
        ...user.settings,
        discordWebhook: decrypt(user.settings.discordWebhook || ""),
        telegramBotToken: decrypt(user.settings.telegramBotToken || ""),
        telegramChatId: decrypt(user.settings.telegramChatId || ""),
        githubToken: decrypt(user.settings.githubToken || ""),
      }
    : null;

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      {/* Page Header — HSR style */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1 self-stretch py-0.5">
          <div className="w-px flex-1 bg-linear-to-b from-healthy-500 via-healthy-500/40 to-transparent" />
          <span className="text-healthy-500 text-[7px] leading-none">◆</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-healthy-500/50 tracking-[0.3em] uppercase font-medium">
            Configuration
          </span>
          <h1 className="text-3xl font-bold text-neutral-50 tracking-widest uppercase leading-none">
            System Settings
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-px w-8 bg-linear-to-r from-healthy-500/40 to-transparent" />
            <p className="text-neutral-400 text-sm">
              Manage your account and configure notification integrations.
            </p>
          </div>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <AccountSettings user={{ email: user.email, isGuest: user.isGuest, hasGithubBound: user.accounts.some(acc => acc.provider === "github") }} />
      </FadeIn>

      <FadeIn delay={0.2}>
        <NotificationSettings settings={decryptedSettings} />
      </FadeIn>

      <FadeIn delay={0.3}>
        <AdvancedSettings settings={decryptedSettings} />
      </FadeIn>

      <FadeIn delay={0.4}>
        <DangerZone />
      </FadeIn>
    </div>
  );
}
