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
  return (
    <div className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-lg overflow-hidden flex flex-col p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-1.5 bg-neutral-800 rounded-lg border border-neutral-700">
          <CalendarDays className="w-4 h-4 text-neutral-300" />
        </div>
        <h3 className="text-base font-semibold text-neutral-50 tracking-wide">
          14-Day Activity Heatmap
        </h3>
      </div>
      
      <div className="flex gap-2 items-end">
        {matrixDays.map((day) => {
          let intensityClass = "bg-neutral-800 border-neutral-700"; // count 0
          let height = "h-4";
          if (day.count > 0 && day.count <= 2) {
            intensityClass = "bg-healthy-500/30 border-healthy-500/50 shadow-[0_0_8px_rgba(0,229,255,0.2)]";
            height = "h-8";
          } else if (day.count > 2 && day.count <= 5) {
            intensityClass = "bg-healthy-500/60 border-healthy-400 shadow-[0_0_12px_rgba(0,229,255,0.4)]";
            height = "h-12";
          } else if (day.count > 5) {
            intensityClass = "bg-healthy-400 border-healthy-300 shadow-[0_0_16px_rgba(0,229,255,0.6)]";
            height = "h-16";
          }

          return (
            <div key={day.dayStr} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="text-[10px] text-neutral-600 font-mono group-hover:text-neutral-400 transition-colors">
                {format(day.date, "dd")}
              </div>
              <div 
                className={`w-full ${height} rounded-sm border transition-all duration-500 group-hover:scale-y-110 origin-bottom ${intensityClass}`}
                title={`${day.count} activities on ${day.dayStr}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
