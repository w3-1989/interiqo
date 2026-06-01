import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Code,
  Hammer,
  Upload,
  ListChecks,
  CalendarClock,
  CreditCard,
  Pen,
  Rocket,
} from "lucide-react";

interface rowModalProps {
  planId: number;
  isOpen: boolean;
  onClose: () => void;
  onRowAdded: () => void;
}

const colors = [
  "#5805FF",
  "#FF5733",
  "#33C3F0",
  "#2ECC71",
  "#F39C12",
  "#E91E8C",
  "#1ABC9C",
  "#9B59B6",
];

const icons = [
  { name: "hammer", Icon: Hammer },
  { name: "upload", Icon: Upload },
  { name: "list-checks", Icon: ListChecks },
  { name: "calendar", Icon: CalendarClock },
  { name: "credit-card", Icon: CreditCard },
  { name: "code", Icon: Code },
  { name: "pen", Icon: Pen },
  { name: "rocket", Icon: Rocket },
];

export default function AddRowModel({
  planId,
  isOpen,
  onClose,
  onRowAdded,
}: rowModalProps) {
  const [rowName, setRowName] = useState("");
  const [colour, setColour] = useState("#5805FF");
  const [icon, setIcon] = useState("hammer");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const { error: errorInsertingData } = await supabase
      .from("plan_rows")
      .insert({
        plan_id: planId,
        title: rowName,
        color: colour,
        icon: icon,
      });
    if (errorInsertingData) {
      throw new Error("Error inserting row data", errorInsertingData);
    }
    onRowAdded();
    onClose();
    setLoading(false);
  }
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-interiqo-black-400 w-[480px] p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-avant text-[24px] dark:text-white">Add Row</h2>

        <input
          className="border-b border-black dark:border-white p-2 text-[14px] font-DMSans outline-none bg-transparent dark:text-white"
          placeholder="Row name"
          value={rowName}
          onChange={(e) => setRowName(e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-DMSans dark:text-white">Colour</p>
          <div className="flex flex-row gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColour(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full cursor-pointer ${colour === c ? "ring-2 ring-offset-2 ring-black dark:ring-white" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-DMSans dark:text-white">Icon</p>
          <div className="flex flex-row gap-2">
            {icons.map((item) => (
              <button
                key={item.name}
                onClick={() => setIcon(item.name)}
                className={`flex items-center justify-center min-h-10 min-w-10 border cursor-pointer ${icon === item.name ? "bg-interiqo-purple-400 border-interiqo-purple-400 text-white" : "border-black/10 dark:border-white/10 dark:text-white"}`}
              >
                <item.Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <button
            onClick={onClose}
            className="flex items-center justify-center p-3 min-w-[120px] min-h-[38px] border border-black/10 text-[12px] font-DMSans cursor-pointer dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center p-3 min-w-[120px] min-h-[38px] bg-interiqo-purple-400 text-[12px] text-white font-DMSans cursor-pointer"
          >
            {loading ? (
              <span className="flex gap-1">
                <span className="dot-1 w-1 h-1 bg-white rounded-full" />
                <span className="dot-2 w-1 h-1 bg-white rounded-full" />
                <span className="dot-3 w-1 h-1 bg-white rounded-full" />
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
