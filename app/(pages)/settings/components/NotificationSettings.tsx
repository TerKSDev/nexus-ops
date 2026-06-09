"use client";

import { useState } from "react";
import {
  updateNotifications,
  testDiscordWebhook,
  testTelegramWebhook,
} from "@/actions/settings";
import {
  Bell,
  MessageSquare,
  Send,
  CheckCircle2,
  GitPullRequest,
  ShieldAlert,
  Rocket,
} from "lucide-react";
import { Input } from "@/components/Input";
import { useToast } from "@/components/ToastProvider";

interface NotificationSettingsProps {
  settings: {
    discordWebhook: string | null;
    telegramBotToken: string | null;
    telegramChatId: string | null;
    enableDiscord: boolean;
    enableTelegram: boolean;
    notifyErrors: boolean;
    notifyPRs: boolean;
    notifyDeployments: boolean;
  } | null;
}

/** Reusable HSR-style toggle switch */
function Toggle({
  enabled,
  onChange,
  color = "healthy",
}: {
  enabled: boolean;
  onChange: () => void;
  color?: "healthy" | "discord" | "telegram";
}) {
  const trackColor = {
    healthy: enabled ? "bg-healthy-500" : "bg-neutral-700",
    discord: enabled ? "bg-[#5865F2]" : "bg-neutral-700",
    telegram: enabled ? "bg-[#0088cc]" : "bg-neutral-700",
  }[color];

  return (
    <div
      onClick={onChange}
      className={`w-9 h-5 rounded-full relative transition-colors duration-300 cursor-pointer shrink-0 ${trackColor}`}
    >
      <div
        className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled ? "left-[18px]" : "left-0.5"}`}
      />
    </div>
  );
}

/** Reusable sub-section header for settings groups */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="h-px w-4 bg-linear-to-l from-neutral-700/60 to-transparent" />
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.25em]">
        {children}
      </span>
      <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent" />
    </div>
  );
}

export default function NotificationSettings({
  settings,
}: NotificationSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [testingDiscord, setTestingDiscord] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);

  const [discordWebhook, setDiscordWebhook] = useState(
    settings?.discordWebhook || "",
  );
  const [telegramBotToken, setTelegramBotToken] = useState(
    settings?.telegramBotToken || "",
  );
  const [telegramChatId, setTelegramChatId] = useState(
    settings?.telegramChatId || "",
  );
  const [enableDiscord, setEnableDiscord] = useState(
    settings?.enableDiscord ?? false,
  );
  const [enableTelegram, setEnableTelegram] = useState(
    settings?.enableTelegram ?? false,
  );
  const [notifyErrors, setNotifyErrors] = useState(
    settings?.notifyErrors ?? true,
  );
  const [notifyPRs, setNotifyPRs] = useState(settings?.notifyPRs ?? true);
  const [notifyDeployments, setNotifyDeployments] = useState(
    settings?.notifyDeployments ?? true,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const formData = new FormData();
    formData.append("discordWebhook", discordWebhook);
    formData.append("telegramBotToken", telegramBotToken);
    formData.append("telegramChatId", telegramChatId);
    formData.append("enableDiscord", enableDiscord.toString());
    formData.append("enableTelegram", enableTelegram.toString());
    formData.append("notifyErrors", notifyErrors.toString());
    formData.append("notifyPRs", notifyPRs.toString());
    formData.append("notifyDeployments", notifyDeployments.toString());
    await updateNotifications(formData);
    setSuccess(true);
    setLoading(false);
    toast("Notification preferences saved successfully.", "success");
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleTestDiscord() {
    if (!discordWebhook)
      return toast("Please enter a Discord Webhook URL first.", "error");
    setTestingDiscord(true);
    const result = await testDiscordWebhook(discordWebhook);
    setTestingDiscord(false);
    if (result.error) toast(result.error, "error");
    else toast("Test message sent! Check your Discord channel.", "success");
  }

  async function handleTestTelegram() {
    if (!telegramBotToken || !telegramChatId)
      return toast("Please enter both Bot Token and Chat ID.", "error");
    setTestingTelegram(true);
    const result = await testTelegramWebhook(telegramBotToken, telegramChatId);
    setTestingTelegram(false);
    if (result.error) toast(result.error, "error");
    else toast("Test message sent! Check your Telegram.", "success");
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 rounded-lg overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* Panel Header */}
      <div className="p-4 px-5 border-b border-neutral-700/40 flex items-center gap-3 bg-neutral-800/30 relative z-10">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <Bell className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          Notification Center
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8">
        {/* Integrations */}
        <div className="flex flex-col gap-4">
          <SectionLabel>Integrations</SectionLabel>

          {/* Discord */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-neutral-950/50 border border-neutral-700/30">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                Discord
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${enableDiscord ? "text-[#5865F2]" : "text-neutral-600"}`}
                >
                  {enableDiscord ? "Enabled" : "Disabled"}
                </span>
                <Toggle
                  enabled={enableDiscord}
                  onChange={() => setEnableDiscord(!enableDiscord)}
                  color="discord"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="password"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                disabled={!enableDiscord}
                variant="discord"
              />
              <button
                type="button"
                onClick={handleTestDiscord}
                disabled={!enableDiscord || !discordWebhook || testingDiscord}
                className="px-4 py-2.5 rounded-lg border border-[#5865F2]/40 text-[#5865F2]/80 font-semibold text-sm hover:bg-[#5865F2]/10 hover:border-[#5865F2]/60 hover:text-[#5865F2] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center cursor-pointer"
              >
                {testingDiscord ? "Ping..." : "Test"}
              </button>
            </div>
          </div>

          {/* Telegram */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-neutral-950/50 border border-neutral-700/30">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0088cc]" />
                Telegram
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${enableTelegram ? "text-[#0088cc]" : "text-neutral-600"}`}
                >
                  {enableTelegram ? "Enabled" : "Disabled"}
                </span>
                <Toggle
                  enabled={enableTelegram}
                  onChange={() => setEnableTelegram(!enableTelegram)}
                  color="telegram"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="password"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="Bot Token: 123456789:ABCdef..."
                disabled={!enableTelegram}
                variant="telegram"
              />
              <div className="flex items-center gap-3">
                <Input
                  type="password"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Chat ID: -100123456789"
                  disabled={!enableTelegram}
                  variant="telegram"
                />
                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={
                    !enableTelegram ||
                    !telegramBotToken ||
                    !telegramChatId ||
                    testingTelegram
                  }
                  className="px-4 py-2.5 rounded-lg border border-[#0088cc]/40 text-[#0088cc]/80 font-semibold text-sm hover:bg-[#0088cc]/10 hover:border-[#0088cc]/60 hover:text-[#0088cc] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-center cursor-pointer"
                >
                  {testingTelegram ? "Ping..." : "Test"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Triggers */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Event Triggers</SectionLabel>

          {/* Critical Errors toggle row */}
          <div
            className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/60 border border-neutral-700/30 hover:border-neutral-600/40 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer group"
            onClick={() => setNotifyErrors(!notifyErrors)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg transition-all ${notifyErrors ? "bg-critical-500/10 text-critical-400 border border-critical-500/25" : "bg-neutral-800/60 text-neutral-600 border border-transparent"}`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">
                  Critical Errors
                </span>
                <span className="text-neutral-500 text-xs">
                  Receive alerts when CRITICAL level logs occur.
                </span>
              </div>
            </div>
            <Toggle
              enabled={notifyErrors}
              onChange={() => setNotifyErrors(!notifyErrors)}
            />
          </div>

          {/* Pull Requests toggle row */}
          <div
            className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/60 border border-neutral-700/30 hover:border-neutral-600/40 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer"
            onClick={() => setNotifyPRs(!notifyPRs)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg transition-all ${notifyPRs ? "bg-warning-500/10 text-warning-400 border border-warning-500/25" : "bg-neutral-800/60 text-neutral-600 border border-transparent"}`}
              >
                <GitPullRequest className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">
                  Pull Requests
                </span>
                <span className="text-neutral-500 text-xs">
                  Get notified of new or merged Pull Requests.
                </span>
              </div>
            </div>
            <Toggle
              enabled={notifyPRs}
              onChange={() => setNotifyPRs(!notifyPRs)}
            />
          </div>

          {/* Deployments toggle row */}
          <div
            className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/60 border border-neutral-700/30 hover:border-neutral-600/40 hover:bg-neutral-800/40 transition-all duration-200 cursor-pointer"
            onClick={() => setNotifyDeployments(!notifyDeployments)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg transition-all ${notifyDeployments ? "bg-healthy-500/10 text-healthy-400 border border-healthy-500/25" : "bg-neutral-800/60 text-neutral-600 border border-transparent"}`}
              >
                <Rocket className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">
                  Deployments
                </span>
                <span className="text-neutral-500 text-xs">
                  Alerts on deployment successes and failures.
                </span>
              </div>
            </div>
            <Toggle
              enabled={notifyDeployments}
              onChange={() => setNotifyDeployments(!notifyDeployments)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-neutral-700/40">
          <div className="flex items-center gap-4">
            {success && (
              <span className="flex items-center gap-1.5 text-healthy-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-linear-to-r from-healthy-600 to-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:from-healthy-500 hover:to-healthy-400 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
