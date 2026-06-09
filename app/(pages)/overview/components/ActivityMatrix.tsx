import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface MatrixDay {
  date: Date;
  dayStr: string;
  count: number;
}

interface ActivityMatrixProps {
  matrixDays: MatrixDay[];
}

export default function ActivityMatrix({ matrixDays }: ActivityMatrixProps) {
  const maxCount = Math.max(...matrixDays.map((d) => d.count), 1);

  return (
    <div className="bg-neutral-900/70 border border-neutral-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-lg overflow-hidden flex flex-col p-5">
      {/* Panel Header — HSR style */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 bg-healthy-500/10 rounded border border-healthy-500/20">
          <CalendarDays className="w-4 h-4 text-healthy-400/80" />
        </div>
        <h3 className="text-sm font-bold text-neutral-100 tracking-widest uppercase">
          14-Day Activity
        </h3>
        <div className="flex-1 h-px bg-linear-to-r from-neutral-700/60 to-transparent ml-1" />
      </div>

      {/* Bar chart */}
      <div className="flex gap-1.5 items-end h-16">
        {matrixDays.map((day) => {
          const ratio = day.count / maxCount;
          const heightPct = day.count === 0 ? 12 : Math.max(20, ratio * 100);

          let barClass =
            "bg-neutral-800/80 border-neutral-700/40 hover:bg-neutral-700/80";
          let glowClass = "";

          if (day.count > 0 && day.count <= 2) {
            barClass =
              "bg-healthy-500/25 border-healthy-500/40 hover:bg-healthy-500/35";
            glowClass = "shadow-[0_0_8px_rgba(0,229,255,0.15)]";
          } else if (day.count > 2 && day.count <= 5) {
            barClass =
              "bg-healthy-500/55 border-healthy-500/70 hover:bg-healthy-500/65";
            glowClass = "shadow-[0_0_10px_rgba(0,229,255,0.3)]";
          } else if (day.count > 5) {
            barClass =
              "bg-healthy-400 border-healthy-300/60 hover:bg-healthy-300";
            glowClass = "shadow-[0_0_14px_rgba(0,229,255,0.5)]";
          }

          return (
            <div
              key={day.dayStr}
              className="flex flex-col items-center gap-1.5 flex-1 group"
            >
              <div className="text-[9px] text-neutral-600 font-mono group-hover:text-neutral-400 transition-colors">
                {format(day.date, "dd")}
              </div>
              <div
                className={`w-full rounded-sm border transition-all duration-300 group-hover:scale-y-110 origin-bottom ${barClass} ${glowClass}`}
                style={{ height: `${heightPct}%` }}
                title={`${day.count} activities on ${day.dayStr}`}
              />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-800/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-neutral-800/80 border border-neutral-700/40" />
          <span className="text-[9px] text-neutral-600 uppercase tracking-wider">
            None
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-healthy-500/25 border border-healthy-500/40" />
          <span className="text-[9px] text-neutral-600 uppercase tracking-wider">
            Low
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-healthy-500/55 border border-healthy-500/70" />
          <span className="text-[9px] text-neutral-600 uppercase tracking-wider">
            Mid
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-healthy-400 border border-healthy-300/60" />
          <span className="text-[9px] text-neutral-600 uppercase tracking-wider">
            High
          </span>
        </div>
      </div>
    </div>
  );
}
