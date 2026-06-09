"use client";

import { BookOpen, Terminal, ShieldAlert, GitMerge, Rocket, Code2 } from "lucide-react";
import FadeIn from "@/app/(pages)/repository/components/FadeIn";

const docSections = [
  {
    icon: Terminal,
    title: "Global Activity Feed",
    description: "Real-time monitoring of all repositories. Tracks Commits, Pull Requests, and Deployments. Filterable by repository and status.",
    color: "healthy"
  },
  {
    icon: GitMerge,
    title: "Auto-Merge PR",
    description: "Enable auto-merge in repository settings to instantly merge new Pull Requests as soon as they are opened, eliminating manual intervention.",
    color: "purple"
  },
  {
    icon: Rocket,
    title: "Vercel Deploy Trigger",
    description: "Bind your Vercel API Token in Advanced Settings. When a deployment fails, instantly trigger a redeploy directly from the dashboard.",
    color: "warning"
  },
  {
    icon: ShieldAlert,
    title: "Encrypted Webhooks",
    description: "All Discord and Telegram webhook URLs are strongly encrypted using your unique 32-character ENCRYPTION_KEY before resting in the database.",
    color: "critical"
  }
];

export default function DocsPage() {
  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1 self-stretch py-0.5">
          <div className="w-px flex-1 bg-linear-to-b from-healthy-500 via-healthy-500/40 to-transparent" />
          <span className="text-healthy-500 text-[7px] leading-none">◆</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-healthy-500/50 tracking-[0.3em] uppercase font-medium">
            System Intelligence
          </span>
          <h1 className="text-3xl font-bold text-neutral-50 tracking-widest uppercase leading-none">
            Data Bank
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-px w-8 bg-linear-to-r from-healthy-500/40 to-transparent" />
            <p className="text-neutral-400 text-sm">
              Documentation and operational guidelines for NexusOps.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <FadeIn delay={0.1}>
          <div className="p-8 rounded-lg bg-neutral-900/60 border border-neutral-700/40 relative overflow-hidden group">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-healthy-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-healthy-500/10 transition-all duration-700" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 bg-neutral-800/80 border border-neutral-700 rounded shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                <BookOpen className="w-6 h-6 text-healthy-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-100 tracking-widest uppercase">System Architecture</h2>
                <p className="text-neutral-500 text-sm mt-1">Understanding the flow of events</p>
              </div>
            </div>
            
            <div className="text-neutral-400 text-sm leading-relaxed space-y-4 relative z-10">
              <p>
                NexusOps acts as a centralized proxy between your GitHub repositories, Vercel deployments, and notification channels. By configuring your Webhooks to point to the NexusOps endpoint, the system captures payloads, sanitizes them, and persists them to the PostgreSQL database.
              </p>
              <p>
                The dashboard then reads this real-time stream to provide the <strong>Global Activity Feed</strong> and calculate the <strong>Activity Matrix</strong>.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docSections.map((section, idx) => {
            const Icon = section.icon;
            const isHealthy = section.color === "healthy";
            const isWarning = section.color === "warning";
            const isCritical = section.color === "critical";
            
            const colorClass = isHealthy ? "text-healthy-400" : isWarning ? "text-warning-400" : isCritical ? "text-critical-400" : "text-purple-400";
            const bgClass = isHealthy ? "bg-healthy-500/10" : isWarning ? "bg-warning-500/10" : isCritical ? "bg-critical-500/10" : "bg-purple-500/10";
            const borderClass = isHealthy ? "border-healthy-500/20" : isWarning ? "border-warning-500/20" : isCritical ? "border-critical-500/20" : "border-purple-500/20";
            
            return (
              <FadeIn key={idx} delay={0.2 + idx * 0.1} className="h-full">
                <div className="p-6 rounded-lg bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors h-full flex flex-col relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${bgClass}`} />
                  
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className={`p-2 rounded border ${bgClass} ${borderClass}`}>
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-200 tracking-wider uppercase">{section.title}</h3>
                  </div>
                  <p className="text-neutral-500 text-xs leading-relaxed relative z-10">
                    {section.description}
                  </p>
                </div>
              </FadeIn>
            )
          })}
        </div>

        <FadeIn delay={0.6}>
          <div className="p-6 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-400 text-sm font-mono">Press <kbd className="px-2 py-1 bg-neutral-800 rounded text-neutral-300 font-bold border border-neutral-700">Ctrl</kbd> + <kbd className="px-2 py-1 bg-neutral-800 rounded text-neutral-300 font-bold border border-neutral-700">K</kbd> anywhere to open Global Search.</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
