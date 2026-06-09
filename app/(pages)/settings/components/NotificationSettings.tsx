"use client";

import { useState } from "react";
import { updateNotifications, testDiscordWebhook, testTelegramWebhook } from "@/actions/settings";
import { Bell, MessageSquare, Send, CheckCircle2, GitPullRequest, ShieldAlert, Rocket } from "lucide-react";
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

export default function NotificationSettings({ settings }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Test loading states
  const [testingDiscord, setTestingDiscord] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);

  // States
  const [discordWebhook, setDiscordWebhook] = useState(settings?.discordWebhook || "");
  const [telegramBotToken, setTelegramBotToken] = useState(settings?.telegramBotToken || "");
  const [telegramChatId, setTelegramChatId] = useState(settings?.telegramChatId || "");

  const [enableDiscord, setEnableDiscord] = useState(settings?.enableDiscord ?? false);
  const [enableTelegram, setEnableTelegram] = useState(settings?.enableTelegram ?? false);

  const [notifyErrors, setNotifyErrors] = useState(settings?.notifyErrors ?? true);
  const [notifyPRs, setNotifyPRs] = useState(settings?.notifyPRs ?? true);
  const [notifyDeployments, setNotifyDeployments] = useState(settings?.notifyDeployments ?? true);

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
    if (!discordWebhook) return toast("Please enter a Discord Webhook URL first.", "error");
    setTestingDiscord(true);
    const result = await testDiscordWebhook(discordWebhook);
    setTestingDiscord(false);
    if (result.error) toast(result.error, "error");
    else toast("Test message sent! Check your Discord channel.", "success");
  }

  async function handleTestTelegram() {
    if (!telegramBotToken || !telegramChatId) return toast("Please enter both Bot Token and Chat ID.", "error");
    setTestingTelegram(true);
    const result = await testTelegramWebhook(telegramBotToken, telegramChatId);
    setTestingTelegram(false);
    if (result.error) toast(result.error, "error");
    else toast("Test message sent! Check your Telegram.", "success");
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 px-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
            <Bell className="w-4 h-4 text-neutral-300" />
          </div>
          <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
            Notification Center
          </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-8">
        
        {/* Integrations */}
        <div className="flex flex-col gap-5">
          <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Integrations</h4>
          
          {/* Discord Integration */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-neutral-950/50 border border-neutral-800/60">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                Discord
              </label>
              <div 
                className={`flex items-center gap-2 cursor-pointer select-none transition-colors ${enableDiscord ? 'text-[#5865F2]' : 'text-neutral-500'}`}
                onClick={() => setEnableDiscord(!enableDiscord)}
              >
                <span className="text-xs font-semibold uppercase">{enableDiscord ? 'Enabled' : 'Disabled'}</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${enableDiscord ? 'bg-[#5865F2]' : 'bg-neutral-700'}`}>
                  <div className={`absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-all duration-300 ${enableDiscord ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="url"
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
                className="px-4 py-2.5 rounded-lg border border-[#5865F2]/50 text-[#5865F2] font-semibold text-sm hover:bg-[#5865F2]/10 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {testingDiscord ? "Ping..." : "Test"}
              </button>
            </div>
          </div>

          {/* Telegram Integration */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-neutral-950/50 border border-neutral-800/60">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0088cc]" />
                Telegram
              </label>
              <div 
                className={`flex items-center gap-2 cursor-pointer select-none transition-colors ${enableTelegram ? 'text-[#0088cc]' : 'text-neutral-500'}`}
                onClick={() => setEnableTelegram(!enableTelegram)}
              >
                <span className="text-xs font-semibold uppercase">{enableTelegram ? 'Enabled' : 'Disabled'}</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${enableTelegram ? 'bg-[#0088cc]' : 'bg-neutral-700'}`}>
                  <div className={`absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-all duration-300 ${enableTelegram ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                placeholder="Bot Token: 123456789:ABCdefGHI..."
                disabled={!enableTelegram}
                variant="telegram"
              />
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="Chat ID: -100123456789"
                  disabled={!enableTelegram}
                  variant="telegram"
                />
                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={!enableTelegram || !telegramBotToken || !telegramChatId || testingTelegram}
                  className="px-4 py-2.5 rounded-lg border border-[#0088cc]/50 text-[#0088cc] font-semibold text-sm hover:bg-[#0088cc]/10 transition-colors disabled:opacity-50"
                >
                  {testingTelegram ? "Ping..." : "Test"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div className="flex flex-col gap-5 mt-2">
          <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Event Triggers</h4>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer" onClick={() => setNotifyErrors(!notifyErrors)}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${notifyErrors ? 'bg-critical-500/10 text-critical-400 border border-critical-500/30' : 'bg-neutral-800 text-neutral-500 border border-transparent'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">Critical Errors</span>
                <span className="text-neutral-500 text-xs">Receive alerts when CRITICAL level logs occur.</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${notifyErrors ? 'bg-healthy-500' : 'bg-neutral-700'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white transition-all duration-300 ${notifyErrors ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer" onClick={() => setNotifyPRs(!notifyPRs)}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${notifyPRs ? 'bg-warning-500/10 text-warning-400 border border-warning-500/30' : 'bg-neutral-800 text-neutral-500 border border-transparent'}`}>
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">Pull Requests</span>
                <span className="text-neutral-500 text-xs">Get notified of new or merged Pull Requests.</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${notifyPRs ? 'bg-healthy-500' : 'bg-neutral-700'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white transition-all duration-300 ${notifyPRs ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer" onClick={() => setNotifyDeployments(!notifyDeployments)}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${notifyDeployments ? 'bg-healthy-500/10 text-healthy-400 border border-healthy-500/30' : 'bg-neutral-800 text-neutral-500 border border-transparent'}`}>
                <Rocket className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-200 font-semibold text-sm">Deployments</span>
                <span className="text-neutral-500 text-xs">Alerts on deployment successes and failures.</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${notifyDeployments ? 'bg-healthy-500' : 'bg-neutral-700'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white transition-all duration-300 ${notifyDeployments ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-4">
            {success && (
              <span className="flex items-center gap-1.5 text-healthy-400 text-sm font-medium animate-pulse">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-healthy-500 cursor-pointer text-neutral-950 px-6 py-2.5 rounded-lg font-bold hover:bg-healthy-400 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
