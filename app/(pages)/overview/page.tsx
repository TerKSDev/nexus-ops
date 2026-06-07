import {
  Activity,
  Server,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 px-12 w-full max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <div className="h-10 w-1 bg-linear-to-b from-healthy-500 to-transparent" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-neutral-50 to-neutral-400 tracking-tight uppercase">
            Overview
          </h1>
          <p className="text-neutral-400 tracking-wide text-sm font-medium">
            View all of your system status and active alerts.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-neutral-700/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-neutral-500/20 transition-all" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Total Services
            </p>
            <p className="text-4xl font-bold text-neutral-50 drop-shadow-md">
              24
            </p>
          </div>
          <div className="w-14 h-14 bg-neutral-800/80 border border-neutral-700/50 rounded-full flex items-center justify-center relative z-10 shadow-inner">
            <Server className="text-neutral-300 w-6 h-6 drop-shadow-md" />
          </div>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-healthy-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-healthy-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-healthy-500/30 transition-all" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Healthy Systems
            </p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-healthy-300 to-healthy-500 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
              22
            </p>
          </div>
          <div className="w-14 h-14 bg-healthy-500/10 border border-healthy-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(0,229,255,0.2)]">
            <CheckCircle2 className="text-healthy-400 w-7 h-7 drop-shadow-[0_0_5px_rgba(0,229,255,0.6)]" />
          </div>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-warning-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-warning-500/30 transition-all" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Active Alerts
            </p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-warning-300 to-warning-500 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              2
            </p>
          </div>
          <div className="w-14 h-14 bg-warning-500/10 border border-warning-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_0_15px_rgba(255,215,0,0.2)]">
            <AlertCircle className="text-warning-400 w-7 h-7 drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 shadow-xl rounded-2xl overflow-hidden mt-4 relative">
        <div className="absolute inset-0 bg-linear-to-b from-neutral-800/10 to-transparent pointer-events-none" />

        <div className="p-6 border-b border-neutral-800/50 flex items-center gap-3 relative z-10 bg-neutral-900/30">
          <div className="p-2 bg-neutral-800/80 rounded-lg border border-neutral-700/50">
            <Activity className="w-5 h-5 text-neutral-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-50 tracking-wide">
            Recent Activity Log
          </h2>
          <div className="ml-auto flex items-center gap-1 text-xs font-mono text-neutral-500">
            <span>SYS_LOG</span>
            <span className="w-1.5 h-1.5 rounded-full bg-healthy-500 animate-pulse ml-2" />
          </div>
        </div>

        <div className="divide-y divide-neutral-800/40 relative z-10">
          {[
            {
              id: 1,
              text: "Database CPU utilization exceeded 80%",
              time: "10 mins ago",
              status: "warning",
            },
            {
              id: 2,
              text: "API Gateway deployment successful",
              time: "1 hour ago",
              status: "healthy",
            },
            {
              id: 3,
              text: "Authentication service rebooted",
              time: "3 hours ago",
              status: "neutral",
            },
            {
              id: 4,
              text: "Payment gateway connection timeout",
              time: "5 hours ago",
              status: "critical",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-5 px-6 flex items-center justify-between hover:bg-neutral-800/40 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-2.5 h-2.5 rotate-45 shadow-sm ${
                    item.status === "healthy"
                      ? "bg-healthy-400 shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                      : item.status === "warning"
                        ? "bg-warning-400 shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                        : item.status === "critical"
                          ? "bg-critical-500 shadow-[0_0_8px_rgba(255,0,123,0.8)]"
                          : "bg-neutral-500"
                  }`}
                />
                <span className="text-neutral-200 font-medium group-hover:text-neutral-50 transition-colors">
                  {item.text}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono text-neutral-500">
                  {item.time}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
