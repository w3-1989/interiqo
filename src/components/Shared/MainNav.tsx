import { useState, useEffect, useRef } from "react";
import { type LucideIcon } from "lucide-react";

interface MainNavProps {
  navItems: readonly navItem[];
  activePage: string;
  setActivePage: (page: string) => void;
}

interface navItem {
  id: string;
  tooltip: string;
  svg: LucideIcon;
}

export default function MainNav({
  setActivePage,
  activePage,
  navItems,
}: MainNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [navVisible, setNavVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setNavVisible(true);
      timerRef.current = setTimeout(() => {
        setNavVisible(false);
      }, 2000);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function renderNavItems() {
    return navItems.map((item) => {
      const Icon = item.svg;
      return (
        <div key={item.id} className=" flex flex-col relative group">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible group-hover:visible flex flex-col items-center">
            <span className="flex justify-center bg-tooltip text-white text-xs py-2 px-3 w-[100px] font-DMSans">
              {item.tooltip}
            </span>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#4C4C4C]" />
          </div>
          <button
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setActivePage(item.id)}
            style={{
              backgroundColor:
                item.id === activePage
                  ? "#5805FF"
                  : hoveredItem === item.id
                    ? "#5805FF"
                    : "",
              transform: item.id === activePage ? "scale(1.1)" : "",
            }}
            className={`group-hover:bg-interiqo-purple-400 transition-transform duration-200
                         ${item.id === activePage ? "" : "hover:scale-110"} flex min-h-14 min-w-14 
                         cursor-pointer bg-white dark:bg-interiqo-black-400 border
                     border-black/5 justify-center items-center`}
          >
            <Icon
              size={20}
              color="currentColor"
              className={`${item.id === activePage || hoveredItem === item.id ? "text-white" : "text-black dark:text-white"}`}
            />
          </button>
        </div>
      );
    });
  }

  return (
    <>
      <nav
        onMouseEnter={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setNavVisible(true);
        }}
        onMouseLeave={() => {
          timerRef.current = setTimeout(() => {
            setNavVisible(false);
          }, 500);
        }}
        className={` ${navVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}
      flex fixed gap-6 bottom-12 left-1/2 -translate-x-1/2 transition-all duration-500`}
      >
        {renderNavItems()}
      </nav>
      <div
        className={`fixed bottom-0 left-0 w-full h-32 z-50 ${navVisible ? "pointer-events-none" : ""}`}
        onMouseEnter={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setNavVisible(true);
        }}
        onMouseLeave={() => {
          timerRef.current = setTimeout(() => {
            setNavVisible(false);
          }, 500);
        }}
      />
    </>
  );
}
