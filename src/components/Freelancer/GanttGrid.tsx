import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { PlanBlock } from "../../types/PlanBlock";
import type { PlanRow } from "../../types/PlanRow";
import {
  Hammer,
  Upload,
  ListChecks,
  CalendarClock,
  CreditCard,
  Code,
  Pen,
  Rocket,
} from "lucide-react";

interface grantProps {
  planId: number;
  timeView: string;
  refreshKey: number;
}

const iconMap: Record<string, React.ElementType> = {
  hammer: Hammer,
  upload: Upload,
  "list-checks": ListChecks,
  calendar: CalendarClock,
  "credit-card": CreditCard,
  code: Code,
  pen: Pen,
  rocket: Rocket,
};

export default function GranttGrid({
  planId,
  timeView,
  refreshKey,
}: grantProps) {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [_blocks, setBlocks] = useState<PlanBlock[]>([]);
  const [_collapsedRows, _setCollapsedRows] = useState<number[]>([]);

  useEffect(() => {
    if (planId === 0) return;

    async function fetchRowsAndBlocks() {
      const { data: rowData, error: errorFetchingRowData } = await supabase
        .from("plan_rows")
        .select()
        .eq("plan_id", planId);

      if (!rowData) {
        throw new Error("No row data found", errorFetchingRowData);
      }

      if (errorFetchingRowData) {
        throw new Error("Error fetching row data", errorFetchingRowData);
      }

      setRows(rowData);

      const { data: blockData, error: errorFetchingBlockData } = await supabase
        .from("plan_blocks")
        .select()
        .eq("plan_id", planId);

      if (!blockData) {
        throw new Error("No block data found", errorFetchingBlockData);
      }

      if (errorFetchingBlockData) {
        throw new Error("Error fetching block data", errorFetchingBlockData);
      }

      setBlocks(blockData);
    }
    fetchRowsAndBlocks();
  }, [planId, refreshKey]);

  const months = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      result.push({
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
      });
    }
    return result;
  }, []);
  return (
    <div className="flex flex-row h-full overflow-hidden">
      <div className="group flex flex-col w-[40px] hover:w-[200px] transition-all duration-300 shrink-0 border-r border-black/5 overflow-hidden">
        <div className="h-[44px] border-b border-black/5" />
        {rows.map((row, index) => {
          const Icon = iconMap[row.icon] || Hammer;

          return (
            <div
              key={index}
              className="flex flex-row h-[60px] items-center overflow-hidden"
            >
              <div
                className="w-2 h-full shrink-0"
                style={{ backgroundColor: row.color }}
              />
              <div className="flex items-center justify-center w-8 shrink-0">
                <Icon size={16} className="dark:text-white" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 text-[12px] font-DMSans dark:text-white whitespace-nowrap overflow-hidden">
                {row.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col flex-1 overflow-x-auto">
        <div className="flex flex-row">
          {months.map((i, index) => (
            <div
              key={index}
              className="min-w-[160px] h-[44px] flex items-center px-3 border-b border-r border-black/5 text-[12px] font-DMSans text-interiqo-black-100 shrink-0"
            >
              {i.month} {i.year}
            </div>
          ))}
        </div>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row">
            {months.map((_m, colIndex) => (
              <div
                key={colIndex}
                className="min-w-[160px] h-[60px] border-b border-r border-black/5 shrink-0"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
