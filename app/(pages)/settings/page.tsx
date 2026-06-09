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
    include: { settings: true },
  });

  if (!user) {
    redirect("/login");
  }

  const decryptedSettings = user.settings ? {
    ...user.settings,
    discordWebhook: decrypt(user.settings.discordWebhook || ""),
    telegramBotToken: decrypt(user.settings.telegramBotToken || ""),
    telegramChatId: decrypt(user.settings.telegramChatId || ""),
    githubToken: decrypt(user.settings.githubToken || ""),
  } : null;

  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
              System Settings
            </h1>
            <p className="text-neutral-400 tracking-wide text-base">
              Manage your account and configure notification integrations.
            </p>
          </div>
        </div>
      </div>

      <FadeIn delay={0.1}>
        <AccountSettings user={{ email: user.email, isGuest: user.isGuest }} />
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
