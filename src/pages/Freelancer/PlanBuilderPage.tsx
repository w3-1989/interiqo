import TopBar from "../../components/Shared/TopBar";
import AddRowModel from "./AddRowModal";
import PlanToolBar from "../../components/Freelancer/PlanToolbar";
import GranttGrid from "../../components/Freelancer/GanttGrid";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  ChevronLeft,
  Hammer,
  Upload,
  ListChecks,
  CalendarClock,
  CreditCard,
  Search,
  Filter,
  CalendarDays,
  Plus,
} from "lucide-react";

export default function PlanBuilderPage() {
  const [planId, setPlanId] = useState(0);
  const [briefTitle, setBriefTitle] = useState("");
  const [timeView, setTimeView] = useState("month");
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [activeBlockType, setActiveBlockType] = useState("work");
  const [showAddRowModal, setShowAddRowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const toolbarItems = [
    {
      id: "work",
      tooltip: "Work Block",
      svg: Hammer,
    },
    {
      id: "client_upload",
      tooltip: "Client Upload",
      svg: Upload,
    },
    {
      id: "client_tasks",
      tooltip: "Client Tasks",
      svg: ListChecks,
    },
    {
      id: "meeting",
      tooltip: "Meeting",
      svg: CalendarClock,
    },
    {
      id: "payment",
      tooltip: "Payment",
      svg: CreditCard,
    },
  ] as const;

  useEffect(() => {
    async function getPlanData() {
      const { data: planData, error: errorGettingPlanData } = await supabase
        .from("plans")
        .select()
        .eq("brief_id", params.id);

      if (!planData) {
        throw new Error("No plan data exists", errorGettingPlanData);
      }
      if (errorGettingPlanData) {
        throw new Error("Error getting plan data", errorGettingPlanData);
      }

      if (planData.length === 0) {
        const { data: briefData, error: errorInsertingBriefId } = await supabase
          .from("plans")
          .insert({ brief_id: params.id })
          .select();

        if (!briefData) {
          throw new Error(
            "Error inserting brief id in plans",
            errorInsertingBriefId,
          );
        }
        if (errorInsertingBriefId) {
          throw new Error(
            "Error inserting brief id in plans",
            errorInsertingBriefId,
          );
        }
        setPlanId(briefData[0].id);
      }

      if (planData.length > 0) {
        setPlanId(planData[0].id);
      }
    }
    getPlanData();

    async function getBriefData() {
      const { data: briefData, error: errorGettingBriefData } = await supabase
        .from("briefs")
        .select()
        .eq("id", params.id);

      if (!briefData) {
        throw new Error("No brief data found", errorGettingBriefData);
      }
      if (errorGettingBriefData) {
        throw new Error("Error getting brief data", errorGettingBriefData);
      }

      setBriefTitle(briefData[0].title);
    }
    getBriefData();
  }, []);

  return (
    <>
      <section className="flex flex-col h-screen dark:bg-black overflow-hidden">
        <TopBar showNotifications={true} />
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-1 text-[12px] font-DMSans dark:text-white cursor-pointer px-4 pb-2"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft />
            </button>
            <h1 className="font-avant text-[31px] text-interiqo-purple-400 px-4 pb-2">{briefTitle}</h1>
          </div>
          <div className="flex flex-row items-center gap-2 mr-4">
            <button className="flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer">
              <Search size={16} />
            </button>
            <button className="flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer">
              <Filter size={16} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowTimeSelect(!showTimeSelect)}
                className="flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer"
              >
                <CalendarDays size={16} />
              </button>
              {showTimeSelect && (
                <div className="absolute right-0 top-12 z-50 flex flex-col bg-white dark:bg-interiqo-black-400 border border-black/5 shadow-sm">
                  {["day", "week", "month"].map((view) => (
                    <button
                      key={view}
                      onClick={() => {
                        setTimeView(view);
                        setShowTimeSelect(false);
                      }}
                      className={`px-6 py-3 text-[12px] font-DMSans cursor-pointer capitalize text-left ${timeView === view ? "bg-interiqo-purple-400 text-white" : "dark:text-white hover:bg-interiqo-purple-400/10"}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
            onClick={() => setShowAddRowModal(true)}
            className="flex items-center justify-center min-h-10 min-w-10 bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer">
              <Plus size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <GranttGrid refreshKey={refreshKey} planId={planId} timeView={timeView} />
        </div>
        <div>
          <PlanToolBar
            navItems={toolbarItems}
            activePage={activeBlockType}
            setActivePage={setActiveBlockType}
          />
        </div>
        <AddRowModel  planId={planId} isOpen={showAddRowModal} onClose={() => setShowAddRowModal(false)} onRowAdded={() => setRefreshKey(prev => prev + 1)}/>
      </section>
    </>
  );
}
